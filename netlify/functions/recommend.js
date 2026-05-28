exports.handler = async function (event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    if (!event.body) throw new Error("No body found");
    const { examName } = JSON.parse(event.body);
    if (!examName) return { statusCode: 400, headers, body: JSON.stringify({ error: 'examName missing' }) };

    console.log("Processing via Latest Gemini 2.0 API for:", examName);

    const apiKey = process.env.GEMINI_API_KEY; 
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY missing in Netlify Environment Variables");
    }

    // 🔥 FIX: 1.5-flash hata kar naya 'gemini-2.0-flash' model ka rasta set kar diya hai
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a JSON generator. Return a raw JSON array containing exactly 3 top books for the Indian exam: "${examName}". Use this exact format: [{"title": "Book Name - Author", "search": "amazon query"}]. Do not write markdown blocks like \`\`\`json, introductions, or explanations. Only return valid JSON array.`
          }]
        }]
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || "Gemini API Response Error");
    }

    let rawText = data.candidates[0].content.parts[0].text;
    
    // Markdown saaf karne ka logic
    rawText = rawText.trim().replace(/```json/g, "").replace(/```/g, "").trim();
    
    const jsonMatch = rawText.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (!jsonMatch) throw new Error("JSON parsing failed from Gemini response");

    return { 
      statusCode: 200, 
      headers, 
      body: JSON.stringify(JSON.parse(jsonMatch[0])) 
    };

  } catch (error) {
    console.error("Gemini system failed, switching to safe fallback:", error.message);
    
    let fallbackExam = "Competitive Exam";
    try { if (event.body) fallbackExam = JSON.parse(event.body).examName || "Competitive Exam"; } catch(e) {}

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify([
        {"title": `Best Recommended Guide Books for ${fallbackExam}`, "search": `${fallbackExam} exam best books`},
        {"title": `${fallbackExam} Previous Years Solved Papers`, "search": `${fallbackExam} solved papers`},
        {"title": `${fallbackExam} Mock Tests & Practice Set Pack`, "search": `${fallbackExam} practice set`}
      ])
    };
  }
};