import { Request, Response } from "express";
import db from "../../../config/db_connection"; // Fixed typo 'cofig' to 'config'

export const addCart = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { productId, quantity } = req.body;
    if (!req.user) {
      return res.status(400).json({ message: "user not found." });
    }

    const userid = req.user.id;

    // Validate input
    if (!quantity || !productId) {
      return res.status(400).json({
        message: "no products to add",
      });
    }

    // Check if User already exists
    const product = await db.Book.findOne({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const price = product.price;
    const totalAmount = price * quantity;

    const cart = await db.Cart.create({
      userId: userid as number,
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

// export const loginUser = async (
//   req: Request,
//   res: Response
// ): Promise<Response> => {
//   try {
//     const { email, password } = req.body;

//     // Validate input types
//     if (typeof email !== "string" || typeof password !== "string") {
//       return res.status(400).json({ message: "Invalid input" });
//     }

//     // Find the user by email
//     const user = await db.User.findOne({ where: { email } });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Verify password
//     const isPasswordValid = await verifyPassword(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(400).json({ message: "Invalid password" });
//     }

//     const userMail = user.email;
//     const secret = user.secret;
//     const qrCodeUrl = user.qrURL;

//     // Generate a JWT token
//     const token = jwt.sign(
//       { email: user.email }, // Assuming the User model has a 'role' attribute
//       process.env.JWT_SECRET as string,
//       { expiresIn: "1d" } // Token expires in 1 day
//     );

//     // Send a single response
//     return res.status(200).json({
//       message: user.twoFactor
//         ? "2 Factor mail sent, verify"
//         : "Login successful",
//       user: {
//         id: user.id,
//         email: user.email,
//       },
//       token,
//       qrCodeUrl: user.twoFactor ? qrCodeUrl : null, // Include QR only if 2FA is enabled
//     });
//   } catch (error) {
//     // Handle errors
//     console.error("Login error:", error); // Logging error for debugging
//     return res.status(500).json({
//       message: "An error occurred during login",
//       error: (error as Error).message ?? "Unknown error occurred",
//     });
//   }
// };
