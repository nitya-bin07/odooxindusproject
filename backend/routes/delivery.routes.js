import express from "express";
const router  = express.Router();
import * as ctrl from "../controllers/delivery.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import { validate, deliveryRules } from "../middleware/validate.middleware.js";

router.use(protect);

router.get   ("/",             ctrl.getAll);
router.get   ("/:id",          ctrl.getById);
router.post  ("/",             restrictTo("admin", "inventory_manager"), validate(deliveryRules.create), ctrl.create);
router.patch ("/:id",          restrictTo("admin", "inventory_manager"), ctrl.update);
router.post  ("/:id/validate", restrictTo("admin", "inventory_manager"), ctrl.validateDelivery);
router.post  ("/:id/cancel",   restrictTo("admin", "inventory_manager"), ctrl.cancel);

export default router;
