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

export const updateBookingService = async (id: number, booking: TIBooking) => {
  await db
    .update(BookingsTable)
    .set(booking)
    .where(eq(BookingsTable.bookingId, id));
  return booking;
};

export const deleteBookingService = async (id: number) => {
  await db.delete(BookingsTable).where(eq(BookingsTable.bookingId, id));
};
