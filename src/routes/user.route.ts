import express from "express";
import UserController from "../controllers/user.controller";
import ProductController from "../controllers/product.controller";
import { protect, authorizeRoles } from "../middlewares/auth.middleware";
import validate from "../middlewares/validate";
import { CreateUserSchema, UpdateUserSchema } from "../dtos/user.dto";
import OrderController from "../controllers/order.controller";
const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("ADMIN"),
  validate(CreateUserSchema),
  UserController.createUser,
);
router.get("/", protect, authorizeRoles("ADMIN"), UserController.getAllUser);
router.get("/:id", protect, UserController.getUserById);

router.patch(
  "/:id",
  protect,
  validate(UpdateUserSchema),
  UserController.updateUser,
);
router.delete("/:id", protect, UserController.deleteUser);
router.get("/:id/products", protect, ProductController.getProductsByUser);
router.get("/:id/orders", protect, OrderController.getAllOrder);

export default router;
