import { createClient, type User } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import nodemailer from "npm:nodemailer@6.9.16";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type EmailEventType =
  | "visa_application_submitted"
  | "appointment_scheduled"
  | "appointment_rescheduled"
  | "visa_approved"
  | "visa_rejected";

interface RequestBody {
  eventType: EmailEventType;
  applicationId: string;
  meta?: Record<string, unknown>;
}

const BRAND = "Global Gateway";
const APP_URL = Deno.env.get("PUBLIC_APP_URL") ?? "https://l-gateway-pro.vercel.app";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function layout(content: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:Inter,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:24px 12px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <tr><td style="background:#0f172a;padding:20px 24px;">
          <p style="margin:0;color:#fff;font-size:18px;font-weight:700;">${BRAND}</p>
        </td></tr>
        <tr><td style="padding:24px;color:#334155;font-size:15px;line-height:1.6;">${content}</td></tr>
        <tr><td style="padding:16px 24px;background:#f8fafc;border-top:1px solid #e5e7eb;color:#64748b;font-size:12px;">
          This is an automated message from ${BRAND}. Please do not reply to this email.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function formatDateTime(iso: string | null | undefined) {
  if (!iso) return "N/A";
  try {
    return new Date(iso).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    });
  } catch {
    return iso;
  }
}

function buildEmail(
  eventType: EmailEventType,
  ctx: {
    applicantName: string;
    countryName: string;
    applicationId: string;
    appointmentDate?: string | null;
    previousAppointmentDate?: string | null;
    rejectionReason?: string | null;
    embassyLocation?: Record<string, unknown> | null;
  },
) {
  const shortId = ctx.applicationId.slice(0, 8).toUpperCase();
  const dashboardLink = `${APP_URL}/dashboard`;

  switch (eventType) {
    case "visa_application_submitted":
      return {
        subject: `Visa application received — ${ctx.countryName}`,
        html: layout(`
          <p>Hello ${escapeHtml(ctx.applicantName)},</p>
          <p>Your visa application for <strong>${escapeHtml(ctx.countryName)}</strong> has been submitted successfully.</p>
          <p><strong>Reference:</strong> ${escapeHtml(shortId)}</p>
          <p>Our team and the embassy will review your documents. You can track status anytime from your dashboard.</p>
          <p style="margin-top:20px;"><a href="${dashboardLink}" style="background:#ef4444;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600;display:inline-block;">View application</a></p>
        `),
      };
    case "appointment_scheduled":
      return {
        subject: `Embassy appointment confirmed — ${ctx.countryName}`,
        html: layout(`
          <p>Hello ${escapeHtml(ctx.applicantName)},</p>
          <p>Your embassy appointment for <strong>${escapeHtml(ctx.countryName)}</strong> has been scheduled.</p>
          <p><strong>Date & time:</strong> ${escapeHtml(formatDateTime(ctx.appointmentDate))}</p>
          ${ctx.embassyLocation?.address ? `<p><strong>Location:</strong> ${escapeHtml(String(ctx.embassyLocation.address))}</p>` : ""}
          <p>Please arrive 15 minutes early with all required documents.</p>
          <p style="margin-top:20px;"><a href="${dashboardLink}" style="background:#ef4444;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600;display:inline-block;">View appointment</a></p>
        `),
      };
    case "appointment_rescheduled":
      return {
        subject: `Appointment rescheduled — ${ctx.countryName}`,
        html: layout(`
          <p>Hello ${escapeHtml(ctx.applicantName)},</p>
          <p>Your embassy appointment for <strong>${escapeHtml(ctx.countryName)}</strong> has been <strong>rescheduled</strong>.</p>
          <p><strong>Previous:</strong> ${escapeHtml(formatDateTime(ctx.previousAppointmentDate))}</p>
          <p><strong>New date & time:</strong> ${escapeHtml(formatDateTime(ctx.appointmentDate))}</p>
          ${ctx.embassyLocation?.address ? `<p><strong>Location:</strong> ${escapeHtml(String(ctx.embassyLocation.address))}</p>` : ""}
          <p style="margin-top:20px;"><a href="${dashboardLink}" style="background:#ef4444;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600;display:inline-block;">View appointment</a></p>
        `),
      };
    case "visa_approved":
      return {
        subject: `Visa approved — ${ctx.countryName}`,
        html: layout(`
          <p>Hello ${escapeHtml(ctx.applicantName)},</p>
          <p>Congratulations! Your visa application for <strong>${escapeHtml(ctx.countryName)}</strong> has been <strong style="color:#059669;">approved</strong>.</p>
          <p><strong>Reference:</strong> ${escapeHtml(shortId)}</p>
          <p>Sign in to download your approval letter and next steps.</p>
          <p style="margin-top:20px;"><a href="${dashboardLink}" style="background:#059669;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600;display:inline-block;">Open dashboard</a></p>
        `),
      };
    case "visa_rejected":
      return {
        subject: `Visa application update — ${ctx.countryName}`,
        html: layout(`
          <p>Hello ${escapeHtml(ctx.applicantName)},</p>
          <p>Your visa application for <strong>${escapeHtml(ctx.countryName)}</strong> was not approved at this time.</p>
          ${ctx.rejectionReason ? `<p><strong>Reason:</strong> ${escapeHtml(ctx.rejectionReason)}</p>` : ""}
          <p>You can view details in your dashboard or contact support for guidance.</p>
          <p style="margin-top:20px;"><a href="${dashboardLink}" style="background:#ef4444;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600;display:inline-block;">View details</a></p>
        `),
      };
    default:
      throw new Error("Unsupported event type");
  }
}

