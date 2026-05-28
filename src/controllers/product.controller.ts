import * as productService from "../service/product.service";
import type { Request, Response } from "express";
import type { CreateProductDto, UpdateProductDto } from "../dtos/product.dto";
import catchAsync from "../utils/catchAsync";
import status from "http-status";

class ProductController {
  static getAllProduct = catchAsync(async (req: Request, res: Response) => {
    const products = await productService.getAll();

    res.status(status.OK).json({
      message: "Fetch all product",
      success: true,
      count: products.length,
      data: products,
    });
  });

  static getProductById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    const product = await productService.getById(id);

    res.status(status.OK).json({
      message: `Showing product by id: ${id}`,
      success: true,
      data: product,
    });
  });

  static getProductByUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id || req.user!.id;
    const products = await productService.getAll(userId as string);

    res.status(status.OK).json({
      message: "Showing product by user",
      success: true,
      count: products.length,
      data: products,
    });
  });

  static createProduct = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const data = req.body as CreateProductDto;
    const product = await productService.create(data, userId);

    res.status(status.CREATED).json({
      message: "Product created",
      success: true,
      data: product,
    });
  });

  static updateProduct = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const data = req.body as UpdateProductDto;
    const product = await productService.update(id, data);

    res.status(status.OK).json({
      message: "Product updated",
      success: true,
      data: product,
    });
  });

  static deleteProduct = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    await productService.remove(id);

    res.status(status.NO_CONTENT).json({
      message: "Product deleted",
      success: true,
    });
  });
}

export default ProductController;
