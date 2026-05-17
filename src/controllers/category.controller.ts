import * as categoryService from "../service/category.service";
import type { Request, Response } from "express";
import type {
  CreateCategoryDto,
  UpdateCategoryDto,
} from "../dtos/category.dto";

class categoryController {
  // GET ALL categoryS
  static async getAllCategory(req: Request, res: Response) {
    try {
      const categories = await categoryService.getAll();

      res.status(200).json({
        message: "Fetch all categories",
        success: true,
        count: categories.length,
        data: categories,
      });
    } catch (error: any) {
      res.status(error.statusCode ?? 500).json({
        error: error.message,
      });
    }
  }

  // GET category BY ID
  static async getCategoryById(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const category = await categoryService.getById(id);

      res.status(200).json({
        message: "Fetch category",
        success: true,
        data: category,
      });
    } catch (error: any) {
      res.status(error.statusCode ?? 500).json({
        error: error.message,
      });
    }
  }

  // CREATE NEW category
  static async createCategory(req: Request, res: Response) {
    try {
      const newcategory = await categoryService.create(
        req.body as CreateCategoryDto,
      );
      res.status(201).json({
        message: "category created",
        success: true,
        data: newcategory,
      });
    } catch (error: any) {
      res.status(error.statusCode ?? 500).json({ error: error.message });
    }
  }

  // UPDATE category
  static async updateCategory(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };

      const updatecategory = await categoryService.update(
        id,
        req.body as UpdateCategoryDto,
      );

      res.status(200).json({
        message: "Used data updated",
        success: true,
        data: updatecategory,
      });
    } catch (error: any) {
      res.status(error.statusCode ?? 500).json({
        error: error.message,
      });
    }
  }

  // DELETE category
  static async deleteCategory(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      await categoryService.remove(id);

      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.status(200).json({
        message: "category deleted",
        success: true,
      });
    } catch (error: any) {
      res.status(error.statusCode ?? 500).json({ error: error.message });
    }
  }
}

export default categoryController;
