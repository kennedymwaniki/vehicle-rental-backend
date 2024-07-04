import {
  deleteTicketService,
  createTicketService,
  getTicketById,
  getTicketsService,
  updateTicketService,
} from "./customerSupportService";

import { type Context } from "hono";

export const getTickets = async (c: Context) => {
  const data = await getTicketsService();
  return c.json(data);
};

export const getTicket = async (c: Context) => {
  const id = parseInt(c.req.param("id"));
  console.log(id);
  const ticket = await getTicketById(id);
  if (!ticket) {
    return c.json({ error: "Support ticket not found" }, 404);
  }
  return c.json(ticket, 200);
};

export const createTicket = async (c: Context) => {
  try {
    const ticket = await c.req.json();
    console.log(ticket);
    const createdTicket = await createTicketService(ticket);
    if (!createdTicket) {
      return c.text("No support ticket created");
    }
    return c.json({ msg: createdTicket }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

export const updateTicket = async (c: Context) => {
  const id = parseInt(c.req.param("id"));
  if (isNaN(id)) return c.text("Invalid ID", 400);

  const ticket = await c.req.json();
  try {
    const searchedTicket = await getTicketById(id);
    if (searchedTicket == undefined)
      return c.text("Support ticket not found", 404);

    const res = await updateTicketService(id, ticket);
    if (!res) return c.text("Support ticket not updated", 404);

    return c.json({ msg: res }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

export const deleteTicket = async (c: Context) => {
  try {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const ticket = await getTicketById(id);
    if (ticket === undefined) return c.text("Support ticket not found", 404);

    const res = await deleteTicketService(id);
    if (res === undefined) return c.text("Support ticket not deleted", 404);

    return c.json({ msg: res }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};
