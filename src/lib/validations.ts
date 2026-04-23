import { link } from "fs";
import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(1000, "Price phải > 1000"),
  category_id: z.number().min(1, "Chọn category"),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export const sliderSchema = z.object({
  title: z.string().min(1, "Title is required"),
  order: z.number().default(0),
  link: z.string().optional(),
});

export const toppingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(1000, "Price phải > 1000"),
});

export const optionSchema = z.object({
  name: z.string().min(1, "Name is required"),

  is_multiple: z.boolean(),

  options: z
    .array(
      z.object({
        name: z.string().min(1, "Option name is required"),
        price: z.number().min(0, "Price must be >= 0"),
      })
    )
    .min(1, "At least 1 option is required"),
});

export const voucherSchema = z.object({
  code: z.string().min(1, "Code là bắt buộc"),

  discount_type: z.string().min(1, "Chọn loại giảm giá"),

  discount_value: z
    .number()
    .min(1, "Giá trị giảm phải > 0"),

  max_usage: z
    .number()
    .min(1, "Số lần sử dụng phải > 0"),

  min_order_value: z
    .number()
    .min(0, "Không được âm"),

  expired_at: z
    .string()
    .min(1, "Chọn ngày hết hạn"),
});

export const storeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone is required"),
});

// Type exports for TypeScript
export type ProductFormData = z.infer<typeof productSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type SliderFormData = z.infer<typeof sliderSchema>;
export type ToppingFormData = z.infer<typeof toppingSchema>;
export type OptionFormData = z.infer<typeof optionSchema>;
export type VoucherFormData = z.infer<typeof voucherSchema>;
export type StoreFormData = z.infer<typeof storeSchema>;