import { TOrder } from "./order.interface";
import { orderServices } from "./order.service";
import { orderValidateSchema } from "./order.validation";
import { Request, Response } from "express";
// for create order
const createOrderController = async (req: Request, res: Response) => {
  try {
    const orderData = req.body;

    // Validate the request body
    const validatedData = orderValidateSchema.safeParse(orderData);
    if (!validatedData.success) {
      return res
        .status(400)
        .json({ success: false, message: validatedData.error.message });
    }

    const response = await orderServices.createOrder(validatedData.data); // Call the service function

    if (typeof response === 'object' && 'success' in response) {
      // Now you can safely access response.success and response.message
      if (!response.success) {
        return res.status(400).json(response); // Return the error response from the service
      }
    } else {
      // Handle unexpected response type (optional)
      console.error("Unexpected response format from service");
      return res.status(500).json({ success: false, message: "Internal server error" });
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully!",
      data: response, // Assuming `response` contains the new order data
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
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
  createOrderController,
  searchOrders,
};
