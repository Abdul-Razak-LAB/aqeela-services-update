import { NextResponse } from "next/server";
import Stripe from "stripe";
import connectDB from "@/config/db";
import { mapOrderRow } from "@/lib/dbMappers";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
  try {
    if (!stripeSecretKey || !stripeWebhookSecret) {
      return NextResponse.json(
        { success: false, message: "Stripe webhook is not configured." },
        { status: 500 }
      );
    }

    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      return NextResponse.json(
        { success: false, message: "Missing Stripe signature." },
        { status: 400 }
      );
    }

    const payload = await request.text();

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-02-24.acacia",
    });

    const event = stripe.webhooks.constructEvent(payload, signature, stripeWebhookSecret);

    if (
      event.type !== "checkout.session.completed" &&
      event.type !== "checkout.session.async_payment_succeeded" &&
      event.type !== "checkout.session.async_payment_failed"
    ) {
      return NextResponse.json({ success: true, ignored: true });
    }

    const session = event.data.object;
    const sessionId = session.id;
    const metadataOrderId = session.metadata?.orderId;

    const sql = await connectDB();

    let orderRow = null;
    if (sessionId) {
      [orderRow] = await sql`
        SELECT *
        FROM orders
        WHERE payment_session_id = ${sessionId}
        LIMIT 1
      `;
    }

    if (!orderRow && metadataOrderId) {
      [orderRow] = await sql`
        SELECT *
        FROM orders
        WHERE id = ${metadataOrderId}
        LIMIT 1
      `;
    }

    const order = orderRow ? mapOrderRow(orderRow) : null;

    if (!order) {
      return NextResponse.json({ success: true, ignored: true });
    }

    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      if (session.payment_status === "paid" || event.type === "checkout.session.async_payment_succeeded") {
        await sql`
          UPDATE orders
          SET
            payment = 'Paid',
            status = 'Order Placed',
            payment_session_id = ${order.paymentSessionId || sessionId || ""},
            updated_at = NOW()
          WHERE id = ${order._id}
        `;
      }
    }

    if (event.type === "checkout.session.async_payment_failed") {
      await sql`
        UPDATE orders
        SET
          payment = 'Failed',
          status = 'Payment Failed',
          payment_session_id = ${order.paymentSessionId || sessionId || ""},
          updated_at = NOW()
        WHERE id = ${order._id}
      `;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Webhook processing failed." },
      { status: 400 }
    );
  }
}
