import { Router } from "express";
import { addCart } from "../controller/cartController";
import { verifyUser } from "../../../middleware/userVerify";

const router = Router();

router.post("/add-cart", verifyUser, addCart);

export default router;
