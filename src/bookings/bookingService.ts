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

//   await db
//     .update(BookingsTable)
//     .set(booking)
//     .where(eq(BookingsTable.bookingId, id));
//   return booking;
// };

function safelyConvertToISOString(date: any): string | null {
  if (!date) return null;

  try {
    if (typeof date === "string") {
      // If it's already a string, try parsing it
      return new Date(date).toISOString();
    } else if (date instanceof Date) {
      // If it's a Date object, convert it directly
      return date.toISOString();
    } else {
      // For any other type, try to create a new Date
      return new Date(date).toISOString();
    }
  } catch (error) {
    console.error("Error converting date:", error);
    return null;
  }
}

export const updateBookingService = async (id: number, booking: TIBooking) => {
  const updatedBooking = { ...booking };

  updatedBooking.bookingDate =
    safelyConvertToISOString(booking.bookingDate) || booking.bookingDate;
  updatedBooking.returnDate =
    safelyConvertToISOString(booking.returnDate) || booking.returnDate;

  await db
    .update(BookingsTable)
    .set(updatedBooking)
    .where(eq(BookingsTable.bookingId, id));

  return updatedBooking;
};

export const deleteBookingService = async (id: number) => {
  await db.delete(BookingsTable).where(eq(BookingsTable.bookingId, id));
  return "Booking successfully deleted";
};
