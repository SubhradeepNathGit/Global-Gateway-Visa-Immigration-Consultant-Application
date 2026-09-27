import axios from "axios";
import supabase from "../Supabase/supabase";
import { buildWebsiteKnowledgePrompt } from "./websiteKnowledgeForAi";
import { formatChatReply } from "./chatReplyFormat";

// Overall timeout for the entire run()
const OVERALL_TIMEOUT_MS = 45000;
const API_CALL_TIMEOUT_MS = 25000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractOpenAiMessageContent(data) {
  const msg = data?.choices?.[0]?.message;
  if (!msg) return "";
  if (typeof msg.content === "string" && msg.content.trim()) {
    const cleaned = msg.content.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
    if (cleaned) return cleaned;
    return msg.content.trim();
  }
  if (Array.isArray(msg.content)) {
    const joined = msg.content
      .map((part) => (typeof part?.text === "string" ? part.text : ""))
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

function validReply(reply) {
  return typeof reply === "string" && reply.trim().length > 0;
}

/** Merges consecutive messages of the same role and guarantees clean alternating multi-turn chat */
function prepareChatMessages(systemPrompt, messages) {
  const prepared = [];
  if (typeof systemPrompt === "string" && systemPrompt.trim()) {
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

/**
 * 1. Vercel API Route (/api/visa-chat)
 * Executes co-located serverless function with Vercel environment variables.
 * Has primary access to OPENROUTER_API_KEY, GROQ_API_KEY, and GEMINI_API_KEY without browser exposure.
 */
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
  if (data?.ok && validReply(data?.reply)) {
    return {
      reply: formatChatReply(data.reply),
      engine: data.engine || "openrouter",
    };
  }
  if (validReply(data?.reply) && data.engine !== "local") {
    return {
      reply: formatChatReply(data.reply),
      engine: data.engine || "openrouter",
    };
  }
  throw new Error(data?.message || data?.error || data?.debugError || "No AI reply from Vercel API");
}

/**
 * 2. Supabase Edge Function (visa-support-chat)
 * Cloud fallback running on Supabase with Edge Function secrets.
 */
async function invokeSupabaseEdge(messages) {
  const { data, error } = await supabase.functions.invoke("visa-support-chat", {
    body: { messages },
  });

  if (error) {
    throw new Error(error.message || "Supabase invoke failed");
  }

  if (data?.ok && validReply(data?.reply)) {
    return {
      reply: formatChatReply(data.reply),
      engine: data.engine || "openrouter",
    };
  }
  if (validReply(data?.reply) && data.engine !== "local") {
    return {
      reply: formatChatReply(data.reply),
      engine: data.engine || "openrouter",
    };
  }

  throw new Error(data?.message || data?.error || data?.debugError || "Empty edge function reply");
}

/**
 * 3. Direct OpenRouter call from the browser (if VITE_OPENROUTER_API_KEY is defined)
 */
async function callDirectOpenRouter(apiKey, messages) {
  const configured = import.meta.env.VITE_OPENROUTER_MODEL?.trim();
  const models = [
    configured,
    "openrouter/free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "meta-llama/llama-3.1-8b-instruct:free",
    "qwen/qwen-2.5-72b-instruct:free",
    "mistralai/mistral-7b-instruct:free",
  ]
    .filter(Boolean)
    .filter((m, i, a) => a.indexOf(m) === i);

  const chatMessages = prepareChatMessages(buildWebsiteKnowledgePrompt(), messages);

  // 1. Try batch fallback chain
  try {
    const res = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: models[0],
        models: models,
        messages: chatMessages,
        temperature: 0.5,
        max_tokens: 1200,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://global-gateway-pro.vercel.app",
          "X-Title": "Global Gateway Visa Support",
        },
        timeout: 14000,
      },
    );

    const text = extractOpenAiMessageContent(res.data);
    if (validReply(text)) {
      return formatChatReply(text);
    }
  } catch (err) {
    if (err?.response?.status === 401) {
      throw new Error("OpenRouter API key invalid or unauthorized (401)");
    }
    console.warn("[VisaChat] Direct OpenRouter batch failed:", err?.message);
  }

  // 2. Direct fallback on openrouter/free
  const res = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "openrouter/free",
      messages: chatMessages,
      temperature: 0.5,
      max_tokens: 1000,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://global-gateway-pro.vercel.app",
        "X-Title": "Global Gateway Visa Support",
      },
      timeout: 10000,
    },
  );

  const text = extractOpenAiMessageContent(res.data);
  if (validReply(text)) {
    return formatChatReply(text);
  }

  throw new Error("Direct OpenRouter failed to reply");
}

/**
 * Direct Gemini client call (if VITE_GEMINI_API_KEY is configured)
 */
