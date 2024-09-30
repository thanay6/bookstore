import { Request, Response } from "express";
import db from "../../../config/db_connection"; // Adjust the path as necessary
import { v4 as uuidv4 } from "uuid"; // Import UUID function

export const addOrder = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { paymentMethod } = req.body;

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
    if (!paymentMethod) {
      return res.status(400).json({ message: "Select payment method" });
    }

    // Check if the user exists
    const user = await db.User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get the user's cart items
    const cartItems = await db.Cart.findAll({ where: { userId } });
    if (cartItems.length === 0) {
      return res.status(404).json({ message: "Cart is empty" });
    }

    // Calculate total amount from cart items
    const totalAmount = cartItems.reduce((total, item) => {
      return total + item.totalAmount; // Assuming totalAmount is present in cart items
    }, 0);

    // Create the order with a unique tracking number
    const order = await db.Order.create({
      customerId: userId,
      paymentMethod,
      totalAmount,
      trackingNumber: uuidv4(), // Generate a unique tracking number
    });

    return res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({
      message: "An error occurred while creating the order",
      error: (error as Error).message || "Unknown error occurred",
    });
  }
};
