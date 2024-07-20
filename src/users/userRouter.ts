import { Hono } from "hono";

import {
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserBookings,
  getUserSupportTickets,
  getUserRelations,
} from "./userController";
import { adminRoleAuth, bothRoleAuth } from "../middleware/authBearer";
import { zValidator } from "@hono/zod-validator";
import { UserSchema } from "../validator";
export const userRouter = new Hono();
// userRouter.use("*");

// get users route
userRouter.get("/users", getUsers);
userRouter.get("/users/:id", getUser);
userRouter.post("/users", createUser);
// userRouter.post("/users/register", createUser);

// create a user

//update a user
userRouter.put(
  "/users/:id",

  updateUser
);
// delete user
userRouter.delete("/users/:id", deleteUser);

userRouter.get("/users/bookings/:id", getUserBookings);
userRouter.get("/users/tickets/:id", getUserSupportTickets);
userRouter.get("/users/relations/:id", getUserRelations);
