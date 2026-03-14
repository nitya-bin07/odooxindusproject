import { Stock, StockLedger, Product, sequelize } from "../models/index.js";
import { Op } from "sequelize";

/**
 * Atomically adjust the stock for a product at a location.
 * Creates the Stock row if it doesn't exist yet.
 * Writes an immutable ledger entry.
 *
 * @param {object}  opts
 * @param {string}  opts.productId
 * @param {string}  opts.locationId
 * @param {string}  opts.warehouseId
 * @param {number}  opts.qty          - positive = in, negative = out
 * @param {string}  opts.movementType - receipt | delivery | transfer_in | transfer_out | adjustment
 * @param {string}  opts.referenceId
 * @param {string}  opts.referenceType
 * @param {string}  opts.notes
 * @param {string}  opts.createdBy
 * @param {object}  opts.transaction  - Sequelize transaction (required)
 *
 * @returns {object} { stock, ledgerEntry }
 */
export const applyStockMovement = async (opts) => {
  const {
    productId,
    locationId,
    warehouseId,
    qty,
    movementType,
    referenceId,
    referenceType,
    notes,
    createdBy,
    transaction,
  } = opts;

  // Upsert stock row
  const [stock] = await Stock.findOrCreate({
    where: { productId, locationId },
    defaults: { productId, locationId, quantity: 0 },
    transaction,
  });

  const newQty = parseFloat(stock.quantity) + parseFloat(qty);

  if (newQty < 0) {
    throw Object.assign(
      new Error(
        `Insufficient stock for product ${productId} at location ${locationId}. ` +
          `Available: ${stock.quantity}, Requested: ${Math.abs(qty)}`
      ),
      { status: 422 }
    );
  }

  stock.quantity = newQty;
  await stock.save({ transaction });

  const ledgerEntry = await StockLedger.create(
    {
      productId,
      locationId,
      warehouseId,
      movementType,
      qty,
      balanceAfter: newQty,
      referenceId,
      referenceType,
      notes,
      createdBy,
    },
    { transaction }
  );

  return { stock, ledgerEntry };
};

/**
 * Get aggregated stock per product across all locations.
 * Returns rows with totalQty and flags for low/out-of-stock.
 */
export const getAggregatedStock = async () => {
  const rows = await sequelize.query(
    `
    SELECT
      p.id          AS "productId",
      p.name        AS "productName",
      p.sku,
      p."reorderPoint",
      COALESCE(SUM(s.quantity), 0) AS "totalQty"
    FROM products p
    LEFT JOIN stocks s ON s."productId" = p.id
    WHERE p."deletedAt" IS NULL AND p."isActive" = true
    GROUP BY p.id, p.name, p.sku, p."reorderPoint"
    `,
    { type: sequelize.QueryTypes.SELECT }
  );

  return rows.map((r) => ({
    ...r,
    totalQty: parseFloat(r.totalQty),
    isOutOfStock: parseFloat(r.totalQty) <= 0,
    isLowStock:
      parseFloat(r.totalQty) > 0 &&
      parseFloat(r.totalQty) <= parseFloat(r.reorderPoint),
  }));
};
