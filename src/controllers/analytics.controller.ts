import { Request, Response } from "express";
import { db } from "../lib/db";

export const getTotalIncome = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const paidOrders = await db.order.findMany({
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
  } catch (error) {
    console.log("[TOTAL_INCOME]", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getWeeklySales = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const date = new Date();
    const lastWeek = new Date(date.setDate(date.getDate() - 7));

    const weeklySales = await db.order.findMany({
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
  } catch (error) {
    console.log("[WEEKLY_SALES]", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getWeeklyOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const date = new Date();
    const lastWeek = new Date(date.setDate(date.getDate() - 7));

    const weeklyOrders = await db.order.count({
      where: {
        isPaid: true,
        createdAt: {
          gte: lastWeek,
        },
      },
    });

    res.status(200).json({ data: { weeklyOrders } });
  } catch (error) {
    console.log("[WEEKLY_ORDERS]", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
