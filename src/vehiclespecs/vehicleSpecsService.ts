import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import {
  TIVehicleSpecification,
  TSVehicleSpecification,
  VehicleSpecificationsTable,
} from "../drizzle/schema";

export const getVehicleSpecsService = async () => {
  const specs = await db.query.VehicleSpecificationsTable.findMany();
  return specs;
};

export const getVehicleSpecById = async (
  id: number
): Promise<TSVehicleSpecification | undefined> => {
  const spec = await db.query.VehicleSpecificationsTable.findFirst({
    where: eq(VehicleSpecificationsTable.vehicleSpecId, id),
  });
  return spec;
};

export const createVehicleSpecService = async (
  spec: TIVehicleSpecification
) => {
  await db.insert(VehicleSpecificationsTable).values(spec);
  return spec;
};

export const updateVehicleSpecService = async (
  id: number,
  spec: TIVehicleSpecification
) => {
  await db
    .update(VehicleSpecificationsTable)
    .set(spec)
    .where(eq(VehicleSpecificationsTable.vehicleSpecId, id));
  return spec;
};

export const deleteVehicleSpecService = async (id: number) => {
  await db
    .delete(VehicleSpecificationsTable)
    .where(eq(VehicleSpecificationsTable.vehicleSpecId, id));
};
