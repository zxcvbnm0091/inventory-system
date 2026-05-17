import * as authService from "../service/auth.service";
import type { Request, Response } from "express";
import type { LoginDto, RegisterDto } from "../dtos/auth.dto";
import type { JWTPayload } from "../types";
import { sendTokenResponse } from "../utils/JWTToken";

class AuthController {
  // LOGIN
  static async login(req: Request, res: Response) {
    try {
      const user = await authService.login(req.body as LoginDto);

      const payload: JWTPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      sendTokenResponse(payload, 200, res);
    } catch (error: any) {
      res.status(error.statusCode ?? 500).json({
        error: error.message,
      });
    }
  }

  // REGISTER
  static async register(req: Request, res: Response) {
    console.log("Register hit");
    console.log("req body: ", req.body);
    try {
      const user = await authService.register(req.body as RegisterDto);

      const payload: JWTPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      sendTokenResponse(payload, 201, res);
    } catch (error: any) {
      res.status(error.statusCode ?? 500).json({ error: error.message });
    }
  }

  // LOGOUT
  static async logout(req: Request, res: Response) {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logged out success", success: true });
  }
}

export default AuthController;
