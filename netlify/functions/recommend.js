exports.handler = async function (event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  let fallbackExam = "Competitive Exam";

  try {
    const { examName } = JSON.parse(event.body || "{}");
    fallbackExam = examName || "Competitive Exam";

    console.log("Processing:", fallbackExam);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("No API key");

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Return a JSON array of exactly 3 books for "${fallbackExam}" Indian exam.
Format: [{"title":"Book - Author","search":"amazon query"}]
Only return the JSON array, nothing else.`
          }]
        }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 200 }
      })
    });

    const data = await res.json();

    if (data.error) {
      console.error("Gemini error:", data.error.message);
      throw new Error(data.error.message);
    }

    const text = data.candidates[0].content.parts[0].text.trim();
    const match = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (!match) throw new Error("JSON parse failed");

    const books = JSON.parse(match[0]);
    console.log("Success:", books.length, "books found");

    return { statusCode: 200, headers, body: JSON.stringify(books) };

  } catch (err) {
    console.error("Error:", err.message);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify([
        { title: `${fallbackExam} - Top Recommended Books`, search: `${fallbackExam} best books` },
        { title: `${fallbackExam} - Previous Year Papers`, search: `${fallbackExam} solved papers` },
        { title: `${fallbackExam} - Complete Study Guide`, search: `${fallbackExam} study guide` }
      ])
    };
  }
};