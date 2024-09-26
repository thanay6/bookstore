import { Request, Response } from "express";
import db from "../../../config/db_connection"; // Fixed typo 'cofig' to 'config'
import {
  generateSecret,
  verifyToken,
  generateQRCode,
  verifyQRToken,
  extractSecretFromOtpauthUrl,
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
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const registerUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email, and password are required",
      });
    }

    // Check if User already exists
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
        solution: "Change email address",
      });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);
    const secret = generateSecret();
    // const otpauthUrl = secret.otpauth_url;

    console.log(secret.otpauth_url);

    // Generate QR code Data URL
    const dataUrl = await generateQRCode(secret.otpauth_url);

    // Extract base64 data
    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");

    // Define S3 upload parameters
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME as string, // Ensure this environment variable is set
      Key: `qr-codes/${email}-${Date.now()}.png`,
      Body: Buffer.from(base64Data, "base64"),
      ContentEncoding: "base64",
      ContentType: "image/png",
    };

    // Log the upload parameters for debugging
    // console.log("S3 upload parameters:", uploadParams);

    // Upload to S3
    const s3Response = await s3.upload(uploadParams).promise();

    // Extract the URL of the uploaded image
    const qrCodeUrl = s3Response.Location;

    // Log the QR code URL for debugging
    // console.log("QR Code URL:", qrCodeUrl);

    // Create a new user
    const user = await db.User.create({
      username,
      email,
      password: hashedPassword,
      secret,
      twoFactor: false,
      qrURL: qrCodeUrl,
      issuiedBooks: [], // Initialize as an empty array if no books are issued yet
    });

    // await sendAdminRegistrationEmail({
    //   username: user.username,
    //   email: user.email,
    //   password: password, // You might want to be cautious about sending passwords in plain text
    // });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        username: user.username,
        email: user.email,
        screat: user.secret,
        QRCode: user.qrURL,
      }, // Return minimal user info
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

export const loginUser = async (
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
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const userMail = user.email;
    const secret = user.secret;
    const qrCodeUrl = user.qrURL;

    // Send email with QR code if two-factor is enabled
    if (user.twoFactor) {
      await sendTwoFactorSetupEmail(userMail, secret.base32, qrCodeUrl);
    }

    // Generate a JWT token
    const token = jwt.sign(
      { email: user.email, id: user.id }, // Assuming the User model has a 'role' attribute
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" } // Token expires in 1 day
    );

    // Send a single response
    return res.status(200).json({
      message: user.twoFactor
        ? "2 Factor mail sent, verify"
        : "Login successful",
      user: {
        id: user.id,
        email: user.email,
      },
      token,
      qrCodeUrl: user.twoFactor ? qrCodeUrl : null, // Include QR only if 2FA is enabled
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
