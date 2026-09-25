import supabase from "../Supabase/supabase";
import { buildWebsiteKnowledgePrompt } from "./websiteKnowledgeForAi";

const INVOKE_TIMEOUT_MS = 20000;

/**
 * Call the private Vercel serverless API route /api/visa-chat.
 * Uses GEMINI_API_KEY / GROQ_API_KEY set in Vercel env vars (server-side, private).
 */
async function callVercelApi(messages) {
  const res = await fetch("/api/visa-chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  if (!res.ok) throw new Error(`Vercel API status ${res.status}`);
  const data = await res.json();
  if (data?.reply && typeof data.reply === "string") {
    return { reply: data.reply, engine: data.engine || "gemini" };
  }
  // null reply means both AI providers failed on the server side
  throw new Error(data?.debugError || "No AI reply from Vercel API");
}

/**
 * Direct client-side Gemini call (only used if VITE_GEMINI_API_KEY is in .env).
 * Not needed when using the Vercel API route.
 */
async function callDirectGemini(apiKey, messages) {
  const model = import.meta.env.VITE_GEMINI_MODEL || "gemini-1.5-flash";
  const endpoints = [
    `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent`,
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
  ];

  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const systemInstruction = {
    parts: [{ text: buildWebsiteKnowledgePrompt() }],
  };

  let lastErr = "";
  for (const url of endpoints) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          systemInstruction,
          contents,
          generationConfig: { temperature: 0.55, maxOutputTokens: 900 },
        }),
      });

      if (!response.ok) {
        lastErr = `Gemini status ${response.status}`;
        continue;
      }

      const data = await response.json();
      const parts = data?.candidates?.[0]?.content?.parts ?? [];
      for (const part of parts) {
        if (typeof part?.text === "string" && part.text.trim()) {
          return part.text.trim();
        }
      }
    } catch (e) {
      lastErr = e?.message || String(e);
    }
  }
  throw new Error(lastErr || "Empty Gemini response");
}

/**
 * Direct client-side Groq call (only used if VITE_GROQ_API_KEY is in .env).
 * Not needed when using the Vercel API route.
 */
async function callDirectGroq(apiKey, messages) {
  const model = import.meta.env.VITE_GROQ_MODEL || "llama-3.3-70b-versatile";
  const chatMessages = [
    { role: "system", content: buildWebsiteKnowledgePrompt() },
    ...messages.map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content,
    })),
  ];

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, messages: chatMessages, temperature: 0.55, max_tokens: 1100 }),
  });

  if (!response.ok) throw new Error(`Groq status ${response.status}`);

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text || typeof text !== "string") throw new Error("Empty Groq response");
  return text.trim();
}

/**
 * Main entry point for the chat UI.
 * Priority order:
 *   1. Vercel API route /api/visa-chat  (private GEMINI_API_KEY / GROQ_API_KEY in Vercel)
 *   2. Supabase Edge Function            (GEMINI_API_KEY / GROQ_API_KEY in Supabase secrets)
 *   3. Direct browser Gemini call        (VITE_GEMINI_API_KEY in .env — exposed in bundle)
 *   4. Direct browser Groq call          (VITE_GROQ_API_KEY in .env — exposed in bundle)
 *   5. Local smart reply engine          (always works, no API key needed)
 *
 * @param {{ role: 'user' | 'assistant', content: string }[]} messages
 */
export async function sendVisaSupportChat(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return { ok: false, error: "No messages" };
  }

  const timeoutPromise = new Promise((resolve) => {
    setTimeout(
      () => resolve({ ok: false, error: "Request timed out", code: "TIMEOUT" }),
      INVOKE_TIMEOUT_MS,
    );
  });

  const invokePromise = (async () => {
    // ── 1. Vercel API route (private server-side key) ──────────────────────
    try {
      const result = await callVercelApi(messages);
      return { ok: true, reply: result.reply, engine: result.engine };
    } catch (err) {
      console.warn("[VisaChat] Vercel API route failed:", err?.message);
    }

    // ── 2. Supabase Edge Function ──────────────────────────────────────────
    try {
      const { data, error } = await supabase.functions.invoke("visa-support-chat", {
        body: { messages },
      });

      if (!error && data?.reply && typeof data.reply === "string") {
        if (data?.debugError) {
          console.warn("[VisaChat Edge Function Warning]:", data.debugError);
        }
        const engine = typeof data.engine === "string" ? data.engine : "local";
        if (engine === "groq" || engine === "gemini") {
          return { ok: true, reply: data.reply, engine };
        }
        // Edge function returned local — fall through to try direct client keys
      }
    } catch (err) {
      console.warn("[VisaChat] Supabase invoke failed:", err?.message);
    }

    // ── 3 & 4. Direct client-side keys (exposed in bundle — last resort) ──
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY?.trim();
    const groqKey = import.meta.env.VITE_GROQ_API_KEY?.trim();

    if (geminiKey) {
      try {
        const reply = await callDirectGemini(geminiKey, messages);
        return { ok: true, reply, engine: "gemini" };
      } catch (err) {
        console.warn("[VisaChat] Direct Gemini failed:", err?.message);
      }
    }

    if (groqKey) {
      try {
        const reply = await callDirectGroq(groqKey, messages);
        return { ok: true, reply, engine: "groq" };
      } catch (err) {
        console.warn("[VisaChat] Direct Groq failed:", err?.message);
      }
    }

    // ── 5. Signal caller to use local engine ──────────────────────────────
    return { ok: false, error: "AI unavailable", code: "NO_AI" };
  })();

  return Promise.race([invokePromise, timeoutPromise]);
}
