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

    // Usamos el endpoint oficial de STREAMING de Google
    // Esto es lo que permite que el texto aparezca poco a poco
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: chatHistory,
        systemInstruction: {
          parts: [{ text: "Eres el asistente de Sergi Regany. Habla de forma natural, cercana y profesional. Sergi es Ingeniero y Matemático experto en IA. NO uses negritas ni asteriscos." }],
        },
        generationConfig: { temperature: 0.8 }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Error en Google API");
    }

    // TRANSFORMADOR DE STREAM: Convertimos el formato de Google al formato que espera el frontend (Vercel AI SDK)
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const json = JSON.parse(line.replace("data: ", ""));
                const text = json.candidates[0].content.parts[0].text;
                if (text) {
                  // Enviamos el texto en el formato '0:"texto"' que usa el SDK de Vercel
                  controller.enqueue(encoder.encode(`0:${JSON.stringify(text)}\n`));
                }
              } catch (e) {
                // Fragmento JSON incompleto, seguimos
              }
            }
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });

  } catch (error: any) {
    console.error("Critical Stream Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
