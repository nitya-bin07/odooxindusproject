import express from "express";
const router  = express.Router();
import * as ctrl from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate, authRules } from "../middleware/validate.middleware.js";

router.post("/register",        validate(authRules.register),       ctrl.register);
router.post("/login",           validate(authRules.login),          ctrl.login);
router.post("/forgot-password", validate(authRules.forgotPassword), ctrl.forgotPassword);
router.post("/reset-password",  validate(authRules.resetPassword),  ctrl.resetPassword);
router.get ("/me",              protect,                            ctrl.me);

export default router;
