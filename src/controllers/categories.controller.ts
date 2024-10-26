import { Request, Response } from "express";
import { db } from "../lib/db";

export const getAllCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categories = await db.category.findMany({
      include: {
        image: true,
      },
    });

    res.status(200).json({
      data: {
        categories,
      },
    });
  } catch (error) {
    console.log("[CATEGORIES_GET] Error: ", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getCategoryById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categoryId = req.params.categoryId as string;

    if (!categoryId) {
      res.status(400).json({
        message: "Category ID is required",
      });
      return;
    }

    const category = await db.category.findUnique({
      where: {
        id: categoryId,
      },
      include: {
        image: true,
      },
    });

    res.status(200).json({
      data: {
        category,
      },
    });
  } catch (error) {
    console.log("[CATEGORY_GET_BY_ID] Error: ", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const createCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, image } = req.body;

    if (!name) {
      res.status(400).json({
        message: "Category Name is required",
      });
      return;
    }

    if (!image) {
      res.status(400).json({
        message: "Image is required to create category",
      });
      return;
    }

    const category = await db.category.create({
      data: {
        name,
        image: {
          create: [
            {
              url: image,
            },
          ],
        },
      },
      include: {
        image: true,
      },
    });

    res.status(201).json({
      data: {
        category,
      },
    });
  } catch (error) {
    console.log("[CATEGORY_CREATE] Error: ", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categoryId = req.params.categoryId as string;

    if (!categoryId) {
      res.status(400).json({
        message: "Category ID is required",
      });
      return;
    }

    const { name, image } = req.body;

    const category = await db.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name,
        image: {
          create: [
            {
              url: image,
            },
          ],
        },
      },
      include: {
        image: true,
      },
    });

    res.status(200).json({
      data: {
        category,
      },
    });
  } catch (error) {
    console.log("[CATEGORY_UPDATE] Error: ", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categoryId = req.params.categoryId as string;

    if (!categoryId) {
      res.status(400).json({
        message: "Category ID is required",
      });
      return;
    }

    const category = await db.category.delete({
      where: {
        id: categoryId,
      },
    });

    res.status(200).json({
      data: {
        category,
      },
    });
  } catch (error) {
    console.log("[CATEGORY_DELETE] Error: ", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
