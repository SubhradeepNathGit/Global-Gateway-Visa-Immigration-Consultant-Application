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
  Deno.env.get("PUBLIC_APP_URL") ?? "https://global-gateway-pro.vercel.app/";

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

function buildSystemPrompt() {
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

CONTACT: needhelp@company.com, +92 666 888 0000, 66 Road Broklyn Street, 600 New York, USA.

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
  const n = text.toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
  if (!n) return true;
  const set = new Set([
    "hi", "hey", "hello", "hola", "namaste", "yo", "ok", "okay", "thanks",
    "thank you", "bye", "goodbye", "hi there", "hey there",
  ]);
  return set.has(n);
}

/** Server-side guide when AI keys missing or upstream fails */
function buildLocalReply(messages: ChatMessage[]): string {
  const text = lastUserMessage(messages);
  const lower = text.toLowerCase();

  if (!lower.trim() || isGreeting(text)) {
    return formatChatReply(
      "Hi! I'm your Global Gateway visa assistant. Ask about a country, student or tourist visas, fees, how to apply, courses, or contact support.",
    );
  }

  if (
    /\b(reschedule|rescheduling|change appointment|move appointment)\b/.test(lower) ||
    (/\b(appointment|interview|biometric)\b/.test(lower) &&
      /\b(can i|how|change|reschedule)\b/.test(lower))
  ) {
    return formatChatReply(
      "Visa appointments are shown on your dashboard and in email notifications after you apply. " +
        "To reschedule, use any reschedule option on your application in the dashboard. " +
        "If you do not see one, contact us via the Contact us page with your registered email and application reference — we will help where embassy policy allows.",
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
    return formatChatReply(
      "For a South Africa student visa on Global Gateway:\n\n" +
      "1. Go to the Countries page and select South Africa.\n" +
      "2. Open Visa Process — if student visa is listed, you'll see requirements and fees.\n" +
      "3. Sign in, complete the application, and pay at checkout.\n\n" +
      (isIndian
        ? "As an Indian applicant, enter your nationality in the form and upload the documents listed for student visa.\n\n"
        : "") +
      "If South Africa isn't listed yet, use the Contact us page with your study plans — we'll confirm availability.",
    );
  }

  if (isIndian && (lower.includes("student") || lower.includes("study")) && !isSA) {
    return formatChatReply(
      "For an Indian student visa: go to the Countries page, choose your destination, open Visa Process, then apply after signing in. " +
      "Tell us the country (e.g. South Africa) for step-by-step help.",
    );
  }

  if (lower.includes("available") || lower.includes("offer") || lower.includes("do you have")) {
    return formatChatReply(
      "Visa availability is shown per country:\n\n" +
      "• Countries page → select destination → Visa Process.\n" +
      "• Listed visa types (student, tourist, work, etc.) can be applied for online.\n" +
      "• Not listed? Contact us with the country and visa type.",
    );
  }

  if (
    /\b(know|tell|help|capabilities|services|offer|can i ask|features|do you do|can you do)\b/.test(lower)
  ) {
    return formatChatReply(
      "I can provide complete guidance on all Global Gateway services:\n\n" +
      "1. Visa Applications: Step-by-step guidance for Student, Tourist, Work, Family, Business & Resident visas.\n" +
      "2. Country Requirements: Document checklists, eligibility criteria, and country policies.\n" +
      "3. Coaching & IELTS: Course enrollment, Band 7+ prep, and practice materials.\n" +
      "4. Embassy Appointments: How to schedule, view, or reschedule biometrics & interviews on your Dashboard.\n" +
      "5. Fees & Payments: Fee breakdowns, payment methods, receipts, and refund policies.\n\n" +
      "What specific country or visa service would you like to know about?"
    );
  }

  if (lower.includes("student") || lower.includes("study")) {
    return formatChatReply(
      "Student visas: Countries page → destination → Visa Process → Sign in → apply → pay → track on your dashboard.",
    );
  }
  if (lower.includes("ielts") || lower.includes("course")) {
    return formatChatReply(
      "Courses and IELTS: Courses page → details → cart → checkout. Access from your dashboard after purchase.",
    );
  }
  if (lower.includes("price") || lower.includes("fee") || lower.includes("cost")) {
    return formatChatReply(
      "Fees appear on each country's Visa Process and checkout before you pay. Courses show prices on the Courses page.",
    );
  }
  if (lower.includes("apply") || lower.includes("how")) {
    return formatChatReply(
      "Apply: Countries page → Visa Process → Sign in → form and documents → payment → dashboard.",
    );
  }
  if (lower.includes("contact") || lower.includes("phone") || lower.includes("email")) {
    return formatChatReply(
      "Contact: Contact us page • needhelp@company.com • +92 666 888 0000",
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
  return formatChatReply(text.trim());
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
      return formatChatReply(part.text.trim());
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

let lastError = "";

async function tryGroq(messages: ChatMessage[]): Promise<string | null> {
  const apiKey = Deno.env.get("GROQ_API_KEY")?.trim();
  if (!apiKey) {
    lastError = "GROQ_API_KEY secret missing on Supabase";
    return null;
  }

  const configured = Deno.env.get("GROQ_MODEL")?.trim();
  const models = [
    configured,
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant",
  ].filter((m): m is string => Boolean(m) && !m.startsWith("eff838"))
    .filter((m, i, a) => a.indexOf(m) === i);

  for (const model of models) {
    try {
      return await callGroq(apiKey, model, messages);
    } catch (e: any) {
      lastError = `Groq (${model}): ${e?.message || String(e)}`;
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
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
  ].filter((m): m is string => Boolean(m) && !m.startsWith("3e4d28"))
    .filter((m, i, a) => a.indexOf(m) === i);

  for (const model of models) {
    try {
      return await callGemini(apiKey, model, messages);
    } catch (e: any) {
      lastError += ` | Gemini (${model}): ${e?.message || String(e)}`;
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

  lastError = "";
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

  return json({ reply: formatChatReply(reply), engine, debugError: lastError || undefined });
});
