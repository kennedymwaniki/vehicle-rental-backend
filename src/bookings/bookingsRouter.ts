import { Hono } from "hono";

import {
  getBooking,
  getBookings,
  createBooking,
  updateBooking,
  deleteBooking,
} from "./bookingController";
import { adminRoleAuth, bothRoleAuth } from "../middleware/authBearer";

export const bookingRouter = new Hono();

bookingRouter.get("/bookings",adminRoleAuth, getBookings);
bookingRouter.get("/bookings/:id",adminRoleAuth, getBooking);
bookingRouter.post("/bookings", adminRoleAuth,createBooking);
bookingRouter.put("/bookings/:id", adminRoleAuth, updateBooking);
bookingRouter.delete("/bookings/:id", bothRoleAuth, deleteBooking);
