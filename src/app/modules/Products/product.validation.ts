import { z } from "zod";

const inventoryValidateSchema = z.object({
  quantity: z
    .number()
    .positive()
    .int()
    .refine((val) => val > 0, {
      message: "Quantity must be a positive integer",
    }),
  inStock: z.boolean(),
});

const variantValidateSchema = z.object({
  type: z.string().nonempty({ message: "Variant type cannot be empty" }),
  value: z.string().nonempty({ message: "Variant value cannot be empty" }),
});

const productValidateSchema = z.object({
  name: z.string().nonempty({ message: "Product name is required" }),
  description: z
    .string()
    .nonempty({ message: "Product description is required" }),
  price: z.number().positive({ message: "Price must be a positive number" }),
  category: z.string().nonempty({ message: "Product category is required" }),
  tags: z.array(
    z.string().nonempty({ message: "Tags cannot contain empty strings" })
  ),
  variants: z
    .array(variantValidateSchema)
    .nonempty({ message: "Variants must be required" }),
  inventory: inventoryValidateSchema,
});

export default productValidateSchema;
