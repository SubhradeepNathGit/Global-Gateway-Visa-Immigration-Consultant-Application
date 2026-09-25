

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type ChatRole = "user" | "assistant";

interface ChatMessage {
  role: ChatRole;
  content: string;
}

interface RequestBody {
  messages?: ChatMessage[];
}

const APP_URL =
  Deno.env.get("PUBLIC_APP_URL") ?? "https://global-gateway-pro.vercel.app";

function formatChatReply(text: string): string {
  const labels: Record<string, string> = {
    country: "Countries page",
    authentication: "Sign in page",
    dashboard: "your dashboard",
    contact: "Contact us page",
    course: "Courses page",
    about: "About page",
    admin: "Admin login",
    "reset-password": "password reset page",
  };
  let t = text;
  t = t.replace(/\*\*([^*]+)\*\*/g, "$1");
  t = t.replace(/\*([^*]+)\*/g, "$1");
  t = t.replace(/`([^`]+)`/g, "$1");
  t = t.replace(/\/([a-z][a-z0-9-]*)/gi, (_, seg: string) => {
    const key = seg.toLowerCase();
    return labels[key] ?? `the ${seg} section`;
  });
  return t.trim();
}

function buildSystemPrompt(): string {
  return `You are the expert Visa Support AI for Global Gateway (${APP_URL}).

ROLE: Answer every question about this website and visa services — applications, appointments, rescheduling, payments, refunds, courses, login, dashboard, embassy updates, documents, and policies. Think step-by-step for complex cases.

SITE AREAS (use these names only — never write slash paths like /country):
- Home page
- About page
- Countries page → pick a country → Visa Process and policy
- Contact us page (human support)
- Sign in page (register or log in)
- Password reset via email link from Sign in
- Dashboard (applications, payments, courses, appointments, notifications)
- Courses page (IELTS and coaching) → cart → checkout
- Admin login (staff only; not for applicants)

VISA TYPES: Student, Family, Tourist, Resident, Working, Business — availability per country on Countries page.

TYPICAL JOURNEY: Countries page → Visa Process → Sign in → application form and uploads → payment → track on dashboard. Embassy may schedule biometrics or interviews; user sees details on dashboard and email.

APPOINTMENTS & RESCHEDULING: After applying, embassies may assign appointment slots. Users check dashboard and notifications. Rescheduling depends on embassy rules — use dashboard options if shown, otherwise Contact us with application reference. Never promise a specific date.

PAYMENTS: UPI, cards, etc. at checkout. Status and receipts on dashboard. Failed payment: retry; if debited without confirmation → Contact us with transaction ID and email.

CONTACT: needhelp@globalgateway.com, +91 8976564530, Sector V, Bidhannagar, Kolkata, West Bengal 700091, India.

OUTPUT RULES:
- You are Global Gateway's own assistant. Speak as "we" about the site.
- Answer the user's exact question first, then give the next step on the site.
- Plain text only. No markdown (no **). Use numbered steps or • bullets.
- Never write slash paths (not /country, /dashboard, /contact). Use page names.
- Warm, clear, under 220 words.
- Do not invent fees, processing days, or appointment slots — point to Visa Process, dashboard, or Contact us.
- Never ask for passwords, OTPs, or card numbers.

