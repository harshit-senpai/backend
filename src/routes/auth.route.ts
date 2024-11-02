import express from "express";
import {
  logOut,
  newVerification,
  signin,
  signUp,
  reset,
  verifyOtp,
  newPassword,
} from "../controllers/auth.controller";
import { isAuthenticated } from "../middlewares/authenticated";

const router = express.Router();

router.route("/sign-up").post(signUp);

router.route("/new-verification/:token").post(newVerification);

router.route("/sign-in").post(signin);

router.route("/sign-out").post(logOut);

router.route("/reset").post(reset);

router.route("/verify-otp").post(verifyOtp);

router.route("/new-password").post(newPassword);

export default router;
