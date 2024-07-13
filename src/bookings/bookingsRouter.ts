import { bothRoleAuth } from "../middleware/authBearer";
import { adminRoleAuth } from "./../middleware/authBearer";
import { Hono } from "hono";
zValidator;
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
bookingRouter.post(
  "/bookings",
  zValidator("json", BookingSchema, (result, c) => {
    if (!result.success) {
      return c.json(result.error, 400);
    }
  }),
  createBooking
);
bookingRouter.put(
  "/bookings/:id",
  zValidator("json", BookingSchema, (result, c) => {
    if (!result.success) {
      return c.json(result.error, 400);
    }
  }),
  updateBooking
);
bookingRouter.delete("/bookings/:id", deleteBooking);
