import { bothRoleAuth } from "../middleware/authBearer";
import { adminRoleAuth } from "./../middleware/authBearer";
import { Hono } from "hono";

import {
  getBooking,
  getBookings,
  createBooking,
  updateBooking,
  deleteBooking,
} from "./bookingController";
import { zValidator } from "@hono/zod-validator";
import { BookingSchema } from "../validator";

export const bookingRouter = new Hono();

bookingRouter.get("/bookings", getBookings);
bookingRouter.get("/bookings/:id", getBooking);
bookingRouter.post("/bookings", createBooking);
bookingRouter.put("/bookings/:id", updateBooking);
bookingRouter.delete("/bookings/:id", deleteBooking);
