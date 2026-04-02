import { NextResponse } from "next/server";
import { createLoginCode, normalizeEmail } from "@/lib/auth";
import { sendAuthCodeEmail } from "@/lib/resend";

export async function POST(request) {
  try {
    const body = await request.json();
    const email = normalizeEmail(body.email);

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, message: "A valid email is required." },
        { status: 400 }
      );
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    await createLoginCode(email, code);

    const emailResult = await sendAuthCodeEmail({ email, code });
    if (!emailResult.sent) {
      return NextResponse.json(
        { success: false, message: emailResult.reason || "Could not send code." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Verification code sent." });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Could not send code." },
      { status: 500 }
    );
  }
}
