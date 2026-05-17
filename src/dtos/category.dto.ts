import { z } from "zod";

export const CategorySchema = z.object({
  id: z.uuid(),
  name: z.string(),
});

export const CreateCategorySchema = CategorySchema.pick({
  name: true,
});

export const UpdateCategorySchema = CategorySchema.pick({
  name: true,
}).partial();

export const FetchCategorySchema = CategorySchema.pick({
  id: true,
  name: true,
});

export type CreateCategoryDto = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryDto = z.infer<typeof UpdateCategorySchema>;
export type FetchCategoryDto = z.infer<typeof FetchCategorySchema>;
