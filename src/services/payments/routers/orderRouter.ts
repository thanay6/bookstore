import { Router } from "express";
import { addPayment } from "../controller/paymentController";
import { verifyUser } from "../../../middleware/userVerify";

const router = Router();

router.post("/add-order", verifyUser, addPayment);

export default router;
