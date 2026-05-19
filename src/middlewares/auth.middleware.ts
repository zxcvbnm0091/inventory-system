import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import config from "../config/config";
import ApiError from "../utils/ApiError";
import status from "http-status";

interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

if (!config.jwt.secret) {
  throw new Error("JWT_SECRET environment variable is not configured");
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const token = req.cookies?.token as string | undefined;

  if (!token) {
    return next(
      new ApiError(status.UNAUTHORIZED, "Not authorized, please login"),
    );
  }

  try {
    const decoded = jwt.verify(
      token,
      config.jwt.secret as string,
    ) as JwtPayload;

    req.user = decoded;
    next();
  } catch {
    return next(
      new ApiError(status.UNAUTHORIZED, "Token is invalid or expired"),
    );
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ApiError(status.FORBIDDEN, "Forbidden: insufficient permissions"),
      );
    }
    next();
  };
};
