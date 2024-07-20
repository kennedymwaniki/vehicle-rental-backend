import {
  deleteBookingService,
  createBookingService,
  getBookingById,
  getBookingsService,
  updateBookingService,
} from "./bookingService";

import { type Context } from "hono";

export const getBookings = async (c: Context) => {
  const data = await getBookingsService();
  return c.json(data);
};

export const getBooking = async (c: Context) => {
  const id = parseInt(c.req.param("id"));
  console.log(id);
  const booking = await getBookingById(id);
  if (!booking) {
    return c.json({ error: "Booking not found" }, 404);
  }
  return c.json(booking, 200);
};

export const createBooking = async (c: Context) => {
  try {
    const booking = await c.req.json();
    console.log(booking);
    const createdBooking = await createBookingService(booking);
    if (!createdBooking) {
      return c.text("No booking created");
    }
    return c.json({ msg: createdBooking }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

export const updateBooking = async (c: Context) => {
  try {
    const id = parseInt(c.req.param("id"));
    console.log("bookingController:", id);
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const booking = await c.req.json();
    console.log(booking);
    const searchedBooking = await getBookingById(id);
    if (searchedBooking == undefined) return c.text("Booking not found", 404);

    const res = await updateBookingService(id, booking);
    if (!res) return c.text("Booking not updated", 404);

    return c.json({ msg: res }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

export const deleteBooking = async (c: Context) => {
  try {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const booking = await getBookingById(id);
    if (booking === undefined) return c.text("Booking not found", 404);

    const res = await deleteBookingService(id);
    if (res === undefined) return c.text("Booking not deleted", 404);

    return c.json({ msg: res }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};
