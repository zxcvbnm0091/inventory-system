import { prisma } from "../lib/prisma";
import { Prisma } from "../generated/prisma/client";
import type {
  CreateOrderItemDto,
  UpdateOrderItemDto,
} from "../dtos/order-item.dto";
import AppError from "../utils/AppError";

const orderItemSelect = {
  id: true,
  orderId: true,
  productId: true,
  quantity: true,
  unitPrice: true,
} satisfies Prisma.OrderItemSelect;

const getAll = async (orderId?: string) => {
  return await prisma.orderItem.findMany({
    where: orderId ? { orderId } : undefined,
    select: orderItemSelect,
  });
};

const getById = async (orderItemId: string) => {
  const orderItem = await prisma.orderItem.findUnique({
    where: { id: orderItemId },
    select: orderItemSelect,
  });

  if (!orderItem) throw new AppError("Order item not found", 404);

  return orderItem;
};

const create = async (dto: CreateOrderItemDto) => {
  // check order exists
  const order = await prisma.order.findUnique({ where: { id: dto.orderId } });
  if (!order) throw new AppError("Order not found", 404);

  // check product exists and has enough stock
  const product = await prisma.product.findUnique({
    where: { id: dto.productId },
  });
  if (!product) throw new AppError("Product not found", 404);
  if (product.quantityInStock < dto.quantity) {
    throw new AppError("Insufficient stock", 400);
  }

  const newOrderItem = await prisma.orderItem.create({
    data: { ...dto },
    select: orderItemSelect,
  });

  return newOrderItem;
};

const update = async (orderItemId: string, dto: UpdateOrderItemDto) => {
  await getById(orderItemId);

  const updatedOrderItem = await prisma.orderItem.update({
    where: { id: orderItemId },
    data: dto,
    select: orderItemSelect,
  });

  return updatedOrderItem;
};

const remove = async (orderItemId: string) => {
  await getById(orderItemId);
  return prisma.orderItem.delete({ where: { id: orderItemId } });
};

export { getAll, getById, create, update, remove };
