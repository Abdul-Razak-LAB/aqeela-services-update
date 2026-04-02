import { NextResponse } from "next/server";
import { sendContactMessageEmails } from "@/lib/resend";

export async function POST(request) {
  try {
    const body = await request.json();

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const message = String(body.message || "").trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: "name, email, and message are required." },
        { status: 400 }
      );
    }

    try {
      await sendContactMessageEmails({ name, email, body: message });
    } catch {
      // Message submission should still succeed even if email provider fails.
    }

    return NextResponse.json({
      success: true,
      message: "Message sent successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Could not send message." },
      { status: 500 }
    );
  }
}