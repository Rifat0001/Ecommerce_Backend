import { Product } from "../Products/product.model";
import { TOrder } from "./order.interface";
import { OrderModel } from "./order.model";
import { startSession } from "mongoose";
import { ClientSession } from "mongodb";

const createOrder = async (orderData: TOrder) => {
  const session: ClientSession = await startSession();
  session.startTransaction();

  try {
    const product = await Product.findById(orderData.productId).session(
      session
    );

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.inventory.quantity < orderData.quantity) {
      return {
        success: false,
        message: "Insufficient quantity available in inventory",
      };
    }

    const newOrder = new OrderModel(orderData);
    await newOrder.save({ session }); // Save order within the transaction

    product.inventory.quantity -= orderData.quantity;
    product.inventory.inStock = product.inventory.quantity === 0 ? false : true; // Update inStock

    await product.save({ session }); 
    return {
      success: true,
      message: "Order created successfully!",
      data: newOrder,
    };
  } catch (err) {
    // No abortTransaction needed - handled by Mongoose automatically on errors
    throw err; // Re-throw other errors for handling in the controller
  } finally {
    session.endSession();
  }
};

const getOrders = async (searchTerm?: string) => {
  const query: any = {}; // Initialize an empty query object

  if (searchTerm) {
    const regex = new RegExp(searchTerm, "i"); // Case-insensitive search
    query.email = { $regex: regex }; // Search by email using regex
  }

  const orders = await OrderModel.find(query); // Find orders based on the query
  return orders;
};

export const orderServices = {
  createOrder,
  getOrders,
};
