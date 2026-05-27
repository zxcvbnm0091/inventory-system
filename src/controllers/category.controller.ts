import * as categoryService from "../service/category.service";
import type { Request, Response } from "express";
import type {
  CreateCategoryDto,
  UpdateCategoryDto,
} from "../dtos/category.dto";
import catchAsync from "../utils/catchAsync";
import status from "http-status";

class categoryController {
  // GET ALL CATEGORIES
  static getAllCategory = catchAsync(async (req: Request, res: Response) => {
    const categories = await categoryService.getAll();

    res.status(status.OK).json({
      message: "Fetch all category",
      success: true,
      count: categories.length,
      data: categories,
    });
  });

  // GET CATEGORY BY ID
  static getCategoryById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const category = await categoryService.getById(id);

    res.status(status.OK).json({
      message: "Fetch category",
      success: true,
      data: category,
    });
  });

  // CREATE CATEGORY
  static createCategory = catchAsync(async (req: Request, res: Response) => {
    const newcategory = await categoryService.create(
      req.body as CreateCategoryDto,
    );

    res.status(status.CREATED).json({
      message: "Category Created",
      success: true,
      data: newcategory,
    });
  });

  // UPDATE CATEGORY
  static updateCategory = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const updatedCategory = await categoryService.update(
      id,
      req.body as UpdateCategoryDto,
    );

    res.status(status.OK).json({
      message: "Category updated",
      success: true,
      data: updatedCategory,
    });
  });

  // DELETE CATEGORY
  static deleteCategory = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    await categoryService.remove(id);

    res.status(status.OK).json({
      message: "Category deleted",
      success: true,
    });
  });
}

export default categoryController;
