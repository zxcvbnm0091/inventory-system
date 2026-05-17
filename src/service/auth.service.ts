import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import type { LoginDto, RegisterDto } from "../dtos/auth.dto";
import * as userService from "./user.service";

import AppError from "../utils/AppError";

const login = async (dto: LoginDto) => {
  const user = await prisma.user.findUnique({ where: { email: dto.email } });

  if (!user) {
    throw new AppError("Invalid credential", 401);
  }

  const isPasswordValid = await bcrypt.compare(dto.password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid credential", 401);
  }

  return { id: user.id, email: user.email, role: user.role };
};

const register = async (dto: RegisterDto) => {
  const user = await userService.create(dto);
  return { id: user.id, email: user.email, role: user.role };
};

export { login, register };
