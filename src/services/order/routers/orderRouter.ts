import { Router } from "express";
import { addOrder } from "../controller/orderController";
import { verifyUser } from "../../../middleware/userVerify";

const router = Router();

router.post("/add-order", verifyUser, addOrder);

export default router;
