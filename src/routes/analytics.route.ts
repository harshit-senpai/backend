import express from "express";
import {
  getTotalIncome,
  getWeeklyOrders,
  getWeeklySales,
} from "../controllers/analytics.controller";

const router = express.Router();

router.route("/total-income").get(getTotalIncome);
router.route("/weekly-sales").get(getWeeklySales);
router.route("/weekly-orders").get(getWeeklyOrders);

export default router;
