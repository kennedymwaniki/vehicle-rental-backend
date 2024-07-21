import { TIBooking } from "../drizzle/schema";
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

// export const updateBooking = async (c: Context) => {
//   try {
//     const id = parseInt(c.req.param("id"));
//     console.log("bookingController:", id);
//     if (isNaN(id)) return c.text("Invalid ID", 400);

//     const booking = await c.req.json();
//     console.log("This the booking the controller gets", booking);

//     if (booking.bookingDate && typeof booking.bookingDate !== "string") {
//       booking.bookingDate = new Date(booking.bookingDate).toISOString();
//     }
//     if (booking.returnDate && typeof booking.returnDate !== "string") {
//       booking.returnDate = new Date(booking.returnDate).toISOString();
//     }

//     const searchedBooking = await getBookingById(id);
//     if (searchedBooking == undefined) return c.text("Booking not found", 404);

//     const res = await updateBookingService(id, booking);
//     if (!res) return c.text("Booking not updated", 404);

//     return c.json({ msg: res }, 201);
//   } catch (error: any) {
//     return c.json({ error: error?.message }, 400);
//   }
// };

function safelyConvertToISOString(date: any): string | null {
  if (!date) return null;

  try {
    if (typeof date === "string") {
      return new Date(date).toISOString();
    } else if (date instanceof Date) {
      return date.toISOString();
    } else {
      return new Date(date).toISOString();
    }
  } catch (error) {
    console.error("Error converting date:", error);
    return null;
  }
}

export const updateBooking = async (c: Context) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const booking: TIBooking = await c.req.json();
    console.log("Received booking data:", booking);

    const updatedBooking = { ...booking };
    updatedBooking.bookingDate =
      safelyConvertToISOString(booking.bookingDate) || booking.bookingDate;
    updatedBooking.returnDate =
      safelyConvertToISOString(booking.returnDate) || booking.returnDate;

    const searchedBooking = await getBookingById(id);
    if (!searchedBooking) return c.text("Booking not found", 404);

    const res = await updateBookingService(id, updatedBooking);
    if (!res) return c.text("Booking not updated", 404);

    return c.json({ msg: res }, 201);
  } catch (error: any) {
    console.error("Error updating booking:", error);
    return c.json({ error: error?.message || "Unknown error occurred" }, 400);
  }
};

export const deleteBooking = async (c: Context) => {
  try {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const booking = await getBookingById(id);
    if (booking === undefined) return c.text("Booking not found", 404);

    const res = await deleteBookingService(id);
    if (!res) return c.text("Booking not deleted", 404);

    return c.json({ msg: res }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};
