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
exports.getUserOrders = exports.verifyOrder = exports.createOrder = void 0;
const crypto_1 = __importDefault(require("crypto"));
const razorpay_1 = __importDefault(require("razorpay"));
const db_1 = require("../lib/db");
const razorpay = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});
const generateSignature = (razorpayOrderId, razorpayPaymentId) => {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const signature = crypto_1.default
        .createHmac("sha256", keySecret)
        .update(razorpayOrderId + "|" + razorpayPaymentId)
        .digest("hex");
    return signature;
};
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    try {
        const { amount, ShopProducts, userId } = req.body;
        if (!amount || isNaN(amount)) {
            res.status(400).json({
                message: "Invalid Amount",
            });
            return;
        }
        if (!ShopProducts || ShopProducts.length === 0) {
            res.status(400).json({
                message: "Invalid Product ID",
            });
            return;
        }
        const user = yield db_1.db.user.findUnique({
            where: {
                id: userId,
            },
        });
        const address = yield db_1.db.address.findFirst({
            where: {
                userId: userId,
            },
        });
        const order = yield db_1.db.order.create({
            data: {
                isPaid: false,
                razorpayOrderId: "",
                customerName: (_a = user === null || user === void 0 ? void 0 : user.name) !== null && _a !== void 0 ? _a : "",
                customerEmail: (_b = user === null || user === void 0 ? void 0 : user.email) !== null && _b !== void 0 ? _b : "",
                customerPhone: (_c = user === null || user === void 0 ? void 0 : user.phone) !== null && _c !== void 0 ? _c : "",
                address: (_d = address === null || address === void 0 ? void 0 : address.fulladdress) !== null && _d !== void 0 ? _d : "",
                city: (_e = address === null || address === void 0 ? void 0 : address.city) !== null && _e !== void 0 ? _e : "",
                state: (_f = address === null || address === void 0 ? void 0 : address.state) !== null && _f !== void 0 ? _f : "",
                country: (_g = address === null || address === void 0 ? void 0 : address.country) !== null && _g !== void 0 ? _g : "",
                pincode: (_h = address === null || address === void 0 ? void 0 : address.pincode) !== null && _h !== void 0 ? _h : "",
                user: {
                    connect: {
                        id: userId,
                    },
                },
                orderItems: {
                    create: ShopProducts.map((product) => ({
                        quantity: product.quantity ? product.quantity : 1,
                        product: {
                            connect: {
                                id: product.id,
                            },
                        },
                    })),
                },
            },
        });
        const razorpayOrder = yield razorpay.orders.create({
            amount,
            currency: "INR",
            receipt: order.id,
        });
        yield db_1.db.order.update({
            where: {
                id: order.id,
            },
            data: {
                razorpayOrderId: razorpayOrder.id,
            },
        });
        res.status(200).json({
            data: {
                razorpayOrder,
            },
        });
    }
    catch (error) {
        console.log("[ORDER_CREATE]", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});
exports.createOrder = createOrder;
const verifyOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId, razorpayPaymentId, razorpaySignature, order } = req.body;
        const signature = generateSignature(orderId, razorpayPaymentId);
        if (signature !== razorpaySignature) {
            res.status(400).json({
                message: "Payment verification failed",
            });
            return;
        }
        yield db_1.db.order.update({
            where: {
                id: order,
            },
            data: {
                isPaid: true,
            },
        });
        res.status(200).json({
            message: "Payment verified successfully",
        });
    }
    catch (error) {
        console.log("[ORDER_VERIFY]", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});
exports.verifyOrder = verifyOrder;
const getUserOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const orders = yield db_1.db.order.findMany({
            where: {
                userId: userId,
                isPaid: false,
            },
            include: {
                orderItems: {
                    include: {
                        product: {
                            include: {
                                images: true,
                            },
                        },
                    },
                },
            },
        });
        res.status(200).json({ data: orders });
    }
    catch (error) {
        console.log("[ORDER_GET]", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});
exports.getUserOrders = getUserOrders;
