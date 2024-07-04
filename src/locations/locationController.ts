

import {
    deleteLocationService,
    createLocationService,
    getLocationById,
    getLocationsService,
    updateLocationService,
  } from "./locationService";
  
  import { type Context } from "hono";
  
  export const getLocations = async (c: Context) => {
    const data = await getLocationsService();
    return c.json(data);
  };
  
  export const getLocation = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    console.log(id);
    const location = await getLocationById(id);
    if (!location) {
      return c.json({ error: "Location not found" }, 404);
    }
    return c.json(location, 200);
  };
  
  export const createLocation = async (c: Context) => {
    try {
      const location = await c.req.json();
      console.log(location);
      const createdLocation = await createLocationService(location);
      if (!createdLocation) {
        return c.text("No location created");
      }
      return c.json({ msg: createdLocation }, 201);
    } catch (error: any) {
      return c.json({ error: error?.message }, 400);
    }
  };
  
  export const updateLocation = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);
  
    const location = await c.req.json();
    try {
      const searchedLocation = await getLocationById(id);
      if (searchedLocation == undefined) return c.text("Location not found", 404);
  
      const res = await updateLocationService(id, location);
      if (!res) return c.text("Location not updated", 404);
  
      return c.json({ msg: res }, 201);
    } catch (error: any) {
      return c.json({ error: error?.message }, 400);
    }
  };
  
  export const deleteLocation = async (c: Context) => {
    try {
      const id = Number(c.req.param("id"));
      if (isNaN(id)) return c.text("Invalid ID", 400);
  
      const location = await getLocationById(id);
      if (location === undefined) return c.text("Location not found", 404);
  
      const res = await deleteLocationService(id);
      if (res === undefined) return c.text("Location not deleted", 404);
  
      return c.json({ msg: res }, 201);
    } catch (error: any) {
      return c.json({ error: error?.message }, 400);
    }
  };