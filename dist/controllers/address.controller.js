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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserAddress = exports.getUserAddressesById = exports.getUserAddresses = exports.createAddress = void 0;
const db_1 = require("../lib/db");
const createAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.body, { userId } = _a, data = __rest(_a, ["userId"]);
        const address = yield db_1.db.address.create({
            data: Object.assign({ userId }, data),
        });
        res.status(200).json({ data: address });
    }
    catch (error) {
        console.log("[ADDRESS_CREATE]", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});
exports.createAddress = createAddress;
const getUserAddresses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        const addresses = yield db_1.db.address.findMany({
            where: {
                userId,
            },
        });
        res.status(200).json({ data: addresses });
    }
    catch (error) {
        console.log("[ADDRESS_GET]", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});
exports.getUserAddresses = getUserAddresses;
const getUserAddressesById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { addressId } = req.params;
        const address = yield db_1.db.address.findUnique({
            where: {
                id: addressId,
            },
        });
        res.status(200).json({
            data: {
                address,
            },
        });
    }
    catch (error) {
        console.log("[ADDRESS_GET_BY_ID]", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});
exports.getUserAddressesById = getUserAddressesById;
const updateUserAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.body, { userId } = _a, data = __rest(_a, ["userId"]);
        const { addressId } = req.params;
        const address = yield db_1.db.address.update({
            where: {
                id: addressId,
                userId,
            },
            data,
        });
        res.status(200).json({ data: address });
    }
    catch (error) {
        console.log("[ADDRESS_UPDATE]", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});
exports.updateUserAddress = updateUserAddress;
