import supabase from "../Supabase/supabase";

/**
 * Sends a transactional email via Supabase Edge Function (non-blocking for UX).
 * Requires function `send-transactional-email` deployed with Resend secrets.
 */
const RECEIPT_EVENTS = new Set([
  "visa_payment_receipt",
  "course_payment_receipt",
  "payment_failed",
]);

export async function sendTransactionalEmail({
  eventType,
  applicationId,
  userId,
  meta = {},
}) {
  if (!eventType) {
    return { ok: false, skipped: true };
  }

  if (RECEIPT_EVENTS.has(eventType)) {
    if (!meta?.transactionId) {
      return { ok: false, skipped: true };
    }
    if (eventType === "payment_failed") {
      if (meta?.txnFor === "visa" && !applicationId) {
        return { ok: false, skipped: true };
      }
      if (meta?.txnFor === "course" && !userId) {
        return { ok: false, skipped: true };
      }
    } else if (eventType === "course_payment_receipt") {
      if (!userId) return { ok: false, skipped: true };
    } else if (eventType === "visa_payment_receipt") {
      if (!applicationId) return { ok: false, skipped: true };
    }
  } else if (!applicationId) {
    return { ok: false, skipped: true };
  }

  try {
    const { data, error } = await supabase.functions.invoke(
      "send-transactional-email",
      {
        body: { eventType, applicationId, userId, meta },
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
