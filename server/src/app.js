import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import menuRoutes from "./routes/menu.js";
import orderRoutes from "./routes/orders.js";

// The Express app is created here (not in index.js) so it can be tested
// without starting a real server or connecting to a database.
const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);

// Unknown route -> 404 JSON
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Any error thrown in a route ends up here
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong on the server" });
});

export default app;
