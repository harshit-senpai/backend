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
exports.resendEmailVerificationOtp = exports.newPassword = exports.verifyOtp = exports.reset = exports.logOut = exports.signin = exports.newVerification = exports.signUp = void 0;
const db_1 = require("../lib/db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const token_1 = require("../lib/token");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mail_1 = require("../utils/mail");
const verificationToken_1 = require("../utils/verificationToken");
const passwordResetToken_1 = require("../utils/passwordResetToken");
const signToken = (id) => {
    const secret = process.env.JWT_SECRET;
    return jsonwebtoken_1.default.sign({ id }, secret, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};
const createSendToken = (user, statusCode, res, message) => {
    const token = signToken(user.id);
    const expiry = Number(process.env.JWT_COOKIE_EXPIRES_IN);
    const cookieOptions = {
        expires: new Date(Date.now() + expiry * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: "lax",
    };
    res.cookie("token", token, cookieOptions);
    res.status(statusCode).json({
        token: token,
        message,
        data: {
            user,
        },
    });
};
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, phone } = req.body;
        if (!name) {
            res.status(400).json({
                message: "user name is required",
            });
            return;
        }
        if (!email) {
            res.status(400).json({
                message: "User email is required",
            });
            return;
        }
        if (!phone) {
            res.status(400).json({
                message: "User Phone number is required",
            });
            return;
        }
        if (!password) {
            res.status(400).json({
                message: "Password is required",
            });
        }
        const existingUser = yield db_1.db.user.findUnique({
            where: {
                email,
            },
        });
        if (existingUser) {
            res.status(400).json({
                message: "Email already in use",
            });
        }
        const hashPassword = yield bcryptjs_1.default.hash(password, 10);
        const verificationToken = yield (0, token_1.generateVerificationToken)(email);
        const existingTempUser = yield db_1.db.tempUser.findUnique({
            where: {
                email,
            },
        });
        if (existingTempUser) {
            yield db_1.db.tempUser.delete({
                where: {
                    email,
                },
            });
        }
        yield db_1.db.tempUser.create({
            data: {
                name,
                email,
                phone,
                password: hashPassword,
                token: verificationToken.token,
            },
        });
        yield (0, mail_1.sendVerificationEmail)(verificationToken.email, verificationToken.token);
        res.status(200).json({
            message: "Verification email sent",
        });
    }
    catch (error) {
        console.log("[SIGN_UP_ERROR]", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});
exports.signUp = signUp;
const newVerification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.body;
        const tempUser = yield db_1.db.tempUser.findUnique({
            where: {
                token,
            },
        });
        const existingToken = yield (0, verificationToken_1.getVerificationTokenByToken)(token);
        if (!existingToken) {
            res.status(404).json({
                message: "Token does not exist",
            });
            return;
        }
        const hasExpired = new Date(existingToken.expires) < new Date();
        if (hasExpired) {
            yield db_1.db.verificationToken.delete({
                where: {
                    id: existingToken.id,
                },
            });
            res.status(404).json({
                message: "Token has expired",
            });
            return;
        }
        const isValidToken = (tempUser === null || tempUser === void 0 ? void 0 : tempUser.token) === (existingToken === null || existingToken === void 0 ? void 0 : existingToken.token);
        if (!isValidToken) {
            res.status(400).json({
                message: "Invalid OTP",
            });
        }
        const newUser = yield db_1.db.user.create({
            data: {
                name: tempUser === null || tempUser === void 0 ? void 0 : tempUser.name,
                email: tempUser === null || tempUser === void 0 ? void 0 : tempUser.email,
                phone: tempUser === null || tempUser === void 0 ? void 0 : tempUser.phone,
                hashPassword: tempUser === null || tempUser === void 0 ? void 0 : tempUser.password,
                emailVerified: new Date(),
            },
        });
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            yield db_1.db.verificationToken.delete({
                where: { id: existingToken.id },
            });
            yield db_1.db.tempUser.delete({
                where: {
                    id: tempUser === null || tempUser === void 0 ? void 0 : tempUser.id,
                },
            });
        }), 1000);
        createSendToken(newUser, 201, res, "User created and email verified");
    }
    catch (error) {
        console.log("NEW_VERIFICATION_ERROR", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});
exports.newVerification = newVerification;
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                message: "missing fields",
            });
        }
        const existingUser = yield db_1.db.user.findFirst({
            where: {
                email,
            },
        });
        if (!existingUser) {
            res.status(404).json({
                message: "User does not exist",
            });
        }
        const correctPassword = yield bcryptjs_1.default.compare(password, existingUser === null || existingUser === void 0 ? void 0 : existingUser.hashPassword);
        if (!correctPassword) {
            res.status(400).json({
                message: "invalid credentials",
            });
        }
        createSendToken(existingUser, 200, res, "user logged in");
    }
    catch (error) {
        console.log("SIGININ_ERROR", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});