You cannot browse the web; use this knowledge only.`;
}

const MAX_MESSAGES = 24;
const MAX_CONTENT_LENGTH = 2000;

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function sanitizeMessages(raw: unknown): ChatMessage[] {
  if (!Array.isArray(raw)) return [];
  const out: ChatMessage[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const role = (item as ChatMessage).role;
    const content = String((item as ChatMessage).content ?? "").trim();
    if (role !== "user" && role !== "assistant") continue;
    if (!content || content.length > MAX_CONTENT_LENGTH) continue;
    out.push({ role, content });
  }
  let msgs = out.slice(-MAX_MESSAGES);
  while (msgs.length > 0 && msgs[0].role === "assistant") {
    msgs = msgs.slice(1);
  }
  return msgs;
}

function lastUserMessage(messages: ChatMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user") return messages[i].content;
  }
  return "";
}

function isGreeting(text: string): boolean {
  const n = text.toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
  if (!n) return true;
  const set = new Set([
    "hi", "hey", "hello", "hola", "namaste", "yo", "ok", "okay", "thanks",
    "thank you", "bye", "goodbye", "hi there", "hey there",
  ]);
  return set.has(n);
}

function buildLocalReply(messages: ChatMessage[]): string {
  const text = lastUserMessage(messages);
  const lower = text.toLowerCase();

  if (!lower.trim() || isGreeting(text)) {
    return formatChatReply(
      "Hi! I'm your Global Gateway visa assistant. Ask about a country, student or tourist visas, fees, how to apply, courses, or contact support.",
    );
  }

  return formatChatReply(
    "Global Gateway Assistant Services:\n\n" +
    "• Visa Applications — Student, Tourist, Work, Family, Resident visas\n" +
    "• IELTS & Coaching — Band 7+ prep and interview practice\n" +
    "• Dashboard & Tracking — Monitor application and appointment status\n" +
    "• Customer Support — Contact us page or email needhelp@globalgateway.com\n\n" +
    "Tell me what you'd like help with!"
  );
}

function parseApiError(errText: string): string {
  try {
    const parsed = JSON.parse(errText);
    const msg = parsed?.error?.message ?? parsed?.message;
    if (typeof msg === "string") return msg.slice(0, 300);
  } catch {
    /* ignore */
  }
  return errText.slice(0, 200);
}

// ─── OpenRouter ────────────────────────────────────────────────────────────
async function callOpenRouter(
  apiKey: string,
  model: string,
  messages: ChatMessage[],
): Promise<string> {
  const chatMessages = [
    { role: "system", content: buildSystemPrompt() },
    ...messages.map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content,
    })),
  ];

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": APP_URL,
      "X-Title": "Global Gateway Visa Support",
    },
    body: JSON.stringify({
      model,
      messages: chatMessages,
      temperature: 0.4,
      max_tokens: 1100,
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenRouter ${res.status}: ${parseApiError(await res.text())}`);
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text || typeof text !== "string") throw new Error("Empty OpenRouter response");
  return formatChatReply(text.trim());
}

// ─── Groq ──────────────────────────────────────────────────────────────────
async function callGroq(
  apiKey: string,
  model: string,
  messages: ChatMessage[],
): Promise<string> {
  const chatMessages = [
    { role: "system", content: buildSystemPrompt() },
    ...messages.map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content,
    })),
  ];

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: chatMessages,
      temperature: 0.4,
      max_tokens: 1100,
    }),
  });

  if (!res.ok) {
    throw new Error(parseApiError(await res.text()));
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text || typeof text !== "string") throw new Error("Empty Groq response");
  return formatChatReply(text.trim());
}

// ─── Gemini ────────────────────────────────────────────────────────────────
function toGeminiContents(messages: ChatMessage[]) {
  return messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
}

