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

    console.log("Processing via Ultimate GitHub AI for:", examName);

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
            content: "You are a database API that ONLY outputs a raw JSON array of 3 books. Never include markdown formatting like ```json, never write intro/outro text, never explain anything. Just output the raw [ ] array."
          },
          {
            role: "user",
            content: `Provide exactly 3 top books for: "${examName}". Format: [{"title": "Book Title - Author", "search": "amazon search query"}].`
          }
        ],
        temperature: 0.1
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "GitHub AI Error");

    let rawText = data.choices[0].message.content.trim();
    
    // 🔍 Yeh line Netlify log mein dikhayegi ki AI ne asliyat mein kya bheja hai
    console.log("ASLI AI RESPONSE:", rawText);

    // Try 1: Standard JSON extraction using brackets
    const startIdx = rawText.indexOf('[');
    const endIdx = rawText.lastIndexOf(']');

    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      const cleanJsonString = rawText.substring(startIdx, endIdx + 1);
      const parsedData = JSON.parse(cleanJsonString);
      return { statusCode: 200, headers, body: JSON.stringify(parsedData) };
    }

    // 🔥 Try 2: SMART TEXT PARSER (Agar AI ne JSON ke badle plain text list bhej di ho)
    console.log("JSON brackets missing. Running Smart Text-to-JSON Converter...");
    
    // Text ko lines mein todo aur faltu empty lines hatao
    const lines = rawText.split('\n')
      .map(l => l.replace(/^[^a-zA-Z0-9]+/, '').trim()) // Aage ke numbers/bullets (1., -, *) hatao
      .filter(l => l.length > 10); // Bahut chhoti lines hatao

    if (lines.length >= 2) {
      const customBooks = lines.slice(0, 3).map(line => {
        // Line se clean title banao
        const cleanTitle = line.replace(/["']/g, "").substring(0, 60);
        return {
          title: cleanTitle,
          search: cleanTitle.toLowerCase()
        };
      });
      return { statusCode: 200, headers, body: JSON.stringify(customBooks) };
    }

    throw new Error("AI response was too short or unparseable");

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