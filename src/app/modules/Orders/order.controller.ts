import { Product } from '../Products/product.model';
import { orderServices } from './order.service';
import { orderValidateSchema } from './order.validation';
import { Request, Response } from 'express';
// for create order
const createOrderController = async (req: Request, res: Response) => {
  try {
    const orderData = req.body;
    // Validate the request body
    const validatedData = orderValidateSchema.safeParse(orderData);
    // console.log(orderServices.createOrder);
    const product = await Product.findById(orderData.productId);
    if (!product) {
      return res
        .status(400)
        .json({ success: false, message: 'Product not found' });
    } else {
      const quantity: number = product?.inventory.quantity ?? 0; // Default to 0 if undefined
      if (quantity >= orderData.quantity) {
        if (!validatedData.success) {
          return res
            .status(400)
            .json({ success: false, message: validatedData.error.message });
        }

        const response = await orderServices.createOrder(validatedData.data); // Call the service function
        // console.log(response);
        res.status(201).json({
          success: true,
          message: 'Order created successfully!',
          data: response, // Assuming `response` contains the new order data
        });
      } else {
        return res
          .status(400)
          .json({ success: false, message: 'Insufficient product quantity' });
      }
    }
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};

// for fetch order
const searchOrders = async (req: Request, res: Response) => {
  try {
    const searchTerm = req.query.email?.toString();

    const orders = await orderServices.getOrders(searchTerm);

    const message = searchTerm
      ? orders.length > 0
        ? `Orders fetched successfully for email containing '${searchTerm}'!`
        : `No order found on this email ${searchTerm}`
      : 'Orders fetched successfully!';

    res.status(200).json({
      success: true,
      message,
      data: orders,
    });
  } catch (err) {
    // console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const orderControllers = {
  createOrderController,
  searchOrders,
};
