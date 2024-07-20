import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import {
  TIUser,
  TSUser,
  UsersTable,
  BookingsTable,
  TSCustomerSupportTicket,
  TIBooking,
} from "../drizzle/schema";
import { TypedQueryBuilder } from "drizzle-orm/query-builders/query-builder";

interface TuserRelations {
  userId: number;
  email: string;
  fullName: string;
  address: string;

  bookings: TIBooking[];
  customerSupportTickets: TSCustomerSupportTicket[];
}
export const getUsersService = async () => {
  const users = await db.query.UsersTable.findMany({
    columns: {
      userId: true,
      fullName: true,
      role: true,
      email: true,
      address: true,
      contactPhone: true,
    },
  });
  return users;
};

export const getUserById = async (id: number): Promise<TSUser | undefined> => {
  const user = await db.query.UsersTable.findFirst({
    where: eq(UsersTable.userId, id),
  });
  return user;
};

export const createUserService = async (user: TIUser) => {
  await db.insert(UsersTable).values(user);
  return user;
};

export const updateUserService = async (id: number, user: TIUser) => {
  await db.update(UsersTable).set(user).where(eq(UsersTable.userId, id));
  return user;
};

export const deleteUserService = async (id: number) => {
  await db.delete(UsersTable).where(eq(UsersTable.userId, id));
  return "User deleted successfully";
};

export const getUserBookingsById = async (userId: number) => {
  const userBookings = await db.query.UsersTable.findFirst({
    where: eq(UsersTable.userId, userId),
    columns: {
      userId: true,
      email: true,
      fullName: true,
      address: true,
      role: true,
    },
    with: {
      bookings: {
        columns: {
          bookingId: true,
          vehicleId: true,
          locationId: true,
          bookingDate: true,
          returnDate: true,
          totalAmount: true,
          bookingStatus: true,
        },
      },
    },
  });

  return userBookings;
};

export const getUserSupportTicketsById = async (userId: number) => {
  const userSupportTickets = await db.query.UsersTable.findFirst({
    where: eq(UsersTable.userId, userId),
    columns: {
      userId: true,
      email: true,
      fullName: true,
      address: true,
      role: true,
    },
    with: {
      customerSupportTickets: {
        columns: {
          ticketId: true,
          subject: true,
          description: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  return userSupportTickets;
};

export const getAllUserRelationsById = async (
  id: number
) => {
  const userRelations = await db.query.UsersTable.findFirst({
    where: eq(UsersTable.userId, id),
    columns: {
      userId: true,
      fullName: true,
      email: true,
      address: true,
    },
    with: {
      bookings: {
        columns: {
          bookingId: true,
          bookingStatus: true,
          locationId: true,
          bookingDate: true,
          totalAmount: true,
        },
      },
      customerSupportTickets: {
        columns: {
          ticketId: true,
          status: true,
          subject: true,
          description: true,
        },
      },
    },
  });
  return userRelations || undefined;
};
