DO $$ BEGIN
 CREATE TYPE "public"."booking_status" AS ENUM('Pending', 'Completed', 'Failed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."payment_status" AS ENUM('Pending', 'Completed', 'Failed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('user', 'admin', 'both');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth_users" (
	"auth_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"email" varchar,
	"role" "role" DEFAULT 'user',
	"password" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "auth_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bookings" (
	"booking_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"vehicle_id" integer,
	"location_id" integer,
	"booking_date" timestamp DEFAULT now(),
	"return_date" timestamp DEFAULT now(),
	"total_amount" numeric NOT NULL,
	"booking_status" "booking_status" DEFAULT 'Pending' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customersupporttickets" (
	"ticket_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"subject" varchar NOT NULL,
	"description" text NOT NULL,
	"status" varchar DEFAULT 'Open',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fleetmanagement" (
	"fleet_id" serial PRIMARY KEY NOT NULL,
	"vehicle_id" integer,
	"acquisition_date" date NOT NULL,
	"depreciation_rate" numeric,
	"current_value" numeric,
	"maintenance_cost" numeric,
	"status" varchar DEFAULT 'Active',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "locations" (
	"location_id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"address" text,
	"contact_phone" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payments" (
	"payment_id" serial PRIMARY KEY NOT NULL,
	"booking_id" integer,
	"amount" integer NOT NULL,
	"payment_status" "payment_status" DEFAULT 'Pending' NOT NULL,
	"payment_date" timestamp DEFAULT now(),
	"payment_method" varchar,
	"transaction_id" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar NOT NULL,
	"imageUrl" text,
	"email" varchar NOT NULL,
	"password" varchar,
	"contact_phone" varchar,
	"address" text,
	"role" "role" DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vehiclespecifications" (
	"vehicleSpec_id" serial PRIMARY KEY NOT NULL,
	"manufacturer" varchar NOT NULL,
	"model" varchar NOT NULL,
	"year" integer NOT NULL,
	"fuel_type" varchar,
	"engine_capacity" varchar,
	"transmission" varchar,
	"seating_capacity" integer,
	"color" varchar,
	"features" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vehicles" (
	"vehicle_id" serial PRIMARY KEY NOT NULL,
	"imageUrl" text,
	"vehicle_specId" integer,
	"rental_rate" numeric NOT NULL,
	"availability" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth_users" ADD CONSTRAINT "auth_users_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_vehicle_id_vehicles_vehicle_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("vehicle_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_location_id_locations_location_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("location_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customersupporttickets" ADD CONSTRAINT "customersupporttickets_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fleetmanagement" ADD CONSTRAINT "fleetmanagement_vehicle_id_vehicles_vehicle_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("vehicle_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payments" ADD CONSTRAINT "payments_booking_id_bookings_booking_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("booking_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_vehicle_specId_vehiclespecifications_vehicleSpec_id_fk" FOREIGN KEY ("vehicle_specId") REFERENCES "public"."vehiclespecifications"("vehicleSpec_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
