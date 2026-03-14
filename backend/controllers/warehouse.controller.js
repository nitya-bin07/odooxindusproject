import { Warehouse, Location } from "../models/index.js";
import { sendSuccess, sendError } from "../utils/response.js";

// GET /api/warehouses
export const getAll = async (req, res) => {
  try {
    const warehouses = await Warehouse.findAll({
      include: [{ model: Location, as: "locations" }],
      order: [["name", "ASC"]],
    });
    return sendSuccess(res, { warehouses });
  } catch (err) {
    console.error(err);
    return sendError(res, "Could not fetch warehouses", 500);
  }
};

// GET /api/warehouses/:id
export const getById = async (req, res) => {
  try {
    const warehouse = await Warehouse.findByPk(req.params.id, {
      include: [{ model: Location, as: "locations" }],
    });
    if (!warehouse) return sendError(res, "Warehouse not found", 404);
    return sendSuccess(res, { warehouse });
  } catch (err) {
    console.error(err);
    return sendError(res, "Could not fetch warehouse", 500);
  }
};

// POST /api/warehouses
export const create = async (req, res) => {
  try {
    const { name, code, address } = req.body;
    const existing = await Warehouse.findOne({ where: { code } });
    if (existing) return sendError(res, "Warehouse code already exists", 409);

    const warehouse = await Warehouse.create({ name, code, address });
    return sendSuccess(res, { warehouse }, "Warehouse created", 201);
  } catch (err) {
    console.error(err);
    return sendError(res, "Could not create warehouse", 500);
  }
};

// PATCH /api/warehouses/:id
export const update = async (req, res) => {
  try {
    const warehouse = await Warehouse.findByPk(req.params.id);
    if (!warehouse) return sendError(res, "Warehouse not found", 404);

    const { name, address, isActive } = req.body;
    await warehouse.update({ name, address, isActive });
    return sendSuccess(res, { warehouse });
  } catch (err) {
    console.error(err);
    return sendError(res, "Could not update warehouse", 500);
  }
};

// DELETE /api/warehouses/:id  (soft)
export const remove = async (req, res) => {
  try {
    const warehouse = await Warehouse.findByPk(req.params.id);
    if (!warehouse) return sendError(res, "Warehouse not found", 404);
    await warehouse.destroy();
    return sendSuccess(res, {}, "Warehouse deleted");
  } catch (err) {
    console.error(err);
    return sendError(res, "Could not delete warehouse", 500);
  }
};
