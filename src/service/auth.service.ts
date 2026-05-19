import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import type { LoginDto, RegisterDto } from "../dtos/auth.dto";
import * as userService from "./user.service";
import { status } from "http-status";
import ApiError from "../utils/ApiError";

const login = async (dto: LoginDto) => {
  const user = await prisma.user.findUnique({ where: { email: dto.email } });

  if (!user) {
    throw new ApiError(status.NOT_FOUND, "User not found");
  }

  const isPasswordValid = await bcrypt.compare(dto.password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credential");
  }

  return { id: user.id, email: user.email, role: user.role };
};

const register = async (dto: RegisterDto) => {
  const user = await userService.create(dto);
  return { id: user.id, email: user.email, role: user.role };
};

export { login, register };
