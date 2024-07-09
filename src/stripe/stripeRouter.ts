// src/routes/stripeRoutes.ts
import { Hono } from 'hono';
import * as stripeController from './stripeController';

const stripeRouter = new Hono();

stripeRouter.post('/create-checkout-session', stripeController.createCheckoutSession);
stripeRouter.post('/create-payment-intent', stripeController.createPaymentIntent);
stripeRouter.post('/webhook', stripeController.handleWebhook);

export default stripeRouter;