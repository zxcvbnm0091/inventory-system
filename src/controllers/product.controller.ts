import * as productService from "../service/product.service";
import type { Request, Response } from "express";
import type { CreateProductDto, UpdateProductDto } from "../dtos/product.dto";
import catchAsync from "../utils/catchAsync";

class ProductController {
  static getAllProduct = catchAsync(async (req: Request, res: Response) => {
    const products = await productService.getAll();

    res.status(200).json({
      message: "Fetch all product",
      success: true,
      count: products.length,
      data: products,
    });
  });

  static getProductById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const product = await productService.getById(id as string);

    res.status(200).json({
      message: `Showing product by id: ${id}`,
      success: true,
      data: product,
    });
  });

  static getProductByUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id || req.user!.id;
    const product = await productService.getAll(userId as string);

    res.status(200).json({
      message: "Showing product by user",
      success: true,
      count: product.length,
      data: product,
    });
  });

  static createProduct = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const product = await productService.create(
      req.body as CreateProductDto,
      userId,
    );

    res.status(201).json({
      message: "Product created",
      success: true,
    });
  });

  static updateProduct = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await productService.update(
      id as string,
      req.body as UpdateProductDto,
    );

    res.status(200).json({
      message: "Product updated",
      success: true,
    });
  });

  static deleteProduct = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    await productService.remove(id as string);

    res.status(204).json({
      message: "Product deleted",
      success: true,
    });
  });
}

export default ProductController;
