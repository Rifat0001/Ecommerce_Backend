import { TOrder } from "./order.interface";
import { OrderModel } from "./order.model";

const createOrderIntoDB = async (orderData: TOrder) => {
  const result = await OrderModel.create(orderData);
  return result;
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
  createOrderIntoDB,
  getOrders,
};
