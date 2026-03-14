import express from "express";
const router  = express.Router();
import * as ctrl from "../controllers/transfer.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import { validate, transferRules } from "../middleware/validate.middleware.js";

router.use(protect);

router.get   ("/",             ctrl.getAll);
router.get   ("/:id",          ctrl.getById);
router.post  ("/",             restrictTo("admin", "inventory_manager"), validate(transferRules.create), ctrl.create);
router.patch ("/:id",          restrictTo("admin", "inventory_manager"), ctrl.update);
router.post  ("/:id/validate", restrictTo("admin", "inventory_manager"), ctrl.validateTransfer);
router.post  ("/:id/cancel",   restrictTo("admin", "inventory_manager"), ctrl.cancel);

export default router;
