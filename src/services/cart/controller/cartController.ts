import { Request, Response } from "express";
import db from "../../../config/db_connection"; // Fixed typo 'cofig' to 'config'

export const addCart = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { productId, quantity } = req.body;

    // Check if the user is authenticated
    if (!req.user) {
      return res.status(400).json({ message: "User not found." });
    }

    const userId = req.user.id; // Get user ID from the request

    // Validate input
    if (!quantity || !productId) {
      return res.status(400).json({
        message: "No products to add",
      });
    }

    // Check if the product exists
    const product = await db.Book.findOne({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const price = product.price;
    const totalAmount = price * quantity;

    // Create or update the cart item
    const cart = await db.Cart.create({
      id: userId, // Using userId as the cart ID
      userId: userId as number,
      productId,
      quantity,
      price,
      totalAmount,
    });

    return res.status(201).json({
      message: "Product added to cart successfully",
      cart,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return res.status(500).json({
      message: "An error occurred while adding to the cart",
      error: (error as Error).message || "Unknown error occurred",
    });
  }
};
