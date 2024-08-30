import { Request, Response } from "express";
import db from "../../../config/db_connection"; // Fixed typo 'cofig' to 'config'
import {
  generateSecret,
  verifyToken,
  otpauthURL,
} from "../services/otpService";
import {
  hashPassword,
  comparePasswords,
  verifyPassword,
} from "../utils/bcryptUtils"; // Hypothetical validation functions
import jwt from "jsonwebtoken";
import { sendAdminRegistrationEmail } from "../mail/registrationMail";
import { sendTwoFactorSetupEmail } from "../mail/twoFactorMail";
import { toDataURL } from "qrcode";
import QRCode from "qrcode";

export const registerAdmin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { username, email, password, role } = req.body;

    // Validate input
    if (!username || !email || !password || !role) {
      return res.status(400).json({
        message: "Username, email, and password are required",
      });
    }

    // Check if Admin already exists
    const existingAdmin = await db.Admin.findOne({ where: { email } });
    if (existingAdmin) {
      return res.status(400).json({
        message: "Email already exists",
        solution: "Change email address",
      });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);
    const secret = generateSecret();

    // Create a new user
    const admin = await db.Admin.create({
      username,
      email,
      password: hashedPassword,
      role,
      secret,
      twoFactor: false,
    });

    await sendAdminRegistrationEmail({
      username: admin.username,
      email: admin.email,
      password: password, // You might want to be cautious about sending passwords in plain text
      role: admin.role,
    });

    return res.status(201).json({
      message: "Admin registered successfully",
      admin: { username: admin.username, email: admin.email }, // Return minimal user info
    });
  } catch (error) {
    // Log the error (consider logging to a file or service)
    console.error("Registration error:", error);

    // Handle errors
    return res.status(500).json({
      message: "An error occurred during registration",
      error: (error as Error).message || "Unknown error occurred",
    });
  }
};

export const loginAdmin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, password } = req.body;

    // Validate input types
    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ message: "Invalid input" });
    }

    // Find the user by email
    const admin = await db.Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(404).json({ message: "admin not found" });
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, admin.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const adminMail = admin.email;
    const secret = admin.secret;
    // Generate the QR code
    const otpauthUrl = otpauthURL(secret.base32, email);
    const dataUrl = await QRCode.toDataURL(otpauthUrl);

    await sendTwoFactorSetupEmail(adminMail, secret.base32, dataUrl);

    // Generate a JWT token
    const token = jwt.sign({ email }, process.env.JWT_SECRET as string, {
      expiresIn: "1d",
    });

    // Send a single response
    return res.status(200).json({
      message: "2 Factor mail sent verify",
      user: {
        id: admin.id,
        email: admin.email,
      },
      token,
    });
  } catch (error) {
    // Handle errors
    console.error("Login error:", error); // Logging error for debugging
    return res.status(500).json({
      message: "An error occurred during login",
      error: (error as Error).message ?? "Unknown error occurred",
    });
  }
};

export const verifyOTP = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, token } = req.body;

    // Validate input
    if (typeof email !== "string" || typeof token !== "string") {
      return res.status(400).send("Invalid input");
    }

    // Find the user by email
    const admin = await db.Admin.findOne({ where: { email } });

    if (!admin) {
      return res.status(404).send("User not found");
    }

    // Verify the OTP token using the user's secret
    const isVerified = verifyToken(admin.secret.base32, token);

    // console.log(user.secret);

    if (isVerified) {
      admin.twoFactor = true;
      return res
        .status(200)
        .json({ message: "2FA verified successfully", startStatus: "started" });
    } else {
      // console.log(token);

      return res.status(400).send("Invalid token");
    }
  } catch (err) {
    console.error("Error verifying OTP:", err);
    return res.status(500).send("Error verifying OTP");
  }
};
