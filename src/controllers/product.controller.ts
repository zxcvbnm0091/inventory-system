import * as productService from "../service/product.service";
import type { Request, Response } from "express";
import type { CreateProductDto, UpdateProductDto } from "../dtos/product.dto";

class ProductController {
  // GET ALL
  static async getAllProduct(req: Request, res: Response) {
    try {
      const products = await productService.getAll();
      res.status(200).json(products);
    } catch (error: any) {
      res.status(error.statusCode ?? 500).json({ error: error.message });
    }
  }

  // GET BY ID
  static async getProductById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await productService.getById(id as string);
      res.status(200).json(product);
    } catch (error: any) {
      res.status(error.statusCode ?? 500).json({ error: error.message });
    }
  }

  // CREATE
  static async createProduct(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const product = await productService.create(
        req.body as CreateProductDto,
        userId,
      );
      res.status(201).json(product);
    } catch (error: any) {
      res.status(error.statusCode ?? 500).json({ error: error.message });
    }
  }

  // UPDATE
  static async updateProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await productService.update(
        id as string,
        req.body as UpdateProductDto,
      );
      res.status(200).json(product);
    } catch (error: any) {
      res.status(error.statusCode ?? 500).json({ error: error.message });
    }
  }

  // DELETE
  static async deleteProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await productService.remove(id as string);
      res.status(204).send();
    } catch (error: any) {
      res.status(error.statusCode ?? 500).json({ error: error.message });
    }
  }
}

export default ProductController;
