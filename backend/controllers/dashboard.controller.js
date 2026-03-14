import { sequelize, Receipt, Delivery, Transfer, Adjustment, Stock, Product } from "../models/index.js";
import { getAggregatedStock } from "../utils/stockService.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { Op } from "sequelize";

// GET /api/dashboard  – master KPI snapshot
export const getKPIs = async (req, res) => {
  try {
    const warehouseId = req.query.warehouseId || null;
    const wFilter = warehouseId ? { warehouseId } : {};

    // ── Document counts ───────────────────────────────────────────────────────
    const [
      pendingReceipts,
      pendingDeliveries,
      scheduledTransfers,
      draftAdjustments,
    ] = await Promise.all([
      Receipt.count({
        where: { ...wFilter, status: { [Op.in]: ["draft", "waiting", "ready"] } },
      }),
      Delivery.count({
        where: { ...wFilter, status: { [Op.in]: ["draft", "waiting", "ready"] } },
      }),
      Transfer.count({
        where: {
          ...(warehouseId
            ? {
                [Op.or]: [
                  { fromWarehouseId: warehouseId },
                  { toWarehouseId: warehouseId },
                ],
              }
            : {}),
          status: { [Op.in]: ["draft", "waiting", "ready"] },
        },
      }),
      Adjustment.count({
        where: { ...wFilter, status: "draft" },
      }),
    ]);

    // ── Stock KPIs ────────────────────────────────────────────────────────────
    const aggregated = await getAggregatedStock();
    const totalProducts  = aggregated.length;
    const lowStockItems  = aggregated.filter((p) => p.isLowStock).length;
    const outOfStockItems= aggregated.filter((p) => p.isOutOfStock).length;

    // ── Recent activity (last 7 days) ─────────────────────────────────────────
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [recentReceipts, recentDeliveries] = await Promise.all([
      Receipt.count({
        where: {
          ...wFilter,
          status: "done",
          validatedAt: { [Op.gte]: sevenDaysAgo },
        },
      }),
      Delivery.count({
        where: {
          ...wFilter,
          status: "done",
          validatedAt: { [Op.gte]: sevenDaysAgo },
        },
      }),
    ]);

    // ── Low stock product list (top 10) ───────────────────────────────────────
    const lowStockProducts = aggregated
      .filter((p) => p.isLowStock || p.isOutOfStock)
      .sort((a, b) => a.totalQty - b.totalQty)
      .slice(0, 10);

    return sendSuccess(res, {
      kpis: {
        totalProducts,
        lowStockItems,
        outOfStockItems,
        pendingReceipts,
        pendingDeliveries,
        scheduledTransfers,
        draftAdjustments,
        recentReceiptsLast7Days:  recentReceipts,
        recentDeliveriesLast7Days: recentDeliveries,
      },
      lowStockProducts,
    });
  } catch (err) {
    console.error(err);
    return sendError(res, "Could not load dashboard", 500);
  }
};

// GET /api/dashboard/stock-by-warehouse  – total stock value per warehouse
export const stockByWarehouse = async (req, res) => {
  try {
    const rows = await sequelize.query(
      `
      SELECT
        w.id          AS "warehouseId",
        w.name        AS "warehouseName",
        COUNT(DISTINCT s."productId")::int  AS "productCount",
        COALESCE(SUM(s.quantity), 0)        AS "totalQty"
      FROM warehouses w
      LEFT JOIN locations l  ON l."warehouseId" = w.id  AND l."deletedAt" IS NULL
      LEFT JOIN stocks    s  ON s."locationId"  = l.id
      WHERE w."deletedAt" IS NULL
      GROUP BY w.id, w.name
      ORDER BY w.name
      `,
      { type: sequelize.QueryTypes.SELECT }
    );
    return sendSuccess(res, { warehouses: rows });
  } catch (err) {
    console.error(err);
    return sendError(res, "Could not fetch warehouse stock summary", 500);
  }
};

// GET /api/dashboard/movement-trend  – daily movement totals for the last 30 days
export const movementTrend = async (req, res) => {
  try {
    const warehouseId = req.query.warehouseId;
    const wClause = warehouseId ? `AND sl."warehouseId" = '${warehouseId}'` : "";

    const rows = await sequelize.query(
      `
      SELECT
        DATE(sl."createdAt")       AS date,
        sl."movementType",
        COUNT(*)::int              AS "moveCount",
        SUM(ABS(sl.qty))           AS "totalQty"
      FROM stock_ledger sl
      WHERE sl."createdAt" >= NOW() - INTERVAL '30 days'
      ${wClause}
      GROUP BY DATE(sl."createdAt"), sl."movementType"
      ORDER BY date DESC, sl."movementType"
      `,
      { type: sequelize.QueryTypes.SELECT }
    );
    return sendSuccess(res, { trend: rows });
  } catch (err) {
    console.error(err);
    return sendError(res, "Could not fetch movement trend", 500);
  }
};
