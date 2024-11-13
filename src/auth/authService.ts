import bcrypt from "bcrypt";
import { db } from "../drizzle/db";
import {
  TIUser,
  TIAuthUsers,
  TSAuthUsers,
  AuthUsersTable,
  UsersTable,

  
} from "../drizzle/schema";
import { sql } from "drizzle-orm";

export const createAuthUserService = async (user: any): Promise<TIUser> => {
  try {
    console.log("AuthService:", user);
    // Insert user into `UsersTable` table

    // Check if user already exists by email
    const existingUser = await db.query.UsersTable.findFirst({
      where: sql`${UsersTable.email} = ${user.email}`,
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }
    //hash password before inserting
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;

    const createdUser = await db
      .insert(UsersTable)
      .values({
        fullName: user.fullName,
        email: user.email,
        contactPhone: user.contactPhone,
        password: user.password,
        address: user.address,
        role: user.role || "user",
      })
      .returning();
    console.log("Authservices:", createdUser);

    // Extract the created user ID
    const userId = createdUser[0].userId;

    await db.insert(AuthUsersTable).values({
      userId,
      password: user.password,
      role: user.role || "user",
    });

    return createdUser[0]; // Return the created user
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("User creation failed");
  }
};

//login service
export const logInAuthService = async (user: TSAuthUsers) => {
  try {
    const { email } = user;
    console.log(user);

    const authUser = await db.query.UsersTable.findFirst({
      columns: {
        userId: true,
        role: true,
        fullName: true,
        email: true,
        password: true,
      },
      where: sql`${UsersTable.email} = ${email}`,
    });

    if (!authUser) {
      throw new Error("User not found");
    }

    return authUser;
  } catch (error) {
    console.error("Error logging in:", error);
    throw new Error("Login failed");
  }
};
