import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import { mapAddressRow } from "@/lib/dbMappers";
import { getAuthUserId } from "@/lib/auth";

export async function GET() {
  try {
    const userId = await getAuthUserId();

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const sql = await connectDB();

    const addressRows = await sql`
      SELECT *
      FROM addresses
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;

    const addresses = addressRows.map(mapAddressRow);

    return NextResponse.json({ success: true, addresses });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Could not fetch addresses." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const userId = await getAuthUserId();

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const requiredFields = ["fullName", "phoneNumber", "pincode", "area", "city", "state"];

    for (const field of requiredFields) {
      if (!body[field] || String(body[field]).trim() === "") {
        return NextResponse.json(
          { success: false, message: `${field} is required.` },
          { status: 400 }
        );
      }
    }

    const sql = await connectDB();

    const [addressRow] = await sql`
      INSERT INTO addresses (
        user_id,
        full_name,
        phone_number,
        pincode,
        area,
        city,
        state
      )
      VALUES (
        ${userId},
        ${String(body.fullName).trim()},
        ${String(body.phoneNumber).trim()},
        ${String(body.pincode).trim()},
        ${String(body.area).trim()},
        ${String(body.city).trim()},
        ${String(body.state).trim()}
      )
      RETURNING *
    `;

    const address = mapAddressRow(addressRow);

    return NextResponse.json({ success: true, address });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Could not save address." },
      { status: 500 }
    );
  }
}
