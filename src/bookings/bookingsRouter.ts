import { Hono } from "hono";

import {
  getBooking,
  getBookings,
  createBooking,
  updateBooking,
  deleteBooking,
} from "./bookingController";
import { bothRoleAuth } from "../middleware/authBearer";

export const bookingRouter = new Hono();

bookingRouter.get("/bookings", getBookings);
bookingRouter.get("/bookings/:id", getBooking);
bookingRouter.post("/bookings", createBooking);
bookingRouter.put("/bookings/:id", updateBooking);
bookingRouter.delete("/bookings/:id", deleteBooking);
