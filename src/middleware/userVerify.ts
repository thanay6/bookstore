import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import db from "../config/db_connection"; // Adjust the path to your configuration file

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Extract the token from the Authorization header
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    // Verify the token and decode its payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET as jwt.Secret) as {
      email: string;
    };

    // Find the user by email
    const user = await db.User.findOne({ where: { email: decoded.email } });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Optionally attach user data to the request object
    // req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(400).json({ message: "Invalid token." });
  }
};
