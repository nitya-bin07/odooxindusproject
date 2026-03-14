import { Category } from "../models/index.js";
import { sendSuccess, sendError } from "../utils/response.js";

export const getAll = async (_req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{ model: Category, as: "subCategories" }],
      where: { parentId: null }, // top-level only; subs nested
      order: [["name", "ASC"]],
    });
    return sendSuccess(res, { categories });
  } catch (err) {
    console.error(err);
    return sendError(res, "Could not fetch categories", 500);
  }
};

export const getById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [{ model: Category, as: "subCategories" }],
    });
    if (!category) return sendError(res, "Category not found", 404);
    return sendSuccess(res, { category });
  } catch (err) {
    console.error(err);
    return sendError(res, "Could not fetch category", 500);
  }
};

export const create = async (req, res) => {
  try {
    const { name, parentId } = req.body;
    if (parentId) {
      const parent = await Category.findByPk(parentId);
      if (!parent) return sendError(res, "Parent category not found", 404);
    }
    const category = await Category.create({ name, parentId: parentId || null });
    return sendSuccess(res, { category }, "Category created", 201);
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError")
      return sendError(res, "Category name already exists", 409);
    console.error(err);
    return sendError(res, "Could not create category", 500);
  }
};

export const update = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return sendError(res, "Category not found", 404);
    const { name, parentId } = req.body;
    await category.update({ name, parentId });
    return sendSuccess(res, { category });
  } catch (err) {
    console.error(err);
    return sendError(res, "Could not update category", 500);
  }
};

export const remove = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return sendError(res, "Category not found", 404);
    await category.destroy();
    return sendSuccess(res, {}, "Category deleted");
  } catch (err) {
    console.error(err);
    return sendError(res, "Could not delete category", 500);
  }
};
