import { Request, Response } from "express";
import db from "../../../config/db_connection";
import { v4 as uuidv4 } from "uuid"; // Import uuid for generating unique IDs
import AWS from "aws-sdk";
import axios from "axios"; // Import axios for HTTP requests

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  region: process.env.AWS_REGION!,
});

const genreToPrefixMapping: { [key: string]: string } = {
  Fiction: "Fic",
  NonFiction: "Nfic",
  Poetry: "Pty",
  Drama: "Dma",
  Comics: "Cms",
  YoungAdult: "YA",
  Academic: "Adc",
  Magazines: "Maz",
  Professional: "Pro",
};

export const addBook = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const {
      bookname,
      genre,
      publisher,
      isbnNumber,
      author,
      pages,
      price,
      weight,
      country,
      series,
      netQuantity,
    } = req.body;

    const existingBook = await db.Book.findOne({ where: { isbnNumber } });
    if (existingBook) {
      existingBook.netQuantity += netQuantity;
      await existingBook.save();
      return res.status(200).json({
        message: "Book already exists in the store. Stock updated.",
        book: existingBook,
      });
    }

    const prefix = genreToPrefixMapping[genre] || "Abc"; // Default prefix

    const uniqueId = `${prefix}${uuidv4()}`;

    const staticImageUrl =
      "https://photos.google.com/photo/AF1QipOye7YSWTiykPMpDJt0PAoxZcdFSGoUoq9SMcvb";

    // Download the static image
    // const imageResponse = await axios.get(staticImageUrl, {
    //   responseType: "arraybuffer",
    // });
    // const imageBuffer = Buffer.from(imageResponse.data, "binary");

    // Upload image to S3
    // const s3Params: AWS.S3.PutObjectRequest = {
    //   Bucket: process.env.AWS_BUCKET_NAME!,
    //   Key: `books/${uuidv4()}.jpg`,
    //   Body: imageBuffer,
    //   ContentType: "image/jpeg",
    // };
    // const s3Response = await s3.upload(s3Params).promise();
    // const photoUrl = s3Response.Location;

    const newBook = await db.Book.create({
      id: uniqueId,
      prefix,
      bookname,
      genre,
      publisher,
      photo: staticImageUrl,
      isbnNumber,
      author,
      pages,
      price,
      weight,
      country,
      series,
      netQuantity,
    });

    return res.status(201).json({
      message: "Book added successfully.",
      book: newBook,
    });
  } catch (error) {
    console.error("Error adding book:", error);
    return res.status(500).json({
      message: "An error occurred while adding the book.",
      error: (error as Error).message ?? "Unknown error occurred",
    });
  }
};

export const getBookDetails = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { name } = req.params;
    const book = await db.Book.findOne({ where: { bookname: name } });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json({ book });
  } catch (error) {
    console.error("Error retrieving book details:", error);
    return res.status(500).json({
      message: "An error occurred while retrieving the book details.",
      error: (error as Error).message ?? "Unknown error occurred",
    });
  }
};

export const getBookDetailsByISBN = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Extract the ISBN number from the request parameters
    const { isbn } = req.params;

    console.log(isbn);

    // Query the database to find the book by ISBN number
    const book = await db.Book.findOne({ where: { isbnNumber: isbn } });

    // If the book is not found, respond with a 404 status
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Respond with the book details
    return res.status(200).json({ book });
  } catch (error) {
    console.error("Error retrieving book details:", error);
    return res.status(500).json({
      message: "An error occurred while retrieving the book details.",
      error: (error as Error).message ?? "Unknown error occurred",
    });
  }
};
