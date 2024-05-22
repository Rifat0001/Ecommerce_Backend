import { Model } from "mongoose";

export type TInventory = {
  quantity: number;
  inStock: boolean;
};

export type TVariant = {
  type: string;
  value: string;
};

export type TProduct = {
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  variants: TVariant[];
  inventory: TInventory;
};

export interface productModel extends Model<TProduct> {
  isUserExists(id: string): Promise<TProduct | null>;
}
