import { Location, Warehouse } from "../models/index.js";
import { sendSuccess, sendError } from "../utils/response.js";

// GET /api/locations?warehouseId=
export const getAll = async (req, res) => {
  try {
    const where = {};
    if (req.query.warehouseId) where.warehouseId = req.query.warehouseId;
    if (req.query.type)        where.type = req.query.type;

    const locations = await Location.findAll({
      where,
      include: [{ model: Warehouse, as: "warehouse", attributes: ["id", "name", "code"] }],
      order: [["name", "ASC"]],
    });
    return sendSuccess(res, { locations });
  } catch (err) {
    console.error(err);
    return sendError(res, "Could not fetch locations", 500);
  }
};

// GET /api/locations/:id
export const getById = async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.id, {
      include: [{ model: Warehouse, as: "warehouse" }],
    });
    if (!location) return sendError(res, "Location not found", 404);
    return sendSuccess(res, { location });
  } catch (err) {
    console.error(err);
    return sendError(res, "Could not fetch location", 500);
  }
};

// POST /api/locations
export const create = async (req, res) => {
  try {
    const { warehouseId, name, code, type } = req.body;

    const warehouse = await Warehouse.findByPk(warehouseId);
    if (!warehouse) return sendError(res, "Warehouse not found", 404);

    const existing = await Location.findOne({ where: { warehouseId, code } });
    if (existing) return sendError(res, "Location code already exists in this warehouse", 409);

    const location = await Location.create({ warehouseId, name, code, type });
    return sendSuccess(res, { location }, "Location created", 201);
  } catch (err) {
    console.error(err);
    return sendError(res, "Could not create location", 500);
  }
};

// PATCH /api/locations/:id
export const update = async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.id);
    if (!location) return sendError(res, "Location not found", 404);

    const { name, type, isActive } = req.body;
    await location.update({ name, type, isActive });
    return sendSuccess(res, { location });
  } catch (err) {
    console.error(err);
    return sendError(res, "Could not update location", 500);
  }
};

// DELETE /api/locations/:id
export const remove = async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.id);
    if (!location) return sendError(res, "Location not found", 404);
    await location.destroy();
    return sendSuccess(res, {}, "Location deleted");
  } catch (err) {
    console.error(err);
    return sendError(res, "Could not delete location", 500);
  }
};
