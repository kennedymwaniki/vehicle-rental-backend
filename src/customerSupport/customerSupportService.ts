import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import {
  TICustomerSupportTicket,
  TSCustomerSupportTicket,
  CustomerSupportTicketsTable,
} from "../drizzle/schema";

export const getTicketsService = async () => {
  const tickets = await db.query.CustomerSupportTicketsTable.findMany({
    columns: {
      ticketId: true,
      userId: true,
      subject: true,
      description: true,
      status: true,
    },
  });
  return tickets;
};

export const getTicketById = async (
  id: number
): Promise<TSCustomerSupportTicket | undefined> => {
  const ticket = await db.query.CustomerSupportTicketsTable.findFirst({
    where: eq(CustomerSupportTicketsTable.ticketId, id),
  });
  return ticket;
};

export const createTicketService = async (ticket: TICustomerSupportTicket) => {
  await db.insert(CustomerSupportTicketsTable).values(ticket);
  return ticket;
};

export const updateTicketService = async (
  id: number,
  ticket: TICustomerSupportTicket
) => {
  await db
    .update(CustomerSupportTicketsTable)
    .set(ticket)
    .where(eq(CustomerSupportTicketsTable.ticketId, id));
  return ticket;
};

export const deleteTicketService = async (id: number) => {
  await db
    .delete(CustomerSupportTicketsTable)
    .where(eq(CustomerSupportTicketsTable.ticketId, id));
};
