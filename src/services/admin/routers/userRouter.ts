import { Router } from "express";
import {
  registerAdmin,
  loginAdmin,
  verifyOTP,
} from "../controller/adminController";

const router = Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/two-factor", verifyOTP);

export default router;
