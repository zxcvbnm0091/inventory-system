import { prisma } from "../lib/prisma";
import { Prisma } from "../generated/prisma/client";
import type {
  CreateOrderItemDto,
  UpdateOrderItemDto,
} from "../dtos/order-item.dto";
import ApiError from "../utils/ApiError";
import { status } from "http-status";
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

  if (!orderItem) throw new ApiError(status.NOT_FOUND, "Order item not found");

  return orderItem;
};

const create = async (dto: CreateOrderItemDto) => {
  // check order exists
  const order = await prisma.order.findUnique({ where: { id: dto.orderId } });
  if (!order) throw new ApiError(status.NOT_FOUND, "Order not found");

  // check product exists and has enough stock
  const product = await prisma.product.findUnique({
    where: { id: dto.productId },
  });
  if (!product) throw new ApiError(status.NOT_FOUND, "Product not found");
  if (product.quantityInStock < dto.quantity) {
    throw new ApiError(status.BAD_REQUEST, "Insufficient stock");
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
