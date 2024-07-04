import {
  deleteUserService,
  createUserService,
  getUserById,
  getUsersService,
  updateUserService,
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
  const id = parseInt(c.req.param("id"));
  if (isNaN(id)) return c.text("Invalid ID", 400);

  const user = await c.req.json();
  try {
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
