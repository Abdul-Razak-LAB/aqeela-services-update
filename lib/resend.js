import { Resend } from "resend";

let resendClient = null;

function getResendClient() {
  const rawApiKey = process.env.RESEND_API_KEY || "";
  const apiKey = rawApiKey.trim().replace(/^['\"]|['\"]$/g, "");

  if (!apiKey) {
    return null;
  }

  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }

  return resendClient;
}

export async function sendConsultationEmails(consultation) {
  const resend = getResendClient();
  if (!resend) {
    return { sent: false, reason: "RESEND_API_KEY is missing." };
  }

  const from = (process.env.RESEND_FROM_EMAIL || "").trim().replace(/^['\"]|['\"]$/g, "");
  if (!from) {
    return { sent: false, reason: "RESEND_FROM_EMAIL is missing." };
  }

  const notificationTo =
    (process.env.CONSULTATION_NOTIFICATION_EMAIL || "")
      .trim()
      .replace(/^['\"]|['\"]$/g, "") || from;

  const customerText = [
    `Hi ${consultation.fullName},`,
    "",
    "Thanks for booking a consultation with Aqeela Services.",
    `Topic: ${consultation.topic}`,
    `Preferred date/time: ${consultation.preferredDate} ${consultation.preferredTime}`,
    "",
    "Our team will contact you shortly.",
  ].join("\n");

  const adminText = [
    "New consultation booking received:",
    `ID: ${consultation.id}`,
    `Name: ${consultation.fullName}`,
    `Phone: ${consultation.phoneNumber}`,
    `Email: ${consultation.email}`,
    `City/Area: ${consultation.cityArea}`,
    `Topic: ${consultation.topic}`,
    `Crop Type: ${consultation.cropType}`,
    `Preferred Date/Time: ${consultation.preferredDate} ${consultation.preferredTime}`,
    `Requirement: ${consultation.requirement || "N/A"}`,
  ].join("\n");

  await Promise.all([
    resend.emails.send({
      from,
      to: consultation.email,
      subject: "Consultation request received",
      text: customerText,
    }),
    resend.emails.send({
      from,
      to: notificationTo,
      subject: `New consultation booking - ${consultation.fullName}`,
      text: adminText,
    }),
  ]);

  return { sent: true };
}
