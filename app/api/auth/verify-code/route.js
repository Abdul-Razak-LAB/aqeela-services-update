import { NextResponse } from "next/server";
import {
  AUTH_SESSION_COOKIE,
  createSessionForUser,
  findOrCreateUserByEmail,
  normalizeEmail,
  verifyLoginCode,
} from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const email = normalizeEmail(body.email);
    const code = String(body.code || "").trim();
    const name = String(body.name || "").trim();

    if (!email || !code) {
      return NextResponse.json(
        { success: false, message: "Email and verification code are required." },
        { status: 400 }
      );
    }

    const isValidCode = await verifyLoginCode(email, code);
    if (!isValidCode) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired verification code." },
        { status: 401 }
      );
    }

    const user = await findOrCreateUserByEmail({ email, name });
    const token = await createSessionForUser(user.id);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        imageUrl: user.image_url,
      },
    });

    response.cookies.set(AUTH_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Could not verify code." },
      { status: 500 }
    );
  }
}
