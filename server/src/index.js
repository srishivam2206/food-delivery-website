import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./db.js";

const PORT = process.env.PORT || 5000;

async function start() {
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is missing. Copy .env.example to .env and set it.");
    process.exit(1);
  }
  await connectDB();
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
}

start();
