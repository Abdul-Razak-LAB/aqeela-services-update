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

export async function sendContactMessageEmails(message) {
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
    `Hi ${message.name},`,
    "",
    "Thanks for contacting Aqeela Services.",
    "We received your message and our team will respond shortly.",
    "",
    "Your message:",
    message.body,
  ].join("\n");

  const adminText = [
    "New contact message received:",
    `Name: ${message.name}`,
    `Email: ${message.email}`,
    `Message: ${message.body}`,
  ].join("\n");

  await Promise.all([
    resend.emails.send({
      from,
      to: message.email,
      subject: "We received your message",
      text: customerText,
    }),
    resend.emails.send({
      from,
      to: notificationTo,
      subject: `New contact message - ${message.name}`,
      text: adminText,
    }),
  ]);

  return { sent: true };
}

export async function sendAuthCodeEmail({ email, code }) {
  const resend = getResendClient();
  if (!resend) {
    return { sent: false, reason: "RESEND_API_KEY is missing." };
  }

  const from = (process.env.RESEND_FROM_EMAIL || "").trim().replace(/^['\"]|['\"]$/g, "");
  if (!from) {
    return { sent: false, reason: "RESEND_FROM_EMAIL is missing." };
  }

  const safeCode = String(code || "").trim();
  if (!safeCode) {
    return { sent: false, reason: "Verification code is missing." };
  }

  const result = await resend.emails.send({
    from,
    to: normalizeRecipient(email),
    subject: "Your Aqeela Services sign-in code",
    text: `Your verification code is ${safeCode}. It expires in 10 minutes.`,
  });

  if (result?.error) {
    return {
      sent: false,
      reason: result.error.message || "Resend could not deliver the verification code.",
    };
  }

  return { sent: true };
}

function normalizeRecipient(email) {
  return String(email || "").trim().toLowerCase();
}
