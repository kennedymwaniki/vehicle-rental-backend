import { Hono } from "hono";

import {
  getTicket,
  getTickets,
  createTicket,
  updateTicket,
  deleteTicket,
} from "./customerSupportController";

export const customerSupportRouter = new Hono();

customerSupportRouter.get("/support-tickets", getTickets);
customerSupportRouter.get("/support-tickets/:id", getTicket);
customerSupportRouter.post("/support-tickets", createTicket);
customerSupportRouter.put("/support-tickets/:id", updateTicket);
customerSupportRouter.delete("/support-tickets/:id", deleteTicket);