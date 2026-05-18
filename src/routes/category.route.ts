import express from "express";
import categoryController from "../controllers/category.controller";
import validate from "../middlewares/validate";
import {
  CreateCategorySchema,
  UpdateCategorySchema,
} from "../dtos/category.dto";
import { protect } from "../middlewares/auth.middleware";
const router = express.Router();

router.get("/", protect, categoryController.getAllCategory);
router.get("/:id", protect, categoryController.getCategoryById);

router.post(
  "/",
  protect,
  validate(CreateCategorySchema),
  categoryController.createCategory,
);

router.patch(
  "/:id",
  protect,
  validate(UpdateCategorySchema),
  categoryController.updateCategory,
);

router.post("/delete/:id", protect, categoryController.deleteCategory);

export default router;
