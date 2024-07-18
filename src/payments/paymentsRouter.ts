import { bothRoleAuth } from "./../middleware/authBearer";
import { Hono } from "hono";
import {
  getPayment,
  getPayments,
  createPayment,
  updatePayment,
  deletePayment,
} from "./paymentsController";
import { parse } from "querystring";

export const paymentsRouter = new Hono();

paymentsRouter.get("/payments", getPayments);
paymentsRouter.get("/payments/:id", getPayment);
paymentsRouter.put("/payments/:id", updatePayment);
paymentsRouter.delete("/payments/:id", deletePayment);

paymentsRouter.post(
  "/create-checkout-session",
  createPayment.createCheckoutSession
);
paymentsRouter.post("/webhook", createPayment.handleWebhook);
paymentsRouter.get(
  "/test-checkout-session",
  createPayment.testCreateCheckoutSession
);
