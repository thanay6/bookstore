import { Router } from "express";
import { loginUser, registerUser } from "../controller/userController";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
