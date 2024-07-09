// src/controllers/stripeController.ts
stripe
import { Context } from 'hono';
import * as stripeService from '../stripe/stripeService';
import * as bookingService from '../bookings/bookingService';
import * as paymentService from '../payments/paymentsService';
import { stripe } from './stripe';

export const createCheckoutSession = async (c: Context) => {
  const { bookingId, amount, currency } = await c.req.json();

  try {
    const sessionId = await stripeService.createCheckoutSession(bookingId, amount, currency);
    return c.json({ sessionId });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return c.json({ error: 'Failed to create checkout session' }, 500);
  }
};

export const createPaymentIntent = async (c: Context) => {
  const { amount, currency } = await c.req.json();

  try {
    const clientSecret = await stripeService.createPaymentIntent(amount, currency);
    return c.json({ clientSecret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return c.json({ error: 'Failed to create payment intent' }, 500);
  }
};

export const handleWebhook = async (c: Context) => {
  const signature = c.req.header('stripe-signature');
  if (!signature) {
    return c.json({ error: 'Missing stripe-signature header' }, 400);
  }

  const rawBody = await c.req.raw.text();

  try {
    const event = stripe.webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET);

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        await handleSuccessfulPayment(session);
        break;
      // Add more event types as needed
    }

    return c.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return c.json({ error: 'Webhook signature verification failed' }, 400);
  }
};

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  const bookingId = session.metadata?.bookingId;
  if (bookingId) {
    await bookingService.updateBookingStatus(bookingId, 'paid');
    await paymentService.createPaymentRecord(bookingId, session.amount_total!, session.payment_intent as string);
  }
}