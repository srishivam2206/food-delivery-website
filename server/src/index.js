import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./db.js";
import MenuItem from "./models/MenuItem.js";
import menuItems from "./seedData.js";

const PORT = process.env.PORT || 5000;

async function start() {
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is missing. Copy .env.example to .env and set it.");
    process.exit(1);
  }
  await connectDB();

  // First run on an empty database: add the sample menu automatically,
  // so a fresh deployment works without running "npm run seed" by hand.
  if ((await MenuItem.estimatedDocumentCount()) === 0) {
    await MenuItem.insertMany(menuItems);
    console.log(`Added ${menuItems.length} sample dishes to the empty menu`);
  }

  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
}

start();
