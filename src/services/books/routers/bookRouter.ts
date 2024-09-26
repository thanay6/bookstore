import { Router } from "express";
import {
  addBook,
  getBookDetails,
  getBookDetailsByISBN,
} from "../controller/bookController";
import { verifyOwner } from "../../../middleware/adminVerify";
import { verifyUser } from "../../../middleware/userVerify";

const router = Router();

router.post("/add-book", verifyOwner, addBook);
router.get("/books/:isbn", verifyUser, getBookDetailsByISBN);

export default router;
