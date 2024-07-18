import { Hono } from "hono";

import {
  getVehicle,
  getFleet,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "./fleetController";
import { adminRoleAuth, bothRoleAuth } from "../middleware/authBearer";
import { zValidator } from "@hono/zod-validator";
import { FleetManagementSchema } from "../validator";

export const fleetRouter = new Hono();

fleetRouter.get("/fleet", getFleet);
fleetRouter.get("/fleet/:id", getVehicle);
fleetRouter.post(
  "/fleet",

  createVehicle
);
fleetRouter.put(
  "/fleet/:id",

  updateVehicle
);
fleetRouter.delete("/fleet/:id", deleteVehicle);
