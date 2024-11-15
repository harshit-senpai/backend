"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const router = express_1.default.Router();
router.route("/sign-up").post(auth_controller_1.signUp);
router.route("/new-verification").post(auth_controller_1.newVerification);
router.route("/sign-in").post(auth_controller_1.signin);
router.route("/sign-out").post(auth_controller_1.logOut);
router.route("/reset").post(auth_controller_1.reset);
router.route("/verify-otp").post(auth_controller_1.verifyOtp);
router.route("/new-password").post(auth_controller_1.newPassword);
router.route("/resend-otp").post(auth_controller_1.resendEmailVerificationOtp);
exports.default = router;
