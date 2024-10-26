import express from "express";
import { createOrder, getUserOrders, verifyOrder } from "../controllers/orders.controller";

const router = express.Router();

router.route("/create-order").post(createOrder);
router.route("/verify-order").post(verifyOrder);
router.route("/user-orders/:userId").get(getUserOrders);

export default router;
