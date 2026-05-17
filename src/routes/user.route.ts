import express from "express";
import UserController from "../controllers/user.controller";
import { protect, authorizeRoles } from "../middlewares/auth.middleware";
import validate from "../middlewares/validate";
import { CreateUserSchema, UpdateUserSchema } from "../dtos/user.dto";
const router = express.Router();

router.get("/all", protect, authorizeRoles("ADMIN"), UserController.getAllUser);
router.get(
  "/:id",
  protect,
  authorizeRoles("ADMIN"),
  UserController.getUserById,
);
router.post(
  "/",
  protect,
  authorizeRoles("ADMIN"),
  validate(CreateUserSchema),
  UserController.createUser,
);
router.patch(
  "/:id",
  protect,
  validate(UpdateUserSchema),
  UserController.updateUser,
);
router.delete("/delete", protect, UserController.deleteUser);

export default router;
