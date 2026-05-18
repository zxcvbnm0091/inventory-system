import * as orderService from "../service/order.service";
import type { Request, Response } from "express";
import type { CreateOrderDto, UpdateOrderDto } from "../dtos/order.dto";
import { success } from "zod";

class OrderController {
  // GET ALL
  static async getAllOrder(req: Request, res: Response) {
    try {
      const orders = await orderService.getAll();
      res.status(200).json(orders);
    } catch (error: any) {
      res.status(error.statusCode ?? 500).json({ error: error.message });
    }
  }

  // GET BY ID
  static async getOrderById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const order = await orderService.getById(id as string);
      res.status(200).json(order);
    } catch (error: any) {
      res.status(error.statusCode ?? 500).json({ error: error.message });
    }
  }

  // GET PRODUCT BY USERID
  static async getOrdersByUser(req: Request, res: Response) {
    try {
      const userId = req.params.id || req.user!.id;
      const orders = await orderService.getAll(userId as string);

      res.status(200).json({
        message: "Showing orders by user",
        success: true,
        count: orders.length,
        data: orders,
      });
    } catch (error: any) {
      res.status(error.statusCode ?? 500).json({ error: error.message });
    }
  }

  // CREATE
  static async createOrder(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const order = await orderService.create(
        req.body as CreateOrderDto,
        userId,
      );
      res.status(201).json({
        message: "Order created",
        success: true,
        data: order,
      });
    } catch (error: any) {
      res.status(error.statusCode ?? 500).json({ error: error.message });
    }
  }

  // UPDATE
  static async updateOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const order = await orderService.update(
        id as string,
        req.body as UpdateOrderDto,
      );
      res.status(200).json({
        message: "Order updated",
        success: true,
        data: order,
      });
    } catch (error: any) {
      res.status(error.statusCode ?? 500).json({ error: error.message });
    }
  }

  // DELETE
  static async deleteOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await orderService.remove(id as string);
      res.status(204).send();
    } catch (error: any) {
      res.status(error.statusCode ?? 500).json({ error: error.message });
    }
  }
}

export default OrderController;
