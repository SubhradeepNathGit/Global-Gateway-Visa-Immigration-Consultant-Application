import supabase from "../Supabase/supabase";

const INVOKE_TIMEOUT_MS = 20000;

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
    try {
      const { data, error } = await supabase.functions.invoke("visa-support-chat", {
        body: { messages },
      });

      if (data?.reply && typeof data.reply === "string") {
        return {
          ok: true,
          reply: data.reply,
          engine:
            typeof data.engine === "string" ? data.engine : "local",
        };
      }

      if (data?.error) {
        return {
          ok: false,
          error: data.error,
          code: data.code ?? "API_ERROR",
        };
      }

      if (error) {
        return { ok: false, error: error.message, code: "INVOKE_ERROR" };
      }

      return { ok: false, error: "Empty response", code: "EMPTY" };
    } catch (err) {
      return {
        ok: false,
        error: err?.message ?? "Network error",
        code: "NETWORK",
      };
    }
  })();

  return Promise.race([invokePromise, timeoutPromise]);
}
