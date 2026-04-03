import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().min(1000, "Price phải > 1000"),
  category_id: z.coerce.number().min(1, "Chọn category"),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export const sliderSchema = z.object({
  title: z.string().min(1, "Title is required"),
});