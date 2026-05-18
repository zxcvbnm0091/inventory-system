import express from "express";
import productController from "../controllers/product.controller";
import validate from "../middlewares/validate";
import { CreateProductSchema, UpdateProductSchema } from "../dtos/product.dto";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/all", protect, productController.getAllProduct);
router.get("/:id", protect, productController.getProductById);

router.post(
  "/",
  protect,
  validate(CreateProductSchema),
  productController.createProduct,
);

router.patch(
  "/:id",
  protect,
  validate(UpdateProductSchema),
  productController.updateProduct,
);

router.post("/delete/:id", protect, productController.deleteProduct);

export default router;
