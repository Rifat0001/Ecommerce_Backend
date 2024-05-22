import { Schema, model } from "mongoose";
import {
  TInventory,
  TProduct,
  TVariant,
  productModel,
} from "./product.interface";

const inventorySchema = new Schema<TInventory>({
  quantity: {
    type: Number,
    required: true,
  },
  inStock: {
    type: Boolean,
    required: true,
  },
});

const VariantSchema = new Schema<TVariant>({
  type: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
});

const productSchema = new Schema<TProduct>({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  tags: { type: [String], required: true },
  variants: { type: [VariantSchema], required: true }, // Optional variants
  inventory: { type: inventorySchema, required: true }, // Use the Inventory interface here
});

productSchema.statics.isUserExists = async function (name: string) {
  const existingUser = await Product.findOne({ name });
  return existingUser;
};

//? 2. Creating model
export const Product = model<TProduct, productModel>("Product", productSchema);