function parseFromAddress(from: string) {
  const trimmed = from.trim();
  const match = trimmed.match(/^(.+?)\s*<([^>]+)>$/);
  if (match) {
    return { name: match[1].trim(), email: match[2].trim() };
  }
  return { name: BRAND, email: trimmed };
}

/**
 * 100% free: your existing Gmail + Google App Password (no domain, no Resend/Brevo).
 * Limit: ~500 emails/day per Gmail account (Google policy).
 */
async function sendWithGmail(to: string[], subject: string, html: string) {
  const user = Deno.env.get("GMAIL_USER");
  const pass = Deno.env.get("GMAIL_APP_PASSWORD");
  if (!user || !pass) return null;

  const fromRaw = Deno.env.get("EMAIL_FROM");
  const fromAddress = fromRaw ?? `${BRAND} <${user}>`;

  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user,
      pass: pass.replace(/\s/g, ""),
    },
  });

  const info = await transport.sendMail({
    from: fromAddress,
    to: to.join(", "),
    subject,
    html,
  });

  return { provider: "gmail", payload: { messageId: info.messageId } };
}

/** Optional fallback — Brevo free tier */
async function sendWithBrevo(to: string[], subject: string, html: string) {
  const apiKey = Deno.env.get("BREVO_API_KEY");
  const fromRaw = Deno.env.get("EMAIL_FROM");
  if (!apiKey || !fromRaw) return null;

  const sender = parseFromAddress(fromRaw);

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: { name: sender.name, email: sender.email },
      to: to.map((email) => ({ email })),
      subject,
      htmlContent: html,
    }),
  });

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      `Brevo error: ${(payload as { message?: string })?.message ?? res.statusText}`,
    );
  }
  return { provider: "brevo", payload };
}

async function sendWithResend(to: string[], subject: string, html: string) {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  const from = Deno.env.get("EMAIL_FROM");
  if (!apiKey || !from) return null;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      `Resend error: ${(payload as { message?: string })?.message ?? res.statusText}`,
    );
  }
  return { provider: "resend", payload };
}

async function sendEmail(to: string[], subject: string, html: string) {
  const gmail = await sendWithGmail(to, subject, html);
  if (gmail) return gmail;

  const brevoKey = Deno.env.get("BREVO_API_KEY");
  const resendKey = Deno.env.get("RESEND_API_KEY");
  const from = Deno.env.get("EMAIL_FROM");

  if (brevoKey && from) {
    const result = await sendWithBrevo(to, subject, html);
    if (result) return result;
  }

  if (resendKey && from) {
    const result = await sendWithResend(to, subject, html);
    if (result) return result;
  }

  throw new Error(
    "Email not configured. Free setup: set GMAIL_USER and GMAIL_APP_PASSWORD in Supabase Edge Function secrets (Google App Password).",
  );
}

type CallerRole =
  | { role: "admin" }
  | { role: "user" }
  | { role: "embassy"; embassy: { country_id: string } }
  | { role: "unknown" };

