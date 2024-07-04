import { zValidator } from "@hono/zod-validator";
import { Context, Hono } from "hono";
import { loginUser, registerUser } from "./authController";
import { registerUserSchema, loginUserSchema } from "../validator";

export const authRouter = new Hono();

//we re going to register a new user and the z validator is going to verify that the data we pass in is correct
authRouter.post(
  "/register",
  zValidator("json", registerUserSchema, (result, c) => {
    if (!result.success) {
      return c.json(result.error, 400);
    }
  }),
  registerUser
);


authRouter.post(
  "/login",
  zValidator("json", loginUserSchema, (result, c) => {
    if (!result.success) {
      return c.json(result.error, 400);
    }
  }),
  loginUser
);
 