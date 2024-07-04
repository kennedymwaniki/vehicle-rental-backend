import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TIUser, TSUser, UsersTable } from "../drizzle/schema";

export const getUsersService = async () => {
  const users = await db.query.UsersTable.findMany({
    columns: {
      userId: true,
      fullName: true,
      email: true,
      role: true,
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
