import * as orderItemService from "../service/order-item.service";
import type { Request, Response } from "express";
import type {
  CreateOrderItemDto,
  UpdateOrderItemDto,
} from "../dtos/order-item.dto";

class OrderItemController {
  // GET ALL
  static async getAll(req: Request, res: Response) {
    try {
      const orderItems = await orderItemService.getAll();
      res.status(200).json(orderItems);
    } catch (error: any) {
      res.status(error.statusCode ?? 500).json({ error: error.message });
    }
  }

  // GET BY ID
  static async getById(req: Request, res: Response) {
    try {
      const { orderItemId } = req.params;
      const orderItem = await orderItemService.getById(orderItemId as string);
      res.status(200).json(orderItem);
    } catch (error: any) {
      res.status(error.statusCode ?? 500).json({ error: error.message });
    }
  }

  // GET BY ORDER ← for nested route GET /api/orders/:orderId/order-items
  static async getByOrder(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const orderItems = await orderItemService.getAll(orderId as string);
      res.status(200).json(orderItems);
    } catch (error: any) {
      res.status(error.statusCode ?? 500).json({ error: error.message });
    }
  }

  // CREATE
  static async create(req: Request, res: Response) {
    try {
      const orderItem = await orderItemService.create(
        req.body as CreateOrderItemDto,
      );
      res.status(201).json(orderItem);
    } catch (error: any) {
      res.status(error.statusCode ?? 500).json({ error: error.message });
    }
  }

  // UPDATE
  static async update(req: Request, res: Response) {
    try {
      const { orderItemId } = req.params;
      const orderItem = await orderItemService.update(
        orderItemId as string,
        req.body as UpdateOrderItemDto,
      );
      res.status(200).json(orderItem);
    } catch (error: any) {
      res.status(error.statusCode ?? 500).json({ error: error.message });
    }
  }

  // DELETE
  static async remove(req: Request, res: Response) {
    try {
      const { orderItemId } = req.params;
      await orderItemService.remove(orderItemId as string);
      res.status(204).send();
    } catch (error: any) {
      res.status(error.statusCode ?? 500).json({ error: error.message });
    }
  }
}

export default OrderItemController;
