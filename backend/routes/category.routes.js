import express from "express";
const router  = express.Router();
import * as ctrl from "../controllers/category.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import { validate, categoryRules } from "../middleware/validate.middleware.js";

router.use(protect);

router.get   ("/",    ctrl.getAll);
router.get   ("/:id", ctrl.getById);
router.post  ("/",    restrictTo("admin", "inventory_manager"), validate(categoryRules.create), ctrl.create);
router.patch ("/:id", restrictTo("admin", "inventory_manager"), ctrl.update);
router.delete("/:id", restrictTo("admin"),                      ctrl.remove);

export default router;
