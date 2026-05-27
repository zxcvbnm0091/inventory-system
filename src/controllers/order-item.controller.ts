import * as orderItemService from "../service/order-item.service";
import type { Request, Response } from "express";
import type {
  CreateOrderItemDto,
  UpdateOrderItemDto,
} from "../dtos/order-item.dto";
import catchAsync from "../utils/catchAsync";
import status from "http-status";

class OrderItemController {
  static getAll = catchAsync(async (req: Request, res: Response) => {
    const orderItems = await orderItemService.getAll();

    res.status(status.OK).json({
      message: "Fetch all order items",
      success: true,
      data: orderItems,
    });
  });

  static getOrderItemById = catchAsync(async (req: Request, res: Response) => {
    const { orderItemId } = req.params as { orderItemId: string };
    const orderItem = await orderItemService.getById(orderItemId);

    res.status(status.OK).json({
      message: "Get order item by id",
      success: true,
      data: orderItem,
    });
  });

  static getByOrder = catchAsync(async (req: Request, res: Response) => {
    const { orderId } = req.params as { orderId: string };
    const orderItems = await orderItemService.getAll(orderId);

    res.status(status.OK).json({
      message: "Fetch orderItems by order",
      success: true,
      data: orderItems,
    });
  });

  static createOrderItem = catchAsync(async (req: Request, res: Response) => {
    const data = req.body as CreateOrderItemDto;
    const orderItem = await orderItemService.create(data);

    res.status(status.CREATED).json({
      message: "Order item created",
      success: true,
      data: orderItem,
    });
  });

  static updateOrderItem = catchAsync(async (req: Request, res: Response) => {
    const { orderItemId } = req.params as { orderItemId: string };
    const data = req.body as UpdateOrderItemDto;
    const updatedOrderItem = await orderItemService.update(orderItemId, data);

    res.status(status.OK).json({
      message: "Order Item updated",
      success: true,
      data: updatedOrderItem,
    });
  });

  static deleteOrderItem = catchAsync(async (req: Request, res: Response) => {
    const { orderItemId } = req.params as { orderItemId: string };
    await orderItemService.remove(orderItemId);

    res.status(status.OK).json({
      message: "Order item deleted",
      success: true,
    });
  });
}

export default OrderItemController;
