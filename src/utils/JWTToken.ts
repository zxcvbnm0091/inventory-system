import jwt from "jsonwebtoken";
import type { Response } from "express";
import type { JWTPayload } from "../types/index";
import config from "../config/config";

const getMilliseconds = (timeStr: string): number => {
  const unit = timeStr.slice(-1);
  const value = parseInt(timeStr);

  if (isNaN(value)) return 0;

  const msMap: Record<string, number> = {
    d: 24 * 60 * 60 * 1000,
    h: 60 * 60 * 1000,
    m: 60 * 1000,
    s: 1000,
  };

  return value * (msMap[unit] ?? 0);
};

const sendTokenResponse = (
  payload: JWTPayload,
  statusCode: number,
  res: Response,
): void => {
  if (!config.jwt.secret) {
    throw new Error("JWT_SECRET environment variable is required");
  }
  const durationMs = getMilliseconds(config.jwt.expiresIn ?? "7d");

  const token = jwt.sign(payload, config.jwt.secret, {
    expiresIn: durationMs / 1000,
  });

  res
    .status(statusCode)
    .cookie("token", token, {
      expires: new Date(Date.now() + durationMs),
      httpOnly: true,
      secure: config.env === "production",
      sameSite: "strict",
    })
    .json({
      success: true,
      user: {
        id: payload.id,
        email: payload.email,
        role: payload.role,
      },
    });
};

export { sendTokenResponse };
