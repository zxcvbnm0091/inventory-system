import * as userService from "../service/user.service";
import type { Request, Response } from "express";
import type { CreateUserDto, UpdateUserDto } from "../dtos/user.dto";
import catchAsync from "../utils/catchAsync";
import config from "../config/config";

class UserController {
  // GET ALL USERS
  static getAllUser = catchAsync(async (req: Request, res: Response) => {
    const users = await userService.getAll();

    res
      .status(200)
      .json({ message: "Fetch all users", success: true, data: users });
  });

  // GET USER BY ID
  static getUserById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const user = await userService.getById(id);

    res.status(200).json({
      message: `Fetch user with id: ${id}`,
      success: true,
      data: user,
    });
  });

  // CREATE NEW USER
  static createUser = catchAsync(async (req: Request, res: Response) => {
    const userData: CreateUserDto = req.body;
    const user = await userService.create(userData);

    res
      .status(201)
      .json({ message: "User created", success: true, data: user });
  });

  // UPDATE USER
  static updateUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const updateData: UpdateUserDto = req.body;

    const user = await userService.update(id, updateData);

    res
      .status(200)
      .json({ message: "User data updated", success: true, data: user });
  });

  // DELETE USER
  // admin
  static deleteUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    await userService.remove(id);

    res.status(200).json({ message: "User deleted", success: true });
  });
  // logged user
  static deleteOwnAccount = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.user as { id: string };
    await userService.remove(id);

    res.clearCookie("token", {
      httpOnly: true,
      secure: config.env === "production",
      sameSite: "strict",
    });

    res.status(200).json({ message: "User deleted", success: true });
  });
}

export default UserController;
