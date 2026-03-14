import express from "express";
const router  = express.Router();
import * as ctrl from "../controllers/dashboard.controller.js";
import { protect } from "../middleware/auth.middleware.js";

router.use(protect);

router.get("/",                   ctrl.getKPIs);
router.get("/stock-by-warehouse", ctrl.stockByWarehouse);
router.get("/movement-trend",     ctrl.movementTrend);

export default router;
