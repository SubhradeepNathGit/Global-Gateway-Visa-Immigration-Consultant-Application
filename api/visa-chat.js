/**
 * Vercel Serverless Function: /api/visa-chat
 * Priority: OpenRouter → Groq → Gemini → Local
 */

const APP_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'https://global-gateway-pro.vercel.app';

function buildSystemPrompt() {
  return `You are the expert Visa Support AI for Global Gateway (${APP_URL}).

ROLE: Answer every question about this website and visa services — applications, appointments, rescheduling, payments, refunds, courses, login, dashboard, embassy updates, documents, and policies.

SITE AREAS: Home page, About page, Countries page, Visa Process, Sign in page, Password reset, Dashboard, Courses page, Contact us page, Admin login (staff only).

VISA TYPES: Student, Family, Tourist, Resident, Working, Business.

APPLICATION JOURNEY: Countries page → Visa Process → Sign in → fill form → upload documents → pay at checkout → track on Dashboard.

APPOINTMENTS & RESCHEDULING: Embassy assigns appointment slots shown on Dashboard. Reschedule via Dashboard if option is shown, else Contact us page with application reference.

PAYMENTS: Status and receipts on Dashboard. Failed payment: retry; if debited without confirmation → Contact us with transaction ID.

CONTACT: needhelp@globalgateway.com | +91 8976564530 | Sector V, Bidhannagar, Kolkata, West Bengal 700091, India.

OUTPUT RULES:
- Speak as "we" about the site. Answer the user's question first, then give the next step.
- Plain text only. No markdown. Use numbered steps or bullets.
- Never write URL paths. Use page names only. Under 220 words. Warm and clear.
- Never invent fees, processing times, or appointment slots.`;
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

async function callOpenRouter(messages) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY not set in Vercel env vars');

  const configured = process.env.OPENROUTER_MODEL;
  const models = [
    configured,
    'openrouter/auto',
    'meta-llama/llama-3.3-70b-instruct:free',
    'google/gemma-2-9b-it:free',
    'deepseek/deepseek-r1-distill-llama-70b:free',
    'qwen/qwen-2.5-72b-instruct:free',
    'mistralai/mistral-7b-instruct:free',
  ].filter(Boolean);

  const chatMessages = [
    { role: 'system', content: buildSystemPrompt() },
    ...messages.map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    })),
  ];

  let lastErr = '';
  for (const model of models) {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': APP_URL,
          'X-Title': 'Global Gateway Visa Support',
        },
        body: JSON.stringify({
          model,
          messages: chatMessages,
          temperature: 0.55,
          max_tokens: 1100,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        lastErr = `OpenRouter (${model}) ${res.status}: ${errText.slice(0, 150)}`;
        continue;
      }

      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content;
      if (text && typeof text === 'string' && text.trim()) {
        return { reply: text.trim(), engine: 'openrouter' };
      }
    } catch (e) {
      lastErr = e?.message || String(e);
    }
  }
  throw new Error(lastErr || 'Empty OpenRouter response');
}

async function callGemini(messages) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not set in Vercel env vars');

  const configured = process.env.GEMINI_MODEL;
  const models = [configured, 'gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'].filter(Boolean);
  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  let lastErr = '';
  for (const model of models) {
    const endpoints = [
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent`,
    ];

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
          lastErr = `Gemini (${model}) ${res.status}: ${errText.slice(0, 150)}`;
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
  }
  throw new Error(lastErr || 'Empty Gemini response');
}

async function callGroq(messages) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY not set in Vercel env vars');

  const configured = process.env.GROQ_MODEL;
  const models = [configured, 'llama-3.3-70b-versatile', 'llama-3.1-8b-instant'].filter(Boolean);
  const chatMessages = [
    { role: 'system', content: buildSystemPrompt() },
    ...messages.map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    })),
  ];

  let lastErr = '';
  for (const model of models) {
    try {
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
        lastErr = `Groq (${model}) ${res.status}: ${errText.slice(0, 150)}`;
        continue;
      }

      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content;
      if (text && typeof text === 'string' && text.trim()) {
        return { reply: text.trim(), engine: 'groq' };
      }
    } catch (e) {
      lastErr = e?.message || String(e);
    }
  }
  throw new Error(lastErr || 'Empty Groq response');
}

export default async function handler(req, res) {
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

  // 1. Try OpenRouter
  try {
    const result = await callOpenRouter(messages);
    res.set(corsHeaders()).status(200).json(result);
    return;
  } catch (e) {
    debugError = `OpenRouter: ${e.message}`;
    console.warn('[visa-chat] OpenRouter failed:', e.message);
  }

  // 2. Try Groq
  try {
    const result = await callGroq(messages);
    res.set(corsHeaders()).status(200).json(result);
    return;
  } catch (e) {
    debugError += ` | Groq: ${e.message}`;
    console.warn('[visa-chat] Groq failed:', e.message);
  }

  // 3. Try Gemini
  try {
    const result = await callGemini(messages);
    res.set(corsHeaders()).status(200).json(result);
    return;
  } catch (e) {
    debugError += ` | Gemini: ${e.message}`;
    console.warn('[visa-chat] Gemini failed:', e.message);
  }

  // 4. All failed — signal client to use local engine
  res.set(corsHeaders()).status(200).json({
    reply: null,
    engine: 'local',
    debugError,
  });
}
