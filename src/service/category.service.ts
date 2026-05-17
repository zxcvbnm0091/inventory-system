import { prisma } from "../lib/prisma";
import { Prisma } from "../generated/prisma/client";
import bcrypt from "bcryptjs";
import type {
  CreateCategoryDto,
  UpdateCategoryDto,
} from "../dtos/category.dto";
import AppError from "../utils/AppError";

const getAll = async () => {
  return await prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },
  });
};

const getById = async (categoryId: string) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    throw new AppError("Category Not Found", 404);
  }

  return category;
};

const create = async (dto: CreateCategoryDto) => {
  const existingcategory = await prisma.category.findUnique({
    where: { name: dto.name },
  });

  if (existingcategory) {
    throw new AppError("Category already exists", 409);
  }

  const categorySelect: Prisma.CategorySelect = {
    id: true,
    name: true,
  };

  const newcategory = await prisma.category.create({
    data: {
      name: dto.name,
    },
    select: categorySelect,
  });

  return newcategory;
};

const update = async (categoryId: string, dto: UpdateCategoryDto) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });
  if (!category) {
    throw new AppError("Category not found", 404);
  }

  const data = { ...dto };

  const updatecategory = await prisma.category.update({
    where: { id: categoryId },
    data: data,
  });

  return updatecategory;
};

const remove = async (categoryId: string) => {
  await getById(categoryId);
  return prisma.category.delete({ where: { id: categoryId } });
};

export { getAll, getById, create, update, remove };
