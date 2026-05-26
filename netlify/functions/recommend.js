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

  // ── 🛠️ AAPKE CONSOLE LOGS ───────────────────────────────────
  console.log("=== NEW REQUEST RECEIVED ===");
  console.log("Function called successfully!");
  console.log("API Key exists in process.env:", !!process.env.GEMINI_API_KEY);
  // ────────────────────────────────────────────────────────────

  try {
    const { examName } = JSON.parse(event.body);
    console.log("Received Exam Name:", examName); // Yeh bhi print kar lete hain check karne ke liye

    if (!examName) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'examName missing' }) };
    }

    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text:
          `List 3 best books for the Indian competitive exam: "${examName}".
          Provide the output ONLY as a raw JSON array. Do not wrap in markdown code blocks.
          Format: [{"title": "Book Title - Author", "search": "short amazon search query"}]`
        }]}],
        generationConfig: { 
          temperature: 0.2, 
          maxOutputTokens: 300
        }
      })
    });

    console.log("Gemini API Response Status:", response.status); // Google ka status code dekhenge

    const data = await response.json();

    if (!response.ok || data.error) {
      console.error("Gemini API Error Detail:", data.error);
      return { statusCode: response.status || 400, headers, body: JSON.stringify({ error: data.error?.message || "API Error" }) };
    }

    let rawText = data.candidates[0].content.parts[0].text.trim();
    rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const cleanJson = JSON.parse(rawText);
    console.log("Successfully parsed JSON array length:", cleanJson.length);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(cleanJson)
    };

  } catch (error) {
    console.error("Catch Block Catch Error:", error.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};