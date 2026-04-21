export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    const { messages } = await req.json();

    // Limpieza de historial para Gemini
    let chatHistory = messages
      .filter((m: any) => m.content && m.content.trim() !== "")
      .map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    if (chatHistory.length > 0 && chatHistory[0].role === "model") chatHistory.shift();
    if (chatHistory.length === 0 || (chatHistory.length > 0 && chatHistory[0].role !== "user")) {
      chatHistory = [{ role: "user", parts: [{ text: "Hola" }] }, ...chatHistory];
    }

    // LISTA DE ENDPOINTS A PROBAR (Combinando versiones y modelos para máxima probabilidad)
    const attempts = [
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`
    ];

    for (const url of attempts) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: chatHistory,
            systemInstruction: {
              parts: [{ text: "Eres el asistente de Sergi Regany. Habla de forma natural, cercana y profesional. Sergi es Ingeniero y Matemático experto en IA." }],
            },
            generationConfig: { temperature: 0.7, maxOutputTokens: 600 }
          }),
        });

        const data = await response.json();
        if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
          return new Response(JSON.stringify({ text: data.candidates[0].content.parts[0].text }), {
            headers: { "Content-Type": "application/json" },
          });
        }
        
        console.warn(`URL ${url} falló. Código: ${response.status}. Mensaje: ${data.error?.message}`);
      } catch (e) { continue; }
    }

    return new Response(JSON.stringify({ 
      error: "Google tiene sus servidores gratuitos saturados ahora mismo. En una aplicación de pago esto no pasaría, pero aquí (Free Tier) a veces hay que esperar 10 segundos y reintentar." 
    }), { status: 500 });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
