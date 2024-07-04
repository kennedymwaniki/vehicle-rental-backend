import { Hono } from "hono";

import {
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "./userController";
import { adminRoleAuth } from "../middleware/authBearer";

export const userRouter = new Hono();
// userRouter.use("*");

// get users route
userRouter.get("/users", getUsers);
userRouter.get("/users/:id", getUser);
userRouter.post("/users", createUser);
// userRouter.post("/users/register", createUser);

// create a user

//update a user
userRouter.put("/users/:id", updateUser);
// delete user
userRouter.delete("/users/:id", deleteUser);


