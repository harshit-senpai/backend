import { Request, Response } from "express";
import { db } from "../lib/db";

export const addToFavourite = async (req: Request, res: Response) => {
  try {
    const { productId, userId } = req.params;

    if (!productId) {
      res.status(400).json({
        message: "Product ID is required",
      });
      return;
    }

    const currentUser = await db.user.findFirst({
      where: {
        id: userId,
      },
    });

    let favoriteIds = [...(currentUser?.favoriteIds || [])];

    favoriteIds.push(productId);

    const user = await db.user.update({
      where: {
        id: userId,
      },
      data: {
        favoriteIds,
      },
    });

    res.status(200).json({
      data: { user },
    });
  } catch (error) {
    console.log("[ADD_TO_FAVOURITE]", error);
    res.status(500).json({
      message: "internal server error",
    });
  }
};

export const getFavourites = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({ message: "User Id is required" });
    }

    const favourites = await db.user.findFirst({
      where: {
        id: userId,
      },
    });

    res.status(200).json({
      data: {
        favourites,
      },
    });
  } catch (error) {
    console.log("[GET_FAVOURITE]", error);
    res.status(200).json({
      message: "Internal server error",
    });
  }
};

export const removeFavourite = async (req: Request, res: Response) => {
  try {
    const { productId, userId } = req.params;

    if (!productId) {
      res.status(400).json({
        message: "Product ID is required",
      });
      return;
    }

    const currentUser = await db.user.findFirst({
      where: {
        id: userId,
      },
    });

    let favoriteIds = [...(currentUser?.favoriteIds || [])];

    favoriteIds = favoriteIds.filter((id) => id !== productId);

    const user = await db.user.update({
      where: {
        id: userId,
      },
      data: { favoriteIds },
    });

    res.status(200).json({
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server Error",
    });
  }
};
