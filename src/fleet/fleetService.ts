import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import {
  TIFleetManagement,
  FleetManagementTable,
  TSFleetManagement,
} from "../drizzle/schema";

export const getFleetService = async () => {
  const fleet = await db.query.FleetManagementTable.findMany({
    columns: {
      fleetId: true,
      vehicleId: true,
      depreciationRate: true,
      currentValue: true,
      acquisitionDate: true,
      maintenanceCost: true,
      status: true,
    },
  });
  return fleet;
};

export const getVehicleById = async (
  id: number
): Promise<TSFleetManagement | undefined> => {
  const vehicle = await db.query.FleetManagementTable.findFirst({
    where: eq(FleetManagementTable.vehicleId, id),
  });
  return vehicle;
};

export const createVehicleService = async (vehicle: TIFleetManagement) => {
  await db.insert(FleetManagementTable).values(vehicle);
  return vehicle;
};

export const updateVehicleService = async (
  id: number,
  vehicle: TIFleetManagement
) => {
  await db
    .update(FleetManagementTable)
    .set(vehicle)
    .where(eq(FleetManagementTable.vehicleId, id));
  return vehicle;
};

export const deleteVehicleService = async (id: number) => {
  await db
    .delete(FleetManagementTable)
    .where(eq(FleetManagementTable.vehicleId, id));
};
