exports.handler = async function (event, context) {
    // 1. Sabhi cross-origin requests (CORS) ko bypass karne ke liye safe headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
    };
  
    // 2. OPTIONS request (Pre-flight) ko gate par hi 200 OK do (Taaki 405 na aaye)
    if (event.httpMethod === 'OPTIONS') {
      return { statusCode: 200, headers, body: '' };
    }
  
    try {
      if (!event.body) throw new Error("No body found in request");
      
      // Frontend se exam ka naam nikalna
      const { examName } = JSON.parse(event.body);
      if (!examName) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'examName missing' }) };
      }
  
      console.log("AI Processing Book Recommendations for:", examName);
  
      // Hugging Face AI Model URL
      const url = "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct";
      const hfToken = process.env.HF_API_KEY;
      const requestHeaders = { 'Content-Type': 'application/json' };
      
      if (hfToken) {
        requestHeaders['Authorization'] = `Bearer ${hfToken}`;
      }
  
      // AI ko bhejha jaane wala prompt
      const response = await fetch(url, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify({
          inputs: `<|begin_of_text|><|start_header_id|>system<|end_header_id|>
          You are a JSON generator. Return a raw JSON array containing exactly 3 top books for the Indian exam requested. 
          Use this exact format: [{"title": "Book Name - Author", "search": "amazon query"}]. Do not write markdown blocks, introductions, or explanations. Only return valid JSON.<|eot_id|><|start_header_id|>user<|end_header_id|>
          Exam Name: "${examName}"<|eot_id|><|start_header_id|>assistant<|end_header_id|>`
        })
      });
  
      const data = await response.json();
      if (data.error) throw new Error(`HF Error: ${data.error}`);
  
      // AI ke response se JSON nikalna
      let rawText = "";
      if (data && data.generated_text) {
         rawText = data.generated_text.split("<|start_header_id|>assistant<|end_header_id|>")[1] || data.generated_text;
      } else if (Array.isArray(data) && data[0]?.generated_text) {
         rawText = data[0].generated_text.split("<|start_header_id|>assistant<|end_header_id|>")[1] || data[0].generated_text;
      } else {
         throw new Error("Empty response from AI");
      }
  
      rawText = rawText.trim().replace(/```json/g, "").replace(/```/g, "").trim();
      const jsonMatch = rawText.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (!jsonMatch) throw new Error("JSON parsing failed");
  
      const cleanJson = JSON.parse(jsonMatch[0]);
  
      // 200 OK ke sath data frontend ko bhej do
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(cleanJson)
      };
  
    } catch (error) {
      console.error("AI Error occurred, sending safe fallback data:", error.message);
      
      // Agar AI fail ho toh safe backup books data
      let fallbackExam = "Competitive Exam";
      try {
        if (event.body) {
          const parsed = JSON.parse(event.body);
          if (parsed.examName) fallbackExam = parsed.examName;
        }
      } catch(e) {}
  
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify([
          {"title": `Best Recommended Books for ${fallbackExam}`, "search": `${fallbackExam} exam books`},
          {"title": `${fallbackExam} Solved Papers & Mock Tests`, "search": `${fallbackExam} solved papers`},
          {"title": `${fallbackExam} Top Rated Study Guide Pack`, "search": `${fallbackExam} guide books`}
        ])
      };
    }
  };