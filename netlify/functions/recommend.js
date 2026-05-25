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

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text:
          `Book recommender for Indian competitive exam students.
Exam: "${examName}"
Return ONLY a valid JSON array of 3 books. No markdown (do NOT wrap inside \`\`\`json), no explanation.
[{"title":"Book Title - Author","search":"short amazon search query"},{"title":"Book Title - Author","search":"short amazon search query"},{"title":"Book Title - Author","search":"short amazon search query"}]
Rules: real books on Amazon India, standard books for this exam.`
        }]}],
        generationConfig: { temperature: 0.2, maxOutputTokens: 400 }
      })
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      return { statusCode: response.status || 400, headers, body: JSON.stringify({ error: data.error?.message || "API Error" }) };
    }

    // Gemini ke text ko saaf karna
    let rawText = data.candidates[0].content.parts[0].text.trim();
    rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const cleanJson = JSON.parse(rawText);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(cleanJson) // Frontend ko ekdam saaf array milega
    };

  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};