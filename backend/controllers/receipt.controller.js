import { sequelize, Receipt, ReceiptLine, Product, Location, Warehouse } from "../models/index.js";
import { applyStockMovement } from "../utils/stockService.js";
import { generateRef } from "../utils/reference.js";
import { sendSuccess, sendError } from "../utils/response.js";

// GET /api/receipts?warehouseId=&status=
export const getAll = async (req, res) => {
  try {
    const where = {};
    if (req.query.warehouseId) where.warehouseId = req.query.warehouseId;
    if (req.query.status)      where.status = req.query.status;

    const receipts = await Receipt.findAll({
      where,
      include: [
        { model: Warehouse, as: "warehouse", attributes: ["id", "name"] },
        {
          model: ReceiptLine,
          as: "lines",
          include: [
            { model: Product,  as: "product",  attributes: ["id", "name", "sku"] },
            { model: Location, as: "location", attributes: ["id", "name", "code"] },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    return sendSuccess(res, { receipts });
  } catch (err) {
    console.error(err);
    return sendError(res, "Could not fetch receipts", 500);
  }
};

// GET /api/receipts/:id
export const getById = async (req, res) => {
  try {
    const receipt = await Receipt.findByPk(req.params.id, {
      include: [
        { model: Warehouse, as: "warehouse" },
        {
          model: ReceiptLine,
          as: "lines",
          include: [
            { model: Product,  as: "product" },
            { model: Location, as: "location" },
          ],
        },
      ],
    });
    if (!receipt) return sendError(res, "Receipt not found", 404);
    return sendSuccess(res, { receipt });
  } catch (err) {
    console.error(err);
    return sendError(res, "Could not fetch receipt", 500);
  }
};

// POST /api/receipts  – create in draft
export const create = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { warehouseId, supplier, scheduledDate, notes, lines } = req.body;

    const warehouse = await Warehouse.findByPk(warehouseId);
    if (!warehouse) { await t.rollback(); return sendError(res, "Warehouse not found", 404); }

    const receipt = await Receipt.create(
      {
        reference: generateRef("REC"),
        warehouseId,
        supplier,
        scheduledDate,
        notes,
        createdBy: req.user.id,
        status: "draft",
      },
      { transaction: t }
    );

    // Validate & create lines
    for (const line of lines) {
      const product  = await Product.findByPk(line.productId);
      const location = await Location.findByPk(line.locationId);
      if (!product)  { await t.rollback(); return sendError(res, `Product ${line.productId} not found`, 404); }
      if (!location) { await t.rollback(); return sendError(res, `Location ${line.locationId} not found`, 404); }

      await ReceiptLine.create(
        {
          receiptId:   receipt.id,
          productId:   line.productId,
          locationId:  line.locationId,
          expectedQty: line.expectedQty,
          receivedQty: 0,
        },
        { transaction: t }
      );
    }

    await t.commit();
    const full = await Receipt.findByPk(receipt.id, {
      include: [{ model: ReceiptLine, as: "lines" }],
    });
    return sendSuccess(res, { receipt: full }, "Receipt created", 201);
  } catch (err) {
    await t.rollback();
    console.error(err);
    return sendError(res, "Could not create receipt", 500);
  }
};

// PATCH /api/receipts/:id  – update header / line quantities (draft only)
export const update = async (req, res) => {
  try {
    const receipt = await Receipt.findByPk(req.params.id);
    if (!receipt) return sendError(res, "Receipt not found", 404);
    if (receipt.status !== "draft")
      return sendError(res, "Only draft receipts can be edited", 400);

    const { supplier, scheduledDate, notes, lines } = req.body;
    await receipt.update({ supplier, scheduledDate, notes });

    if (Array.isArray(lines)) {
      for (const line of lines) {
        if (!line.id) continue;
        const rl = await ReceiptLine.findByPk(line.id);
        if (rl && rl.receiptId === receipt.id) {
          await rl.update({
            expectedQty: line.expectedQty ?? rl.expectedQty,
            receivedQty: line.receivedQty ?? rl.receivedQty,
          });
        }
      }
    }

    return sendSuccess(res, { receipt });
  } catch (err) {
    console.error(err);
    return sendError(res, "Could not update receipt", 500);
  }
};

// POST /api/receipts/:id/validate – confirm receipt → stock +
export const validateReceipt = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const receipt = await Receipt.findByPk(req.params.id, {
      include: [{ model: ReceiptLine, as: "lines" }],
    });
    if (!receipt) { await t.rollback(); return sendError(res, "Receipt not found", 404); }
    if (receipt.status === "done")
      { await t.rollback(); return sendError(res, "Receipt already validated", 400); }
    if (receipt.status === "canceled")
      { await t.rollback(); return sendError(res, "Cannot validate a canceled receipt", 400); }

    const warehouseId = receipt.warehouseId;

    for (const line of receipt.lines) {
      const qty = parseFloat(line.receivedQty) || parseFloat(line.expectedQty);
      if (qty <= 0) continue;

      await line.update({ receivedQty: qty }, { transaction: t });

      const loc = await Location.findByPk(line.locationId);

      await applyStockMovement({
        productId:     line.productId,
        locationId:    line.locationId,
        warehouseId:   loc?.warehouseId || warehouseId,
        qty:           qty,
        movementType:  "receipt",
        referenceId:   receipt.id,
        referenceType: "Receipt",
        notes:         `Validated receipt ${receipt.reference}`,
        createdBy:     req.user.id,
        transaction:   t,
      });
    }

    await receipt.update({ status: "done", validatedAt: new Date() }, { transaction: t });
    await t.commit();
    return sendSuccess(res, { receipt }, "Receipt validated – stock updated");
  } catch (err) {
    await t.rollback();
    console.error(err);
    return sendError(res, err.message || "Could not validate receipt", err.status || 500);
  }
};

// POST /api/receipts/:id/cancel
export const cancel = async (req, res) => {
  try {
    const receipt = await Receipt.findByPk(req.params.id);
    if (!receipt) return sendError(res, "Receipt not found", 404);
    if (receipt.status === "done")
      return sendError(res, "Cannot cancel a validated receipt", 400);
    await receipt.update({ status: "canceled" });
    return sendSuccess(res, { receipt }, "Receipt canceled");
  } catch (err) {
    console.error(err);
    return sendError(res, "Could not cancel receipt", 500);
  }
};
