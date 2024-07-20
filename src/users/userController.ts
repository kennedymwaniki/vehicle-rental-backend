import {
  deleteUserService,
  createUserService,
  getUserById,
  getUsersService,
  updateUserService,
  getUserBookingsById,
  getAllUserRelationsById,
  getUserSupportTicketsById,
} from "./userService";

import { type Context } from "hono";

export const getUsers = async (c: Context) => {
  const data = await getUsersService();
  return c.json(data);
};

//get one user
export const getUser = async (c: Context) => {
  const id = parseInt(c.req.param("id"));
  console.log(id);
  const user = await getUserById(id);
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }
  return c.json(user, 200);
};

// create a new user
export const createUser = async (c: Context) => {
  try {
    const user = await c.req.json();
    console.log(user);
    const createdUser = await createUserService(user);
    if (!createdUser) {
      return c.text("no user created");
    }
    return c.json({ msg: createdUser }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

export const updateUser = async (c: Context) => {
  try {
    const id = parseInt(c.req.param("id"));
    console.log("controller:", id);
    if (isNaN(id)) return c.text("Invalid ID", 400);
    const user = await c.req.json();
    // search for the user
    const searchedUser = await getUserById(id);
    if (searchedUser == undefined) return c.text("User not found", 404);
    // get the data and update it
    const res = await updateUserService(id, user);
    // return a success message
    if (!res) return c.text("User not updated", 404);

    return c.json({ msg: res }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

//delete user
export const deleteUser = async (c: Context) => {
  try {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    //search for the user
    const user = await getUserById(id);
    if (user == undefined) return c.text("User not found", 404);
    //deleting the user
    const res = await deleteUserService(id);
    if (!res) return c.text("User not deleted", 404);

    return c.json({ msg: res }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

export const getUserBookings = async (c: Context) => {
  const userId = parseInt(c.req.param("id"));

  if (isNaN(userId)) {
    return c.json({ error: "Invalid user ID" }, 400);
  }

  const userBookings = await getUserBookingsById(userId);

  if (!userBookings) {
    return c.json({ error: "User not found" }, 404);
  }

  const { bookings, ...userData } = userBookings;

  return c.json({ user: userData, bookings }, 200);
};

export const getUserSupportTickets = async (c: Context) => {
  const userId = parseInt(c.req.param("id"));

  if (isNaN(userId)) {
    return c.json({ error: "Invalid user ID" }, 400);
  }

  const userSupportTickets = await getUserSupportTicketsById(userId);

  if (!userSupportTickets) {
    return c.json({ error: "User not found" }, 404);
  }

  const { customerSupportTickets, ...userData } = userSupportTickets;

  return c.json(
    { user: userData, supportTickets: customerSupportTickets },
    200
  );
};

//! all user relations
export const getUserRelations = async (c: Context) => {
  const userId = Number(c.req.param("id"));
  if (isNaN(userId)) {
    return c.json({ error: "Invalid user ID" }, 400);
  }
  const userRelations = await getAllUserRelationsById(userId);
  if (!userRelations) {
    return c.json({
      error: "We could not find such a user or their relations",
    });
  }
  const { customerSupportTickets, bookings, ...userData } = userRelations;

  return c.json({ userData, bookings, customerSupportTickets });
};
