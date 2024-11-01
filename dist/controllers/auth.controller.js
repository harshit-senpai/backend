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
exports.rest = exports.logOut = exports.signin = exports.newVerification = exports.signUp = void 0;
const db_1 = require("../lib/db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const token_1 = require("../lib/token");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mail_1 = require("../utils/mail");
const verificationToken_1 = require("../utils/verificationToken");
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
        const newUser = yield db_1.db.user.create({
            data: {
                name,
                email,
                phone,
                hashPassword,
            },
        });
        const verificationToken = yield (0, token_1.generateVerificationToken)(email);
        yield (0, mail_1.sendVerificationEmail)(verificationToken.email, verificationToken.token);
        createSendToken(newUser, 201, res, "User created");
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
        const { token } = req.params;
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
        yield db_1.db.user.update({
            where: {
                id: existingUser.id,
            },
            data: {
                emailVerified: new Date(),
                email: existingToken.email,
            },
        });
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            yield db_1.db.verificationToken.delete({
                where: { id: existingToken.id },
            });
        }), 1000);
        res.status(200).json({ message: "Email verified" });
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
const rest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body();
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
    }
    catch (error) {
        console.log("[RESET_ERROR]", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});
exports.rest = rest;
