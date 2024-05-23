import { TProduct } from './product.interface';
import { Product } from './product.model';

const createProductIntoDB = async (productData: TProduct) => {
  if (await Product.isUserExists(productData.name)) {
    throw new Error('Product already Exist');
  }
  const result = await Product.create(productData);
  return result;
};

const deleteProductFromDB = async (_id: string) => {
  const product = await Product.findByIdAndDelete(_id); // Find and delete

  if (!product) {
    throw new Error('Product not found');
  }
  return product;
};

const getSingleProductFromDB = async (_id: string) => {
  const result = await Product.findOne({ _id });
  return result;
};

const updateProductFromDB = async (_id: string, updatedProduct: TProduct) => {
  try {
    const product = await Product.findById({ _id }); // Find the product to update

    if (!product) {
      throw new Error('Product not found'); // Handle product not found error
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

const getProducts = async (searchTerm?: string) => {
  // Optional searchTerm parameter
  if (!searchTerm) {
    const allProducts = await Product.find(); // Get all products
    return allProducts;
  }

  const regex = new RegExp(searchTerm, 'i'); // Case-insensitive search
  const searchedProducts = await Product.find({ name: { $regex: regex } }); // Search by title
  return searchedProducts;
};

export const productServices = {
  createProductIntoDB,
  getProducts,
  getSingleProductFromDB,
  deleteProductFromDB,
  updateProductFromDB,
};
