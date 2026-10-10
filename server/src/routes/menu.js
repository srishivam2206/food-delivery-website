import { Router } from "express";
import MenuItem from "../models/MenuItem.js";

const router = Router();

// Escapes characters like "." or "(" so user text is searched literally
function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// GET /api/menu?q=pizza&category=Main
router.get("/", async (req, res, next) => {
  try {
    const { q, category } = req.query;
    const filter = {};

    if (typeof q === "string" && q.trim()) {
      filter.name = { $regex: escapeRegex(q.trim()), $options: "i" };
    }
    if (typeof category === "string" && category && category !== "All") {
      filter.category = category;
    }

    const items = await MenuItem.find(filter).sort({ category: 1, name: 1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

// GET /api/menu/categories
router.get("/categories", async (req, res, next) => {
  try {
    const categories = await MenuItem.distinct("category");
    res.json(["All", ...categories.sort()]);
  } catch (err) {
    next(err);
  }
});

export default router;
