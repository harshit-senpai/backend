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
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.createProduct = exports.getAllProducts = void 0;
const db_1 = require("../lib/db");
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const baseURL = `${req.protocol}://${req.get('host')}`;
        const url = new URL(req.url, baseURL);
        // additionally we can use req.query for much better
        const categoryId = url.searchParams.get("categoryId") || undefined;
        const sizeId = url.searchParams.get("sizeId") || undefined;
        const isFeatured = url.searchParams.get("isFeatured") || undefined;
        const isBestSeller = url.searchParams.get("isBestSeller") || undefined;
        const products = yield db_1.db.product.findMany({
            where: {
                categoryId,
                sizeId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false,
                isBestSeller: isBestSeller ? true : undefined,
            },
            include: {
                images: true,
                category: true,
                size: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.status(200).json({
            data: {
                products,
            },
        });
    }
    catch (error) {
        console.log("[PRODUCT_GET]", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});
exports.getAllProducts = getAllProducts;
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const { name, price, categoryId, description, sizeId, isFeatured, isBestSeller, isArchived, isDisscounted, stock, sellingPoint, images, } = body;
        if (!name) {
            res.status(400).json({
                message: "Name is Required",
            });
            return;
        }
        if (!price) {
            res.status(400).json({
                message: "Price is required",
            });
            return;
        }
        if (!categoryId) {
            res.status(400).json({
                message: "Category is required",
            });
            return;
        }
        if (!images || !images.length) {
            res.status(400).json({
                message: "Product image is required",
            });
            return;
        }
        if (!sizeId) {
            res.status(400).json({
                message: "Size Id is required",
            });
            return;
        }
        if (!sellingPoint) {
            res.status(400).json({
                message: "Selling Point is required",
            });
            return;
        }
        if (!stock) {
            res.status(400).json({
                message: "stock is required",
            });
            return;
        }
        if (!description || !description.length) {
            res.status(400).json({
                message: "Description is required",
            });
            return;
        }
        const product = yield db_1.db.product.create({
            data: {
                name,
                description,
                sellingPoint,
                price,
                stock,
                categoryId,
                sizeId,
                isFeatured,
                isArchived,
                isBestSeller,
                isDisscounted,
                images: {
                    createMany: {
                        data: [...images.map((image) => image)],
                    },
                },
            },
        });
        res.status(201).json({
            data: {
                product,
            },
        });
    }
    catch (error) {
        console.log("[PRODUCT_POST]", error);
        res.status(500).json("Internal Error");
    }
});
exports.createProduct = createProduct;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        if (!productId) {
            res.status(400).json({
                message: "Product ID is required",
            });
            return;
        }
        const product = yield db_1.db.product.findUnique({
            where: {
                id: productId,
            },
            include: {
                images: true,
                category: true,
                size: true,
            },
        });
        res.status(200).json({
            data: {
                product,
            },
        });
    }
    catch (error) {
        console.log("[PRODUCT_GET_BY_ID]", error);
        res.status(500).json("Internal Error");
    }
});
exports.getProductById = getProductById;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        if (!productId) {
            res.status(400).json({
                message: "Product ID is Required",
            });
            return;
        }
        const body = req.body;
        const { name, price, categoryId, sizeId, images, stock, description, sellingPoint, isFeatured, isBestSeller, isArchived, isDisscounted, } = body;
        if (!name) {
            res.status(400).json({
                message: "Name is Required",
            });
            return;
        }
        if (!price) {
            res.status(400).json({
                message: "Price is required",
            });
            return;
        }
        if (!categoryId) {
            res.status(400).json({
                message: "Category is required",
            });
            return;
        }
        if (!images || !images.length) {
            res.status(400).json({
                message: "Product image is required",
            });
            return;
        }
        if (!sizeId) {
            res.status(400).json({
                message: "Size Id is required",
            });
            return;
        }
        if (!sellingPoint) {
            res.status(400).json({
                message: "Selling Point is required",
            });
            return;
        }
        if (!stock) {
            res.status(400).json({
                message: "stock is required",
            });
            return;
        }
        if (!description || !description.length) {
            res.status(400).json({
                message: "Description is required",
            });
            return;
        }
        yield db_1.db.product.update({
            where: {
                id: productId,
            },
            data: {
                name,
                description,
                price,
                categoryId,
                sizeId,
                images: {
                    deleteMany: {},
                },
                stock,
                sellingPoint,
                isFeatured,
                isArchived,
                isBestSeller,
                isDisscounted,
            },
        });
        const product = yield db_1.db.product.update({
            where: {
                id: productId,
            },
            data: {
                images: {
                    createMany: {
                        data: [...images.map((image) => image)],
                    },
                },
            },
        });
        res.status(200).json({
            data: {
                product,
            },
        });
    }
    catch (error) {
        console.log("[PRODUCT_UPDATE]", error);
        res.status(500).json("Internal Error");
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        if (!productId) {
            res.status(400).json({
                message: "Product ID is Required",
            });
            return;
        }
        const product = yield db_1.db.product.delete({
            where: {
                id: productId,
            },
        });
        res.status(200).json({
            data: {
                product,
            },
        });
    }
    catch (error) {
        console.log("[PRODUCT_DELETE]", error);
        res.status(500).json("Internal Error");
    }
});
exports.deleteProduct = deleteProduct;
