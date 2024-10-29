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
exports.searchSearch = void 0;
const db_1 = require("../lib/db");
const searchSearch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = req.query;
        const title = query.title;
        const product = yield db_1.db.product.findMany({
            where: {
                name: {
                    contains: title,
                    mode: "insensitive",
                },
            },
            include: {
                images: true,
            },
        });
        res.status(200).json({
            data: {
                product,
            },
        });
    }
    catch (error) {
        console.log("[PRODUCT_SEARCH_ERROR]", error);
        res.status(500).json("internal server error");
    }
});
exports.searchSearch = searchSearch;
