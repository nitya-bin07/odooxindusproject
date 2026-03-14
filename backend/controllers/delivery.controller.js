import { sequelize, Delivery, DeliveryLine, Product, Location, Warehouse } from "../models/index.js";
import { applyStockMovement } from "../utils/stockService.js";
import { generateRef } from "../utils/reference.js";
import { sendSuccess, sendError } from "../utils/response.js";

// GET /api/deliveries?warehouseId=&status=
export const getAll = async (req, res) => {
  try {
    const where = {};
    if (req.query.warehouseId) where.warehouseId = req.query.warehouseId;
    if (req.query.status)      where.status = req.query.status;

    const deliveries = await Delivery.findAll({
      where,
      include: [
        { model: Warehouse,    as: "warehouse", attributes: ["id", "name"] },
        {
          model: DeliveryLine, as: "lines",
          include: [
            { model: Product,  as: "product",  attributes: ["id", "name", "sku"] },
            { model: Location, as: "location", attributes: ["id", "name", "code"] },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    return sendSuccess(res, { deliveries });
  } catch (err) {
    console.error(err);
    return sendError(res, "Could not fetch deliveries", 500);
  }
};

// GET /api/deliveries/:id
export const getById = async (req, res) => {
  try {
    const delivery = await Delivery.findByPk(req.params.id, {
      include: [
        { model: Warehouse, as: "warehouse" },
        {
          model: DeliveryLine, as: "lines",
          include: [
            { model: Product,  as: "product" },
            { model: Location, as: "location" },
          ],
        },
      ],
    });
    if (!delivery) return sendError(res, "Delivery not found", 404);
    return sendSuccess(res, { delivery });
  } catch (err) {
    console.error(err);
    return sendError(res, "Could not fetch delivery", 500);
  }
};

// POST /api/deliveries
export const create = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { warehouseId, customer, scheduledDate, notes, lines } = req.body;

    const warehouse = await Warehouse.findByPk(warehouseId);
    if (!warehouse) { await t.rollback(); return sendError(res, "Warehouse not found", 404); }

    const delivery = await Delivery.create(
      {
        reference: generateRef("DEL"),
        warehouseId,
        customer,
        scheduledDate,
        notes,
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

      await DeliveryLine.create(
        {
          deliveryId: delivery.id,
          productId:  line.productId,
          locationId: line.locationId,
          demandQty:  line.demandQty,
          doneQty:    0,
        },
        { transaction: t }
      );
    }

    await t.commit();
    const full = await Delivery.findByPk(delivery.id, {
      include: [{ model: DeliveryLine, as: "lines" }],
    });
    return sendSuccess(res, { delivery: full }, "Delivery created", 201);
  } catch (err) {
    await t.rollback();
    console.error(err);
    return sendError(res, "Could not create delivery", 500);
  }
};

// PATCH /api/deliveries/:id  (draft only)
export const update = async (req, res) => {
  try {
    const delivery = await Delivery.findByPk(req.params.id);
    if (!delivery) return sendError(res, "Delivery not found", 404);
    if (delivery.status !== "draft")
      return sendError(res, "Only draft deliveries can be edited", 400);

    const { customer, scheduledDate, notes, lines } = req.body;
    await delivery.update({ customer, scheduledDate, notes });

    if (Array.isArray(lines)) {
      for (const line of lines) {
        if (!line.id) continue;
        const dl = await DeliveryLine.findByPk(line.id);
        if (dl && dl.deliveryId === delivery.id) {
          await dl.update({
            demandQty: line.demandQty ?? dl.demandQty,
            doneQty:   line.doneQty   ?? dl.doneQty,
          });
        }
      }
    }
    return sendSuccess(res, { delivery });
  } catch (err) {
    console.error(err);
    return sendError(res, "Could not update delivery", 500);
  }
};

// POST /api/deliveries/:id/validate  → stock -
export const validateDelivery = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const delivery = await Delivery.findByPk(req.params.id, {
      include: [{ model: DeliveryLine, as: "lines" }],
    });
    if (!delivery) { await t.rollback(); return sendError(res, "Delivery not found", 404); }
    if (delivery.status === "done")
      { await t.rollback(); return sendError(res, "Delivery already validated", 400); }
    if (delivery.status === "canceled")
      { await t.rollback(); return sendError(res, "Cannot validate a canceled delivery", 400); }

    for (const line of delivery.lines) {
      const qty = parseFloat(line.doneQty) || parseFloat(line.demandQty);
      if (qty <= 0) continue;

      await line.update({ doneQty: qty }, { transaction: t });

      const loc = await Location.findByPk(line.locationId);

      await applyStockMovement({
        productId:     line.productId,
        locationId:    line.locationId,
        warehouseId:   loc?.warehouseId || delivery.warehouseId,
        qty:           -qty,                 // outgoing = negative
        movementType:  "delivery",
        referenceId:   delivery.id,
        referenceType: "Delivery",
        notes:         `Validated delivery ${delivery.reference}`,
        createdBy:     req.user.id,
        transaction:   t,
      });
    }

    await delivery.update({ status: "done", validatedAt: new Date() }, { transaction: t });
    await t.commit();
    return sendSuccess(res, { delivery }, "Delivery validated – stock reduced");
  } catch (err) {
    await t.rollback();
    console.error(err);
    return sendError(res, err.message || "Could not validate delivery", err.status || 500);
  }
};

// POST /api/deliveries/:id/cancel
export const cancel = async (req, res) => {
  try {
    const delivery = await Delivery.findByPk(req.params.id);
    if (!delivery) return sendError(res, "Delivery not found", 404);
    if (delivery.status === "done")
      return sendError(res, "Cannot cancel a validated delivery", 400);
    await delivery.update({ status: "canceled" });
    return sendSuccess(res, { delivery }, "Delivery canceled");
  } catch (err) {
    console.error(err);
    return sendError(res, "Could not cancel delivery", 500);
  }
};
