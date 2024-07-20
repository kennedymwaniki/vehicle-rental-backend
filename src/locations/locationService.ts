import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TILocation, TSLocation, LocationsTable } from "../drizzle/schema";

export const getLocationsService = async () => {
  const locations = await db.query.LocationsTable.findMany();
  return locations;
};

export const getLocationById = async (
  id: number
): Promise<TSLocation | undefined> => {
  const location = await db.query.LocationsTable.findFirst({
    where: eq(LocationsTable.locationId, id),
  });
  return location;
};

export const createLocationService = async (location: TILocation) => {
  await db.insert(LocationsTable).values(location);
  return location;
};

export const updateLocationService = async (
  id: number,
  location: TILocation
) => {
  await db
    .update(LocationsTable)
    .set(location)
    .where(eq(LocationsTable.locationId, id));
  return location;
};

export const deleteLocationService = async (id: number) => {
  await db.delete(LocationsTable).where(eq(LocationsTable.locationId, id));
  return "Location successfully deleted";
};
