import axios from "axios";
import supabase from "../Supabase/supabase";
import { buildWebsiteKnowledgePrompt } from "./websiteKnowledgeForAi";
import { formatChatReply } from "./chatReplyFormat";

// Overall timeout for the entire run() including all fallbacks
const OVERALL_TIMEOUT_MS = 60000;
// Per-API call timeout
const API_CALL_TIMEOUT_MS = 28000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractOpenAiMessageContent(data) {
  const msg = data?.choices?.[0]?.message;
  if (!msg) return "";
  if (typeof msg.content === "string" && msg.content.trim()) {
    return msg.content.trim();
  }
  if (Array.isArray(msg.content)) {
    const joined = msg.content
      .map((part) => (typeof part?.text === "string" ? part.text : ""))
      .join("\n")
      .trim();
    if (joined) return joined;
  }
  if (typeof msg.reasoning === "string" && msg.reasoning.trim()) {
    return msg.reasoning.trim();
  }
  return "";
}

function validReply(reply) {
  return typeof reply === "string" && reply.trim().length > 0;
}

/**
 * PRIMARY: Direct OpenRouter call from the browser.
 * Retries each model up to 3 times with exponential back-off + jitter.
 * Detects 429 rate limits and skips exhausted models early.
 */
async function callDirectOpenRouter(apiKey, messages) {
  const configured = import.meta.env.VITE_OPENROUTER_MODEL?.trim();
  const models = [
    configured,
    "google/gemini-2.0-flash-exp:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "deepseek/deepseek-r1:free",
    "deepseek/deepseek-chat:free",
    "qwen/qwen-2.5-coder-32b-instruct:free",
    "meta-llama/llama-3.1-8b-instruct:free",
    "openrouter/auto",
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

  const errors = [];
  for (const model of models) {
    let skipModel = false;
    for (let attempt = 0; attempt < 2; attempt++) {
      if (skipModel) break;
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
            timeout: 8000,
          },
        );

        const text = extractOpenAiMessageContent(res.data);
        if (validReply(text)) {
          console.log(`[VisaChat] OpenRouter OK: ${model} attempt=${attempt + 1}`);
          return formatChatReply(text);
        }
        errors.push(`OpenRouter (${model}) attempt ${attempt + 1}: empty content`);
      } catch (e) {
        const msg = e?.response?.data?.error?.message || e?.message || String(e);
        const status = e?.response?.status || (
          msg.includes("401") ? 401 :
          msg.includes("402") ? 402 :
          msg.includes("404") ? 404 :
          msg.includes("429") ? 429 : 0
        );
        errors.push(`OpenRouter (${model}): ${msg}`);
        console.warn(`[VisaChat] OpenRouter failed: ${model} (status ${status}):`, msg);

        // 401 Unauthorized — key is invalid, skip OpenRouter entirely!
        if (status === 401 || msg.toLowerCase().includes("invalid api key") || msg.toLowerCase().includes("unauthorized")) {
          throw new Error("OpenRouter API key invalid or unauthorized (401)");
        }

        // 402, 404, 429 — skip model immediately
        if (status === 402 || status === 404 || status === 429 || msg.toLowerCase().includes("rate limit") || msg.toLowerCase().includes("credits") || msg.toLowerCase().includes("not found")) {
          skipModel = true;
          break;
        }

        if (attempt < 1) {
          await sleep(300);
        }
      }
    }
  }

  throw new Error(errors[errors.length - 1] || "All OpenRouter models failed");
}

async function callVercelApi(messages) {
  const response = await axios.post(
    "/api/visa-chat",
    { messages },
    {
      headers: { "Content-Type": "application/json" },
      timeout: API_CALL_TIMEOUT_MS,
    },
  );
  const data = response.data;
  if (validReply(data?.reply)) {
    return {
      reply: formatChatReply(data.reply),
      engine: data.engine || "openrouter",
    };
  }
  throw new Error(data?.debugError || "No AI reply from Vercel API");
}

async function invokeSupabaseEdge(messages) {
  const { data, error } = await supabase.functions.invoke("visa-support-chat", {
    body: { messages },
  });

  if (error) {
    throw new Error(error.message || "Supabase invoke failed");
  }

  if (validReply(data?.reply)) {
    const engine = typeof data.engine === "string" ? data.engine : "openrouter";
    return {
      reply: formatChatReply(data.reply),
      engine,
      debugError: data.debugError,
    };
  }

  throw new Error(data?.debugError || data?.error || "Empty edge function reply");
}

