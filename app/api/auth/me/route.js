import { NextResponse } from "next/server";
import { getAuthUserFromCookies } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getAuthUserFromCookies();

    if (!user) {
      return NextResponse.json({ success: true, user: null });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        imageUrl: user.image_url,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Could not fetch auth user." },
      { status: 500 }
    );
  }
}
