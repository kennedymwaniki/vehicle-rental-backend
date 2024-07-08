import { Hono } from "hono";

import {
  getVehicleSpec,
  getVehicleSpecs,
  createVehicleSpec,
  updateVehicleSpec,
  deleteVehicleSpec,
} from "./vehicleSpecsController";

export const vehicleSpecsRouter = new Hono();

vehicleSpecsRouter.get("/vehicleSpecs", getVehicleSpecs);
vehicleSpecsRouter.get("/vehicleSpecs/:id", getVehicleSpec);
vehicleSpecsRouter.post("/vehicleSpecs", createVehicleSpec);
vehicleSpecsRouter.put("/vehicleSpecs/:id", updateVehicleSpec);
vehicleSpecsRouter.delete("/vehicleSpecs/:id", deleteVehicleSpec);
