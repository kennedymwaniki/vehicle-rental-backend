import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TIVehicle, TSVehicle, VehiclesTable } from "../drizzle/schema";

export const getVehiclesService = async () => {
  const vehicles = await db.query.VehiclesTable.findMany({
    columns: {
      vehicleId: true,
      vehicleSpecsId: true,
      availability: true,
      rentalRate: true,
    },
  });
  return vehicles;
};

export const getVehicleById = async (
  id: number
): Promise<TSVehicle | undefined> => {
  const vehicle = await db.query.VehiclesTable.findFirst({
    where: eq(VehiclesTable.vehicleId, id),
  });
  return vehicle;
};

export const createVehicleService = async (vehicle: TIVehicle) => {
  await db.insert(VehiclesTable).values(vehicle);
  return vehicle;
};

export const updateVehicleService = async (id: number, vehicle: TIVehicle) => {
  await db
    .update(VehiclesTable)
    .set(vehicle)
    .where(eq(VehiclesTable.vehicleId, id));
  return vehicle;
};

export const deleteVehicleService = async (id: number) => {
  await db.delete(VehiclesTable).where(eq(VehiclesTable.vehicleId, id));
};

export const getVehicleSpecificationsById = async (vehicleId: number) => {
  const vehicleSpecifications = await db.query.VehiclesTable.findFirst({
    where: eq(VehiclesTable.vehicleId, vehicleId),
    columns: {
      vehicleId: true,
      vehicleSpecsId: true,
      rentalRate: true,
      availability: true,
      createdAt: true,
      updatedAt: true,
    },
    with: {
      vehicleSpec: {
        columns: {
          manufacturer: true,
          model: true,
          year: true,
          fuelType: true,
          engineCapacity: true,
          transmission: true,
          seatingCapacity: true,
          color: true,
          features: true,
        },
      },
    },
  });

  return vehicleSpecifications;
};
