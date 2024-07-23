import {
  pgTable,
  serial,
  varchar,
  integer,
  decimal,
  boolean,
  timestamp,
  text,
  pgEnum,
  date,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enum for user roles
export const roleEnum = pgEnum("role", ["user", "admin", "both"]);
export const UsersTable = pgTable("users", {
  userId: serial("user_id").primaryKey(),
  fullName: varchar("full_name").notNull(),
  image: text("imageUrl"),
  email: varchar("email").unique().notNull(),
  password: varchar("password"),
  contactPhone: varchar("contact_phone"),
  address: text("address"),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const VehicleSpecificationsTable = pgTable("vehiclespecifications", {
  vehicleSpecId: serial("vehicleSpec_id").primaryKey(),
  manufacturer: varchar("manufacturer").notNull(),
  model: varchar("model").notNull(),
  year: integer("year").notNull(),
  fuelType: varchar("fuel_type"),
  engineCapacity: varchar("engine_capacity"),
  transmission: varchar("transmission"),
  seatingCapacity: integer("seating_capacity"),
  color: varchar("color"),
  features: text("features"),
});

export const VehiclesTable = pgTable("vehicles", {
  vehicleId: serial("vehicle_id").primaryKey(),
  image_url: text("imageUrl"),
  vehicleSpecsId: integer("vehicle_specId").references(
    () => VehicleSpecificationsTable.vehicleSpecId,
    { onDelete: "cascade" }
  ),
  rentalRate: decimal("rental_rate").notNull(),
  availability: boolean("availability").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const LocationsTable = pgTable("locations", {
  locationId: serial("location_id").primaryKey(),
  name: varchar("name").notNull(),
  address: text("address"),
  contactPhone: varchar("contact_phone"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// payment Enum (['Pending', 'Completed', 'Failed']
export const bookingStatusEnum = pgEnum("booking_status", [
  "Pending",
  "Completed",
  "Failed",
]);

export const BookingsTable = pgTable("bookings", {
  bookingId: serial("booking_id").primaryKey(),
  userId: integer("user_id").references(() => UsersTable.userId, {
    onDelete: "cascade",
  }),
  vehicleId: integer("vehicle_id").references(() => VehiclesTable.vehicleId, {
    onDelete: "cascade",
  }),
  locationId: integer("location_id").references(
    () => LocationsTable.locationId,
    { onDelete: "cascade" }
  ),
  bookingDate: date("booking_date", { mode: "string" }),
  returnDate: date("return_date", { mode: "string" }),
  totalAmount: decimal("total_amount").notNull(),
  bookingStatus: bookingStatusEnum("booking_status")
    .default("Pending")
    .notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});

// payment Enum (['Pending', 'Completed', 'Failed']
export const paymentStatusEnum = pgEnum("payment_status", [
  "Pending",
  "Completed",
  "Failed",
]);

export const PaymentsTable = pgTable("payments", {
  paymentId: serial("payment_id").primaryKey(),
  bookingId: integer("booking_id").references(() => BookingsTable.bookingId, {
    onDelete: "cascade",
  }),
  amount: integer("amount").notNull(),
  paymentStatus: paymentStatusEnum("payment_status")
    .default("Pending")
    .notNull(),
  paymentDate: timestamp("payment_date", { mode: "string" }).defaultNow(),
  paymentMethod: varchar("payment_method"),
  transactionId: varchar("transaction_id"),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at",{ mode: "string" }).defaultNow(),
});

export const AuthUsersTable = pgTable("auth_users", {
  authId: serial("auth_id").primaryKey(),
  userId: integer("user_id").references(() => UsersTable.userId, {
    onDelete: "cascade",
  }),
  email: varchar("email").unique(),
  role: roleEnum("role").default("user"),

  password: varchar("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const CustomerSupportTicketsTable = pgTable("customersupporttickets", {
  ticketId: serial("ticket_id").primaryKey(),
  userId: integer("user_id").references(() => UsersTable.userId, {
    onDelete: "cascade",
  }),
  subject: varchar("subject").notNull(),
  description: text("description").notNull(),
  status: varchar("status").default("Open"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const FleetManagementTable = pgTable("fleetmanagement", {
  fleetId: serial("fleet_id").primaryKey(),
  vehicleId: integer("vehicle_id").references(() => VehiclesTable.vehicleId, {
    onDelete: "cascade",
  }),
  acquisitionDate: date("acquisition_date").notNull(),
  depreciationRate: decimal("depreciation_rate"),
  currentValue: decimal("current_value"),
  maintenanceCost: decimal("maintenance_cost"),
  status: varchar("status").default("Active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

//relationships

// Authentication relations (one-to-one with Users)
export const authenticationRelations = relations(AuthUsersTable, ({ one }) => ({
  user: one(UsersTable, {
    fields: [AuthUsersTable.userId],
    references: [UsersTable.userId],
  }),
}));

// Vehicles relations (many-to-one with VehicleSpecifications)
export const vehicleRelations = relations(VehiclesTable, ({ one }) => ({
  vehicleSpec: one(VehicleSpecificationsTable, {
    fields: [VehiclesTable.vehicleSpecsId],
    references: [VehicleSpecificationsTable.vehicleSpecId],
  }),
}));

// Bookings relations (many-to-one with Users, Vehicles, and Locations, one-to-many with Payments)
export const bookingRelations = relations(BookingsTable, ({ one, many }) => ({
  user: one(UsersTable, {
    fields: [BookingsTable.userId],
    references: [UsersTable.userId],
  }),
  vehicle: one(VehiclesTable, {
    fields: [BookingsTable.vehicleId],
    references: [VehiclesTable.vehicleId],
  }),
  location: one(LocationsTable, {
    fields: [BookingsTable.locationId],
    references: [LocationsTable.locationId],
  }),
  payments: many(PaymentsTable),
}));

// Payments relations (many-to-one with Bookings)
export const paymentRelations = relations(PaymentsTable, ({ one }) => ({
  booking: one(BookingsTable, {
    fields: [PaymentsTable.bookingId],
    references: [BookingsTable.bookingId],
  }),
}));

// CustomerSupportTickets relations (many-to-one with Users)
export const customerSupportTicketRelations = relations(
  CustomerSupportTicketsTable,
  ({ one }) => ({
    user: one(UsersTable, {
      fields: [CustomerSupportTicketsTable.userId],
      references: [UsersTable.userId],
    }),
  })
);

// FleetManagement relations (one-to-one with Vehicles)
export const fleetManagementRelations = relations(
  FleetManagementTable,
  ({ one }) => ({
    vehicle: one(VehiclesTable, {
      fields: [FleetManagementTable.vehicleId],
      references: [VehiclesTable.vehicleId],
    }),
  })
);

// User relations (one-to-many with Bookings and CustomerSupportTickets, one-to-one with Authentication)
export const userRelations = relations(UsersTable, ({ one, many }) => ({
  bookings: many(BookingsTable),
  customerSupportTickets: many(CustomerSupportTicketsTable),
  authentication: many(AuthUsersTable),
}));

// VehicleSpecifications relations (one-to-many with Vehicles)
export const vehicleSpecificationsRelations = relations(
  VehicleSpecificationsTable,
  ({ many }) => ({
    vehicles: many(VehiclesTable),
  })
);

//end of relatiosnhips

//types
// User types
export type TIUser = typeof UsersTable.$inferInsert;
export type TSUser = typeof UsersTable.$inferSelect;

// Vehicle Specifications types
export type TIVehicleSpecification =
  typeof VehicleSpecificationsTable.$inferInsert;
export type TSVehicleSpecification =
  typeof VehicleSpecificationsTable.$inferSelect;

// Vehicles types
export type TIVehicle = typeof VehiclesTable.$inferInsert;
export type TSVehicle = typeof VehiclesTable.$inferSelect;

// Locations types
export type TILocation = typeof LocationsTable.$inferInsert;
export type TSLocation = typeof LocationsTable.$inferSelect;

// Bookings types
export type TIBooking = typeof BookingsTable.$inferInsert;
export type TSBooking = typeof BookingsTable.$inferSelect;

// Payments types
export type TIPayment = typeof PaymentsTable.$inferInsert;
export type TSPayment = typeof PaymentsTable.$inferSelect;

// Authentication types
export type TIAuthUsers = typeof AuthUsersTable.$inferInsert;
export type TSAuthUsers = typeof AuthUsersTable.$inferSelect;

// Customer Support Tickets types
export type TICustomerSupportTicket =
  typeof CustomerSupportTicketsTable.$inferInsert;
export type TSCustomerSupportTicket =
  typeof CustomerSupportTicketsTable.$inferSelect;

// Fleet Management types
export type TIFleetManagement = typeof FleetManagementTable.$inferInsert;
export type TSFleetManagement = typeof FleetManagementTable.$inferSelect;
