import jwt from "jsonwebtoken";
import type { Response } from "express";
import type { JWTAccessPayload, JWTRefreshPayload } from "../types/index";
import config from "../config/config";

export const generateAccessToken = (payload: JWTAccessPayload): string => {
  if (!config.jwt.access) throw new Error("JWT_ACCESS_SECRET is not defined");
  return jwt.sign(payload, config.jwt.access, {
    expiresIn: config.jwt.accessExpiresIn,
  });
};

export const generateRefreshToken = (payload: JWTRefreshPayload): string => {
  if (!config.jwt.refresh) throw new Error("JWT_REFRESH_SECRET is not defined");
  return jwt.sign(payload, config.jwt.refresh, {
    expiresIn: config.jwt.refreshExpiresIn,
  });
};

export const cookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: config.env === "production",
  sameSite: "strict" as const,
  maxAge,
});

// export const sendTokenResponse = (
//   accessPayload: JWTAccessPayload,
//   refreshPayload: JWTRefreshPayload,
//   statusCode: number,
//   res: Response,
// ): void => {
//   const accessToken = generateAccessToken(accessPayload);
//   const refreshToken = generateRefreshToken(refreshPayload);

//   res
//     .status(statusCode)
//     .cookie("token", accessToken, {
//       httpOnly: true,
//       secure: config.env === "production",
//       sameSite: "strict",
//       maxAge: config.jwt.accessExpiresMs,
//     })
//     .cookie("refreshToken", refreshToken, {
//       httpOnly: true,
//       secure: config.env === "production",
//       sameSite: "strict",
//       maxAge: config.jwt.refreshExpiresMs,
//     })
//     .json({
//       success: true,
//       user: {
//         id: accessPayload.id,
//         email: accessPayload.email,
//         role: accessPayload.role,
//       },
//     });
// };
