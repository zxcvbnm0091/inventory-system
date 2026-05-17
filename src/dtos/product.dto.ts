import { z } from "zod";

export const ProductSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  price: z.number().positive(),
  quantityInStock: z.number().int().min(0),
  categoryId: z.uuid(),
  userId: z.uuid(),
});

export const CreateProductSchema = ProductSchema.pick({
  name: true,
  description: true,
  price: true,
  quantityInStock: true,
  categoryId: true,
});

export const UpdateProductSchema = ProductSchema.pick({
  name: true,
  description: true,
  price: true,
  quantityInStock: true,
  categoryId: true,
}).partial();

export type CreateProductDto = z.infer<typeof CreateProductSchema>;
export type UpdateProductDto = z.infer<typeof UpdateProductSchema>;
