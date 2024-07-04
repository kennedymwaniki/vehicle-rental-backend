import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TIPayment, TSPayment, PaymentsTable } from "../drizzle/schema";

export const getPaymentsService = async () => {
  const payments = await db.query.PaymentsTable.findMany();
  return payments;
};

export const getPaymentById = async (id: number): Promise<TSPayment | undefined> => {
  const payment = await db.query.PaymentsTable.findFirst({
    where: eq(PaymentsTable.paymentId, id),
  });
  return payment;
};

export const createPaymentService = async (payment: TIPayment) => {
  await db.insert(PaymentsTable).values(payment);
  return payment;
};

export const updatePaymentService = async (id: number, payment: TIPayment) => {
  await db.update(PaymentsTable).set(payment).where(eq(PaymentsTable.paymentId, id));
  return payment;
};

export const deletePaymentService = async (id: number) => {
  await db.delete(PaymentsTable).where(eq(PaymentsTable.paymentId, id));
};