import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { userRouter } from "./users/userRouter";
import { bookingRouter } from "./bookings/bookingsRouter";
import { fleetRouter } from "./fleet/fleetRouter";
import { locationRouter } from "./locations/locationRouter";
import { paymentsRouter } from "./payments/paymentsRouter";
import { vehicleRouter } from "./vehicles/vehicleRouter";
import { vehicleSpecsRouter } from "./vehiclespecs/vehicleSpecsRouter";
import { customerSupportRouter } from "./customerSupport/customerSupportRouter";
import { cors } from "hono/cors";
import { authRouter } from "./auth/authRouter";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.use(
  cors({
    origin: "*", // specify your frontend URL
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.route("/api", userRouter);
app.route("/api", bookingRouter);
app.route("/api", fleetRouter);
app.route("/api", locationRouter);
app.route("/api", paymentsRouter);
app.route("/api", vehicleRouter);
app.route("/api", vehicleSpecsRouter);
app.route("/api", customerSupportRouter);
app.route("/api/auth", authRouter);

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
