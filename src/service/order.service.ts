import { prisma } from "../lib/prisma";
import { Prisma } from "../generated/prisma/client";
import type { CreateOrderDto, UpdateOrderDto } from "../dtos/order.dto";
import ApiError from "../utils/ApiError";
import { status } from "http-status";
const orderSelect = {
  id: true,
  status: true,
  totalPrice: true,
  customerName: true,
  customerEmail: true,
  userId: true,
} satisfies Prisma.OrderSelect;

const getAll = async (userId?: string) => {
  return await prisma.order.findMany({
    where: userId ? { userId } : undefined,
    orderBy: { createdAt: "desc" },
    select: orderSelect,
  });
};

const getById = async (orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: orderSelect,
  });

  if (!order) {
    throw new ApiError(status.NOT_FOUND, "order not found");
  }

  return order;
};

const create = async (dto: CreateOrderDto, userId: string) => {
  const newOrder = await prisma.order.create({
    data: {
      ...dto,
      userId,
    },
    select: orderSelect,
  });

  return newOrder;
};

const update = async (orderId: string, dto: UpdateOrderDto) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) throw new ApiError(status.NOT_FOUND, "order not found");

  const updateOrder = await prisma.order.update({
    where: { id: orderId },
    data: dto,
    select: orderSelect,
  });

  return updateOrder;
};

const remove = async (orderId: string) => {
  await getById(orderId);
  return prisma.order.delete({ where: { id: orderId } });
};

export { getAll, getById, create, update, remove };
