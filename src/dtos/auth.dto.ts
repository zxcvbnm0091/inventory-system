import { z } from "zod";
import { UserSchema } from "./user.dto";

export const RegisterSchema = UserSchema.pick({
  name: true,
  email: true,
  password: true,
  role: true,
});

export const LoginSchema = UserSchema.pick({
  email: true,
  password: true,
});

export type RegisterDto = z.infer<typeof RegisterSchema>;
export type LoginDto = z.infer<typeof LoginSchema>;
