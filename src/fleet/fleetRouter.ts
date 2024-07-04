import { Hono } from "hono";

import {
  getVehicle,
  getFleet,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "./fleetController";

export const fleetRouter = new Hono();

fleetRouter.get("/fleet", getFleet);
fleetRouter.get("/fleet/:id", getVehicle);
fleetRouter.post("/fleet", createVehicle);
fleetRouter.put("/fleet/:id", updateVehicle);
fleetRouter.delete("/fleet/:id", deleteVehicle);