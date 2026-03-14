import { sequelize, Adjustment, AdjustmentLine, Product, Location, Warehouse, Stock } from "../models/index.js";
import { applyStockMovement } from "../utils/stockService.js";
import { generateRef } from "../utils/reference.js";
import { sendSuccess, sendError } from "../utils/response.js";

// GET /api/adjustments?warehouseId=&status=
export const getAll = async (req, res) => {
  try {
    const where = {};
    if (req.query.warehouseId) where.warehouseId = req.query.warehouseId;
    if (req.query.status)      where.status      = req.query.status;

    const adjustments = await Adjustment.findAll({
      where,
      include: [
        { model: Warehouse, as: "warehouse", attributes: ["id", "name"] },
        {
          model: AdjustmentLine, as: "lines",
          include: [
            { model: Product,  as: "product",  attributes: ["id", "name", "sku"] },
            { model: Location, as: "location", attributes: ["id", "name", "code"] },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    return sendSuccess(res, { adjustments });
  } catch (err) {
    console.error(err);
    return sendError(res, "Could not fetch adjustments", 500);
  }
};

// GET /api/adjustments/:id
export const getById = async (req, res) => {
  try {
    const adjustment = await Adjustment.findByPk(req.params.id, {
      include: [
        { model: Warehouse, as: "warehouse" },
        {
          model: AdjustmentLine, as: "lines",
          include: [
            { model: Product,  as: "product" },
            { model: Location, as: "location" },
          ],
        },
      ],
    });
    if (!adjustment) return sendError(res, "Adjustment not found", 404);
    return sendSuccess(res, { adjustment });
  } catch (err) {
    console.error(err);
    return sendError(res, "Could not fetch adjustment", 500);
  }
};

// POST /api/adjustments
export const create = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { warehouseId, reason, lines } = req.body;

    const warehouse = await Warehouse.findByPk(warehouseId);
    if (!warehouse) { await t.rollback(); return sendError(res, "Warehouse not found", 404); }

    const adjustment = await Adjustment.create(
      {
        reference: generateRef("ADJ"),
        warehouseId,
        reason,
        createdBy: req.user.id,
        status: "draft",
      },
      { transaction: t }
    );

    for (const line of lines) {
      const product  = await Product.findByPk(line.productId);
      const location = await Location.findByPk(line.locationId);
      if (!product)  { await t.rollback(); return sendError(res, `Product ${line.productId} not found`, 404); }
      if (!location) { await t.rollback(); return sendError(res, `Location ${line.locationId} not found`, 404); }

      // Capture current stock level as previousQty
      const stock = await Stock.findOne({
        where: { productId: line.productId, locationId: line.locationId },
      });
      const previousQty = stock ? parseFloat(stock.quantity) : 0;

      await AdjustmentLine.create(
        {
          adjustmentId: adjustment.id,
          productId:    line.productId,
          locationId:   line.locationId,
          countedQty:   line.countedQty,
          previousQty,
        },
        { transaction: t }
      );
    }

    await t.commit();
    const full = await Adjustment.findByPk(adjustment.id, {
      include: [{ model: AdjustmentLine, as: "lines" }],
    });
    return sendSuccess(res, { adjustment: full }, "Adjustment created", 201);
  } catch (err) {
    await t.rollback();
    console.error(err);
    return sendError(res, "Could not create adjustment", 500);
  }
};

// POST /api/adjustments/:id/validate  → update stock to countedQty
export const validateAdjustment = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const adjustment = await Adjustment.findByPk(req.params.id, {
      include: [{ model: AdjustmentLine, as: "lines" }],
    });
    if (!adjustment) { await t.rollback(); return sendError(res, "Adjustment not found", 404); }
    if (adjustment.status === "done")
      { await t.rollback(); return sendError(res, "Adjustment already validated", 400); }
    if (adjustment.status === "canceled")
      { await t.rollback(); return sendError(res, "Cannot validate a canceled adjustment", 400); }

    for (const line of adjustment.lines) {
      const diff = parseFloat(line.countedQty) - parseFloat(line.previousQty);
      if (diff === 0) continue;

      const loc = await Location.findByPk(line.locationId);

      await applyStockMovement({
        productId:     line.productId,
        locationId:    line.locationId,
        warehouseId:   loc?.warehouseId || adjustment.warehouseId,
        qty:           diff,
        movementType:  "adjustment",
        referenceId:   adjustment.id,
        referenceType: "Adjustment",
        notes:         `Adjustment ${adjustment.reference} – reason: ${adjustment.reason || "N/A"}`,
        createdBy:     req.user.id,
        transaction:   t,
      });
    }

    await adjustment.update({ status: "done", validatedAt: new Date() }, { transaction: t });
    await t.commit();
    return sendSuccess(res, { adjustment }, "Adjustment validated – stock corrected");
  } catch (err) {
    await t.rollback();
    console.error(err);
    return sendError(res, err.message || "Could not validate adjustment", err.status || 500);
  }
};

// POST /api/adjustments/:id/cancel
export const cancel = async (req, res) => {
  try {
    const adjustment = await Adjustment.findByPk(req.params.id);
    if (!adjustment) return sendError(res, "Adjustment not found", 404);
    if (adjustment.status === "done")
      return sendError(res, "Cannot cancel a validated adjustment", 400);
    await adjustment.update({ status: "canceled" });
    return sendSuccess(res, { adjustment }, "Adjustment canceled");
  } catch (err) {
    console.error(err);
    return sendError(res, "Could not cancel adjustment", 500);
  }
};
