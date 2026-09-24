import supabase from "../Supabase/supabase";
import { buildWebsiteKnowledgePrompt } from "./websiteKnowledgeForAi";

const INVOKE_TIMEOUT_MS = 20000;

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
          generationConfig: {
            temperature: 0.55,
            maxOutputTokens: 900,
          },
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
    body: JSON.stringify({
      model,
      messages: chatMessages,
      temperature: 0.55,
      max_tokens: 1100,
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq status ${response.status}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text || typeof text !== "string") throw new Error("Empty Groq response");
  return text.trim();
}

/**
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
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY?.trim();
    const groqKey = import.meta.env.VITE_GROQ_API_KEY?.trim();

    // 1. Try Supabase Edge Function first
    try {
      const { data, error } = await supabase.functions.invoke("visa-support-chat", {
        body: { messages },
      });

      if (data?.reply && typeof data.reply === "string") {
        if (data?.debugError) {
          console.warn("[VisaChat Edge Function Warning]:", data.debugError);
        }
        const engine = typeof data.engine === "string" ? data.engine : "local";
        // If Supabase edge function produced an AI reply (groq or gemini), use it directly
        if (engine === "groq" || engine === "gemini") {
          return { ok: true, reply: data.reply, engine };
        }
        // If edge function returned local fallback, but client has direct AI keys set, fallback to direct client AI call
        if (engine === "local") {
          if (geminiKey) {
            try {
              const reply = await callDirectGemini(geminiKey, messages);
              return { ok: true, reply, engine: "gemini" };
            } catch (err) {
              console.warn("Direct Gemini call failed:", err);
            }
          }
          if (groqKey) {
            try {
              const reply = await callDirectGroq(groqKey, messages);
              return { ok: true, reply, engine: "groq" };
            } catch (err) {
              console.warn("Direct Groq call failed:", err);
            }
          }
          return { ok: true, reply: data.reply, engine: "local" };
        }
      }
    } catch (err) {
      console.warn("Supabase invoke failed:", err);
    }

    // 2. Client-side direct AI key fallback (if Edge Function is down or not deployed)
    if (geminiKey) {
      try {
        const reply = await callDirectGemini(geminiKey, messages);
        return { ok: true, reply, engine: "gemini" };
      } catch (err) {
        console.warn("Direct Gemini call failed:", err);
      }
    }

    if (groqKey) {
      try {
        const reply = await callDirectGroq(groqKey, messages);
        return { ok: true, reply, engine: "groq" };
      } catch (err) {
        console.warn("Direct Groq call failed:", err);
      }
    }

    return { ok: false, error: "AI unavailable", code: "NO_AI" };
  })();

  return Promise.race([invokePromise, timeoutPromise]);
}
