// src/services/stripeService.ts
import Stripe from 'stripe';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16', // Use the latest API version
});

export const createCheckoutSession = async (
  bookingId: string,
  amount: number,
  currency: string
): Promise<string> => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: currency,
          product_data: {
            name: 'Car Booking',
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.FRONTEND_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/booking/cancel`,
    metadata: {
      bookingId: bookingId,
    },
  });

  return session.id;
};

export const createPaymentIntent = async (
  amount: number,
  currency: string
): Promise<string> => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: currency,
  });

  return paymentIntent.client_secret!;
};