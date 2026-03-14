import { sequelize, Transfer, TransferLine, Product, Location, Warehouse } from "../models/index.js";
import { applyStockMovement } from "../utils/stockService.js";
import { generateRef } from "../utils/reference.js";
import { sendSuccess, sendError } from "../utils/response.js";

// GET /api/transfers?fromWarehouseId=&toWarehouseId=&status=
export const getAll = async (req, res) => {
  try {
    const where = {};
    if (req.query.fromWarehouseId) where.fromWarehouseId = req.query.fromWarehouseId;
    if (req.query.toWarehouseId)   where.toWarehouseId   = req.query.toWarehouseId;
    if (req.query.status)          where.status          = req.query.status;

    const transfers = await Transfer.findAll({
      where,
      include: [
        {
          model: TransferLine, as: "lines",
          include: [
            { model: Product,  as: "product",      attributes: ["id", "name", "sku"] },
            { model: Location, as: "fromLocation", attributes: ["id", "name", "code"] },
            { model: Location, as: "toLocation",   attributes: ["id", "name", "code"] },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    return sendSuccess(res, { transfers });
  } catch (err) {
    console.error(err);
    return sendError(res, "Could not fetch transfers", 500);
  }
};

// GET /api/transfers/:id
export const getById = async (req, res) => {
  try {
    const transfer = await Transfer.findByPk(req.params.id, {
      include: [
        {
          model: TransferLine, as: "lines",
          include: [
            { model: Product,  as: "product" },
            { model: Location, as: "fromLocation" },
            { model: Location, as: "toLocation" },
          ],
        },
      ],
    });
    if (!transfer) return sendError(res, "Transfer not found", 404);
    return sendSuccess(res, { transfer });
  } catch (err) {
    console.error(err);
    return sendError(res, "Could not fetch transfer", 500);
  }
};

// POST /api/transfers
export const create = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { fromWarehouseId, toWarehouseId, scheduledDate, notes, lines } = req.body;

    const fromWH = await Warehouse.findByPk(fromWarehouseId);
    const toWH   = await Warehouse.findByPk(toWarehouseId);
    if (!fromWH) { await t.rollback(); return sendError(res, "Source warehouse not found", 404); }
    if (!toWH)   { await t.rollback(); return sendError(res, "Destination warehouse not found", 404); }

    const transfer = await Transfer.create(
      {
        reference: generateRef("TRF"),
        fromWarehouseId,
        toWarehouseId,
        scheduledDate,
        notes,
        createdBy: req.user.id,
        status: "draft",
      },
      { transaction: t }
    );

    for (const line of lines) {
      const product      = await Product.findByPk(line.productId);
      const fromLocation = await Location.findByPk(line.fromLocationId);
      const toLocation   = await Location.findByPk(line.toLocationId);

      if (!product)      { await t.rollback(); return sendError(res, `Product ${line.productId} not found`, 404); }
      if (!fromLocation) { await t.rollback(); return sendError(res, `Source location ${line.fromLocationId} not found`, 404); }
      if (!toLocation)   { await t.rollback(); return sendError(res, `Destination location ${line.toLocationId} not found`, 404); }

      await TransferLine.create(
        {
          transferId:     transfer.id,
          productId:      line.productId,
          fromLocationId: line.fromLocationId,
          toLocationId:   line.toLocationId,
          qty:            line.qty,
          doneQty:        0,
        },
        { transaction: t }
      );
    }

    await t.commit();
    const full = await Transfer.findByPk(transfer.id, {
      include: [{ model: TransferLine, as: "lines" }],
    });
    return sendSuccess(res, { transfer: full }, "Transfer created", 201);
  } catch (err) {
    await t.rollback();
    console.error(err);
    return sendError(res, "Could not create transfer", 500);
  }
};

// POST /api/transfers/:id/validate  → stock out from source, stock in at dest
export const validateTransfer = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const transfer = await Transfer.findByPk(req.params.id, {
      include: [{ model: TransferLine, as: "lines" }],
    });
    if (!transfer) { await t.rollback(); return sendError(res, "Transfer not found", 404); }
    if (transfer.status === "done")
      { await t.rollback(); return sendError(res, "Transfer already validated", 400); }
    if (transfer.status === "canceled")
      { await t.rollback(); return sendError(res, "Cannot validate a canceled transfer", 400); }

    for (const line of transfer.lines) {
      const qty = parseFloat(line.qty);
      if (qty <= 0) continue;

      await line.update({ doneQty: qty }, { transaction: t });

      // Deduct from source
      await applyStockMovement({
        productId:     line.productId,
        locationId:    line.fromLocationId,
        warehouseId:   transfer.fromWarehouseId,
        qty:           -qty,
        movementType:  "transfer_out",
        referenceId:   transfer.id,
        referenceType: "Transfer",
        notes:         `Transfer out – ${transfer.reference}`,
        createdBy:     req.user.id,
        transaction:   t,
      });

      // Add to destination
      await applyStockMovement({
        productId:     line.productId,
        locationId:    line.toLocationId,
        warehouseId:   transfer.toWarehouseId,
        qty:           qty,
        movementType:  "transfer_in",
        referenceId:   transfer.id,
        referenceType: "Transfer",
        notes:         `Transfer in – ${transfer.reference}`,
        createdBy:     req.user.id,
        transaction:   t,
      });
    }

    await transfer.update({ status: "done", validatedAt: new Date() }, { transaction: t });
    await t.commit();
    return sendSuccess(res, { transfer }, "Transfer validated – stock moved");
  } catch (err) {
    await t.rollback();
    console.error(err);
    return sendError(res, err.message || "Could not validate transfer", err.status || 500);
  }
};

// POST /api/transfers/:id/cancel
export const cancel = async (req, res) => {
  try {
    const transfer = await Transfer.findByPk(req.params.id);
    if (!transfer) return sendError(res, "Transfer not found", 404);
    if (transfer.status === "done")
      return sendError(res, "Cannot cancel a validated transfer", 400);
    await transfer.update({ status: "canceled" });
    return sendSuccess(res, { transfer }, "Transfer canceled");
  } catch (err) {
    console.error(err);
    return sendError(res, "Could not cancel transfer", 500);
  }
};

// PATCH /api/transfers/:id  (draft only)
export const update = async (req, res) => {
  try {
    const transfer = await Transfer.findByPk(req.params.id);
    if (!transfer) return sendError(res, "Transfer not found", 404);
    if (transfer.status !== "draft")
      return sendError(res, "Only draft transfers can be edited", 400);
    const { scheduledDate, notes } = req.body;
    await transfer.update({ scheduledDate, notes });
    return sendSuccess(res, { transfer });
  } catch (err) {
    console.error(err);
    return sendError(res, "Could not update transfer", 500);
  }
};
