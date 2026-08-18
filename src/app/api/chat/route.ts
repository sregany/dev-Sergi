// Modelos ordenados por prioridad
const MODELS = [
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
];

const SYSTEM_PROMPT = `Eres SR_AGENT, el asistente de IA de Sergi Regany en su portfolio web.
SOLO puedes responder preguntas sobre Sergi, sus habilidades, sus proyectos o cómo contactarle.

DATOS SOBRE SERGI:
- Perfil: Full Stack AI Engineer. Construye aplicaciones web con inteligencia artificial integrada y sistemas ERP enterprise.
- Formación: Graduado en Ingeniería Informática y Matemáticas.
- Stack Tecnológico Completo:
  - Frontend: Next.js 15/14 (App Router, RSC, Server Actions), React 19, TypeScript (Strict), Tailwind CSS (Glassmorphism), shadcn/ui, Recharts, Sonner, Lucide Icons.
  - Backend & Data: PostgreSQL (Neon Serverless & Supabase S3-compatible), Drizzle ORM, Prisma ORM, Server Actions, Node.js, Python.
  - IA & RAG: Vercel AI SDK (toDataStreamResponse), Google Gemini 1.5 Flash, RAG Architecture (Retrieval-Augmented Generation context-aware), OpenAI APIs.
  - Auth & Seguridad: Clerk Enterprise (OAuth/SSR), Supabase Auth + RLS (Row Level Security), NextAuth.js (Session/bcryptjs), RBAC (superadmin, jefe_obra, operator, viewer).
  - Pagos & Utilidades: Stripe (Checkout & Webhooks), jspdf + jspdf-autotable (Generación de PDFs), xlsx (Importador inteligente BC3/Excel), Audit Log & JSON DB Snapshots.
  - Deploy & DevOps: Vercel Edge, Docker, GitOps, ROS2 (Robótica industrial y visión).
- Proyectos Destacados:
  1. NexusAI: SaaS de gestión de proyectos donde la IA es el motor central. Agente RAG context-aware, streaming nativo, Server Actions, Clerk, Neon PostgreSQL, Drizzle, Stripe y 100/100 en Lighthouse SEO/Accesibilidad.
  2. INVESTFINCA: ERP de construcción en producción activa. Single Source of Truth para obras, presupuestos BC3/Excel, certificaciones en PDF, albaranes, diario de obra, gestor de planos DWG, planificación Gantt y motor BI. Reducción del 40% del tiempo administrativo.
  3. TREBOJOCS: ERP de gestión de máquinas, finanzas y recaudaciones. Next.js 14, PostgreSQL + Prisma ORM, NextAuth.js, bcryptjs, Recharts, tracking de discrepancias, audit log y exportación de BD en JSON.
- Email: sergiregany1996@gmail.com
- GitHub: https://github.com/sregany
- LinkedIn: https://www.linkedin.com/in/sregany/

REGLAS DE FORMATO:
- Responde siempre en español, con un tono profesional, cercano, directo y servicial.
- NO uses sintaxis markdown compleja como corchetes innecesarios o títulos gigantes.`;

