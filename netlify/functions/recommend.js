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
          `List 3 best books for the Indian competitive exam: "${examName}".
          Provide the output ONLY as a raw JSON array. Do not include any introductory or concluding text. Do not wrap the code in markdown blocks.
          Use this exact format:
          [{"title": "Book Title - Author", "search": "short amazon search query"}, {"title": "Book Title - Author", "search": "short amazon search query"}, {"title": "Book Title - Author", "search": "short amazon search query"}]`
        }]}],
        generationConfig: { 
          temperature: 0.2, 
          maxOutputTokens: 300
          // 🛠️ REMOVED: responseMimeType hata diya taaki 400 error aana band ho jaye
        }
      })
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      return { statusCode: response.status || 400, headers, body: JSON.stringify({ error: data.error?.message || "API Error" }) };
    }

    let rawText = data.candidates[0].content.parts[0].text.trim();
    
    // 🛠️ SUPER CLEANING: Agar Gemini galti se markdown block ```json bhi de de, toh use saaf karein
    if (rawText.includes("```")) {
      rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    }
    
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