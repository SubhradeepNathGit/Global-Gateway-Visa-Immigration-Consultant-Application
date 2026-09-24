/**
 * Visa Support chat — Groq (primary) → Gemini (backup) → built-in site guide (always 200).
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
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
  Deno.env.get("PUBLIC_APP_URL") ?? "https://l-gateway-pro.vercel.app";

function buildSystemPrompt() {
  return `You are Visa Support for Global Gateway (${APP_URL}).

Help users with visas (student, tourist, work, business, family, resident), applying via /country → Visa Process, /authentication, /dashboard, courses at /course, payments, refunds (/contact).

When asked if a visa is available for a country (e.g. South Africa student visa): explain they should open /country, find that country, and check Visa Process for listed visa types; if unsure, suggest /contact. Do not invent fees or processing times.

For greetings (hi, hey), reply warmly in one short sentence and invite them to name a country or visa type.

Be clear, step-by-step, under 220 words. No passwords or card numbers.`;
}

const MAX_MESSAGES = 24;
const MAX_CONTENT_LENGTH = 2000;
const rateBuckets = new Map<string, number[]>();

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
  const n = text.toLowerCase().trim();
  if (!n) return true;
  const set = new Set([
    "hi", "hey", "hello", "hola", "namaste", "yo", "ok", "okay", "thanks",
    "thank you", "bye", "goodbye",
  ]);
  return set.has(n) || (/^(hi|hey|hello)\b/.test(n) && n.length < 24);
}

/** Server-side guide when AI keys missing or upstream fails */
function buildLocalReply(messages: ChatMessage[]): string {
  const text = lastUserMessage(messages);
  const lower = text.toLowerCase();

  if (!lower.trim() || isGreeting(text)) {
    return (
      "Hi! I'm your Global Gateway visa assistant. Ask about a country (/country), student or tourist visas, fees, how to apply, courses (/course), or /contact."
    );
  }

  const isIndian = /\b(indian|india|from india)\b/.test(lower);
  const isSA =
    lower.includes("south africa") ||
    (lower.includes("africa") && lower.includes("south"));

  if (
    isSA &&
    (lower.includes("student") || lower.includes("study"))
  ) {
    return (
      "For a South Africa student visa on Global Gateway:\n\n" +
      "1. Go to /country and look for South Africa (or search).\n" +
      "2. Open Visa Process — if student visa is listed, you'll see requirements and fees.\n" +
      "3. Sign in at /authentication, complete the application, and pay at checkout.\n\n" +
      (isIndian
        ? "As an Indian applicant, enter your nationality in the form and upload the documents listed for student visa.\n\n"
        : "") +
      "If South Africa isn't listed yet, contact /contact with your study plans — we'll confirm availability."
    );
  }

  if (isIndian && (lower.includes("student") || lower.includes("study")) && !isSA) {
    return (
      "For an Indian student visa: go to /country, choose your destination, open Visa Process, then apply at /authentication. " +
      "Tell us the country (e.g. South Africa) for step-by-step help."
    );
  }

  if (lower.includes("available") || lower.includes("offer") || lower.includes("do you have")) {
    return (
      "Visa availability is shown per country on our site:\n\n" +
      "• Open /country → select your destination → Visa Process.\n" +
      "• Listed visa types (student, tourist, work, etc.) are what you can apply for online.\n" +
      "• Not listed? Use /contact — tell us the country and visa type."
    );
  }

  if (lower.includes("student") || lower.includes("study")) {
    return "Student visas: /country → pick destination → Visa Process → /authentication → apply → pay → track in /dashboard.";
  }
  if (lower.includes("ielts") || lower.includes("course")) {
    return "Courses & IELTS: /course → details → cart → checkout. Access from /dashboard after purchase.";
  }
  if (lower.includes("price") || lower.includes("fee") || lower.includes("cost")) {
    return "Fees appear on each country's Visa Process and checkout before you pay. Courses show prices on /course.";
  }
  if (lower.includes("apply") || lower.includes("how")) {
    return "Apply: /country → Visa Process → /authentication → form + documents → payment → /dashboard.";
  }
  if (lower.includes("contact") || lower.includes("phone") || lower.includes("email")) {
    return "Contact: /contact • needhelp@company.com • +92 666 888 0000";
  }

  return (
    "I can help with Global Gateway visas and the website. Try /country for destinations, or ask about student/tourist visas, fees, apply steps, courses (/course), or /contact."
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
      temperature: 0.55,
      max_tokens: 1100,
    }),
  });

  if (!res.ok) {
    throw new Error(parseApiError(await res.text()));
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text || typeof text !== "string") throw new Error("Empty Groq response");
  return text.trim();
}

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
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const generationConfig: Record<string, unknown> = {
    temperature: 0.55,
    maxOutputTokens: 900,
  };
  if (model.includes("2.5")) {
    generationConfig.thinkingConfig = { thinkingBudget: 0 };
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: buildSystemPrompt() }] },
      contents: toGeminiContents(messages),
      generationConfig,
    }),
  });

  if (!res.ok) {
    throw new Error(parseApiError(await res.text()));
  }

  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    if (typeof part?.text === "string" && part.text.trim()) {
      return part.text.trim();
    }
  }
  throw new Error("Empty Gemini response");
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (rateBuckets.get(key) ?? []).filter((t) => now - t < 60_000);
  if (recent.length >= 40) {
    rateBuckets.set(key, recent);
    return true;
  }
  recent.push(now);
  rateBuckets.set(key, recent);
  return false;
}

async function tryGroq(messages: ChatMessage[]): Promise<string | null> {
  const apiKey = Deno.env.get("GROQ_API_KEY")?.trim();
  if (!apiKey) return null;

  const configured = Deno.env.get("GROQ_MODEL")?.trim();
  const models = [
    configured,
    "llama-3.3-70b-versatile",
    "llama-3.1-70b-versatile",
    "llama-3.1-8b-instant",
  ].filter((m): m is string => Boolean(m))
    .filter((m, i, a) => a.indexOf(m) === i);

  for (const model of models) {
    try {
      return await callGroq(apiKey, model, messages);
    } catch (e) {
      console.warn("[visa-support-chat] Groq failed", model, e);
    }
  }
  return null;
}

async function tryGemini(messages: ChatMessage[]): Promise<string | null> {
  const apiKey = Deno.env.get("GEMINI_API_KEY")?.trim();
  if (!apiKey) return null;

  const configured = Deno.env.get("GEMINI_MODEL")?.trim();
  const models = [
    configured,
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
  ].filter((m): m is string => Boolean(m))
    .filter((m, i, a) => a.indexOf(m) === i);

  for (const model of models) {
    try {
      return await callGemini(apiKey, model, messages);
    } catch (e) {
      console.warn("[visa-support-chat] Gemini failed", model, e);
    }
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const clientKey =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const messages = sanitizeMessages(body.messages);
  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return json({ error: "Need at least one user message" }, 400);
  }

  if (isRateLimited(clientKey)) {
    return json({
      reply: buildLocalReply(messages),
      engine: "local",
      code: "RATE_LIMITED",
    });
  }

  let reply = await tryGroq(messages);
  let engine = "groq";

  if (!reply) {
    reply = await tryGemini(messages);
    engine = "gemini";
  }

  if (!reply) {
    reply = buildLocalReply(messages);
    engine = "local";
  }

  return json({ reply, engine });
});
