import express from "express";
import { protect, authorizeRoles } from "../middlewares/auth.js";
const router = express.Router();

router.get("/admin-only", protect, authorizeRoles("admin"), (req, res) => {
  res.json({ secret: "admin data" });
});

export default router;
