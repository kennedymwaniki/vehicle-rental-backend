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

export const getPayment = async (c: Context) => {
  const id = parseInt(c.req.param("id"));
  console.log(id);
  const payment = await getPaymentById(id);
  if (!payment) {
    return c.json({ error: "Payment not found" }, 404);
  }
  return c.json(payment, 200);
};

export const createPayment = async (c: Context) => {
  try {
    const payment = await c.req.json();
    console.log(payment);
    const createdPayment = await createPaymentService(payment);
    if (!createdPayment) {
      return c.text("No payment created");
    }
    return c.json({ msg: createdPayment }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

export const updatePayment = async (c: Context) => {
  const id = parseInt(c.req.param("id"));
  if (isNaN(id)) return c.text("Invalid ID", 400);

  const payment = await c.req.json();
  try {
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
