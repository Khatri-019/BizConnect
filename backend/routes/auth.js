import express from "express";
import { register, login, refresh, logout, me ,registerExpert,checkUsername } from "../controllers/authController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.post("/check-username", checkUsername);
router.post("/expert-register", registerExpert);

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", protect, me);


export default router;
