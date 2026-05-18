import * as userService from "../service/user.service";
import type { Request, Response } from "express";
import type { CreateUserDto, UpdateUserDto } from "../dtos/user.dto";

class UserController {
  // GET ALL USERS
  static async getAllUser(req: Request, res: Response) {
    try {
      const users = await userService.getAll();

      res.status(200).json({
        message: "Fetch all users",
        success: true,
        count: users.length,
        data: users,
      });
    } catch (error: any) {
      res.status(error.statusCode ?? 500).json({
        error: error.message,
      });
    }
  }

  // GET USER BY ID
  static async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const user = await userService.getById(id);

      res.status(200).json({
        message: "Fetch user",
        success: true,
        data: user,
      });
    } catch (error: any) {
      res.status(error.statusCode ?? 500).json({
        error: error.message,
      });
    }
  }

  // CREATE NEW USER
  static async createUser(req: Request, res: Response) {
    try {
      const newUser = await userService.create(req.body as CreateUserDto);
      res
        .status(201)
        .json({ message: "User created", success: true, data: newUser });
    } catch (error: any) {
      res.status(error.statusCode ?? 500).json({ error: error.message });
    }
  }

  // UPDATE USER
  static async updateUser(req: Request, res: Response) {
    try {
      const userId = req.user!.id;

      const updateUser = await userService.update(
        userId,
        req.body as UpdateUserDto,
      );

      res.status(200).json({
        message: "Used data updated",
        success: true,
        data: updateUser,
      });
    } catch (error: any) {
      res.status(error.statusCode ?? 500).json({
        error: error.message,
      });
    }
  }

  // DELETE USER
  static async deleteUser(req: Request, res: Response) {
    try {
      const userId = req.params.id || req.user!.id;
      await userService.remove(userId as string);

      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.status(200).json({
        message: "User deleted",
        success: true,
      });
    } catch (error: any) {
      res.status(error.statusCode ?? 500).json({ error: error.message });
    }
  }
}

export default UserController;
