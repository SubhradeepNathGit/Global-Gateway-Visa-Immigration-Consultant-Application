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

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function shouldUseWebSearch(userText: string): boolean {
  const lower = userText.toLowerCase();
  if (lower.length < 8) return false;
  return /\b(age|eligibility|eligible|requirement|how old|years old|minimum|maximum|policy|rule|criteria|validity|processing|document|fee|cost|tourist|student|work|visa|south africa|india|schengen|uk|usa|canada)\b/.test(
    lower,
  );
}

async function fetchWebSearchContext(query: string): Promise<string> {
  const snippets: string[] = [];

  const serperKey = Deno.env.get("SERPER_API_KEY")?.trim();
  if (serperKey) {
    try {
      const res = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: {
          "X-API-KEY": serperKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ q: query, num: 6, gl: "in" }),
      });
      if (res.ok) {
        const data = await res.json();
        for (const item of (data?.organic ?? []).slice(0, 6)) {
          if (item?.title && item?.snippet) {
            snippets.push(`${item.title}: ${item.snippet}`);
          }
        }
      }
    } catch (e) {
      console.warn("[visa-support-chat] Serper search failed", e);
    }
  }

  try {
    const ddgUrl =
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1&skip_disambig=1`;
    const res = await fetch(ddgUrl, { signal: AbortSignal.timeout(2500) });
    if (res.ok) {
      const data = await res.json();
      if (typeof data.Abstract === "string" && data.Abstract.trim()) {
        snippets.push(`Summary: ${data.Abstract.trim()}`);
      }
      for (const topic of (data.RelatedTopics ?? []).slice(0, 5)) {
        if (typeof topic?.Text === "string" && topic.Text.trim()) {
          snippets.push(topic.Text.trim());
        }
      }
    }
  } catch (e) {
    console.warn("[visa-support-chat] DuckDuckGo search failed", e);
  }

  return snippets.slice(0, 8).join("\n");
}

function extractOpenAiContent(data: unknown): string {
  const msg = (data as { choices?: { message?: Record<string, unknown> }[] })
    ?.choices?.[0]?.message;
  if (!msg) return "";
  const content = msg.content;
  if (typeof content === "string" && content.trim()) return content.trim();
  if (Array.isArray(content)) {
    const joined = content
      .map((p) => (typeof (p as { text?: string })?.text === "string" ? (p as { text: string }).text : ""))
      .join("\n")
      .trim();
    if (joined) return joined;
  }
  const reasoning = msg.reasoning || msg.reasoning_content;
  if (typeof reasoning === "string" && reasoning.trim()) {
    const cleaned = reasoning.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
    if (cleaned) return cleaned;
    return reasoning.trim();
  }
  return "";
}

/** Merges consecutive messages of the same role and guarantees clean alternating multi-turn chat */
function prepareChatMessages(
  systemPrompt: string,
  messages: ChatMessage[],
): { role: string; content: string }[] {
  const prepared: { role: string; content: string }[] = [];
  if (systemPrompt.trim()) {
    prepared.push({ role: "system", content: systemPrompt.trim() });
  }

  for (const m of messages) {
    const role = m.role === "assistant" ? "assistant" : "user";
    const content = String(m.content ?? "").trim();
    if (!content) continue;

    const last = prepared[prepared.length - 1];
    if (last && last.role === role) {
      last.content += "\n\n" + content;
    } else {
      prepared.push({ role, content });
    }
  }

  const firstNonSystem = prepared.findIndex((p) => p.role !== "system");
  if (firstNonSystem !== -1 && prepared[firstNonSystem].role === "assistant") {
    prepared.splice(firstNonSystem, 1);
  }

  return prepared;
}

function buildSystemPrompt(searchContext = ""): string {
  const base = `You are the expert Visa Support AI for Global Gateway (${APP_URL}).

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
- When WEB SEARCH CONTEXT is provided below, use it for factual eligibility, age, and policy answers. Always add how to apply on Global Gateway (Countries page, Visa Process, Sign in).
- If unsure, give the best nearest answer and say embassy rules can change — confirm on Visa Process or Contact us.

You cannot browse the live web yourself; use site knowledge and any WEB SEARCH CONTEXT below.`;

  const ctx = searchContext.trim();
  if (!ctx) return base;
  return `${base}\n\nWEB SEARCH CONTEXT:\n${ctx}`;
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

function buildLocalReply(messages: ChatMessage[], searchContext = ""): string {
  const text = lastUserMessage(messages);
  const lower = text.toLowerCase();

  if (
    /\b(age|eligibility|eligible)\b/.test(lower) &&
    /\b(tourist|visitor)\b/.test(lower) &&
    /\bsouth africa\b/.test(lower)
  ) {
    let reply =
      "South Africa visitor/tourist visa eligibility (general guidance):\n\n" +
      "• Applicants usually need a valid passport, proof of funds, return travel, and accommodation.\n" +
      "• Minors often need extra documents (birth certificate, parental consent) — exact rules depend on nationality.\n" +
      "• There is no single 'minimum age' for all tourists; children travel with guardian documents.\n\n" +
      "On Global Gateway: open the Countries page → South Africa → Visa Process for the checklist for your nationality, then apply after Sign in.";
    if (searchContext.trim()) {
      reply += `\n\nReference notes:\n${searchContext.trim().slice(0, 600)}`;
    }
    return formatChatReply(reply);
  }

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
  searchContext = "",
): Promise<string> {
  const chatMessages = prepareChatMessages(buildSystemPrompt(searchContext), messages);

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
    signal: AbortSignal.timeout(9000),
  });

  if (!res.ok) {
    const errText = await res.text();
    const err: any = new Error(`OpenRouter ${res.status}: ${parseApiError(errText)}`);
    err.status = res.status;
    throw err;
  }

  const data = await res.json();
  const text = extractOpenAiContent(data);
  if (!text) throw new Error("Empty OpenRouter response");
  return formatChatReply(text);
}

// ─── Groq ──────────────────────────────────────────────────────────────────
async function callGroq(
  apiKey: string,
  model: string,
  messages: ChatMessage[],
  searchContext = "",
): Promise<string> {
  const chatMessages = prepareChatMessages(buildSystemPrompt(searchContext), messages);

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
    signal: AbortSignal.timeout(9000),
  });

  if (!res.ok) {
    throw new Error(parseApiError(await res.text()));
  }

  const data = await res.json();
  const text = extractOpenAiContent(data);
  if (!text) throw new Error("Empty Groq response");
  return formatChatReply(text);
}

// ─── Gemini ────────────────────────────────────────────────────────────────
function toGeminiContents(messages: ChatMessage[]) {
  const contents: { role: string; parts: { text: string }[] }[] = [];
  for (const m of messages) {
    const role = m.role === "assistant" ? "model" : "user";
    const text = String(m.content ?? "").trim();
    if (!text) continue;
    const last = contents[contents.length - 1];
    if (last && last.role === role) {
      last.parts[0].text += "\n\n" + text;
    } else {
      contents.push({ role, parts: [{ text }] });
    }
  }
  while (contents.length > 0 && contents[0].role === "model") {
    contents.shift();
  }
  return contents;
}

async function callGemini(
  apiKey: string,
  model: string,
  messages: ChatMessage[],
  searchContext = "",
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
          systemInstruction: { parts: [{ text: buildSystemPrompt(searchContext) }] },
          contents: toGeminiContents(messages),
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 900,
          },
        }),
        signal: AbortSignal.timeout(9000),
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

/**
 * Per-request error tracking. Each handler invocation creates its own errors array.
 * FIX: Previously a module-level `let lastError = ""` was shared across all concurrent
 * requests (Deno isolates can share module state between invocations), causing the
 * alternating success/failure bug where error strings from one request bled into the next.
 */
async function tryOpenRouter(
  messages: ChatMessage[],
  searchContext: string,
  errors: string[],
): Promise<string | null> {
  const apiKey = Deno.env.get("OPENROUTER_API_KEY")?.trim();
  if (!apiKey) {
    errors.push("OPENROUTER_API_KEY secret missing on Supabase");
    return null;
  }

  const configured = Deno.env.get("OPENROUTER_MODEL")?.trim();

  // Multi-provider verified active free models (Google, Meta, DeepSeek, Qwen, Mistral)
  const models = [
    configured,
    "google/gemini-2.0-flash-exp:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "meta-llama/llama-3.1-8b-instruct:free",
    "deepseek/deepseek-r1:free",
    "deepseek/deepseek-chat:free",
    "qwen/qwen-2.5-coder-32b-instruct:free",
    "mistralai/mistral-small-24b-instruct-2501:free",
    "openrouter/auto",
  ].filter((m): m is string => Boolean(m))
   .filter((m, i, a) => a.indexOf(m) === i);

  for (const model of models) {
    let skipModel = false;
    for (let attempt = 0; attempt < 2; attempt++) {
      if (skipModel) break;
      try {
        const reply = await callOpenRouter(apiKey, model, messages, searchContext);
        if (reply && reply.trim()) {
          console.log(`[visa-support-chat] OpenRouter OK: ${model} attempt=${attempt + 1}`);
          return reply;
        }
        errors.push(`OpenRouter (${model}) attempt ${attempt + 1}: empty reply`);
      } catch (e: any) {
        const errMsg: string = e?.message || String(e);
        const status: number = e?.status || (
          errMsg.includes("401") ? 401 :
          errMsg.includes("402") ? 402 :
          errMsg.includes("404") ? 404 :
          errMsg.includes("429") ? 429 : 0
        );
        errors.push(`OpenRouter (${model}): ${errMsg}`);
        console.warn(`[visa-support-chat] OpenRouter failed: ${model} (status ${status}):`, errMsg);

        // 401 Unauthorized / Invalid Key — all models will fail with this key, stop OpenRouter entirely!
        if (status === 401 || errMsg.toLowerCase().includes("invalid api key") || errMsg.toLowerCase().includes("unauthorized")) {
          errors.push("OpenRouter API key is invalid or unauthorized (401)");
          return null; // Skip to Groq immediately!
        }

        // 402 Insufficient credits — skip this model immediately, do not retry!
        if (status === 402 || errMsg.toLowerCase().includes("credits") || errMsg.toLowerCase().includes("payment required")) {
          skipModel = true;
          break;
        }

        // 404 Model not found or deprecated — skip this model immediately, do not retry!
        if (status === 404 || errMsg.toLowerCase().includes("not found")) {
          skipModel = true;
          break;
        }

        // 429 Rate limited — skip this model immediately, do not retry!
        const isRateLimit = status === 429 || errMsg.toLowerCase().includes("rate limit") || errMsg.toLowerCase().includes("too many");
        if (isRateLimit) {
          skipModel = true;
          break;
        }

        // Only retry once on 5xx or network errors with brief 300ms backoff
        if (attempt < 1) {
          await sleep(300);
        }
      }
    }
  }
  return null;
}

async function tryGroq(
  messages: ChatMessage[],
  searchContext: string,
  errors: string[],
): Promise<string | null> {
  const apiKey = (Deno.env.get("GROQ_API_KEY") || Deno.env.get("GROQ_APT_KEY"))?.trim();
  if (!apiKey) {
    errors.push("GROQ_API_KEY (or GROQ_APT_KEY) secret missing on Supabase");
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
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const reply = await callGroq(apiKey, model, messages, searchContext);
        if (reply && reply.trim()) {
          console.log(`[visa-support-chat] Groq OK: ${model}`);
          return reply;
        }
        errors.push(`Groq (${model}) attempt ${attempt + 1}: empty reply`);
      } catch (e: any) {
        const errMsg: string = e?.message || String(e);
        errors.push(`Groq (${model}) attempt ${attempt + 1}: ${errMsg}`);
        console.warn(`[visa-support-chat] Groq failed: ${model}`, errMsg);
        if (attempt < 1) await sleep(400);
      }
    }
  }
  return null;
}

async function tryGemini(
  messages: ChatMessage[],
  searchContext: string,
  errors: string[],
): Promise<string | null> {
  const apiKey = Deno.env.get("GEMINI_API_KEY")?.trim();
  if (!apiKey) {
    errors.push("GEMINI_API_KEY secret missing on Supabase");
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
      const reply = await callGemini(apiKey, model, messages, searchContext);
      if (reply && reply.trim()) {
        console.log(`[visa-support-chat] Gemini OK: ${model}`);
        return reply;
      }
      errors.push(`Gemini (${model}): empty reply`);
    } catch (e: any) {
      errors.push(`Gemini (${model}): ${e?.message || String(e)}`);
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

  // FIX: Per-request scoped error tracking — never shared across concurrent requests
  const errors: string[] = [];

  const userQuery = lastUserMessage(messages);
  let searchContext = "";
  if (shouldUseWebSearch(userQuery)) {
    searchContext = await fetchWebSearchContext(userQuery);
  }

  // Priority 1: OpenRouter (primary — always tried first, with per-model retries + backoff)
  let reply = await tryOpenRouter(messages, searchContext, errors);
  let engine = "openrouter";

  // Priority 2: Groq (fast, reliable secondary)
  if (!reply) {
    reply = await tryGroq(messages, searchContext, errors);
    engine = "groq";
  }

  // Priority 3: Gemini (tertiary)
  if (!reply) {
    reply = await tryGemini(messages, searchContext, errors);
    engine = "gemini";
  }

  // Priority 4: Local fallback — ONLY when ALL 3 APIs fail (critical condition)
  if (!reply) {
    reply = buildLocalReply(messages, searchContext);
    engine = "local";
    console.warn("[visa-support-chat] All APIs failed — local fallback used. Errors:", errors.join(" | "));
  }

  const finalReply = formatChatReply(reply).trim() ||
    formatChatReply(buildLocalReply(messages, searchContext));

  return json({
    reply: finalReply,
    engine,
    debugError: errors.length > 0 ? errors.join(" | ") : undefined,
  });
});

