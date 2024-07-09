import { Hono } from "hono";

import {
  getVehicleSpec,
  getVehicleSpecs,
  createVehicleSpec,
  updateVehicleSpec,
  deleteVehicleSpec,
} from "./vehicleSpecsController";
import { zValidator } from "@hono/zod-validator";
import { VehicleSpecificationSchema } from "../validator";

export const vehicleSpecsRouter = new Hono();

vehicleSpecsRouter.get(
  "/vehicleSpecs",

  getVehicleSpecs
);
vehicleSpecsRouter.get("/vehicleSpecs/:id", getVehicleSpec);
vehicleSpecsRouter.post(
  "/vehicleSpecs",
  zValidator("json", VehicleSpecificationSchema, (result, c) => {
    if (!result.success) {
      return c.json(result.error, 400);
    }
  }),
  createVehicleSpec
);
vehicleSpecsRouter.put("/vehicleSpecs/:id", updateVehicleSpec);
vehicleSpecsRouter.delete("/vehicleSpecs/:id", deleteVehicleSpec);
