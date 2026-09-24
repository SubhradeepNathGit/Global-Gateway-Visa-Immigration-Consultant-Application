import supabase from "../Supabase/supabase";

/**
 * Sends a transactional email via Supabase Edge Function (non-blocking for UX).
 * Requires function `send-transactional-email` deployed with Resend secrets.
 */
export async function sendTransactionalEmail({
  eventType,
  applicationId,
  meta = {},
}) {
  if (!eventType || !applicationId) {
    return { ok: false, skipped: true };
  }

  try {
    const { data, error } = await supabase.functions.invoke(
      "send-transactional-email",
      {
        body: { eventType, applicationId, meta },
      },
    );

    if (error) {
      console.warn("[sendTransactionalEmail]", eventType, error.message);
      return { ok: false, error };
    }

    if (data?.error) {
      console.warn("[sendTransactionalEmail]", eventType, data.error);
      return { ok: false, error: data.error };
    }

    return { ok: true, data };
  } catch (err) {
    console.warn("[sendTransactionalEmail]", eventType, err);
    return { ok: false, error: err };
  }
}

/** Fire-and-forget — never blocks UI or throws to callers */
export function sendTransactionalEmailAsync(payload) {
  void sendTransactionalEmail(payload);
}
