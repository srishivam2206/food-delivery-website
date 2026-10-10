import { Router } from "express";
import MenuItem from "../models/MenuItem.js";
import Order from "../models/Order.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// All order routes need a logged-in user
router.use(requireAuth);

// POST /api/orders
// Body: { items: [{ menuItemId, quantity }], address, paymentMethod }
router.post("/", async (req, res, next) => {
  try {
    const { items, address, paymentMethod = "cod" } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }
    if (!address || !address.trim()) {
      return res.status(400).json({ message: "Delivery address is required" });
    }
    if (!["cod", "online-demo"].includes(paymentMethod)) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    for (const item of items) {
      const qty = Number(item.quantity);
      if (!item.menuItemId || !Number.isInteger(qty) || qty < 1 || qty > 20) {
        return res.status(400).json({ message: "Each item needs a quantity between 1 and 20" });
      }
    }

    // Prices come from the database, never from the browser.
    // Otherwise a user could edit the request and pay Rs. 1 for everything.
    const ids = items.map((i) => i.menuItemId);
    const menuItems = await MenuItem.find({ _id: { $in: ids } });
    const byId = new Map(menuItems.map((m) => [String(m._id), m]));

    const orderItems = [];
    let total = 0;
    for (const item of items) {
      const menuItem = byId.get(String(item.menuItemId));
      if (!menuItem) {
        return res.status(400).json({ message: "One of the items is no longer available" });
      }
      const quantity = Number(item.quantity);
      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity,
      });
      total += menuItem.price * quantity;
    }

    const order = await Order.create({
      user: req.userId,
      items: orderItems,
      total,
      address: address.trim(),
      paymentMethod,
    });

    res.status(201).json(order);
  } catch (err) {
    // A badly formatted id (not a real ObjectId) is a client mistake, not a server crash
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid item id" });
    }
    next(err);
  }
});

// GET /api/orders  (only the logged-in user's own orders)
router.get("/", async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

export default router;
