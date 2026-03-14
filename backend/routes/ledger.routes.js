import express from "express";
const router  = express.Router();
import * as ctrl from "../controllers/ledger.controller.js";
import { protect } from "../middleware/auth.middleware.js";

router.use(protect);

router.get("/",                    ctrl.getLedger);
router.get("/summary",             ctrl.getSummary);
router.get("/product/:productId",  ctrl.getByProduct);

export default router;
