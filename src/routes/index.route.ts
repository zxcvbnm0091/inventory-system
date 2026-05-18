import express from "express";
import userRoutes from "./user.route";
import authRoutes from "./auth.route";
import productRoutes from "./product.route";
import categoryRoutes from "./category.route";
import orderRoutes from "./order.route";
import orderItemRoutes from "./order-item.route";
const router = express.Router();

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/orders", orderRoutes);
router.use("/order-items", orderItemRoutes);
export default router;
