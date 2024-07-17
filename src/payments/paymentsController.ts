import { Context } from "hono";
import {
  createPaymentService,
  deletePaymentService,
  getPaymentById,
  getPaymentsService,
  updatePaymentService,
} from "./paymentsService";

import stripe from "../stripe/stripe";
const paymentService = createPaymentService();

export const getPayments = async (c: Context) => {
  const data = await getPaymentsService();
  return c.json(data);
};

export const getPayment = async (c: Context) => {
  const id = parseInt(c.req.param("id"));
  if (isNaN(id)) {
    return c.json({ error: "Invalid ID" }, 400);
  }
  console.log(id);
  const payment = await getPaymentById(id);
  if (!payment) {
    return c.json({ error: "Payment not found" }, 404);
  }
  return c.json(payment, 200);
};

export const createPayment = {
  async createCheckoutSession(c: Context) {
    try {
      const booking = await c.req.json();
      const { bookingId, amount } = booking;
      if (bookingId === undefined || amount === undefined) {
        console.error("Booking ID or amount is missing");
        return c.json(
          { success: false, error: "Booking ID or amount is missing" },
          400
        );
      }

      console.log(
        `Check if id and amount is being received: ${bookingId}, amount: ${amount}`
      );

      const session = await paymentService.createCheckoutSession({
        bookingId,
        amount,
      });

      return c.json({
        success: true,
        sessionId: session.id,
        checkoutUrl: session.url,
      });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      return c.json(
        { success: false, error: "Failed to create checkout session" },
        500
      );
    }
  },

  async handleWebhook(c: Context) {
    try {
      const sig = c.req.header("stripe-signature");
      const rawBody = await c.req.raw.text();

      const event = stripe.webhooks.constructEvent(
        rawBody,
        sig!,
        process.env.STRIPE_WEBHOOK_SECRET!
      );

      if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        await paymentService.handleSuccessfulPayment(session.id);
      }

      return c.json({ received: true });
    } catch (err) {
      console.error(err);
      return c.json({ error: "Webhook error" }, 400);
    }
  },
};

export const updatePayment = async (c: Context) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const payment = await c.req.json();
    const searchedPayment = await getPaymentById(id);
    if (searchedPayment == undefined) return c.text("Payment not found", 404);

    const res = await updatePaymentService(id, payment);
    if (!res) return c.text("Payment not updated", 404);

    return c.json({ msg: res }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

export const deletePayment = async (c: Context) => {
  try {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const payment = await getPaymentById(id);
    if (payment === undefined) return c.text("Payment not found", 404);

    const res = await deletePaymentService(id);
    if (res === undefined) return c.text("Payment not deleted", 404);

    return c.json({ msg: res }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};
