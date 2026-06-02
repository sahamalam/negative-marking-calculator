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

    console.log("Processing via Highly Accurate AI for:", examName);

    const token = process.env.GITHUB_TOKEN; 
    if (!token) throw new Error("GITHUB_TOKEN missing");

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
            content: "You are a strict, highly accurate Indian competitive exams database API. You ONLY output a raw JSON array of 3 books. CRITICAL: Never invent fake book titles or wrong authors. Only recommend real, highly popular, and existing books from well-known publishers like Arihant, Kiran Publication, Disha, McGraw Hill, RS Aggarwal, or M. Laxmikanth. Never include markdown formatting like ```json, never write intro/outro text. Output ONLY the raw [ ] array."
          },
          {
            role: "user",
            content: `Provide exactly 3 real and best-selling books for the exam: "${event.body ? JSON.parse(event.body).examName : examName}". Format: [{"title": "Book Title - Publisher/Author", "search": "amazon search query"}].`
          }
        ],
        temperature: 0.0, // 🔥 Kreativity ZERO! Ab yeh sirf factual data dega
        max_tokens: 250
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "GitHub AI Error");

    let rawText = data.choices[0].message.content.trim();
    console.log("ASLI AI RESPONSE:", rawText);

    // Standard JSON extraction using brackets
    const startIdx = rawText.indexOf('[');
    const endIdx = rawText.lastIndexOf(']');

    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      const cleanJsonString = rawText.substring(startIdx, endIdx + 1);
      const parsedData = JSON.parse(cleanJsonString);
      return { statusCode: 200, headers, body: JSON.stringify(parsedData) };
    }

    throw new Error("AI response format issue");

  } catch (error) {
    console.error("Ultimate Parser Fallback triggered:", error.message);
    
    let fallbackExam = "Competitive Exam";
    try { if (event.body) fallbackExam = JSON.parse(event.body).examName || "Competitive Exam"; } catch(e) {}

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify([
        {"title": `Best Recommended Guide Books for ${fallbackExam}`, "search": `${fallbackExam} exam best books`},
        {"title": `${fallbackExam} Previous Years Solved Papers Pack`, "search": `${fallbackExam} solved papers`},
        {"title": `${fallbackExam} Top Mock Tests & Practice Set`, "search": `${fallbackExam} practice set`}
      ])
    };
  }
};