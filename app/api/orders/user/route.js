import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import { mapOrderRow } from "@/lib/dbMappers";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const sql = await connectDB();

    const orderRows = await sql`
      SELECT *
      FROM orders
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;

    const orders = orderRows.map(mapOrderRow);

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Could not fetch orders." },
      { status: 500 }
    );
  }
}
