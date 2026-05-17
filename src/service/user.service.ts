import { prisma } from "../lib/prisma";
import { Prisma } from "../generated/prisma/client";
import bcrypt from "bcryptjs";
import type { CreateUserDto, UpdateUserDto } from "../dtos/user.dto";
import AppError from "../utils/AppError";

const hash = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  return passwordHash;
};

const getAll = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
};

const getById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("User Not Found", 404);
  }

  return user;
};

const create = async (dto: CreateUserDto) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: dto.email },
  });

  if (existingUser) {
    throw new AppError("User already exists", 409);
  }

  const passwordHash = await hash(dto.password);

  const userSelect: Prisma.UserSelect = {
    id: true,
    name: true,
    email: true,
  };

  const newUser = await prisma.user.create({
    data: {
      name: dto.name,
      email: dto.email,
      role: dto.role,
      password: passwordHash,
    },
    select: userSelect,
  });

  return newUser;
};

const update = async (userId: string, dto: UpdateUserDto) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const data = { ...dto };

  if (data.password) {
    data.password = await hash(data.password);
  }

  const updateUser = await prisma.user.update({
    where: { id: userId },
    data: data,
    select: { id: true, name: true, email: true, role: true },
  });

  return updateUser;
};

const remove = async (userId: string) => {
  await getById(userId);
  return prisma.user.delete({ where: { id: userId } });
};

export { getAll, getById, create, update, remove };
