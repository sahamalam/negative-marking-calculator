exports.handler = async function (event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { examName } = JSON.parse(event.body);
    if (!examName) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'examName missing' }) };
    }

    console.log("Fetching books via Free Hugging Face AI for:", examName);

    // 🚀 Llama-3 Model URL
    const url = "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct";
    
    // 🛠️ FIX: Netlify dashboard se token uthana aur use pass karna
    const hfToken = process.env.HF_API_KEY;
    const requestHeaders = { 'Content-Type': 'application/json' };
    
    if (hfToken) {
      requestHeaders['Authorization'] = `Bearer ${hfToken}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: requestHeaders, // ✅ Ab yahan sahi chabi pass ho rahi hai
      body: JSON.stringify({
        inputs: `<|begin_of_text|><|start_header_id|>system<|end_header_id|>
        You are a JSON generator. Return a raw JSON array containing exactly 3 top books for the Indian exam requested. 
        Use this exact format: [{"title": "Book Name - Author", "search": "amazon query"}]. Do not write markdown blocks, introductions, or explanations. Only return valid JSON.<|eot_id|><|start_header_id|>user<|end_header_id|>
        Exam Name: "${examName}"<|eot_id|><|start_header_id|>assistant<|end_header_id|>`
      })
    });

    const data = await response.json();
    
    // Agar Hugging Face ne koi error diya toh use catch mein bhejo
    if (data.error) {
       throw new Error(`HF API Error: ${data.error}`);
    }

    let rawText = "";

    if (data && data.generated_text) {
       rawText = data.generated_text.split("<|start_header_id|>assistant<|end_header_id|>")[1] || data.generated_text;
    } else if (Array.isArray(data) && data[0]?.generated_text) {
       rawText = data[0].generated_text.split("<|start_header_id|>assistant<|end_header_id|>")[1] || data[0].generated_text;
    } else {
       throw new Error("AI Empty Response");
    }

    rawText = rawText.trim().replace(/```json/g, "").replace(/```/g, "").trim();
    
    // Extract only the JSON array part safely
    const jsonMatch = rawText.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (!jsonMatch) throw new Error("JSON regex failed");

    const cleanJson = JSON.parse(jsonMatch[0]);
    console.log("Success! Generated books:", cleanJson.length);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(cleanJson)
    };

  } catch (error) {
    console.error("HF Error, triggering static fallback:", error.message);
    
    // 🛠️ Safe Fallback: Agar AI down ho toh khud standard links bana kar bhej do
    const { examName } = JSON.parse(event.body || "{}");
    const cleanExam = examName || "Competitive Exam";
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify([
        {"title": `Best Recommended Books for ${cleanExam}`, "search": `${cleanExam} exam books`},
        {"title": `${cleanExam} Solved Papers & Mock Tests`, "search": `${cleanExam} solved papers`},
        {"title": `${cleanExam} Top Rated Study Guide Pack`, "search": `${cleanExam} guide books`}
      ])
    };
  }
};