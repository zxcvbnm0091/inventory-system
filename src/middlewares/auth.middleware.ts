import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

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

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not configured");
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const token = req.cookies?.token as string | undefined;

  if (!token) {
    res.status(401).json({ error: "Not authorized, please login" });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;

    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Token is invalid or expired" });
    return;
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ error: "Forbidden: insufficient permissions" });
      return;
    }
    next();
  };
};
