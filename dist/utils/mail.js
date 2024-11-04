"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordEmail = exports.sendVerificationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});
const sendVerificationEmail = (email, token) => __awaiter(void 0, void 0, void 0, function* () {
    const confirmationLink = token;
    yield transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: email,
        subject: "Confirm your email",
        html: `<p>your OTP is: ${confirmationLink}.</p>`,
    });
});
exports.sendVerificationEmail = sendVerificationEmail;
const resetPasswordEmail = (email, token) => __awaiter(void 0, void 0, void 0, function* () {
    const link = token;
    yield transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: email,
        subject: "Rest your password",
        html: `<p>your OTP is: ${link}.</p>`,
    });
});
exports.resetPasswordEmail = resetPasswordEmail;
