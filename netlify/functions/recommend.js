exports.handler = async function (event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { examName } = JSON.parse(event.body);
    if (!examName) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'examName missing' }) };
    }

    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text:
          `List 3 standard books for the Indian competitive exam: "${examName}". 
          Your response must be a valid JSON array matching this schema:
          [{"title": "Book Title - Author", "search": "short amazon search query"}]`
        }]}],
        generationConfig: { 
          temperature: 0.2, 
          maxOutputTokens: 300,
          responseMimeType: "application/json" // Yeh strict JSON input maangta hai
        }
      })
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      return { statusCode: response.status || 400, headers, body: JSON.stringify({ error: data.error?.message || "API Error" }) };
    }

    let rawText = data.candidates[0].content.parts[0].text.trim();
    
    // Safe cleaning
    rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const cleanJson = JSON.parse(rawText);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(cleanJson)
    };

  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};