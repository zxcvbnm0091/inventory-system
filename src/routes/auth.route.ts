import express from "express";
import AuthController from "../controllers/auth.controller";
import validate from "../middlewares/validate";
import { protect } from "../middlewares/auth.middleware";
import { RegisterSchema, LoginSchema } from "../dtos/auth.dto";

const router = express.Router();

router.post("/register", validate(RegisterSchema), AuthController.register);
router.post("/login", validate(LoginSchema), AuthController.login);
router.post("/logout", protect, AuthController.logout);

export default router;
