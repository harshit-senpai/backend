import { Request, Response } from "express";
import { db } from "../lib/db";

export const searchSearch = async (req: Request, res: Response) => {
  try {
    const query = req.query;
    const title = query.title as string;
    console.log(query.title);

    const product = await db.product.findMany({
      where: {
        name: {
          contains: title,
          mode: "insensitive",
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
