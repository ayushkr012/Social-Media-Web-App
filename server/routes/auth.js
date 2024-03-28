import express from "express";
import { login, sendOtp, verifyOtp } from "../controllers/auth.js";

const authRoutes = express.Router();

authRoutes.post("/login", login);
authRoutes.post("/sendotp", sendOtp);
authRoutes.post("/verifyotp", verifyOtp);

export default authRoutes;
