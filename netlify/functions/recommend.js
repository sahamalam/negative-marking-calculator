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

    console.log("Processing via Robust GitHub AI for:", examName);

    const token = process.env.GITHUB_TOKEN; 
    if (!token) {
      throw new Error("GITHUB_TOKEN missing in Netlify Environment Variables");
    }

    const url = "https://models.inference.ai.azure.com/chat/completions";

    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        model: "meta-llama-3.1-8b-instruct",
        messages: [
          {
            role: "system",
            content: "You are a strict JSON api. You only output a raw JSON array. Never write introductory text, never write markdown blocks, never explain anything."
          },
          {
            role: "user",
            content: `Return a valid JSON array containing exactly 3 real, top books for the Indian exam: "${examName}". Use this exact structure: [{"title": "Book Name - Author", "search": "amazon query"}]. Output ONLY the raw JSON array.`
          }
        ],
        temperature: 0.1
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || "GitHub AI Error");
    }

    let rawText = data.choices[0].message.content.trim();
    console.log("Raw AI Response received successfully");

    // 🔥 BULLETPROOF JSON EXTRACTION: Find the exact start [ and end ]
    const startIdx = rawText.indexOf('[');
    const endIdx = rawText.lastIndexOf(']');

    if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
      throw new Error("Valid JSON array format not found in AI response");
    }

    const cleanJsonString = rawText.substring(startIdx, endIdx + 1);
    const parsedData = JSON.parse(cleanJsonString);

    return { 
      statusCode: 200, 
      headers, 
      body: JSON.stringify(parsedData) 
    };

  } catch (error) {
    console.error("AI Parser caught an issue, deploying safe fallback:", error.message);
    
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