import { Hono } from "hono";

import {
  getVehicleSpec,
  getVehicleSpecs,
  createVehicleSpec,
  updateVehicleSpec,
  deleteVehicleSpec,
} from "./vehicleSpecsController";

export const vehicleSpecsRouter = new Hono();

vehicleSpecsRouter.get("/vehicle-specs", getVehicleSpecs);
vehicleSpecsRouter.get("/vehicle-specs/:id", getVehicleSpec);
vehicleSpecsRouter.post("/vehicle-specs", createVehicleSpec);
vehicleSpecsRouter.put("/vehicle-specs/:id", updateVehicleSpec);
vehicleSpecsRouter.delete("/vehicle-specs/:id", deleteVehicleSpec);