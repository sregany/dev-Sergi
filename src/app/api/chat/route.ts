// Modelos ordenados por prioridad (los más rápidos y baratos primero)
const MODELS = [
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
];

const SYSTEM_PROMPT = `Eres SR_AGENT, el asistente de IA de Sergi Regany en su portfolio web.
SOLO puedes responder preguntas sobre Sergi, sus habilidades, sus proyectos o cómo contactarle.
Si te preguntan sobre cualquier otro tema, responde: "Solo puedo responder dudas sobre Sergi Regany y sus proyectos."

DATOS SOBRE SERGI:
- Perfil: Full Stack AI Engineer. Construye aplicaciones web con inteligencia artificial integrada.
- Formación: Ingeniero y Matemático.
- Stack: Next.js, Node.js, TypeScript, Vercel AI SDK, LLMs (Gemini, GPT-4), RAG Agents, PostgreSQL, Drizzle, Clerk, Stripe.
- Proyecto Principal: NexusAI — SaaS con agente RAG para gestión inteligente de proyectos.
- Logros: Desarrolló un ERP a medida que redujo un 40% el tiempo administrativo.
- Email: sergiregany1996@gmail.com

REGLAS DE FORMATO:
- NO uses negritas, asteriscos ni listas con guiones.
- Responde en prosa natural, cercana y profesional.
- Sé conciso pero informativo.`;

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "API key no configurada" }, { status: 500 });
    }

    const { messages } = await req.json();

    // Preparar historial para Gemini
    let chatHistory = (messages || [])
      .filter((m: any) => m.content && m.content.trim() !== "")
      .map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    // Gemini exige que el primer mensaje sea del usuario
    if (chatHistory.length > 0 && chatHistory[0].role === "model") {
      chatHistory.shift();
    }
    if (chatHistory.length === 0 || chatHistory[0].role !== "user") {
      chatHistory = [{ role: "user", parts: [{ text: "Hola" }] }, ...chatHistory];
    }

    // Intentar cada modelo hasta que uno funcione
    let lastError = "";
    for (const model of MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;

        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: chatHistory,
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            generationConfig: { temperature: 0.7 },
          }),
        });

        if (!response.ok) {
          const errBody = await response.text();
          lastError = `${model}: ${response.status} - ${errBody.slice(0, 200)}`;
          console.warn(`[Chat] Modelo ${model} falló (${response.status}), probando siguiente...`);
          continue; // Probar el siguiente modelo
        }

        // Modelo respondió OK — transformar el stream de Google al formato del SDK de Vercel
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
            try {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                buffer = lines.pop() || "";

                for (const line of lines) {
                  if (line.startsWith("data: ")) {
                    try {
                      const json = JSON.parse(line.slice(6));
                      const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
                      if (text) {
                        controller.enqueue(
                          encoder.encode(`0:${JSON.stringify(text)}\n`)
                        );
                      }
                    } catch {
                      // Fragmento JSON incompleto, seguimos
                    }
                  }
                }
              }
            } finally {
              controller.close();
            }
          },
        });

        console.log(`[Chat] Respondiendo con modelo: ${model}`);
        return new Response(stream, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
          },
        });
      } catch (fetchErr: any) {
        lastError = `${model}: ${fetchErr.message}`;
        console.warn(`[Chat] Error de red con ${model}: ${fetchErr.message}`);
        continue;
      }
    }

    // Si ningún modelo funcionó, devolver error con info útil
    console.error(`[Chat] Todos los modelos fallaron. Último error: ${lastError}`);
    return Response.json(
      { error: `Todos los modelos están saturados. Inténtalo en unos minutos. (${lastError})` },
      { status: 503 }
    );
  } catch (error: any) {
    console.error("[Chat] Error crítico:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
