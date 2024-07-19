import { Session } from "inspector";
import stripe from "../stripe/stripe";
import getRawBody from "raw-body";
import {
  deletePaymentService,
  createPaymentService,
  getPaymentById,
  getPaymentsService,
  updatePaymentService,
} from "./paymentsService";

import { type Context } from "hono";

export const getPayments = async (c: Context) => {
  const data = await getPaymentsService();
  return c.json(data);
};

// In paymentsController.ts

export const getPayment = async (c: Context) => {
  const id = parseInt(c.req.param("id"));
  if (isNaN(id)) {
    return c.json({ error: "Invalid ID" }, 400); // Return a 400 error for invalid ID
  }
  console.log(id);
  const payment = await getPaymentById(id);
  if (!payment) {
    return c.json({ error: "Payment not found" }, 404);
  }
  return c.json(payment, 200);
};

// export const createPayment = async (c: Context) => {
//   try {
//     const payment = await c.req.json();
//     console.log(payment);
//     const createdPayment = await createPaymentService(payment);
//     if (!createdPayment) {
//       return c.text("No payment created");
//     }
//     return c.json({ msg: createdPayment }, 201);
//   } catch (error: any) {
//     return c.json({ error: error?.message }, 400);
//   }
// };

const paymentService = createPaymentService();
export const createPayment = {
  async createCheckoutSession(c: Context) {
    try {
      const { bookingId, amount } = await c.req.json();
      //! i am checking how the id and amount is received
      console.log(
        `this is how we receive the bookingId in the controller ${bookingId} as a :`,
        typeof bookingId
      );
      console.log(
        `this is how we receive the amount in the controller ${amount} as a :`,
        typeof amount
      );
      //!converting our received booking id and amount into numbers

      const validBookingId = Number(bookingId);
      const validAmount = Number(amount);

      console.log(
        `this is the validBookingId ${validBookingId} in the controller which is receiced as :`,
        `${bookingId}`
      );
      console.log(
        `this is the validAmount ${validBookingId} in the controller which is receiced as :`,
        `${bookingId}`
      );

      if (isNaN(validBookingId) || isNaN(validAmount)) {
        return c.json(
          { success: false, error: "Invalid bookingId or amount" },
          400
        );
      }

      const session = await paymentService.createCheckoutSession(
        validBookingId,
        validAmount
      );
      //!check the session

      console.log(session);

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

  async testCreateCheckoutSession(c: Context) {
    try {
      const bookingId = 8;
      const amount = 90000;

      const session = await paymentService.createCheckoutSession(
        bookingId,
        amount
      );
      await paymentService.handleSuccessfulPayment(session.id);

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
      console.log("signature in controller", sig);

      const rawBody = await c.req.raw.text();
      console.log("rawBody in controller", rawBody);

      const event = stripe.webhooks.constructEvent(
        rawBody,
        sig!,
        process.env.STRIPE_WEBHOOK_SECRET!
      );

      console.log("Received event:", event);

      if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        console.log("Session data:", session);
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
