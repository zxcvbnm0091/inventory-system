import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import type { LoginDto, RegisterDto } from "../dtos/auth.dto";
import * as userService from "./user.service";
import status from "http-status";
import ApiError from "../utils/ApiError";
import jwt from "jsonwebtoken";
import config from "../config/config";
import {
  generateAccessToken,
  generateRefreshToken,
  cookieOptions,
} from "../utils/JWTToken";

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

const refresh = async (refreshToken: string) => {
  if (!config.jwt.refresh) throw new Error("JWT_REFRESH_SECRET is required");

  const payload = jwt.verify(refreshToken, config.jwt.refresh) as {
    userId: string;
  };

  const existing = await prisma.token.findUnique({
    where: { userId: payload.userId },
  });

  if (!existing || existing.token !== refreshToken || existing.blacklisted) {
    throw new ApiError(status.UNAUTHORIZED, "Invalid refresh token");
  }

  const newToken = generateRefreshToken({ userId: payload.userId });

  await prisma.token.update({
    where: { userId: payload.userId },
    data: {
      token: newToken,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  // fetch user to build access token payload
  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) throw new ApiError(status.NOT_FOUND, "User not found");

  return {
    newRefreshToken: newToken,
    accessPayload: { id: user.id, email: user.email, role: user.role },
  };
};

const logout = async (refreshToken: string) => {
  if (!refreshToken) return;

  try {
    const payload = jwt.verify(refreshToken, config.jwt.refresh!) as {
      userId: string;
    };
    await prisma.token.delete({ where: { userId: payload.userId } });
  } catch {}
};

export { login, register, refresh, logout };
