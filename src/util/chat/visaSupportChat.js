import supabase from "../Supabase/supabase";

/**
 * @param {{ role: 'user' | 'assistant', content: string }[]} messages
 */
export async function sendVisaSupportChat(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return { ok: false, error: "No messages" };
  }

  try {
    const { data, error } = await supabase.functions.invoke("visa-support-chat", {
      body: { messages },
    });

    if (error) {
      return { ok: false, error: error.message, code: "INVOKE_ERROR" };
    }

    if (data?.error) {
      return {
        ok: false,
        error: data.error,
        code: data.code ?? "API_ERROR",
      };
    }

    if (!data?.reply) {
      return { ok: false, error: "Empty response", code: "EMPTY" };
    }

    return { ok: true, reply: data.reply };
  } catch (err) {
    return {
      ok: false,
      error: err?.message ?? "Network error",
      code: "NETWORK",
    };
  }
}
