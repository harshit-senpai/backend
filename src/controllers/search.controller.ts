import { Request, Response } from "express";
import { db } from "../lib/db";

export const searchSearch = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const { title } = body;

    const product = await db.product.findMany({
      where: {
        name: {
          contains: title,
        },
      },
    });

    res.status(200).json({
      data: {
        product,
      },
    });
  } catch (error) {
    console.log("[PRODUCT_SEARCH_ERROR]", error);
    res.status(500).json("internal server error");
  }
};
