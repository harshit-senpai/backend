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
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUp = void 0;
const db_1 = require("../lib/db");
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
        }
        if (!phone) {
            res.status(200).json({
                message: "User Phone number is required",
            });
        }
        const newUser = yield db_1.db.user.create({
            data: {
                name,
                email,
                phone,
            },
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
