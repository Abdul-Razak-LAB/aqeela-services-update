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

    const { orderId } = await request.json();
    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "orderId is required." },
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
      return NextResponse.json({ success: true, alreadyPaid: true });
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-02-24.acacia",
    });

    const lineItems = order.items.map((item) => ({
      price_data: {
        currency: (process.env.STRIPE_CURRENCY || "usd").toLowerCase(),
        product_data: {
          name: item.product.name,
        },
        unit_amount: Math.round(Number(item.product.offerPrice || 0) * 100),
      },
      quantity: Number(item.quantity || 1),
    }));

    lineItems.push({
      price_data: {
        currency: (process.env.STRIPE_CURRENCY || "usd").toLowerCase(),
        product_data: {
          name: "Tax",
        },
        unit_amount: Math.round(Number(order.tax || 0) * 100),
      },
      quantity: 1,
    });

    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${origin}/order-placed?orderId=${order._id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart?payment=cancelled`,
      metadata: {
        orderId: order._id,
        userId,
      },
    });

    await sql`
      UPDATE orders
      SET
        payment_session_id = ${session.id},
        updated_at = NOW()
      WHERE id = ${order._id}
    `;

    return NextResponse.json({
      success: true,
      checkoutUrl: session.url,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create payment session." },
      { status: 500 }
    );
  }
}
