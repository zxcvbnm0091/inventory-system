import { prisma } from "../lib/prisma";
import { Prisma } from "../generated/prisma/client";
import type { CreateProductDto, UpdateProductDto } from "../dtos/product.dto";
import ApiError from "../utils/ApiError";
import { status } from "http-status";

const productSelect = {
  id: true,
  name: true,
  description: true,
  price: true,
  quantityInStock: true,
  categoryId: true,
  userId: true,
} satisfies Prisma.ProductSelect;

const getAll = async (userId?: string) => {
  return await prisma.product.findMany({
    where: userId ? { userId } : undefined,
    orderBy: { createdAt: "desc" },
    select: productSelect,
  });
};

const getById = async (productId: string) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: productSelect,
  });

  if (!product) {
    throw new ApiError(status.NOT_FOUND, "Product not found");
  }

  return product;
};

const create = async (dto: CreateProductDto, userId: string) => {
  const newProduct = await prisma.product.create({
    data: {
      ...dto,
      userId,
    },
    select: productSelect,
  });

  return newProduct;
};

const update = async (productId: string, dto: UpdateProductDto) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) throw new ApiError(status.NOT_FOUND, "Product not found");

  const updateProduct = await prisma.product.update({
    where: { id: productId },
    data: dto,
    select: productSelect,
  });

  return updateProduct;
};

const remove = async (productId: string) => {
  await getById(productId);
  return prisma.product.delete({ where: { id: productId } });
};

export { getAll, getById, create, update, remove };