function getSmartResponse(userQuery: string): string {
  const q = userQuery.toLowerCase();

  if (q.includes("erp") || q.includes("investfinca") || q.includes("construccion") || q.includes("obra") || q.includes("gantt") || q.includes("bc3")) {
    return "INVESTFINCA es un ERP de construcción en producción (Next.js 14, Supabase, Drizzle, Tailwind, shadcn/ui, jspdf, xlsx) que actúa como Single Source of Truth para obras. Incluye analítica con KPIs, presupuestos con importación BC3/Excel, certificaciones en PDF, diario de obra, gestor documental (PDF, imágenes, planos DWG), planificación Gantt, directorio de proveedores y RLS en BD. Ha logrado reducir un 40% el tiempo administrativo.";
  }

  if (q.includes("trebojocs") || q.includes("maquina") || q.includes("finanza") || q.includes("ingreso") || q.includes("discrepancia") || q.includes("prisma") || q.includes("nextauth")) {
    return "TREBOJOCS es un ERP para la gestión de máquinas, recaudaciones y finanzas (Next.js 14, PostgreSQL, Prisma ORM, NextAuth.js, bcryptjs, Recharts). Ofrece dashboards de KPIs en tiempo real, tracking de discrepancias, audit log de las últimas 10 acciones por usuario, exportación de snapshot de la BD en JSON para administradores y roles jerárquicos (ADMIN, OPERATOR, VIEWER).";
  }

  if (q.includes("nexus") || q.includes("rag") || q.includes("saas") || q.includes("tarea") || q.includes("clerk") || q.includes("stripe") || q.includes("neon")) {
    return "NexusAI es un SaaS de gestión de proyectos donde la IA es el motor central. Integra un agente RAG que lee la base de datos antes de responder, streaming de chat nativo, mutaciones vía Server Actions, auth con Clerk, pagos con Stripe, Neon PostgreSQL + Drizzle ORM y 100/100 en accesibilidad y SEO en Lighthouse.";
  }

  if (q.includes("stack") || q.includes("tecnologia") || q.includes("herramienta") || q.includes("lenguaje") || q.includes("next") || q.includes("react") || q.includes("prisma") || q.includes("drizzle")) {
    return "El stack completo de Sergi abarca Frontend (Next.js 15/14, React 19, TypeScript, Tailwind CSS, shadcn/ui, Recharts), Backend & Data (PostgreSQL con Neon y Supabase, Drizzle ORM, Prisma ORM, Server Actions, Python), IA (Vercel AI SDK, Gemini 1.5 Flash, RAG), Auth & Seguridad (Clerk, Supabase Auth + RLS, NextAuth.js, bcryptjs), Pagos (Stripe Webhooks) y utilidades como jspdf, xlsx y ROS2.";
  }

  if (q.includes("quien") || q.includes("perfil") || q.includes("sobre") || q.includes("estudio") || q.includes("matematica") || q.includes("ingenier")) {
    return "Sergi Regany es Full-Stack AI Engineer graduado en Ingeniería Informática y Matemáticas. Se especializa en crear productos digitales escalables de principio a fin, integrando inteligencia artificial aplicada, arquitecturas RAG, ERPs empresariales y automatizaciones cloud.";
  }

  if (q.includes("robot") || q.includes("ros") || q.includes("vision") || q.includes("hardware")) {
    return "Sergi tiene experiencia en Robótica e Ingeniería de Software (2019-2021), habiendo desarrollado sistemas de visión por computador, automatización industrial con ROS2 e infraestructura cloud aplicada a sistemas embebidos.";
  }

  if (q.includes("contacto") || q.includes("email") || q.includes("correo") || q.includes("contratar") || q.includes("linkedin") || q.includes("github") || q.includes("hablar") || q.includes("reunion") || q.includes("reunión") || q.includes("proyecto") || q.includes("trabaj") || q.includes("presupuesto")) {
    return "¡Estaré encantado de ayudarte a conectar con Sergi! Puedes escribirle directamente a su email sergiregany1996@gmail.com o enviarle un mensaje en LinkedIn (linkedin.com/in/sregany). Sergi está siempre abierto a colaborar en nuevos proyectos SaaS, integraciones de IA o desarrollo enterprise.";
  }

  return "¡Hola! Soy el asistente virtual de Sergi Regany. Puedo contarte todos los detalles sobre sus proyectos (INVESTFINCA, TREBOJOCS, NexusAI), su completo stack tecnológico (Next.js 15, Prisma/Drizzle, Vercel AI SDK, Gemini 1.5 Flash) o ayudarte a conectar con él escribiendo a sergiregany1996@gmail.com. ¿En qué te puedo ayudar hoy?";
}

function streamTextResponse(text: string) {
  const encoder = new TextEncoder();
  const words = text.split(" ");
  let index = 0;

  const stream = new ReadableStream({
    async start(controller) {
      const interval = setInterval(() => {
        if (index < words.length) {
          const chunk = (index === 0 ? "" : " ") + words[index];
          controller.enqueue(encoder.encode(`0:${JSON.stringify(chunk)}\n`));
          index++;
        } else {
          clearInterval(interval);
          controller.close();
        }
      }, 30);
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastUserMessage = (messages || [])
      .slice()
      .reverse()
      .find((m: any) => m.role === "user")?.content || "";

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;

    if (apiKey) {
      let chatHistory = (messages || [])
        .filter((m: any) => m.content && m.content.trim() !== "")
        .map((m: any) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        }));

      if (chatHistory.length > 0 && chatHistory[0].role === "model") {
        chatHistory.shift();
      }
      if (chatHistory.length === 0 || chatHistory[0].role !== "user") {
        chatHistory = [{ role: "user", parts: [{ text: "Hola" }] }, ...chatHistory];
      }

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

          if (response.ok) {
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
                          // Fragmento JSON incompleto
                        }
                      }
                    }
                  }
                } finally {
                  controller.close();
                }
              },
            });

            return new Response(stream, {
              headers: { "Content-Type": "text/plain; charset=utf-8" },
            });
          }
        } catch {
          // Intentar siguiente modelo o caer en el generador inteligente
        }
      }
    }

    // Fallback inteligente (garantiza respuesta 100% confiable si no hay API Key o falla el proveedor)
    return streamTextResponse(getSmartResponse(lastUserMessage));
  } catch (error: any) {
    return streamTextResponse(
      "¡Hola! Soy el asistente virtual de Sergi Regany. Puedo darte información sobre sus proyectos (INVESTFINCA, TREBOJOCS, NexusAI), su stack técnico o su contacto en sergiregany1996@gmail.com."
    );
  }
}
