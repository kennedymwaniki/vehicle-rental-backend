import {
  deleteVehicleSpecService,
  createVehicleSpecService,
  getVehicleSpecById,
  getVehicleSpecsService,
  updateVehicleSpecService,
} from "./vehicleSpecsService";

import { type Context } from "hono";

export const getVehicleSpecs = async (c: Context) => {
  const data = await getVehicleSpecsService();
  return c.json(data);
};

export const getVehicleSpec = async (c: Context) => {
  const id = parseInt(c.req.param("id"));
  console.log(id);
  const spec = await getVehicleSpecById(id);
  if (!spec) {
    return c.json({ error: "Vehicle specification not found" }, 404);
  }
  return c.json(spec, 200);
};

export const createVehicleSpec = async (c: Context) => {
  try {
    const spec = await c.req.json();
    console.log(spec);
    const createdSpec = await createVehicleSpecService(spec);
    if (!createdSpec) {
      return c.text("No vehicle specification created");
    }
    return c.json({ msg: createdSpec }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

export const updateVehicleSpec = async (c: Context) => {
  const id = parseInt(c.req.param("id"));
  if (isNaN(id)) return c.text("Invalid ID", 400);

  const spec = await c.req.json();
  try {
    const searchedSpec = await getVehicleSpecById(id);
    if (searchedSpec == undefined)
      return c.text("Vehicle specification not found", 404);

    const res = await updateVehicleSpecService(id, spec);
    if (!res) return c.text("Vehicle specification not updated", 404);

    return c.json({ msg: res }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

export const deleteVehicleSpec = async (c: Context) => {
  try {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const spec = await getVehicleSpecById(id);
    if (spec === undefined)
      return c.text("Vehicle specification not found", 404);

    const res = await deleteVehicleSpecService(id);
    if (res === undefined)
      return c.text("Vehicle specification not deleted", 404);

    return c.json({ msg: res }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};