async function callGemini(
  apiKey: string,
  model: string,
  messages: ChatMessage[],
): Promise<string> {
  const endpoints = [
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent`,
  ];

  let lastGeminiErr = "";
  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: buildSystemPrompt() }] },
          contents: toGeminiContents(messages),
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 900,
          },
        }),
      });

      if (!res.ok) {
        lastGeminiErr = parseApiError(await res.text());
        continue;
      }

      const data = await res.json();
      const parts = data?.candidates?.[0]?.content?.parts ?? [];
      for (const part of parts) {
        if (typeof part?.text === "string" && part.text.trim()) {
          return formatChatReply(part.text.trim());
        }
      }
    } catch (err: any) {
      lastGeminiErr = err?.message || String(err);
    }
  }
  throw new Error(lastGeminiErr || "Gemini call failed");
}

let lastError = "";

async function tryOpenRouter(messages: ChatMessage[]): Promise<string | null> {
  const apiKey = Deno.env.get("OPENROUTER_API_KEY")?.trim();
  if (!apiKey) {
    lastError = "OPENROUTER_API_KEY secret missing on Supabase";
    return null;
  }

  const configured = Deno.env.get("OPENROUTER_MODEL")?.trim();
  const models = [
    configured,
    "openrouter/auto",
    "meta-llama/llama-3.3-70b-instruct:free",
    "google/gemma-2-9b-it:free",
    "deepseek/deepseek-r1-distill-llama-70b:free",
    "qwen/qwen-2.5-72b-instruct:free",
    "mistralai/mistral-7b-instruct:free",
  ].filter((m): m is string => Boolean(m))
   .filter((m, i, a) => a.indexOf(m) === i);

  for (const model of models) {
    try {
      return await callOpenRouter(apiKey, model, messages);
    } catch (e: any) {
      lastError += ` | OpenRouter (${model}): ${e?.message || String(e)}`;
      console.warn("[visa-support-chat] OpenRouter failed", model, e);
    }
  }
  return null;
}

async function tryGroq(messages: ChatMessage[]): Promise<string | null> {
  const apiKey = Deno.env.get("GROQ_API_KEY")?.trim();
  if (!apiKey) {
    if (!lastError) lastError = "GROQ_API_KEY secret missing on Supabase";
    return null;
  }

  const configured = Deno.env.get("GROQ_MODEL")?.trim();
  const models = [
    configured,
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant",
    "mixtral-8x7b-32768",
    "gemma2-9b-it",
  ].filter((m): m is string => Boolean(m))
   .filter((m, i, a) => a.indexOf(m) === i);

  for (const model of models) {
    try {
      return await callGroq(apiKey, model, messages);
    } catch (e: any) {
      lastError += ` | Groq (${model}): ${e?.message || String(e)}`;
      console.warn("[visa-support-chat] Groq failed", model, e);
    }
  }
  return null;
}

async function tryGemini(messages: ChatMessage[]): Promise<string | null> {
  const apiKey = Deno.env.get("GEMINI_API_KEY")?.trim();
  if (!apiKey) {
    if (!lastError) lastError = "GEMINI_API_KEY secret missing on Supabase";
    return null;
  }

  const configured = Deno.env.get("GEMINI_MODEL")?.trim();
  const models = [
    configured,
    "gemini-2.5-flash",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
  ].filter((m): m is string => Boolean(m))
   .filter((m, i, a) => a.indexOf(m) === i);

  for (const model of models) {
    try {
      return await callGemini(apiKey, model, messages);
    } catch (e: any) {
      lastError += ` | Gemini (${model}): ${e?.message || String(e)}`;
    }
  }
  return null;
}

// ─── Main HTTP Handler supporting GET, POST, and OPTIONS ─────────────────────
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  let messages: ChatMessage[] = [];

  // Support GET requests with ?message=... or ?q=... query parameters
  if (req.method === "GET") {
    const url = new URL(req.url);
    const userQuery = url.searchParams.get("message") || url.searchParams.get("q");

    if (!userQuery) {
      return json({
        ok: true,
        status: "online",
        message: "Visa Support Chatbot Edge Function is running",
        usage: "Send POST with { messages: [...] } or GET with ?message=your_question",
      });
    }

    messages = [{ role: "user", content: userQuery.trim() }];
  } else if (req.method === "POST") {
    let body: RequestBody;
    try {
      body = await req.json();
    } catch {
      return json({ error: "Invalid JSON" }, 400);
    }

    messages = sanitizeMessages(body.messages);
    if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
      return json({ error: "Need at least one user message" }, 400);
    }
  } else {
    return json({ error: "Method not allowed" }, 405);
  }

  lastError = "";

  // Priority order: OpenRouter → Groq → Gemini → Local
  let reply = await tryOpenRouter(messages);
  let engine = "openrouter";

  if (!reply) {
    reply = await tryGroq(messages);
    engine = "groq";
  }

  if (!reply) {
    reply = await tryGemini(messages);
    engine = "gemini";
  }

  if (!reply) {
    reply = buildLocalReply(messages);
    engine = "local";
  }

  return json({
    reply: formatChatReply(reply),
    engine,
    debugError: lastError || undefined,
  });
});
