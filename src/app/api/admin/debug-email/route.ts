import { NextResponse } from "next/server";
import { EMAIL_FROM, resend } from "@/lib/resend";

export async function GET() {
  const hasKey = Boolean(process.env.RESEND_API_KEY) && process.env.RESEND_API_KEY !== "re_placeholder";
  const notificationEmail = process.env.NOTIFICATION_EMAIL || null;

  let sendResult: unknown = null;
  try {
    const res = await resend.emails.send({
      from: EMAIL_FROM,
      to: notificationEmail || "contact@cocondisa.fr",
      subject: "Diagnostic — test envoi",
      html: "<p>Test diagnostic d'envoi.</p>",
    });
    sendResult = res;
  } catch (error) {
    sendResult = { caught: String(error) };
  }

  return NextResponse.json({
    hasKey,
    notificationEmail,
    sendResult,
  });
}
