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
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getAllCategories = void 0;
const db_1 = require("../lib/db");
const getAllCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield db_1.db.category.findMany({
            include: {
                image: true,
            },
        });
        res.status(200).json({
            data: {
                categories,
            },
        });
    }
    catch (error) {
        console.log("[CATEGORIES_GET] Error: ", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});
exports.getAllCategories = getAllCategories;
const getCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryId = req.params.categoryId;
        if (!categoryId) {
            res.status(400).json({
                message: "Category ID is required",
            });
            return;
        }
        const category = yield db_1.db.category.findUnique({
            where: {
                id: categoryId,
            },
            include: {
                image: true,
            },
        });
        res.status(200).json({
            data: {
                category,
            },
        });
    }
    catch (error) {
        console.log("[CATEGORY_GET_BY_ID] Error: ", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});
exports.getCategoryById = getCategoryById;
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, image } = req.body;
        if (!name) {
            res.status(400).json({
                message: "Category Name is required",
            });
            return;
        }
        if (!image) {
            res.status(400).json({
                message: "Image is required to create category",
            });
            return;
        }
        const category = yield db_1.db.category.create({
            data: {
                name,
                image: {
                    create: [
                        {
                            url: image,
                        },
                    ],
                },
            },
            include: {
                image: true,
            },
        });
        res.status(201).json({
            data: {
                category,
            },
        });
    }
    catch (error) {
        console.log("[CATEGORY_CREATE] Error: ", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});
exports.createCategory = createCategory;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryId = req.params.categoryId;
        if (!categoryId) {
            res.status(400).json({
                message: "Category ID is required",
            });
            return;
        }
        const { name, image } = req.body;
        const category = yield db_1.db.category.update({
            where: {
                id: categoryId,
            },
            data: {
                name,
                image: {
                    create: [
                        {
                            url: image,
                        },
                    ],
                },
            },
            include: {
                image: true,
            },
        });
        res.status(200).json({
            data: {
                category,
            },
        });
    }
    catch (error) {
        console.log("[CATEGORY_UPDATE] Error: ", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});
exports.updateCategory = updateCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryId = req.params.categoryId;
        if (!categoryId) {
            res.status(400).json({
                message: "Category ID is required",
            });
            return;
        }
        const category = yield db_1.db.category.delete({
            where: {
                id: categoryId,
            },
        });
        res.status(200).json({
            data: {
                category,
            },
        });
    }
    catch (error) {
        console.log("[CATEGORY_DELETE] Error: ", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});
exports.deleteCategory = deleteCategory;
