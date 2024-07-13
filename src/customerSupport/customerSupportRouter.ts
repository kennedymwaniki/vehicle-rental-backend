import { Hono } from "hono";

import {
  getTicket,
  getTickets,
  createTicket,
  updateTicket,
  deleteTicket,
} from "./customerSupportController";
import { adminRoleAuth, bothRoleAuth } from "../middleware/authBearer";
import { zValidator } from "@hono/zod-validator";
import { CustomerSupportTicketSchema } from "../validator";

export const customerSupportRouter = new Hono();

customerSupportRouter.get("/support-tickets", getTickets);
customerSupportRouter.get("/support-tickets/:id", getTicket);
customerSupportRouter.post(
  "/support-tickets",
  zValidator("json", CustomerSupportTicketSchema, (result, c) => {
    if (!result.success) {
      return c.json(result.error, 400);
    }
  }),

  createTicket
);
customerSupportRouter.put(
  "/support-tickets/:id",
  zValidator("json", CustomerSupportTicketSchema, (result, c) => {
    if (!result.success) {
      return c.json(result.error, 400);
    }
  }),

  updateTicket
);
customerSupportRouter.delete(
  "/support-tickets/:id",

  deleteTicket
);
