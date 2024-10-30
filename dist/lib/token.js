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
exports.generateVerificationToken = void 0;
const verificationToken_1 = require("../utils/verificationToken");
const db_1 = require("./db");
const uuid_1 = require("uuid");
const generateVerificationToken = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const token = (0, uuid_1.v4)();
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
