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
exports.generatePasswordResetToken = exports.generateVerificationToken = void 0;
const passwordResetToken_1 = require("../utils/passwordResetToken");
const verificationToken_1 = require("../utils/verificationToken");
const db_1 = require("./db");
const generateVerificationToken = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const token = Math.floor(1000 + Math.random() * 9000).toString();
    const expires = new Date(new Date().getTime() + 3600 * 1000);
    const existingToken = yield (0, verificationToken_1.getVerificationTokenByEmail)(email);
    if (existingToken) {
        yield db_1.db.verificationToken.delete({
            where: {
                id: existingToken.id,
            },
        });
    }
    const verificationToken = yield db_1.db.verificationToken.create({
        data: {
            email,
            token,
            expires,
        },
    });
    return verificationToken;
});
exports.generateVerificationToken = generateVerificationToken;
const generatePasswordResetToken = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const token = Math.floor(1000 + Math.random() * 9000).toString();
    const expires = new Date(new Date().getTime() + 3600 * 1000);
    const existingToken = yield (0, passwordResetToken_1.getPasswordResetTokenByEmail)(email);
    if (existingToken) {
        yield db_1.db.passwordResetToken.delete({
            where: {
                id: existingToken.id,
            },
        });
    }
    const passwordResetToken = yield db_1.db.passwordResetToken.create({
        data: {
            email,
            token,
            expires,
        },
    });
    return passwordResetToken;
});
exports.generatePasswordResetToken = generatePasswordResetToken;
