import { NextResponse } from "next/server";
import { AUTH_SESSION_COOKIE, clearCurrentSession } from "@/lib/auth";

export async function POST() {
  try {
    await clearCurrentSession();

    const response = NextResponse.json({ success: true });
    response.cookies.set(AUTH_SESSION_COOKIE, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Could not sign out." },
      { status: 500 }
    );
  }
}
