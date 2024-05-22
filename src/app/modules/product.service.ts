import { Product } from "./product.interface";
import { ProductModel } from "./product.model";

const createProductIntoDB = async (product: Product) => {
  const result = await ProductModel.create(product);
  return result;
};

const getAllProductsFromDB = async () => {
  const result = await ProductModel.find();
  return result;
};

const deleteProductFromDB = async (_id: string) => {
  const product = await ProductModel.findByIdAndDelete(_id); // Find and delete

  if (!product) {
    throw new Error("Product not found");
  }
  return product;
};

const getSingleProductFromDB = async (_id: string) => {
  const result = await ProductModel.findOne({ _id });
  return result;
};

const updateProductFromDB = async (_id: string, updatedProduct: Product) => {
  try {
    const product = await ProductModel.findById({ _id }); // Find the product to update

    if (!product) {
      throw new Error("Product not found"); // Handle product not found error
    }

    // Update product properties
    product.name = updatedProduct.name || product.name; // Update only if provided
    product.description = updatedProduct.description || product.description;
    product.price = updatedProduct.price || product.price;
    product.category = updatedProduct.category || product.category;
    product.tags = updatedProduct.tags || product.tags;
    product.variants = updatedProduct.variants || product.variants;
    product.inventory = updatedProduct.inventory || product.inventory;

    // You can add validation for updatedProduct properties here

    const updatedDoc = await product.save(); // Save the updated product
    return updatedDoc;
  } catch (err) {
    console.log(err);
  }
};

const searchProductsByTitle = async (searchTerm: string) => {
  const regex = new RegExp(searchTerm, "i"); // Case-insensitive search
  const products = await ProductModel.find({ name: { $regex: regex } });
  return products;
};

export const productServices = {
  createProductIntoDB,
  getAllProductsFromDB,
  searchProductsByTitle,
  getSingleProductFromDB,
  deleteProductFromDB,
  updateProductFromDB,
};
