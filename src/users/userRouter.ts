import { Hono } from "hono";

import {
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserBookings,
  getUserSupportTickets,
} from "./userController";
import { adminRoleAuth, bothRoleAuth } from "../middleware/authBearer";
import { zValidator } from "@hono/zod-validator";
import { UserSchema } from "../validator";
export const userRouter = new Hono();
// userRouter.use("*");

// get users route
userRouter.get("/users", getUsers);
userRouter.get("/users/:id", getUser);
userRouter.post(
  "/users",
  zValidator("json", UserSchema, (result, c) => {
    if (!result.success) {
      return c.json(result.error, 400);
    }
  }),
  createUser
);
// userRouter.post("/users/register", createUser);

// create a user

//update a user
userRouter.put(
  "/users/:id",
  zValidator("json", UserSchema, (result, c) => {
    if (!result.success) {
      return c.json(result.error, 400);
    }
  }),
  updateUser
);
// delete user
userRouter.delete("/users/:id", deleteUser);

userRouter.get("/users/bookings/:id", getUserBookings);
userRouter.get("/users/tickets/:id", getUserSupportTickets);
