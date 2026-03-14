import { sendError } from "../utils/response.js";

// ── Tiny helper ───────────────────────────────────────────────────────────────
const isEmpty = (v) => v === undefined || v === null || String(v).trim() === "";
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isUUID  = (v) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
const isPositiveNumber = (v) => !isNaN(v) && parseFloat(v) > 0;
const isNonNegativeNumber = (v) => !isNaN(v) && parseFloat(v) >= 0;

/**
 * Factory: build a middleware from a list of rule functions.
 * Each rule receives req and returns an error string or null.
 */
export const validate = (rules) => (req, res, next) => {
  const errors = [];
  for (const rule of rules) {
    const err = rule(req);
    if (err) errors.push(err);
  }
  if (errors.length) return sendError(res, "Validation failed", 422, errors);
  next();
};

// ── Auth rules ────────────────────────────────────────────────────────────────
export const authRules = {
  register: [
    (req) => isEmpty(req.body.name)     ? "name is required"             : null,
    (req) => isEmpty(req.body.email)    ? "email is required"            : null,
    (req) => !isEmpty(req.body.email) && !isEmail(req.body.email)
                                        ? "email is invalid"             : null,
    (req) => isEmpty(req.body.password) ? "password is required"         : null,
    (req) => !isEmpty(req.body.password) && req.body.password.length < 6
                                        ? "password must be ≥ 6 chars"  : null,
  ],
  login: [
    (req) => isEmpty(req.body.email)    ? "email is required"   : null,
    (req) => isEmpty(req.body.password) ? "password is required" : null,
  ],
  forgotPassword: [
    (req) => isEmpty(req.body.email) ? "email is required" : null,
    (req) => !isEmpty(req.body.email) && !isEmail(req.body.email)
                                     ? "email is invalid" : null,
  ],
  resetPassword: [
    (req) => isEmpty(req.body.email)    ? "email is required"           : null,
    (req) => isEmpty(req.body.otp)      ? "otp is required"             : null,
    (req) => isEmpty(req.body.password) ? "new password is required"    : null,
    (req) => !isEmpty(req.body.password) && req.body.password.length < 6
                                        ? "password must be ≥ 6 chars" : null,
  ],
};

// ── Warehouse rules ───────────────────────────────────────────────────────────
export const warehouseRules = {
  create: [
    (req) => isEmpty(req.body.name) ? "name is required" : null,
    (req) => isEmpty(req.body.code) ? "code is required" : null,
  ],
};

// ── Location rules ────────────────────────────────────────────────────────────
export const locationRules = {
  create: [
    (req) => isEmpty(req.body.warehouseId) ? "warehouseId is required" : null,
    (req) => !isEmpty(req.body.warehouseId) && !isUUID(req.body.warehouseId)
                                           ? "warehouseId must be a valid UUID" : null,
    (req) => isEmpty(req.body.name)        ? "name is required"        : null,
    (req) => isEmpty(req.body.code)        ? "code is required"        : null,
  ],
};

// ── Category rules ────────────────────────────────────────────────────────────
export const categoryRules = {
  create: [
    (req) => isEmpty(req.body.name) ? "name is required" : null,
  ],
};

// ── Product rules ─────────────────────────────────────────────────────────────
export const productRules = {
  create: [
    (req) => isEmpty(req.body.name) ? "name is required" : null,
    (req) => isEmpty(req.body.sku)  ? "sku is required"  : null,
  ],
};

// ── Receipt rules ─────────────────────────────────────────────────────────────
export const receiptRules = {
  create: [
    (req) => isEmpty(req.body.warehouseId) ? "warehouseId is required" : null,
    (req) => !isEmpty(req.body.warehouseId) && !isUUID(req.body.warehouseId)
                                           ? "warehouseId must be a valid UUID" : null,
    (req) => !req.body.lines || !Array.isArray(req.body.lines) || req.body.lines.length === 0
                                           ? "lines array is required and must not be empty" : null,
    (req) => {
      if (!Array.isArray(req.body.lines)) return null;
      for (let i = 0; i < req.body.lines.length; i++) {
        const l = req.body.lines[i];
        if (isEmpty(l.productId))              return `lines[${i}].productId is required`;
        if (!isUUID(l.productId))              return `lines[${i}].productId must be a valid UUID`;
        if (isEmpty(l.locationId))             return `lines[${i}].locationId is required`;
        if (!isUUID(l.locationId))             return `lines[${i}].locationId must be a valid UUID`;
        if (isEmpty(l.expectedQty))            return `lines[${i}].expectedQty is required`;
        if (!isPositiveNumber(l.expectedQty))  return `lines[${i}].expectedQty must be > 0`;
      }
      return null;
    },
  ],
};