exports.signin = signin;
const logOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.cookie("token", "Loggout", {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true,
        });
        res.status(200).json({
            message: "User logged out successfully",
        });
    }
    catch (error) {
        console.log("[LOGOUT_ERROR]", error);
        res.status(500).json({
            message: "internal server error",
        });
    }
});
exports.logOut = logOut;
const reset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({
                message: "Email does not exists",
            });
            return;
        }
        const existingUser = yield db_1.db.user.findUnique({
            where: {
                email,
            },
        });
        if (!existingUser) {
            res.status(404).json({
                message: "User with this email does not exists",
            });
            return;
        }
        const passwordResetToken = yield (0, token_1.generatePasswordResetToken)(email);
        yield (0, mail_1.resetPasswordEmail)(passwordResetToken.email, passwordResetToken.token);
        res.status(200).json({
            message: "Email sent!",
        });
    }
    catch (error) {
        console.log("[RESET_ERROR]", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});
exports.reset = reset;
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.body;
        console.log(token);
        const existingToken = yield (0, passwordResetToken_1.getPasswordResetTokenByToken)(token);
        if (!existingToken) {
            res.status(404).json({
                message: "Invalid Token!",
            });
            return;
        }
        const hasExpired = new Date(existingToken.expires) < new Date();
        if (hasExpired) {
            yield db_1.db.passwordResetToken.delete({
                where: {
                    id: existingToken.id,
                },
            });
            res.status(400).json({
                message: "OTP has expired",
            });
        }
        const existingUser = yield db_1.db.user.findUnique({
            where: {
                email: existingToken.email,
            },
        });
        if (!existingUser) {
            res.status(404).json({
                message: "User does not exist",
            });
            return;
        }
        const sessionToken = jsonwebtoken_1.default.sign({ email: existingToken.email }, process.env.JWT_SECRET, {
            expiresIn: "15m",
        });
        const Otp = yield (0, passwordResetToken_1.getPasswordResetTokenByEmail)(existingUser.email);
        const isValidOtp = token == (Otp === null || Otp === void 0 ? void 0 : Otp.token);
        if (!isValidOtp) {
            res.status(400).json({
                message: "Wrong OTP",
            });
            return;
        }
        console.log(sessionToken);
        res.status(200).json({
            message: "OTP is verified",
            sessionToken,
        });
    }
    catch (error) {
        console.log("[VERIFY_OTP]", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});
exports.verifyOtp = verifyOtp;
const newPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sessionToken, newPassword } = req.body;
        if (!sessionToken || !newPassword) {
            res.status(400).json({
                message: "Session token and new password are required",
            });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(sessionToken, process.env.JWT_SECRET);
        const existingUser = yield db_1.db.user.findUnique({
            where: {
                email: decoded.email,
            },
        });
        if (!existingUser) {
            res.status(404).json({
                message: "User does not exist",
            });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        yield db_1.db.user.update({
            where: {
                id: existingUser.id,
            },
            data: {
                hashPassword: hashedPassword,
            },
        });
        res.status(200).json({
            message: "Password has been reset successfully",
        });
    }
    catch (error) {
        console.log("[NEW_PASSWORD_ERROR]", error);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
});
exports.newPassword = newPassword;
const resendEmailVerificationOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({
                message: "Email is required to resend the confermation OTP",
            });
            return;
        }
        const existingToken = yield (0, verificationToken_1.getVerificationTokenByEmail)(email);
        if (!existingToken) {
            res.status(200).json({
                message: "Associated Email does not exists",
            });
            return;
        }
        const hasExpired = new Date(existingToken.expires) < new Date();
        if (hasExpired) {
            const newVerificationToken = yield (0, token_1.generateVerificationToken)(email);
            yield (0, mail_1.sendVerificationEmail)(newVerificationToken.email, newVerificationToken.token);
            yield db_1.db.tempUser.update({
                where: {
                    email: newVerificationToken.email,
                },
                data: {
                    token: newVerificationToken.token,
                },
            });
            res.status(200).json({
                message: "verification email sent",
            });
            return;
        }
        yield db_1.db.verificationToken.delete({
            where: {
                id: existingToken.id,
            },
        });
        const newVerificationToken = yield (0, token_1.generateVerificationToken)(email);
        yield db_1.db.tempUser.update({
            where: {
                email: newVerificationToken.email,
            },
            data: {
                token: newVerificationToken.token,
            },
        });
        yield (0, mail_1.sendVerificationEmail)(newVerificationToken.email, newVerificationToken.token);
        res.status(200).json({
            message: "verification email sent",
        });
    }
    catch (error) {
        console.log("[RESEND_EMAIL_VERIFICATION_OTP]", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});
exports.resendEmailVerificationOtp = resendEmailVerificationOtp;
