import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TIBooking, TSBooking, BookingsTable } from "../drizzle/schema";

export const getBookingsService = async () => {
  const bookings = await db.query.BookingsTable.findMany();
  return bookings;
};

export const getBookingById = async (
  id: number
): Promise<TSBooking | undefined> => {
  const booking = await db.query.BookingsTable.findFirst({
    where: eq(BookingsTable.bookingId, id),
  });
  return booking;
};

export const createBookingService = async (booking: TIBooking) => {
  await db.insert(BookingsTable).values(booking);
  return booking;
};

// export const updateBookingService = async (id: number, booking: TIBooking) => {
//   if (booking.bookingDate && typeof booking.bookingDate !== "string") {
//     booking.bookingDate = new Date(booking.bookingDate).toISOString();
//   }
//   if (booking.returnDate && typeof booking.returnDate !== "string") {
//     booking.returnDate = new Date(booking.returnDate).toISOString();
//   }
//   console.log(
//     "this is how the service gets the dates after convertion",
//     booking.returnDate
//   );

//   await db
//     .update(BookingsTable)
//     .set(booking)
//     .where(eq(BookingsTable.bookingId, id));
//   return booking;
// };

export const updateBookingService = async (id: number, booking: TIBooking) => {
  if (booking.bookingDate) {
    booking.bookingDate = new Date(booking.bookingDate).toISOString();
  }
  if (booking.returnDate) {
    booking.returnDate = new Date(booking.returnDate).toISOString();
  }

  await db
    .update(BookingsTable)
    .set(booking)
    .where(eq(BookingsTable.bookingId, id));
  return booking;
};

export const deleteBookingService = async (id: number) => {
  await db.delete(BookingsTable).where(eq(BookingsTable.bookingId, id));
  return "Booking successfully deleted";
};
