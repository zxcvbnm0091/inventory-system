import express from "express";
import OrderItemController from "../controllers/order-item.controller";
import validate from "../middlewares/validate";
import { protect } from "../middlewares/auth.middleware";
import {
  CreateOrderItemSchema,
  UpdateOrderItemSchema,
} from "../dtos/order-item.dto";

const router = express.Router();

router.get("/", protect, OrderItemController.getAll);
router.get("/:orderItemId", protect, OrderItemController.getById);
router.post(
  "/",
  protect,
  validate(CreateOrderItemSchema),
  OrderItemController.create,
);
router.put(
  "/:orderItemId",
  protect,
  validate(UpdateOrderItemSchema),
  OrderItemController.update,
);
router.delete("/:orderItemId", protect, OrderItemController.remove);

export default router;
