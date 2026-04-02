import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import { mapOrderRow } from "@/lib/dbMappers";
import Stripe from "stripe";
import { getAuthUserId } from "@/lib/auth";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export async function POST(request) {
  try {
    if (!stripeSecretKey) {
      return NextResponse.json(
        { success: false, message: "Stripe is not configured on the server." },
        { status: 500 }
      );
    }

    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { orderId, sessionId } = await request.json();

    if (!orderId || !sessionId) {
      return NextResponse.json(
        { success: false, message: "orderId and sessionId are required." },
        { status: 400 }
      );
    }

    const sql = await connectDB();

    const [orderRow] = await sql`
      SELECT *
      FROM orders
      WHERE id = ${orderId} AND user_id = ${userId}
      LIMIT 1
    `;

    const order = orderRow ? mapOrderRow(orderRow) : null;
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found." },
        { status: 404 }
      );
    }

    if (order.payment === "Paid") {
      return NextResponse.json({ success: true, alreadyPaid: true, order });
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-02-24.acacia",
    });

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const metadataOrderId = session.metadata?.orderId;
    const metadataUserId = session.metadata?.userId;

    if (
      session.id !== order.paymentSessionId ||
      metadataOrderId !== order._id ||
      metadataUserId !== userId
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid payment confirmation." },
        { status: 400 }
      );
    }

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { success: false, message: "Payment is not completed yet." },
        { status: 400 }
      );
    }

    const [updatedOrderRow] = await sql`
      UPDATE orders
      SET
        payment = 'Paid',
        status = 'Order Placed',
        updated_at = NOW()
      WHERE id = ${order._id}
      RETURNING *
    `;

    return NextResponse.json({ success: true, order: mapOrderRow(updatedOrderRow) });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Could not confirm payment." },
      { status: 500 }
    );
  }
}
