ALTER TABLE "bookings" ALTER COLUMN "booking_date" SET DATA TYPE date;--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "booking_date" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "return_date" SET DATA TYPE date;--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "return_date" DROP DEFAULT;