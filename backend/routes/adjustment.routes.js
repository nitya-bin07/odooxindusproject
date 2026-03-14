import express from "express";
const router  = express.Router();
import * as ctrl from "../controllers/adjustment.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import { validate, adjustmentRules } from "../middleware/validate.middleware.js";

router.use(protect);

router.get   ("/",             ctrl.getAll);
router.get   ("/:id",          ctrl.getById);
router.post  ("/",             restrictTo("admin", "inventory_manager"), validate(adjustmentRules.create), ctrl.create);
router.post  ("/:id/validate", restrictTo("admin", "inventory_manager"), ctrl.validateAdjustment);
router.post  ("/:id/cancel",   restrictTo("admin", "inventory_manager"), ctrl.cancel);

export default router;
