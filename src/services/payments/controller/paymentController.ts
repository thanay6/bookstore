import { Request, Response } from "express";
import db from "../../../config/db_connection"; // Adjust the path as necessary
import { v4 as uuidv4 } from "uuid"; // Import UUID function

export const addPayment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { orderId } = req.body; // Expecting paymentMethod in the request body

    // Check if the user is authenticated
    if (!req.user) {
      return res.status(400).json({ message: "User not found." });
    }

    const userId = req.user.id; // Get user ID from the request

    // Ensure userId is defined and valid
    if (typeof userId !== "number") {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    // Validate input
    if (!orderId) {
      return res.status(400).json({ message: "No order ID provided." });
    }

    // Check if the user exists
    const user = await db.User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Get the order details
    const order = await db.Order.findOne({ where: { id: orderId } });
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // Calculate total amount from order (assuming totalAmount is stored in the order)
    const totalAmount = order.totalAmount;

    const paymentMethod = order.paymentMethod;

    // Create the payment record
    const payment = await db.Payment.create({
      id: uuidv4(),
      orderId: order.id,
      customerId: userId,
      totalAmount,
    });

    return res.status(201).json({
      message: "Payment done successfully.",
      payment,
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    return res.status(500).json({
      message: "An error occurred while processing the payment.",
      error: (error as Error).message || "Unknown error occurred.",
    });
  }
};
