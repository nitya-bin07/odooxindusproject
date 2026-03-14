import { Product, Category, Stock, Location, Warehouse } from "../models/index.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { Op } from "sequelize";

// GET /api/products?search=&categoryId=&lowStock=true
export const getAll = async (req, res) => {
  try {
    const where = { isActive: true };
    if (req.query.categoryId) where.categoryId = req.query.categoryId;
    if (req.query.search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${req.query.search}%` } },
        { sku:  { [Op.iLike]: `%${req.query.search}%` } },
      ];
    }

    const products = await Product.findAll({
      where,
      include: [
        { model: Category, as: "category", attributes: ["id", "name"] },
        {
          model: Stock,
          as: "stocks",
          include: [
            {
              model: Location,
              as: "location",
              attributes: ["id", "name", "code"],
              include: [{ model: Warehouse, as: "warehouse", attributes: ["id", "name"] }],
            },
          ],
        },
      ],
      order: [["name", "ASC"]],
    });

    // Attach aggregated totals + low-stock flag
    const enriched = products.map((p) => {
      const totalQty = p.stocks.reduce((sum, s) => sum + parseFloat(s.quantity), 0);
      return {
        ...p.toJSON(),
        totalQty,
        isLowStock: totalQty > 0 && totalQty <= parseFloat(p.reorderPoint),
        isOutOfStock: totalQty <= 0,
      };
    });

    // Optional filter: only low / out-of-stock
    const result =
      req.query.lowStock === "true"
        ? enriched.filter((p) => p.isLowStock || p.isOutOfStock)
        : enriched;

    return sendSuccess(res, { products: result });
  } catch (err) {
    console.error(err);
    return sendError(res, "Could not fetch products", 500);
  }
};

// GET /api/products/:id
export const getById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category, as: "category" },
        {
          model: Stock,
          as: "stocks",
          include: [
            {
              model: Location,
              as: "location",
              include: [{ model: Warehouse, as: "warehouse" }],
            },
          ],
        },
      ],
    });
    if (!product) return sendError(res, "Product not found", 404);
    return sendSuccess(res, { product });
  } catch (err) {
    console.error(err);
    return sendError(res, "Could not fetch product", 500);
  }
};

// POST /api/products
export const create = async (req, res) => {
  try {
    const { name, sku, categoryId, unitOfMeasure, description, reorderPoint } = req.body;

    const existing = await Product.findOne({ where: { sku } });
    if (existing) return sendError(res, "SKU already exists", 409);

    const product = await Product.create({
      name,
      sku,
      categoryId: categoryId || null,
      unitOfMeasure: unitOfMeasure || "unit",
      description,
      reorderPoint: reorderPoint || 0,
    });
    return sendSuccess(res, { product }, "Product created", 201);
  } catch (err) {
    console.error(err);
    return sendError(res, "Could not create product", 500);
  }
};

// PATCH /api/products/:id
export const update = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return sendError(res, "Product not found", 404);

    const { name, categoryId, unitOfMeasure, description, reorderPoint, isActive } = req.body;
    await product.update({ name, categoryId, unitOfMeasure, description, reorderPoint, isActive });
    return sendSuccess(res, { product });
  } catch (err) {
    console.error(err);
    return sendError(res, "Could not update product", 500);
  }
};

// DELETE /api/products/:id (soft)
export const remove = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return sendError(res, "Product not found", 404);
    await product.destroy();
    return sendSuccess(res, {}, "Product deleted");
  } catch (err) {
    console.error(err);
    return sendError(res, "Could not delete product", 500);
  }
};
