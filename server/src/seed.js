import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./db.js";
import MenuItem from "./models/MenuItem.js";
import items from "./seedData.js";

async function seed() {
  await connectDB();
  await MenuItem.deleteMany({});
  await MenuItem.insertMany(items);
  console.log(`Seeded ${items.length} menu items`);
  await mongoose.disconnect();
}

seed();
