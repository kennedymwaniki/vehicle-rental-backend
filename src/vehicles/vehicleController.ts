import {
  deleteVehicleService,
  createVehicleService,
  getVehicleById,
  getVehiclesService,
  updateVehicleService,
  getVehicleSpecificationsById
} from "./vehicleService";

import { type Context } from "hono";

export const getVehicles = async (c: Context) => {
  const data = await getVehiclesService();
  return c.json(data);
};

export const getVehicle = async (c: Context) => {
  const id = parseInt(c.req.param("id"));
  console.log(id);
  const vehicle = await getVehicleById(id);
  if (!vehicle) {
    return c.json({ error: "Vehicle not found" }, 404);
  }
  return c.json(vehicle, 200);
};

export const createVehicle = async (c: Context) => {
  try {
    const vehicle = await c.req.json();
    console.log(vehicle);
    const createdVehicle = await createVehicleService(vehicle);
    if (!createdVehicle) {
      return c.text("No vehicle created");
    }
    return c.json({ msg: createdVehicle }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

export const updateVehicle = async (c: Context) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const vehicle = await c.req.json();
    const searchedVehicle = await getVehicleById(id);
    if (searchedVehicle === undefined) return c.text("Vehicle not found", 404);

    const res = await updateVehicleService(id, vehicle);
    if (!res) return c.text("Vehicle not updated", 404);

    return c.json({ msg: res }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

export const deleteVehicle = async (c: Context) => {
  try {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const vehicle = await getVehicleById(id);
    if (vehicle === undefined) return c.text("Vehicle not found", 404);

    const res = await deleteVehicleService(id);
    if (res === undefined) return c.text("Vehicle not deleted", 404);

    return c.json({ msg: res }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

export const getVehicleSpecifications = async (c: Context) => {
  const vehicleId = parseInt(c.req.param("id"));

  if (isNaN(vehicleId)) {
    return c.json({ error: "Invalid vehicle ID" }, 400);
  }

  const vehicleSpecifications = await getVehicleSpecificationsById(vehicleId);

  if (!vehicleSpecifications) {
    return c.json({ error: "Vehicle not found" }, 404);
  }

  const { vehicleSpec, ...vehicleData } = vehicleSpecifications;

  return c.json({ vehicle: vehicleData, specifications: vehicleSpec }, 200);
};
