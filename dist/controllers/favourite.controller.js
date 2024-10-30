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
exports.removeFavourite = exports.getFavourites = exports.addToFavourite = void 0;
const db_1 = require("../lib/db");
const addToFavourite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId, userId } = req.params;
        if (!productId) {
            res.status(400).json({
                message: "Product ID is required",
            });
            return;
        }
        const currentUser = yield db_1.db.user.findFirst({
            where: {
                id: userId,
            },
        });
        let favoriteIds = [...((currentUser === null || currentUser === void 0 ? void 0 : currentUser.favoriteIds) || [])];
        favoriteIds.push(productId);
        const user = yield db_1.db.user.update({
            where: {
                id: userId,
            },
            data: {
                favoriteIds,
            },
        });
        res.status(200).json({
            data: { user },
        });
    }
    catch (error) {
        console.log("[ADD_TO_FAVOURITE]", error);
        res.status(500).json({
            message: "internal server error",
        });
    }
});
exports.addToFavourite = addToFavourite;
const getFavourites = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!userId) {
            res.status(400).json({ message: "User Id is required" });
        }
        const favourites = yield db_1.db.user.findFirst({
            where: {
                id: userId,
            },
        });
        res.status(200).json({
            data: {
                favourites,
            },
        });
    }
    catch (error) {
        console.log("[GET_FAVOURITE]", error);
        res.status(200).json({
            message: "Internal server error",
        });
    }
});
exports.getFavourites = getFavourites;
const removeFavourite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId, userId } = req.params;
        if (!productId) {
            res.status(400).json({
                message: "Product ID is required",
            });
            return;
        }
        const currentUser = yield db_1.db.user.findFirst({
            where: {
                id: userId,
            },
        });
        let favoriteIds = [...((currentUser === null || currentUser === void 0 ? void 0 : currentUser.favoriteIds) || [])];
        favoriteIds = favoriteIds.filter((id) => id !== productId);
        const user = yield db_1.db.user.update({
            where: {
                id: userId,
            },
            data: { favoriteIds },
        });
        res.status(200).json({
            data: {
                user,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server Error",
        });
    }
});
exports.removeFavourite = removeFavourite;
