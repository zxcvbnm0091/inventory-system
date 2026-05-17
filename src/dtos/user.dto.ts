import { z } from "zod";

export const UserSchema = z.object({
  id: z.uuid(),
  name: z.string().min(2).max(50),
  email: z.email(),
  password: z.string().min(8),
  role: z.enum(["ADMIN", "STAFF"]),
});

export const CreateUserSchema = UserSchema.pick({
  name: true,
  email: true,
  password: true,
  role: true,
});

export const UpdateUserSchema = UserSchema.pick({
  name: true,
  password: true,
}).partial();

export const FetchUserSchema = UserSchema.pick({
  id: true,
  name: true,
  email: true,
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
export type FetchUserDto = z.infer<typeof FetchUserSchema>;
