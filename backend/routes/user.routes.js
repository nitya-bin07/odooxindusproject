import express from "express";
const router  = express.Router();
import * as ctrl from "../controllers/user.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

router.use(protect);

router.get  ("/",                   restrictTo("admin"),                     ctrl.getAllUsers);
router.get  ("/:id",                                                         ctrl.getUserById);
router.patch("/change-password",                                             ctrl.changePassword);
router.patch("/:id",                                                         ctrl.updateUser);
router.delete("/:id",               restrictTo("admin"),                     ctrl.deleteUser);

export default router;
