"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const analytics_controller_1 = require("../controllers/analytics.controller");
const router = express_1.default.Router();
router.route("/total-income").get(analytics_controller_1.getTotalIncome);
router.route("/weekly-sales").get(analytics_controller_1.getWeeklySales);
router.route("/weekly-orders").get(analytics_controller_1.getWeeklyOrders);
exports.default = router;
