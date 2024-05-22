import { orderServices } from "./order.service";
import { orderValidateSchema } from "./order.validation";
import { Request, Response } from "express";
// for create order
const createOrder = async (req: Request, res: Response) => {
  try {
    const orderData = req.body;
    const zodParseData = orderValidateSchema.parse(orderData);
    const result = await orderServices.createOrderIntoDB(zodParseData);
    res.status(200).json({
      success: true,
      message: "Order created successfully!",
      data: result,
    });
  } catch (err) {
    console.log(err);
  }
};
// for fetch order
const searchOrders = async (req: Request, res: Response) => {
  try {
    const searchTerm = req.query.email?.toString(); 

    const orders = await orderServices.getOrders(searchTerm);

    const message = searchTerm
      ? `Orders fetched successfully for email containing '${searchTerm}'!`
      : "Orders fetched successfully!";

    res.status(200).json({
      success: true,
      message,
      data: orders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const orderControllers = {
  createOrder,
  searchOrders,
};