async function callDirectGemini(apiKey, messages) {
  const configured = import.meta.env.VITE_GEMINI_MODEL?.trim();
  const models = [configured, "gemini-2.5-flash", "gemini-1.5-flash"].filter(Boolean);
  const contents = [];
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

  const systemInstruction = { parts: [{ text: buildWebsiteKnowledgePrompt() }] };

  let lastErr = "";
  for (const model of models) {
    try {
      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          systemInstruction,
          contents,
          generationConfig: { temperature: 0.5, maxOutputTokens: 1000 },
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

/**
 * Direct Groq client call (if VITE_GROQ_API_KEY is configured)
 */
async function callDirectGroq(apiKey, messages) {
  const configured = import.meta.env.VITE_GROQ_MODEL?.trim();
  const models = [configured, "llama-3.3-70b-versatile", "llama-3.1-8b-instant"].filter(Boolean);
  const chatMessages = prepareChatMessages(buildWebsiteKnowledgePrompt(), messages);

  let lastErr = "";
  for (const model of models) {
    try {
      const res = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        { model, messages: chatMessages, temperature: 0.5, max_tokens: 1100 },
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
 *   1. Vercel API Route (/api/visa-chat) — PRIMARY in production.
 *      Executes on Vercel with OPENROUTER_API_KEY, GROQ_API_KEY, and GEMINI_API_KEY.
 *   2. Supabase Edge Function (visa-support-chat) — SECONDARY.
 *      Serverless edge failover with Supabase secrets.
 *   3. Direct OpenRouter (if VITE_OPENROUTER_API_KEY configured in browser)
 *   4. Direct Groq (if VITE_GROQ_API_KEY configured in browser)
 *   5. Direct Gemini (if VITE_GEMINI_API_KEY configured in browser)
 *
 * NO local canned fallbacks. Always responds via real AI API router.
 */
export async function sendVisaSupportChat(messages) {
  let normalizedMessages = [];
  if (typeof messages === "string" && messages.trim()) {
    normalizedMessages = [{ role: "user", content: messages.trim() }];
  } else if (Array.isArray(messages)) {
    normalizedMessages = messages.filter((m) => m && typeof m.content === "string" && m.content.trim().length > 0);
  }

  if (normalizedMessages.length === 0) {
    return { ok: false, error: "Please enter your question to ask Gateway AI." };
  }

  const run = async () => {
    // ── 1) Vercel API Route — PRIMARY ──────────────────────────────────────
    if (typeof window !== "undefined") {
      try {
        const result = await callVercelApi(normalizedMessages);
        if (result && result.reply) {
          return { ok: true, reply: result.reply, engine: result.engine || "openrouter" };
        }
      } catch (err) {
        console.warn("[VisaChat] Vercel API route failed, trying Supabase Edge:", err?.message);
      }
    }

    // ── 2) Supabase Edge Function — SECONDARY ──────────────────────────────
    try {
      const edge = await invokeSupabaseEdge(normalizedMessages);
      if (edge && edge.reply) {
        return { ok: true, reply: edge.reply, engine: edge.engine || "openrouter" };
      }
    } catch (err) {
      console.warn("[VisaChat] Supabase Edge Function failed:", err?.message);
    }

    // ── 3) Direct OpenRouter — TERTIARY ────────────────────────────────────
    const openRouterKey = import.meta.env.VITE_OPENROUTER_API_KEY?.trim();
    if (openRouterKey && openRouterKey !== "your_openrouter_api_key_here") {
      try {
        const reply = await callDirectOpenRouter(openRouterKey, normalizedMessages);
        if (reply) {
          return { ok: true, reply, engine: "openrouter" };
        }
      } catch (err) {
        console.warn("[VisaChat] Direct OpenRouter failed:", err?.message);
      }
    }

    // ── 4) Direct Groq ────────────────────────────────────────────────────
    const groqKey = (import.meta.env.VITE_GROQ_APT_KEY || import.meta.env.VITE_GROQ_API_KEY)?.trim();
    if (groqKey) {
      try {
        const reply = await callDirectGroq(groqKey, normalizedMessages);
        if (reply) {
          return { ok: true, reply, engine: "groq" };
        }
      } catch (err) {
        console.warn("[VisaChat] Direct Groq failed:", err?.message);
      }
    }

    // ── 5) Direct Gemini ──────────────────────────────────────────────────
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY?.trim();
    if (geminiKey) {
      try {
        const reply = await callDirectGemini(geminiKey, normalizedMessages);
        if (reply) {
          return { ok: true, reply, engine: "gemini" };
        }
      } catch (err) {
        console.warn("[VisaChat] Direct Gemini failed:", err?.message);
      }
    }

    // ── 6) All AI endpoints failed — clean error response (no fake local text)
    console.error("[VisaChat] All AI API endpoints failed to respond");
    return {
      ok: false,
      error: "Our AI assistant is temporarily unreachable. Please try again in a few moments, or reach out directly through the Contact us page.",
    };
  };

  const timeoutPromise = new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          ok: false,
          error: "The request timed out. Please try asking again in a moment.",
        }),
      OVERALL_TIMEOUT_MS,
    );
  });

  return Promise.race([run(), timeoutPromise]);
}