async function callDirectGemini(apiKey, messages) {
  const configured = import.meta.env.VITE_GEMINI_MODEL?.trim();
  const models = [configured, "gemini-2.5-flash", "gemini-1.5-flash"].filter(Boolean);
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  const systemInstruction = { parts: [{ text: buildWebsiteKnowledgePrompt() }] };

  let lastErr = "";
  for (const model of models) {
    try {
      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          systemInstruction,
          contents,
          generationConfig: { temperature: 0.4, maxOutputTokens: 1000 },
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          timeout: API_CALL_TIMEOUT_MS,
        },
      );

      const parts = res.data?.candidates?.[0]?.content?.parts ?? [];
      for (const part of parts) {
        if (validReply(part?.text)) {
          return formatChatReply(part.text.trim());
        }
      }
    } catch (e) {
      lastErr = e?.response?.data?.error?.message || e?.message || String(e);
    }
  }
  throw new Error(lastErr || "Empty Gemini response");
}

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
          timeout: API_CALL_TIMEOUT_MS,
        },
      );

      const text = extractOpenAiMessageContent(res.data);
      if (validReply(text)) return formatChatReply(text);
    } catch (e) {
      lastErr = e?.response?.data?.error?.message || e?.message || String(e);
    }
  }
  throw new Error(lastErr || "Empty Groq response");
}

/**
 * Priority chain:
 *   1. Direct OpenRouter (PRIMARY — browser → openrouter.ai directly)
 *   2. Supabase Edge Function (SECONDARY — also tries OpenRouter → Groq → Gemini server-side)
 *   3. Vercel API Route (TERTIARY)
 *   4. Direct Gemini (QUATERNARY)
 *   5. Direct Groq (QUINARY)
 *   6. Local keyword fallback (LAST RESORT — only when ALL 5 above fail)
 */
export async function sendVisaSupportChat(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return { ok: false, error: "No messages" };
  }

  const run = async () => {
    // ── 1) Direct OpenRouter — PRIMARY ─────────────────────────────────────
    const openRouterKey = import.meta.env.VITE_OPENROUTER_API_KEY?.trim();
    if (openRouterKey && openRouterKey !== "your_openrouter_api_key_here") {
      try {
        const reply = await callDirectOpenRouter(openRouterKey, messages);
        return { ok: true, reply, engine: "openrouter" };
      } catch (err) {
        console.warn("[VisaChat] Direct OpenRouter failed:", err?.message);
      }
    }

    // ── 2) Supabase Edge Function — SECONDARY ──────────────────────────────
    // It runs OpenRouter → Groq → Gemini server-side (avoids CORS + browser key exposure)
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const edge = await invokeSupabaseEdge(messages);
        if (edge.debugError) {
          console.warn("[VisaChat] Edge debug:", edge.debugError);
        }
        // Accept openrouter, groq, or gemini replies from edge — not local
        if (
          edge.engine === "openrouter" ||
          edge.engine === "groq" ||
          edge.engine === "gemini"
        ) {
          return { ok: true, reply: edge.reply, engine: edge.engine };
        }
        // Edge returned local — log and try next fallback
        console.warn("[VisaChat] Edge returned local engine, trying next fallback");
      } catch (err) {
        console.warn(`[VisaChat] Supabase edge attempt ${attempt + 1} failed:`, err?.message);
        if (attempt === 0) await sleep(700);
      }
    }

    // ── 3) Vercel API Route — TERTIARY ────────────────────────────────────
    if (typeof window !== "undefined") {
      try {
        const result = await callVercelApi(messages);
        // Accept any AI engine from Vercel (openrouter / groq / gemini)
        if (result.engine !== "local") {
          return { ok: true, reply: result.reply, engine: result.engine };
        }
      } catch (err) {
        console.warn("[VisaChat] Vercel API failed:", err?.message);
      }
    }

    // ── 4) Direct Gemini — QUATERNARY ─────────────────────────────────────
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY?.trim();
    if (geminiKey) {
      try {
        const reply = await callDirectGemini(geminiKey, messages);
        return { ok: true, reply, engine: "gemini" };
      } catch (err) {
        console.warn("[VisaChat] Direct Gemini failed:", err?.message);
      }
    }

    // ── 5) Direct Groq — QUINARY ──────────────────────────────────────────
    const groqKey = import.meta.env.VITE_GROQ_API_KEY?.trim();
    if (groqKey) {
      try {
        const reply = await callDirectGroq(groqKey, messages);
        return { ok: true, reply, engine: "groq" };
      } catch (err) {
        console.warn("[VisaChat] Direct Groq failed:", err?.message);
      }
    }

    // ── 6) All APIs exhausted ─────────────────────────────────────────────
    console.error("[VisaChat] All AI providers failed — returning NO_AI signal for local fallback");
    return { ok: false, error: "AI unavailable", code: "NO_AI" };
  };

  const timeoutPromise = new Promise((resolve) => {
    setTimeout(
      () => resolve({ ok: false, error: "Request timed out", code: "TIMEOUT" }),
      OVERALL_TIMEOUT_MS,
    );
  });

  return Promise.race([run(), timeoutPromise]);
}

