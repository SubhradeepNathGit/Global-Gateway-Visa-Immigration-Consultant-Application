/**
 * Visa Support — primary: Groq (free tier). Set GROQ_API_KEY in Supabase secrets.
 * Client falls back to local site guide if Groq fails.
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
  return `You are the expert Visa Support AI for Global Gateway (${APP_URL}).

ROLE: Guide users step-by-step on this website — visas, courses, payments, account, dashboard, embassy updates. Handle simple and complicated questions. Think through multi-step scenarios.

WEBSITE MAP:
- Home: /
- About: /about
- Countries: /country → Visa Process & policy per destination
- Contact: /contact
- Sign in / register: /authentication
- Dashboard: /dashboard
- Courses / IELTS: /course
- Cart/checkout: from /course (login required)
- Admin: /admin | Embassy: separate portal (not for applicants)

VISAS: Student, Family, Tourist, Resident, Working, Business (per country on /country).

JOURNEY: /country → Visa Process → /authentication → application form + documents → pay → /dashboard.

PAYMENTS: UPI/cards at checkout. Issues → /contact with transaction ID.
REFUNDS: checkout terms + /contact.
CONTACT: needhelp@company.com, +92 666 888 0000, 66 Road Broklyn Street, 600 New York, USA.

RULES: Smart, clear answers; numbered steps when helpful; no invented fees/timelines; no passwords/OTP/cards; decline off-topic; cannot browse live site — use this map; under ~220 words unless steps need detail.`;
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

function parseApiError(status: number, errText: string): string {
  try {
    const parsed = JSON.parse(errText);
    const msg = parsed?.error?.message ?? parsed?.message;
    if (typeof msg === "string") return msg.slice(0, 300);
  } catch {
    /* ignore */
  }
  return `HTTP ${status}`;
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
      top_p: 0.9,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("[visa-support-chat] Groq", model, res.status, errText);
    throw new Error(parseApiError(res.status, errText));
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text || typeof text !== "string") {
    throw new Error("Empty Groq response");
  }
  return text.trim();
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (rateBuckets.get(key) ?? []).filter((t) => now - t < 60_000);
  if (recent.length >= 30) {
    rateBuckets.set(key, recent);
    return true;
  }
  recent.push(now);
  rateBuckets.set(key, recent);
  return false;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const apiKey = Deno.env.get("GROQ_API_KEY")?.trim();
  if (!apiKey) {
    return json(
      {
        error: "Groq not configured. Set GROQ_API_KEY in Supabase secrets.",
        code: "NOT_CONFIGURED",
      },
      503,
    );
  }

  const clientKey =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
  if (isRateLimited(clientKey)) {
    return json({ error: "Rate limited", code: "RATE_LIMITED" }, 429);
  }

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

  const configured = Deno.env.get("GROQ_MODEL")?.trim();
  const models = [
    configured,
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant",
    "mixtral-8x7b-32768",
  ].filter((m): m is string => Boolean(m))
    .filter((m, i, a) => a.indexOf(m) === i);

  let reply: string | null = null;
  let lastErr = "";

  for (const model of models) {
    try {
      reply = await callGroq(apiKey, model, messages);
      break;
    } catch (e) {
      lastErr = e instanceof Error ? e.message : String(e);
    }
  }

  if (!reply) {
    return json(
      {
        error: "Groq unavailable",
        code: "UPSTREAM_ERROR",
        hint: lastErr,
      },
      502,
    );
  }

  return json({ reply, engine: "groq" });
});
