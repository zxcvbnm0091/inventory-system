import express from "express";
import orderController from "../controllers/order.controller";
import validate from "../middlewares/validate";
import { CreateOrderSchema, UpdateOrderSchema } from "../dtos/order.dto";
import OrderItemController from "../controllers/order.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", protect, orderController.getAllOrder);
router.get("/:id", protect, orderController.getOrderById);

router.post(
  "/",
  protect,
  validate(CreateOrderSchema),
  orderController.createOrder,
);

router.patch(
  "/:id",
  protect,
  validate(UpdateOrderSchema),
  orderController.updateOrder,
);

router.post("/delete/:id", protect, orderController.deleteOrder);
router.get(
  "/:orderId/order-items",
  protect,
  OrderItemController.getOrdersByUser,
);
export default router;
