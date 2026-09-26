import axios from "axios";
import supabase from "../Supabase/supabase";
import { buildWebsiteKnowledgePrompt } from "./websiteKnowledgeForAi";
import { formatChatReply } from "./chatReplyFormat";

const INVOKE_TIMEOUT_MS = 55000;
const OPENROUTER_TIMEOUT_MS = 45000;

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
 * OpenRouter with model fallbacks + per-model retries (fixes first-request cold failures).
 */
async function callDirectOpenRouter(apiKey, messages) {
  const configured = import.meta.env.VITE_OPENROUTER_MODEL?.trim();
  const models = [
    configured,
    "openrouter/auto",
    "meta-llama/llama-3.3-70b-instruct:free",
    "google/gemma-2-9b-it:free",
    "qwen/qwen-2.5-72b-instruct:free",
    "mistralai/mistral-7b-instruct:free",
    "deepseek/deepseek-r1-distill-llama-70b:free",
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
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await axios.post(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            model,
            messages: chatMessages,
            temperature: 0.45,
            max_tokens: 1200,
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
              "HTTP-Referer": "https://global-gateway-pro.vercel.app",
              "X-Title": "Global Gateway Visa Support",
            },
            timeout: OPENROUTER_TIMEOUT_MS,
          },
        );

        const text = extractOpenAiMessageContent(res.data);
        if (validReply(text)) {
          return formatChatReply(text);
        }
        lastErr = `OpenRouter (${model}): empty content`;
      } catch (e) {
        const msg = e?.response?.data?.error?.message || e?.message || String(e);
        lastErr = `OpenRouter (${model}): ${msg}`;
        if (attempt < 2) await sleep(500 * (attempt + 1));
      }
    }
  }

  throw new Error(lastErr || "Empty OpenRouter response");
}

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
          generationConfig: { temperature: 0.45, maxOutputTokens: 1000 },
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          timeout: OPENROUTER_TIMEOUT_MS,
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
        { model, messages: chatMessages, temperature: 0.45, max_tokens: 1100 },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          timeout: OPENROUTER_TIMEOUT_MS,
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
 * Priority: Supabase (OpenRouter inside) → Direct OpenRouter → Vercel → Gemini → Groq
 */
export async function sendVisaSupportChat(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return { ok: false, error: "No messages" };
  }

  const run = async () => {
    // 1) Supabase edge — OpenRouter first on server (production)
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const edge = await invokeSupabaseEdge(messages);
        if (edge.debugError) {
          console.warn("[VisaChat] Edge debug:", edge.debugError);
        }
        if (
          edge.engine === "openrouter" ||
          edge.engine === "groq" ||
          edge.engine === "gemini"
        ) {
          return { ok: true, reply: edge.reply, engine: edge.engine };
        }
        if (edge.engine === "local" && validReply(edge.reply)) {
          return { ok: true, reply: edge.reply, engine: "local" };
        }
      } catch (err) {
        console.warn("[VisaChat] Supabase attempt failed:", err?.message);
        if (attempt === 0) await sleep(600);
      }
    }

    // 2) Direct OpenRouter (dev / backup)
    const openRouterKey = import.meta.env.VITE_OPENROUTER_API_KEY?.trim();
    if (openRouterKey) {
      try {
        const reply = await callDirectOpenRouter(openRouterKey, messages);
        return { ok: true, reply, engine: "openrouter" };
      } catch (err) {
        console.warn("[VisaChat] Direct OpenRouter failed:", err?.message);
      }
    }

    // 3) Vercel API route
    if (typeof window !== "undefined") {
      try {
        const result = await callVercelApi(messages);
        return { ok: true, reply: result.reply, engine: result.engine };
      } catch (err) {
        console.warn("[VisaChat] Vercel API failed:", err?.message);
      }
    }

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

    return { ok: false, error: "AI unavailable", code: "NO_AI" };
  };

  const timeoutPromise = new Promise((resolve) => {
    setTimeout(
      () => resolve({ ok: false, error: "Request timed out", code: "TIMEOUT" }),
      INVOKE_TIMEOUT_MS,
    );
  });

  return Promise.race([run(), timeoutPromise]);
}
