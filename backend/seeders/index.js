import "dotenv/config";
import bcrypt from "bcrypt";
import { sequelize, User, Warehouse, Location, Category, Product } from "../models/index.js";

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected for seeding");

    // Sync all models (force in dev for clean seed)
    await sequelize.sync({ force: true });
    console.log("Tables created");

    // ── Admin user ────────────────────────────────────────────────────────────
    const hashedPw = await bcrypt.hash("admin123", 12);
    const admin = await User.create({
      name: "Admin User",
      email: "admin@inventory.local",
      password: hashedPw,
      role: "admin",
    });
    console.log("Admin user created:", admin.email);

    // ── Staff user ────────────────────────────────────────────────────────────
    const staffPw = await bcrypt.hash("staff123", 12);
    const staff = await User.create({
      name: "Staff User",
      email: "staff@inventory.local",
      password: staffPw,
      role: "warehouse_staff",
    });
    console.log("Staff user created:", staff.email);

    // ── Manager user ──────────────────────────────────────────────────────────
    const mgrPw = await bcrypt.hash("manager123", 12);
    const manager = await User.create({
      name: "Manager User",
      email: "manager@inventory.local",
      password: mgrPw,
      role: "inventory_manager",
    });
    console.log("Manager user created:", manager.email);

    // ── Warehouses ────────────────────────────────────────────────────────────
    const wh1 = await Warehouse.create({ name: "Main Warehouse", code: "WH-MAIN", address: "123 Industry Lane" });
    const wh2 = await Warehouse.create({ name: "Annex Warehouse", code: "WH-ANNEX", address: "456 Industrial Rd" });
    console.log("Warehouses created");

    // ── Locations ─────────────────────────────────────────────────────────────
    const loc1 = await Location.create({ warehouseId: wh1.id, name: "Rack A1", code: "A1", type: "internal" });
    const loc2 = await Location.create({ warehouseId: wh1.id, name: "Rack A2", code: "A2", type: "internal" });
    const loc3 = await Location.create({ warehouseId: wh2.id, name: "Shelf B1", code: "B1", type: "internal" });
    console.log("Locations created");

    // ── Categories ────────────────────────────────────────────────────────────
    const catElec = await Category.create({ name: "Electronics" });
    const catFurn = await Category.create({ name: "Furniture" });
    const catMisc = await Category.create({ name: "Miscellaneous" });
    console.log("Categories created");

    // ── Products ──────────────────────────────────────────────────────────────
    await Product.bulkCreate([
      { name: "Laptop Lenovo T14",    sku: "ELEC-001", categoryId: catElec.id, unitOfMeasure: "unit", reorderPoint: 5 },
      { name: "USB-C Dock",           sku: "ELEC-002", categoryId: catElec.id, unitOfMeasure: "unit", reorderPoint: 10 },
      { name: "Standing Desk",        sku: "FURN-001", categoryId: catFurn.id, unitOfMeasure: "unit", reorderPoint: 3 },
      { name: "Ergonomic Chair",      sku: "FURN-002", categoryId: catFurn.id, unitOfMeasure: "unit", reorderPoint: 5 },
      { name: "Whiteboard Markers",   sku: "MISC-001", categoryId: catMisc.id, unitOfMeasure: "box",  reorderPoint: 20 },
    ]);
    console.log("Products created");

    console.log("\n🌱  Seeding complete!\n");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
};

seed();
