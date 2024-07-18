import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import {
  TIPayment,
  TSPayment,
  PaymentsTable,
  BookingsTable,
} from "../drizzle/schema";
import stripe from "../stripe/stripe";

// interface TIPayment {
// ?  // Define the properties of TIPayment interface according to your needs
//   bookingId: number;
//   amount: number;
//   paymentStatus: string;
//   paymentMethod: string;
//   transactionId: string;
// }

interface TISPayment {
  bookingId: number;
  amount: number;
  paymentStatus: string;
  paymentMethod: string;
  transactionId: string;
}

export const getPaymentsService = async () => {
  const payments = await db.query.PaymentsTable.findMany();
  return payments;
};

export const getPaymentById = async (
  id: number
): Promise<TSPayment | undefined> => {
  const payment = await db.query.PaymentsTable.findFirst({
    where: eq(PaymentsTable.paymentId, id),
  });
  return payment;
};
// export const createPaymentService = async (payment: TIPayment) => {
//   await db.insert(PaymentsTable).values(payment);
//   return payment;
// };

export const createPaymentService = () => {
  return {
    async createCheckoutSession(bookingId: number, amount: number) {
      console.log(`Booking ID in service: ${bookingId}`, typeof bookingId);
      console.log(`Amount in service: ${amount}`, typeof amount);
      //! Ensure bookingId and amount are numbers
      const validBookingId = Number(bookingId);
      const validAmount = Number(amount);

      console.log(
        `this is the validBookingId ${validBookingId} in the service which is receiced as :`,
        `${bookingId}`
      );
      console.log(
        `this is the validAmount ${validBookingId} in the service which is receiced as :`,
        `${bookingId}`
      );

      if (isNaN(validBookingId) || isNaN(validAmount)) {
        throw new Error("Invalid bookingId or amount");
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Car Booking",
              },
              unit_amount: validAmount * 100, // Stripe expects amount in cents
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.FRONTEND_URL}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/booking-cancelled`,
        metadata: {
          bookingId: validBookingId.toString(),
        },
      });

      return session;
    },

    async handleSuccessfulPayment(sessionId: string) {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      const bookingId = Number(session.metadata!.bookingId);

      const amountTotal = session.amount_total;
      if (amountTotal === null) {
        throw new Error("session.amount_total is null");
      }

      await db
        .update(BookingsTable)
        .set({ bookingStatus: "Completed" })
        .where(eq(BookingsTable.bookingId, bookingId));

      await db
        .insert(PaymentsTable)
        .values({
          bookingId,
          amount: amountTotal / 100,
          paymentStatus: "Completed",
          paymentMethod: session.payment_method_types[0],
          transactionId: session.payment_intent as string,
        })
        .returning();
    },
  };
};

export const updatePaymentService = async (id: number, payment: TIPayment) => {
  await db
    .update(PaymentsTable)
    .set(payment)
    .where(eq(PaymentsTable.paymentId, id));
  return payment;
};

export const deletePaymentService = async (id: number) => {
  await db.delete(PaymentsTable).where(eq(PaymentsTable.paymentId, id));
};
