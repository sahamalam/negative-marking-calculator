exports.handler = async function (event, context) {
    // 🛠️ FIX: CORS Headers ko '*' kar diya hai taaki koi bhi origin block na ho
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
  
    // Browser ki preflight OPTIONS request ko handle karne ke liye
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
  
      // Yahan hum key Netlify ke dashboard se secure tarike se uthayenge
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
  
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text:
            `Book recommender for Indian competitive exam students.
  Exam: "${examName}"
  Return ONLY a valid JSON array of 3 books. No markdown, no explanation.
  [{"title":"Book Title - Author","search":"short amazon search query"},{"title":"Book Title - Author","search":"short amazon search query"},{"title":"Book Title - Author","search":"short amazon search query"}]
  Rules: real books on Amazon India, standard books for this exam.`
          }]}],
          generationConfig: { temperature: 0.3, maxOutputTokens: 300 }
        })
      });
  
      const data = await response.json();
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify(data)
      };
    } catch (error) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
    }
  };