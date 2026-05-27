import * as authService from "../service/auth.service";
import type { Request, Response } from "express";
import type { LoginDto, RegisterDto } from "../dtos/auth.dto";
import type { JWTAccessPayload, JWTRefreshPayload } from "../types";
import {
  generateAccessToken,
  generateRefreshToken,
  cookieOptions,
} from "../utils/JWTToken";
import catchAsync from "../utils/catchAsync";
import status from "http-status";
import config from "../config/config";

class AuthController {
  static login = catchAsync(async (req: Request, res: Response) => {
    const user = await authService.login(req.body as LoginDto);

    const accessPayload: JWTAccessPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const refreshPayload: JWTRefreshPayload = {
      userId: user.id,
    };

    const accessToken = generateAccessToken(accessPayload);
    const refreshToken = generateRefreshToken(refreshPayload);

    res
      .cookie(
        "accessToken",
        accessToken,
        cookieOptions(config.jwt.accessExpiresMs),
      )
      .cookie(
        "refreshToken",
        refreshToken,
        cookieOptions(config.jwt.refreshExpiresMs),
      )
      .status(status.OK)
      .json({
        message: "Login success",
        success: true,
        user: user,
      });
  });

  static register = catchAsync(async (req: Request, res: Response) => {
    const user = await authService.register(req.body as RegisterDto);

    const accessPayload: JWTAccessPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const refreshPayload: JWTRefreshPayload = {
      userId: user.id,
    };

    const accessToken = generateAccessToken(accessPayload);
    const refreshToken = generateRefreshToken(refreshPayload);

    res
      .cookie(
        "accessToken",
        accessToken,
        cookieOptions(config.jwt.accessExpiresMs),
      )
      .cookie(
        "refreshToken",
        refreshToken,
        cookieOptions(config.jwt.refreshExpiresMs),
      )
      .status(status.OK)
      .json({
        message: "Register success",
        success: true,
        user: user,
      });
  });

  // LOGOUT
  static logout = catchAsync(async (req: Request, res: Response) => {
    // delete from DB so the token can't be reused
    await authService.logout(req.cookies?.refreshToken);

    res
      .clearCookie("accessToken", cookieOptions(0))
      .clearCookie("refreshToken", cookieOptions(0))
      .status(status.OK)
      .json({ message: "Logged out success", success: true });
  });

  static refreshToken = catchAsync(async (req: Request, res: Response) => {
    const token = req.cookies?.refreshToken;

    const { newRefreshToken, accessPayload } = await authService.refresh(token);

    const newAccessToken = generateAccessToken(accessPayload);

    res
      .cookie(
        "accessToken",
        newAccessToken,
        cookieOptions(config.jwt.accessExpiresMs),
      )
      .cookie(
        "refreshToken",
        newRefreshToken,
        cookieOptions(config.jwt.refreshExpiresMs),
      )
      .status(status.OK)
      .json({ message: "Token refreshed", success: true });
  });
}

export default AuthController;
