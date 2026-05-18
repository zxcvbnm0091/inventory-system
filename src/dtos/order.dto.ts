import { z } from "zod";

export const OrderSchema = z.object({
  id: z.uuid(),
  status: z.enum(["PENDING", "PROCESSING", "COMPLETED", "CANCELLED"]),
  totalPrice: z.number(),
  customerName: z.string(),
  customerEmail: z.email(),
  userId: z.uuid(),
});

export const CreateOrderSchema = OrderSchema.pick({
  status: true,
  totalPrice: true,
  customerName: true,
  customerEmail: true,
  userId: true,
});

export const UpdateOrderSchema = OrderSchema.pick({
  status: true,
  totalPrice: true,
  customerName: true,
  customerEmail: true,
});

export type CreateOrderDto = z.infer<typeof CreateOrderSchema>;
export type UpdateOrderDto = z.infer<typeof UpdateOrderSchema>;