async function resolveCallerRole(
  admin: ReturnType<typeof createClient>,
  user: User,
): Promise<CallerRole> {
  const { data: userRow } = await admin
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (userRow?.role === "admin") return { role: "admin" };
  if (userRow?.role === "user") return { role: "user" };

  const { data: embassyRow } = await admin
    .from("embassy")
    .select("id, country_id, email")
    .eq("id", user.id)
    .maybeSingle();

  if (embassyRow) {
    return { role: "embassy", embassy: { country_id: embassyRow.country_id } };
  }

  return { role: "unknown" };
}

async function authorizeEvent(
  admin: ReturnType<typeof createClient>,
  caller: User,
  eventType: EmailEventType,
  application: { user_id: string; country_id: string },
) {
  const roleInfo = await resolveCallerRole(admin, caller);

  if (roleInfo.role === "admin") return true;

  if (eventType === "visa_application_submitted") {
    return application.user_id === caller.id;
  }

  if (
    eventType === "appointment_scheduled" ||
    eventType === "appointment_rescheduled" ||
    eventType === "visa_approved" ||
    eventType === "visa_rejected"
  ) {
    if (roleInfo.role === "embassy") {
      return roleInfo.embassy.country_id === application.country_id;
    }
  }

  return false;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json()) as RequestBody;
    if (!body?.eventType || !body?.applicationId) {
      return new Response(
        JSON.stringify({ error: "eventType and applicationId are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const admin = createClient(supabaseUrl, serviceKey);

    const { data: application, error: appError } = await admin
      .from("applications")
      .select(
        `id, user_id, country_id, status, appointment_date, previous_appointment_date, rejection_reason, embassy_location,
        application_personal_info ( first_name, last_name, email ),
        countries ( name )`,
      )
      .eq("id", body.applicationId)
      .maybeSingle();

    if (appError || !application) {
      return new Response(JSON.stringify({ error: "Application not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const allowed = await authorizeEvent(
      admin,
      user,
      body.eventType,
      application,
    );
    if (!allowed) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const personal = Array.isArray(application.application_personal_info)
      ? application.application_personal_info[0]
      : application.application_personal_info;

    let country = Array.isArray(application.countries)
      ? application.countries[0]
      : application.countries;

    if (!country?.name && application.country_id) {
      const { data: countryRow } = await admin
        .from("countries")
        .select("name")
        .eq("id", application.country_id)
        .maybeSingle();
      country = countryRow;
    }

    let applicantEmail = personal?.email as string | undefined;

    if (!applicantEmail) {
      const { data: applicant } = await admin
        .from("users")
        .select("email, name")
        .eq("id", application.user_id)
        .maybeSingle();
      applicantEmail = applicant?.email;
    }

    if (!applicantEmail) {
      return new Response(
        JSON.stringify({ error: "Applicant email not found" }),
        {
          status: 422,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const applicantName =
      [personal?.first_name, personal?.last_name].filter(Boolean).join(" ") ||
      "Applicant";

    const countryName = (country?.name as string) || "your destination";

    const meta = body.meta ?? {};
    const rejectionReason =
      (meta.rejectionReason as string) ?? application.rejection_reason;

    const { subject, html } = buildEmail(body.eventType, {
      applicantName,
      countryName,
      applicationId: application.id,
      appointmentDate:
        (meta.appointmentDate as string) ?? application.appointment_date,
      previousAppointmentDate:
        (meta.previousAppointmentDate as string) ??
        application.previous_appointment_date,
      rejectionReason,
      embassyLocation:
        (meta.embassyLocation as Record<string, unknown>) ??
        application.embassy_location,
    });

    const recipients = [applicantEmail];

    const embassyNotify =
      Deno.env.get("EMAIL_NOTIFY_EMBASSY_ON_SUBMIT") === "true" &&
      body.eventType === "visa_application_submitted";

    if (embassyNotify && application.country_id) {
      const { data: embassies } = await admin
        .from("embassy")
        .select("email")
        .eq("country_id", application.country_id)
        .not("email", "is", null);

      for (const row of embassies ?? []) {
        if (row.email && !recipients.includes(row.email)) {
          recipients.push(row.email);
        }
      }
    }

    const result = await sendEmail(recipients, subject, html);

    return new Response(JSON.stringify({ success: true, result }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[send-transactional-email]", err);
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : "Internal error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
