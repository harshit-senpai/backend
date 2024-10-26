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
exports.getWeeklyOrders = exports.getWeeklySales = exports.getTotalIncome = void 0;
const db_1 = require("../lib/db");
const getTotalIncome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paidOrders = yield db_1.db.order.findMany({
            where: {
                isPaid: true,
            },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        const totalIncome = paidOrders.reduce((acc, order) => {
            const orderTotal = order.orderItems.reduce((orderSum, item) => {
                return orderSum + Number(item.product.price);
            }, 0);
            return acc + orderTotal;
        }, 0);
        res.status(200).json({ data: { totalIncome } });
    }
    catch (error) {
        console.log("[TOTAL_INCOME]", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});
exports.getTotalIncome = getTotalIncome;
const getWeeklySales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const date = new Date();
        const lastWeek = new Date(date.setDate(date.getDate() - 7));
        const weeklySales = yield db_1.db.order.findMany({
            where: {
                isPaid: true,
                createdAt: {
                    gte: lastWeek,
                },
            },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        const totalSales = weeklySales.reduce((acc, salse) => {
            const orderTotal = salse.orderItems.reduce((orderSum, item) => {
                return orderSum + Number(item.product.price);
            }, 0);
            return acc + orderTotal;
        }, 0);
        res.status(200).json({ data: { totalSales } });
    }
    catch (error) {
        console.log("[WEEKLY_SALES]", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});
exports.getWeeklySales = getWeeklySales;
const getWeeklyOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const date = new Date();
        const lastWeek = new Date(date.setDate(date.getDate() - 7));
        const weeklyOrders = yield db_1.db.order.count({
            where: {
                isPaid: true,
                createdAt: {
                    gte: lastWeek,
                },
            },
        });
        res.status(200).json({ data: { weeklyOrders } });
    }
    catch (error) {
        console.log("[WEEKLY_ORDERS]", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});
exports.getWeeklyOrders = getWeeklyOrders;
