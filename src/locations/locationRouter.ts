import { Hono } from "hono";

import {
  getLocation,
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} from "./locationController";
import { zValidator } from "@hono/zod-validator";
import { LocationSchema } from "../validator";

export const locationRouter = new Hono();

locationRouter.get("/locations", getLocations);
locationRouter.get("/locations/:id", getLocation);
locationRouter.post(
  "/locations",
  zValidator("json", LocationSchema, (result, c) => {
    if (!result.success) {
      return c.json(result.error, 400);
    }
  }),
  createLocation
);
locationRouter.put(
  "/locations/:id",
  zValidator("json", LocationSchema, (result, c) => {
    if (!result.success) {
      return c.json(result.error, 400);
    }
  }),
  updateLocation
);
locationRouter.delete("/locations/:id", deleteLocation);
