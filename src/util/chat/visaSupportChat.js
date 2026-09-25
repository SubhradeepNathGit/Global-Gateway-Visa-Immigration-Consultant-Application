import axios from "axios";
import supabase from "../Supabase/supabase";
import { buildWebsiteKnowledgePrompt } from "./websiteKnowledgeForAi";

const INVOKE_TIMEOUT_MS = 20000;

/**
 * Call Vercel API Route /api/visa-chat using Axios
 */
async function callVercelApi(messages) {
  const response = await axios.post(
    "/api/visa-chat",
    { messages },
    {
      headers: { "Content-Type": "application/json" },
      timeout: INVOKE_TIMEOUT_MS,
    },
  );
  const data = response.data;
  if (data?.reply && typeof data.reply === "string") {
    return { reply: data.reply, engine: data.engine || "openrouter" };
  }
  throw new Error(data?.debugError || "No AI reply from Vercel API");
}

/**
 * Direct client-side OpenRouter call using Axios.
 * Uses VITE_OPENROUTER_API_KEY set in .env.
 */
async function callDirectOpenRouter(apiKey, messages) {
  const configured = import.meta.env.VITE_OPENROUTER_MODEL?.trim();
  const models = [
    configured,
    "openrouter/auto",
    "meta-llama/llama-3.3-70b-instruct:free",
    "google/gemma-2-9b-it:free",
    "deepseek/deepseek-r1-distill-llama-70b:free",
    "qwen/qwen-2.5-72b-instruct:free",
    "mistralai/mistral-7b-instruct:free",
  ]
    .filter(Boolean)
    .filter((m, i, a) => a.indexOf(m) === i);

  const chatMessages = [
    { role: "system", content: buildWebsiteKnowledgePrompt() },
    ...messages.map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content,
    })),
  ];

  let lastErr = "";
  for (const model of models) {
    try {
      const res = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model,
          messages: chatMessages,
          temperature: 0.4,
          max_tokens: 1100,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://global-gateway-pro.vercel.app",
            "X-Title": "Global Gateway Visa Support",
          },
          timeout: INVOKE_TIMEOUT_MS,
        },
      );

      const data = res.data;
      const text = data?.choices?.[0]?.message?.content;
      if (text && typeof text === "string" && text.trim()) {
        return text.trim();
      }
    } catch (e) {
      const msg = e?.response?.data?.error?.message || e?.message || String(e);
      lastErr = `OpenRouter (${model}): ${msg}`;
    }
  }

  throw new Error(lastErr || "Empty OpenRouter response");
}

/**
 * Direct client-side Gemini call using Axios.
 */
async function callDirectGemini(apiKey, messages) {
  const configured = import.meta.env.VITE_GEMINI_MODEL?.trim();
  const models = [
    configured,
    "gemini-2.5-flash",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
  ].filter(Boolean);
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  const systemInstruction = { parts: [{ text: buildWebsiteKnowledgePrompt() }] };

  let lastErr = "";
  for (const model of models) {
    const endpoints = [
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent`,
    ];
    for (const url of endpoints) {
      try {
        const res = await axios.post(
          url,
          {
            systemInstruction,
            contents,
            generationConfig: { temperature: 0.4, maxOutputTokens: 900 },
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": apiKey,
            },
            timeout: INVOKE_TIMEOUT_MS,
          },
        );

        const data = res.data;
        const parts = data?.candidates?.[0]?.content?.parts ?? [];
        for (const part of parts) {
          if (typeof part?.text === "string" && part.text.trim()) {
            return part.text.trim();
          }
        }
      } catch (e) {
        const msg = e?.response?.data?.error?.message || e?.message || String(e);
        lastErr = `Gemini (${model}): ${msg}`;
      }
    }
  }
  throw new Error(lastErr || "Empty Gemini response");
}

/**
 * Direct client-side Groq call using Axios.
 */
async function callDirectGroq(apiKey, messages) {
  const configured = import.meta.env.VITE_GROQ_MODEL?.trim();
  const models = [configured, "llama-3.3-70b-versatile", "llama-3.1-8b-instant"].filter(Boolean);
  const chatMessages = [
    { role: "system", content: buildWebsiteKnowledgePrompt() },
    ...messages.map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content,
    })),
  ];

  let lastErr = "";
  for (const model of models) {
    try {
      const res = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        { model, messages: chatMessages, temperature: 0.4, max_tokens: 1100 },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          timeout: INVOKE_TIMEOUT_MS,
        },
      );

      const data = res.data;
      const text = data?.choices?.[0]?.message?.content;
      if (text && typeof text === "string" && text.trim()) return text.trim();
    } catch (e) {
      const msg = e?.response?.data?.error?.message || e?.message || String(e);
      lastErr = `Groq (${model}): ${msg}`;
    }
  }
  throw new Error(lastErr || "Empty Groq response");
}

/**
 * Main entry point for the chat UI.
 * Priority order:
 * 1. Direct OpenRouter key (VITE_OPENROUTER_API_KEY in .env) via Axios
 * 2. Supabase Edge Function (visa-support-chat)
 * 3. Vercel API Route (/api/visa-chat) via Axios
 * 4. Direct Gemini key (VITE_GEMINI_API_KEY) via Axios
 * 5. Direct Groq key (VITE_GROQ_API_KEY) via Axios
 * 6. Local smart fallback
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
    // ── 1. Direct OpenRouter Key (Highest Priority for local & production) ──
    const openRouterKey = import.meta.env.VITE_OPENROUTER_API_KEY?.trim();
    if (openRouterKey) {
      try {
        const reply = await callDirectOpenRouter(openRouterKey, messages);
        return { ok: true, reply, engine: "openrouter" };
      } catch (err) {
        console.warn("[VisaChat] Direct OpenRouter failed:", err?.message);
      }
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
        if (engine === "openrouter" || engine === "groq" || engine === "gemini") {
          return { ok: true, reply: data.reply, engine };
        }
      }
    } catch (err) {
      console.warn("[VisaChat] Supabase invoke failed:", err?.message);
    }

    // ── 3. Vercel API Route (when hosted on Vercel) ───────────────────────
    if (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
      try {
        const result = await callVercelApi(messages);
        return { ok: true, reply: result.reply, engine: result.engine };
      } catch (err) {
        console.warn("[VisaChat] Vercel API route failed:", err?.message);
      }
    }

    // ── 4 & 5. Direct Gemini / Groq Keys ─────────────────────────────────
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

    // ── 6. Signal caller to use local engine ──────────────────────────────
    return { ok: false, error: "AI unavailable", code: "NO_AI" };
  })();

  return Promise.race([invokePromise, timeoutPromise]);
}
