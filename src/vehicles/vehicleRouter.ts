import { Hono } from "hono";

import {
  getVehicle,
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getVehicleSpecifications,
} from "./vehicleController";
import { bothRoleAuth } from "../middleware/authBearer";

export const vehicleRouter = new Hono();

vehicleRouter.get("/vehicles", getVehicles);
vehicleRouter.get("/vehicles/:id", getVehicle);
vehicleRouter.post("/vehicles", createVehicle);
vehicleRouter.put("/vehicles/:id", updateVehicle);
vehicleRouter.delete("/vehicles/:id", deleteVehicle);
vehicleRouter.get("vehicle/specification/:id", getVehicleSpecifications);
