import { z } from "zod";

export const OrderItemSchema = z.object({
  id: z.string().uuid(),
  orderId: z.string().uuid(),
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
});

export const CreateOrderItemSchema = OrderItemSchema.pick({
  orderId: true,
  productId: true,
  quantity: true,
  unitPrice: true,
});

export const UpdateOrderItemSchema = OrderItemSchema.pick({
  quantity: true,
  unitPrice: true,
}).partial();

export type CreateOrderItemDto = z.infer<typeof CreateOrderItemSchema>;
export type UpdateOrderItemDto = z.infer<typeof UpdateOrderItemSchema>;
