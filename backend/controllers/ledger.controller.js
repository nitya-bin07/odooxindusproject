import { StockLedger, Product, Location, Warehouse, User, sequelize } from "../models/index.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { Op } from "sequelize";

// GET /api/ledger?productId=&locationId=&warehouseId=&movementType=&from=&to=&page=&limit=
export const getLedger = async (req, res) => {
  try {
    const {
      productId,
      locationId,
      warehouseId,
      movementType,
      referenceType,
      from,
      to,
      page = 1,
      limit = 50,
    } = req.query;

    const where = {};
    if (productId)     where.productId     = productId;
    if (locationId)    where.locationId    = locationId;
    if (warehouseId)   where.warehouseId   = warehouseId;
    if (movementType)  where.movementType  = movementType;
    if (referenceType) where.referenceType = referenceType;

    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt[Op.gte] = new Date(from);
      if (to)   where.createdAt[Op.lte] = new Date(to);
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await StockLedger.findAndCountAll({
      where,
      include: [
        { model: Product,   as: "product",   attributes: ["id", "name", "sku", "unitOfMeasure"] },
        { model: Location,  as: "location",  attributes: ["id", "name", "code"] },
        { model: Warehouse, as: "warehouse", attributes: ["id", "name", "code"] },
        { model: User,      as: "creator",   attributes: ["id", "name", "email"] },
      ],
      order: [["createdAt", "DESC"]],
      limit:  parseInt(limit),
      offset,
    });

    return sendSuccess(res, {
      ledger: rows,
      pagination: {
        total:       count,
        page:        parseInt(page),
        limit:       parseInt(limit),
        totalPages:  Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error(err);
    return sendError(res, "Could not fetch ledger", 500);
  }
};

// GET /api/ledger/product/:productId  – full movement history for one product
export const getByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { warehouseId, from, to } = req.query;

    const where = { productId };
    if (warehouseId) where.warehouseId = warehouseId;
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt[Op.gte] = new Date(from);
      if (to)   where.createdAt[Op.lte] = new Date(to);
    }

    const entries = await StockLedger.findAll({
      where,
      include: [
        { model: Location,  as: "location",  attributes: ["id", "name", "code"] },
        { model: Warehouse, as: "warehouse", attributes: ["id", "name"] },
        { model: User,      as: "creator",   attributes: ["id", "name"] },
      ],
      order: [["createdAt", "ASC"]],
    });

    return sendSuccess(res, { entries });
  } catch (err) {
    console.error(err);
    return sendError(res, "Could not fetch product ledger", 500);
  }
};

// GET /api/ledger/summary  – movement count grouped by type (for charts)
export const getSummary = async (req, res) => {
  try {
    const { warehouseId, from, to } = req.query;

    let dateFilter = "";
    const replacements = {};

    if (warehouseId) {
      dateFilter += ` AND sl."warehouseId" = :warehouseId`;
      replacements.warehouseId = warehouseId;
    }
    if (from) {
      dateFilter += ` AND sl."createdAt" >= :from`;
      replacements.from = new Date(from);
    }
    if (to) {
      dateFilter += ` AND sl."createdAt" <= :to`;
      replacements.to = new Date(to);
    }

    const rows = await sequelize.query(
      `
      SELECT
        sl."movementType",
        COUNT(*)::int              AS "count",
        SUM(ABS(sl.qty))           AS "totalQty"
      FROM stock_ledger sl
      WHERE 1=1 ${dateFilter}
      GROUP BY sl."movementType"
      ORDER BY sl."movementType"
      `,
      { replacements, type: sequelize.QueryTypes.SELECT }
    );

    return sendSuccess(res, { summary: rows });
  } catch (err) {
    console.error(err);
    return sendError(res, "Could not fetch ledger summary", 500);
  }
};
