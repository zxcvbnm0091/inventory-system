import * as orderService from "../service/order.service";
import type { Request, Response } from "express";
import type { CreateOrderDto, UpdateOrderDto } from "../dtos/order.dto";
import catchAsync from "../utils/catchAsync";
import status from "http-status";

class OrderController {
  static getAllOrder = catchAsync(async (req: Request, res: Response) => {
    const orders = await orderService.getAll();

    res.status(status.OK).json({
      message: "Fetch all orders",
      success: true,
      data: orders,
    });
  });

  static getOrderById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const order = await orderService.getById(id);

    res.status(status.OK).json({
      message: `Showing order by id ${id}`,
      success: true,
      data: order,
    });
  });

  static getOrderByUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id || req.user!.id;
    const orders = await orderService.getAll(userId as string);

    res.status(status.OK).json({
      message: "Showing orders by user",
      success: true,
      data: orders,
    });
  });

  static createOrder = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const data = req.body as CreateOrderDto;
    const order = await orderService.create(data, userId);

    res.status(status.CREATED).json({
      message: "Order created",
      success: true,
      data: order,
    });
  });

  static updateOrder = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const data = req.body as UpdateOrderDto;
    const order = await orderService.update(id, data);

    res.status(status.OK).json({
      message: "Order updated",
      success: true,
      data: order,
    });
  });

  static deleteOrder = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    await orderService.remove(id);

    res.status(status.NO_CONTENT).json({
      message: "Order deleted",
      success: true,
    });
  });
}

export default OrderController;
