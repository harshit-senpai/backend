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
exports.deleteSize = exports.updateSize = exports.getSizeById = exports.createSize = exports.getAllSizes = void 0;
const db_1 = require("../lib/db");
const getAllSizes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sizes = yield db_1.db.size.findMany();
        res.status(200).json({
            data: {
                sizes,
            },
        });
    }
    catch (error) {
        console.log("[SIZE_GET]", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});
exports.getAllSizes = getAllSizes;
const createSize = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, value } = req.body;
        if (!name || !value) {
            res.status(400).json({
                message: "Name and value are required",
            });
            return;
        }
        const size = yield db_1.db.size.create({
            data: {
                name,
                value,
            },
        });
        res.status(200).json({
            data: {
                size,
            },
        });
    }
    catch (error) {
        console.log("[SIZE_POST]", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});
exports.createSize = createSize;
const getSizeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sizeId } = req.params;
        if (!sizeId) {
            res.status(400).json({
                message: "Size id is required",
            });
            return;
        }
        const size = yield db_1.db.size.findUnique({
            where: {
                id: sizeId,
            },
        });
        res.status(200).json({
            data: {
                size,
            },
        });
    }
    catch (error) {
        console.log("[SIZE_GET_BY_ID]", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});
exports.getSizeById = getSizeById;
const updateSize = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sizeId } = req.params;
        if (!sizeId) {
            res.status(400).json({
                message: "Size id is required",
            });
            return;
        }
        const body = req.body;
        const { name, value } = body;
        const size = yield db_1.db.size.update({
            where: {
                id: sizeId,
            },
            data: {
                name,
                value,
            },
        });
        res.status(200).json({
            data: {
                size,
            },
        });
    }
    catch (error) {
        console.log("[SIZE_PATCH]", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});
exports.updateSize = updateSize;
const deleteSize = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sizeId } = req.params;
        if (!sizeId) {
            res.status(400).json({
                message: "Size id is required",
            });
        }
        const size = yield db_1.db.size.delete({
            where: {
                id: sizeId,
            },
        });
        res.status(200).json({
            data: {
                size,
            },
        });
    }
    catch (error) {
        console.log("[SIZE_DELETE]", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});
exports.deleteSize = deleteSize;
