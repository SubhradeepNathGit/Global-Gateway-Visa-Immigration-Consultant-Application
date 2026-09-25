/**
 * Vercel Serverless Function: /api/visa-chat
 * Calls Gemini (or Groq) using private server-side env vars.
 * Keys are NEVER sent to the browser.
 *
 * Env vars to set in Vercel Dashboard (private, no VITE_ prefix):
 *   GEMINI_API_KEY  — your Google Gemini API key
 *   GROQ_API_KEY    — your Groq API key (optional fallback)
 *   GEMINI_MODEL    — optional, defaults to gemini-1.5-flash
 *   GROQ_MODEL      — optional, defaults to llama-3.3-70b-versatile
 */

const APP_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'https://global-gateway-pro.vercel.app';

function buildSystemPrompt() {
  return `You are the expert Visa Support AI for Global Gateway (${APP_URL}).

ABOUT GLOBAL GATEWAY:
Global Gateway is a professional visa & immigration consultancy platform. Users browse destination countries, view visa requirements, submit applications, pay fees, and track status — all from one platform.

ROLE: Answer every question about this website and its visa services — applications, appointments, rescheduling, payments, refunds, courses, login, dashboard, embassy updates, documents, and policies.

SITE AREAS (use these names only — never write slash paths like /country):
- Home page, About page, Countries page, Visa Process (per country), Sign in page, Password reset, Dashboard, Courses page, Contact us page, Admin login (staff only)

VISA TYPES: Student, Family, Tourist, Resident, Working, Business (availability per country on Countries page).

APPLICATION JOURNEY: Countries page → pick destination → Visa Process → review requirements & fees → Sign in → fill form → upload documents → pay at checkout → track on Dashboard.

APPOINTMENTS & RESCHEDULING: After applying, embassy assigns appointment slots shown on Dashboard. Reschedule via Dashboard if option is shown, else Contact us page with application reference and registered email. Never promise a specific date.

PAYMENTS: Status and receipts on Dashboard. Failed payment: retry; if debited without confirmation → Contact us with transaction ID and email.

COURSES (IELTS & COACHING): Courses page → cart → checkout → access from Dashboard.

CONTACT: needhelp@globalgateway.com | +91 8976564530 | Sector V, Bidhannagar, Kolkata, West Bengal 700091, India.

OUTPUT RULES:
- Speak as "we" about the site. Answer the user's question first, then give the next step.
- Plain text only. No markdown (no **bold**, no #headings). Use numbered steps or bullets.
- Never write URL paths. Use page names only. Under 220 words. Warm and clear.
- Never invent fees, processing times, or appointment slots.
- Never ask for passwords, OTPs, or card numbers.`;
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

async function callGemini(messages) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not set in Vercel env vars');

  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const endpoints = [
    `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent`,
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
  ];

  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  let lastErr = '';
  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: buildSystemPrompt() }] },
          contents,
          generationConfig: { temperature: 0.55, maxOutputTokens: 900 },
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        lastErr = `Gemini ${res.status}: ${errText.slice(0, 200)}`;
        continue;
      }

      const data = await res.json();
      const parts = data?.candidates?.[0]?.content?.parts ?? [];
      for (const part of parts) {
        if (typeof part?.text === 'string' && part.text.trim()) {
          return { reply: part.text.trim(), engine: 'gemini' };
        }
      }
    } catch (e) {
      lastErr = e?.message || String(e);
    }
  }
  throw new Error(lastErr || 'Empty Gemini response');
}

async function callGroq(messages) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY not set in Vercel env vars');

  const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
  const chatMessages = [
    { role: 'system', content: buildSystemPrompt() },
    ...messages.map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    })),
  ];

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model, messages: chatMessages, temperature: 0.55, max_tokens: 1100 }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Groq ${res.status}: ${errText.slice(0, 200)}`);
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error('Empty Groq response');
  return { reply: text.trim(), engine: 'groq' };
}

export default async function handler(req, res) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.set(corsHeaders()).status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { messages } = req.body ?? {};
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'messages array required' });
    return;
  }

  let debugError = '';

  // 1. Try Gemini first
  try {
    const result = await callGemini(messages);
    res.set(corsHeaders()).status(200).json(result);
    return;
  } catch (e) {
    debugError = `Gemini: ${e.message}`;
    console.warn('[visa-chat] Gemini failed:', e.message);
  }

  // 2. Fallback to Groq
  try {
    const result = await callGroq(messages);
    res.set(corsHeaders()).status(200).json(result);
    return;
  } catch (e) {
    debugError += ` | Groq: ${e.message}`;
    console.warn('[visa-chat] Groq failed:', e.message);
  }

  // 3. Both failed — signal client to use local engine
  res.set(corsHeaders()).status(200).json({
    reply: null,
    engine: 'local',
    debugError,
  });
}