// ── Delivery rules ────────────────────────────────────────────────────────────
export const deliveryRules = {
  create: [
    (req) => isEmpty(req.body.warehouseId) ? "warehouseId is required" : null,
    (req) => !isEmpty(req.body.warehouseId) && !isUUID(req.body.warehouseId)
                                           ? "warehouseId must be a valid UUID" : null,
    (req) => !req.body.lines || !Array.isArray(req.body.lines) || req.body.lines.length === 0
                                           ? "lines array is required and must not be empty" : null,
    (req) => {
      if (!Array.isArray(req.body.lines)) return null;
      for (let i = 0; i < req.body.lines.length; i++) {
        const l = req.body.lines[i];
        if (isEmpty(l.productId))            return `lines[${i}].productId is required`;
        if (!isUUID(l.productId))            return `lines[${i}].productId must be a valid UUID`;
        if (isEmpty(l.locationId))           return `lines[${i}].locationId is required`;
        if (!isUUID(l.locationId))           return `lines[${i}].locationId must be a valid UUID`;
        if (isEmpty(l.demandQty))            return `lines[${i}].demandQty is required`;
        if (!isPositiveNumber(l.demandQty))  return `lines[${i}].demandQty must be > 0`;
      }
      return null;
    },
  ],
};

// ── Transfer rules ────────────────────────────────────────────────────────────
export const transferRules = {
  create: [
    (req) => isEmpty(req.body.fromWarehouseId) ? "fromWarehouseId is required" : null,
    (req) => !isEmpty(req.body.fromWarehouseId) && !isUUID(req.body.fromWarehouseId)
                                               ? "fromWarehouseId must be a valid UUID" : null,
    (req) => isEmpty(req.body.toWarehouseId)   ? "toWarehouseId is required"   : null,
    (req) => !isEmpty(req.body.toWarehouseId) && !isUUID(req.body.toWarehouseId)
                                               ? "toWarehouseId must be a valid UUID"   : null,
    (req) => !req.body.lines || !Array.isArray(req.body.lines) || req.body.lines.length === 0
                                               ? "lines array is required and must not be empty" : null,
    (req) => {
      if (!Array.isArray(req.body.lines)) return null;
      for (let i = 0; i < req.body.lines.length; i++) {
        const l = req.body.lines[i];
        if (isEmpty(l.productId))         return `lines[${i}].productId is required`;
        if (!isUUID(l.productId))         return `lines[${i}].productId must be a valid UUID`;
        if (isEmpty(l.fromLocationId))    return `lines[${i}].fromLocationId is required`;
        if (!isUUID(l.fromLocationId))    return `lines[${i}].fromLocationId must be a valid UUID`;
        if (isEmpty(l.toLocationId))      return `lines[${i}].toLocationId is required`;
        if (!isUUID(l.toLocationId))      return `lines[${i}].toLocationId must be a valid UUID`;
        if (isEmpty(l.qty))               return `lines[${i}].qty is required`;
        if (!isPositiveNumber(l.qty))     return `lines[${i}].qty must be > 0`;
      }
      return null;
    },
  ],
};

// ── Adjustment rules ──────────────────────────────────────────────────────────
export const adjustmentRules = {
  create: [
    (req) => isEmpty(req.body.warehouseId) ? "warehouseId is required" : null,
    (req) => !isEmpty(req.body.warehouseId) && !isUUID(req.body.warehouseId)
                                           ? "warehouseId must be a valid UUID" : null,
    (req) => !req.body.lines || !Array.isArray(req.body.lines) || req.body.lines.length === 0
                                           ? "lines array is required and must not be empty" : null,
    (req) => {
      if (!Array.isArray(req.body.lines)) return null;
      for (let i = 0; i < req.body.lines.length; i++) {
        const l = req.body.lines[i];
        if (isEmpty(l.productId))                  return `lines[${i}].productId is required`;
        if (!isUUID(l.productId))                  return `lines[${i}].productId must be a valid UUID`;
        if (isEmpty(l.locationId))                 return `lines[${i}].locationId is required`;
        if (!isUUID(l.locationId))                 return `lines[${i}].locationId must be a valid UUID`;
        if (isEmpty(l.countedQty))                 return `lines[${i}].countedQty is required`;
        if (!isNonNegativeNumber(l.countedQty))    return `lines[${i}].countedQty must be ≥ 0`;
      }
      return null;
    },
  ],
};
