import { Product } from "../Products/product.model";
import { TOrder } from "./order.interface";
import { OrderModel } from "./order.model";
import { ClientSession, startSession } from "mongoose";

const createOrder = async (orderData: TOrder) => {
  const session: ClientSession = await startSession();
  session.startTransaction();

  try {
    const product = await Product.findById(orderData.productId).session(
      session
    );

    if (!product) {
      return { success: false, message: "Product not found" };
    }

    console.log(product); // Now logs the product object

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

    await product.save({ session }); // Save product update within the transaction

    await session.commitTransaction();
    return newOrder;
  } catch (err) {
    await session.abortTransaction();
    console.error(err);
    return { success: false, message: "Internal server error" }; // Handle unexpected errors
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
