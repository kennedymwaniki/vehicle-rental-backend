import { Hono } from "hono";

import {
  getLocation,
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} from "./locationController";

export const locationRouter = new Hono();

locationRouter.get("/locations", getLocations);
locationRouter.get("/locations/:id", getLocation);
locationRouter.post("/locations", createLocation);
locationRouter.put("/locations/:id", updateLocation);
locationRouter.delete("/locations/:id", deleteLocation);