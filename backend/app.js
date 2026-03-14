import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes       from "./routes/auth.routes.js";
import userRoutes       from "./routes/user.routes.js";
import warehouseRoutes  from "./routes/warehouse.routes.js";
import locationRoutes   from "./routes/location.routes.js";
import categoryRoutes   from "./routes/category.routes.js";
import productRoutes    from "./routes/product.routes.js";
import receiptRoutes    from "./routes/receipt.routes.js";
import deliveryRoutes   from "./routes/delivery.routes.js";
import transferRoutes   from "./routes/transfer.routes.js";
import adjustmentRoutes from "./routes/adjustment.routes.js";
import ledgerRoutes     from "./routes/ledger.routes.js";
import dashboardRoutes  from "./routes/dashboard.routes.js";

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple request logger (dev)
if (process.env.NODE_ENV !== "production") {
  app.use((req, _res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
  });
}

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth",        authRoutes);
app.use("/api/users",       userRoutes);
app.use("/api/warehouses",  warehouseRoutes);
app.use("/api/locations",   locationRoutes);
app.use("/api/categories",  categoryRoutes);
app.use("/api/products",    productRoutes);
app.use("/api/receipts",    receiptRoutes);
app.use("/api/deliveries",  deliveryRoutes);
app.use("/api/transfers",   transferRoutes);
app.use("/api/adjustments", adjustmentRoutes);
app.use("/api/ledger",      ledgerRoutes);
app.use("/api/dashboard",   dashboardRoutes);

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) =>
  res.json({ status: "ok", timestamp: new Date().toISOString() })
);

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

export default app;
