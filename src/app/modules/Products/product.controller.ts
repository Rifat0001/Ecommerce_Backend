import { Request, Response } from 'express';
import { productServices } from './product.service';
import productValidateSchema from './product.validation';
import { Product } from './product.model';

// for create product
const createProduct = async (req: Request, res: Response) => {
  try {
    const productData = req.body;
    const zodParseData = productValidateSchema.parse(productData);
    if (await Product.isUserExists(productData.name)) {
      return res
        .status(400)
        .json({ success: false, message: 'Product already exists' });
    } else {
      const result = await productServices.createProductIntoDB(zodParseData);

      res.status(200).json({
        success: true,
        message: 'Product created successfully!',
        data: result,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

// search a single product by it's id
const getSingleProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const result = await productServices.getSingleProductFromDB(productId);

    res.status(200).json({
      success: true,
      message: 'Product fetched successfully!',
      data: result,
    });
  } catch (err) {
    console.log(err);
  }
};

// delete any product by id
const deleteSingleProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const deletedProduct = await productServices.deleteProductFromDB(productId);

    if (!deletedProduct) {
      return res
        .status(404)
        .json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully!',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// update any product information
const updateSingleProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const updatedProduct = req.body; // Assuming product data is in request body

    const result = await productServices.updateProductFromDB(
      productId,
      updatedProduct,
    );

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully!',
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// get all products and search Term data
const searchProducts = async (req: Request, res: Response) => {
  try {
    const searchTerm = req.query.searchTerm as string;

    const products = await productServices.getProducts(searchTerm);

    const message = searchTerm
      ? products.length > 0
        ? `Products matching search term '${searchTerm}' fetched successfully!`
        : `No products found matching search term '${searchTerm}'.`
      : 'Products fetched successfully!';

    res.status(200).json({
      success: true,
      message,
      data: products,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const productControllers = {
  createProduct,
  getSingleProduct,
  updateSingleProduct,
  deleteSingleProduct,
  searchProducts,
};
