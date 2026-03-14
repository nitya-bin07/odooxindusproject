import express from "express";
const router  = express.Router();
import * as ctrl from "../controllers/receipt.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import { validate, receiptRules } from "../middleware/validate.middleware.js";

router.use(protect);

router.get   ("/",               ctrl.getAll);
router.get   ("/:id",            ctrl.getById);
router.post  ("/",               restrictTo("admin", "inventory_manager"), validate(receiptRules.create), ctrl.create);
router.patch ("/:id",            restrictTo("admin", "inventory_manager"), ctrl.update);
router.post  ("/:id/validate",   restrictTo("admin", "inventory_manager"), ctrl.validateReceipt);
router.post  ("/:id/cancel",     restrictTo("admin", "inventory_manager"), ctrl.cancel);

export default router;
