// middlewares/verifyUser.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import db from "../config/db_connection"; // Fixed typo 'cofig' to 'config'
import { UserInstance } from "../services/user/model/userModel";
declare module "express-serve-static-core" {
  interface Request {
    user?: UserInstance;
  }
}
export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as jwt.Secret) as {
      id: number;
      email: string;
    };

    if (!decoded.email) {
      return res.status(400).json({ message: "token is wrong." });
    }

    const user = await db.User.findOne({ where: { email: decoded.email } });
    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(400).json({ message: "Invalid token." });
  }
};
