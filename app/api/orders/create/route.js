import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import { mapOrderRow } from "@/lib/dbMappers";

export async function POST(request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Order items are required." },
        { status: 400 }
      );
    }

    const requiredAddressFields = ["fullName", "phoneNumber", "pincode", "area", "city", "state"];
    for (const field of requiredAddressFields) {
      if (!body.address?.[field] || String(body.address[field]).trim() === "") {
        return NextResponse.json(
          { success: false, message: `${field} is required.` },
          { status: 400 }
        );
      }
    }

    const subTotal = body.items.reduce((sum, item) => {
      const price = Number(item?.product?.offerPrice || 0);
      const quantity = Number(item?.quantity || 0);
      return sum + price * quantity;
    }, 0);

    const tax = Math.floor(subTotal * 0.02);
    const amount = subTotal + tax;

    const sql = await connectDB();

    const paymentType = body.paymentType === "ONLINE" ? "ONLINE" : "COD";

    const orderId = crypto.randomUUID();
    const [orderRow] = await sql`
      INSERT INTO orders (
        id,
        user_id,
        items,
        address,
        sub_total,
        tax,
        amount,
        status,
        payment_type,
        payment,
        date
      )
      VALUES (
        ${orderId},
        ${userId},
        ${JSON.stringify(body.items)}::jsonb,
        ${JSON.stringify(body.address)}::jsonb,
        ${subTotal},
        ${tax},
        ${amount},
        ${paymentType === "ONLINE" ? "Awaiting Payment" : "Order Placed"},
        ${paymentType},
        ${paymentType === "ONLINE" ? "Unpaid" : "Pending"},
        ${Date.now()}
      )
      RETURNING *
    `;

    const order = mapOrderRow(orderRow);

    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Could not create order." },
      { status: 500 }
    );
  }
}
