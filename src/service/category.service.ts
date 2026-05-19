import { prisma } from "../lib/prisma";
import { Prisma } from "../generated/prisma/client";
import type {
  CreateCategoryDto,
  UpdateCategoryDto,
} from "../dtos/category.dto";
import ApiError from "../utils/ApiError";
import { status } from "http-status";
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
    throw new ApiError(status.NOT_FOUND, "Category Not Found");
  }

  return category;
};

const create = async (dto: CreateCategoryDto) => {
  const existingcategory = await prisma.category.findUnique({
    where: { name: dto.name },
  });

  if (existingcategory) {
    throw new ApiError(status.CONFLICT, "Category already exists");
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
    throw new ApiError(status.NOT_FOUND, "Category not found");
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
