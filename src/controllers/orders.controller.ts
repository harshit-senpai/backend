import { Request, Response } from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import { db } from "../lib/db";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

const generateSignature = (
  razorpayOrderId: string,
  razorpayPaymentId: string
) => {
  const keySecret = process.env.RAZORPAY_KEY_SECRET as string;

  const signature = crypto
    .createHmac("sha256", keySecret)
    .update(razorpayOrderId + "|" + razorpayPaymentId)
    .digest("hex");

  return signature;
};

export const createOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { amount, productId, userId } = req.body;

    if (!amount || isNaN(amount)) {
      res.status(400).json({
        message: "Invalid Amount",
      });
      return;
    }

    if (!productId || productId.length === 0) {
      res.status(400).json({
        message: "Invalid Product ID",
      });
      return;
    }

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    const address = await db.address.findFirst({
      where: {
        userId: userId,
      },
    });

    const products = await db.product.findMany({
      where: {
        id: productId,
      },
    });

    const order = await db.order.create({
      data: {
        isPaid: false,
        razorpayOrderId: "",
        customerName: user?.name ?? "",
        customerEmail: user?.email ?? "",
        customerPhone: user?.phone ?? "",
        address: address?.fulladdress ?? "",
        city: address?.city ?? "",
        state: address?.state ?? "",
        country: address?.country ?? "",
        pincode: address?.pincode ?? "",
        user: {
          connect: {
            id: userId,
          },
        },
        orderItems: {
          create: products.map((product) => ({
            product: {
              connect: {
                id: product.id,
              },
            },
          })),
        },
      },
    });

    const razorpayOrder = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: order.id,
    });

    await db.order.update({
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
  } catch (error) {
    console.log("[ORDER_CREATE]", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const verifyOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { orderId, razorpayPaymentId, razorpaySignature, order } = req.body;

    const signature = generateSignature(orderId, razorpayPaymentId);

    if (signature !== razorpaySignature) {
      res.status(400).json({
        message: "Payment verification failed",
      });
      return;
    }

    await db.order.update({
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
  } catch (error) {
    console.log("[ORDER_VERIFY]", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getUserOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;

    const orders = await db.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        orders: true,
      },
    });

    res.status(200).json({ data: orders });
  } catch (error) {
    console.log("[ORDER_GET]", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};