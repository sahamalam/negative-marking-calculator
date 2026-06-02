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

    console.log("Processing via GitHub Free AI for:", examName);

    const token = process.env.GITHUB_TOKEN; 
    if (!token) {
      throw new Error("GITHUB_TOKEN missing in Netlify Environment Variables");
    }

    // 🚀 GitHub Models Official API Endpoint
    const url = "https://models.inference.ai.azure.com/chat/completions";

    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        model: "meta-llama-3.1-8b-instruct", // 🔥 100% Free, Super Fast Premium AI Model
        messages: [{
          role: "user",
          content: `You are a JSON generator. Return a raw JSON array containing exactly 3 top books for the Indian exam: "${examName}". Use this exact format: [{"title": "Book Name - Author", "search": "amazon query"}]. Do not write markdown blocks like \`\`\`json, introductions, or explanations. Only return valid JSON array.`
        }],
        temperature: 0.2
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || "GitHub AI Error");
    }

    let rawText = data.choices[0].message.content;
    
    // Cleanup markdown if AI adds it
    rawText = rawText.trim().replace(/```json/g, "").replace(/```/g, "").trim();
    
    const jsonMatch = rawText.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (!jsonMatch) throw new Error("JSON parsing failed from AI response");

    return { 
      statusCode: 200, 
      headers, 
      body: JSON.stringify(JSON.parse(jsonMatch[0])) 
    };

  } catch (error) {
    console.error("AI system failed, switching to safe fallback:", error.message);
    
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