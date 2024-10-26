import { Request, Response } from "express";
import { db } from "../lib/db";

export const getAllProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const baseURL = `${req.protocol}://${req.get('host')}`;
    const url = new URL(req.url, baseURL);

    // additionally we can use req.query for much better

    const categoryId = url.searchParams.get("categoryId") || undefined;
    const sizeId = url.searchParams.get("sizeId") || undefined;
    const isFeatured = url.searchParams.get("isFeatured") || undefined;
    const isBestSeller = url.searchParams.get("isBestSeller") || undefined;

    const products = await db.product.findMany({
      where: {
        categoryId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
        isBestSeller: isBestSeller ? true : undefined,
      },
      include: {
        images: true,
        category: true,
        size: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      data: {
        products,
      },
    });
  } catch (error) {
    console.log("[PRODUCT_GET]", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const body = req.body;
    const {
      name,
      price,
      categoryId,
      description,
      sizeId,
      isFeatured,
      isBestSeller,
      isArchived,
      isDisscounted,
      stock,
      sellingPoint,
      images,
    } = body;

    if (!name) {
      res.status(400).json({
        message: "Name is Required",
      });
      return;
    }

    if (!price) {
      res.status(400).json({
        message: "Price is required",
      });
      return;
    }

    if (!categoryId) {
      res.status(400).json({
        message: "Category is required",
      });
      return;
    }

    if (!images || !images.length) {
      res.status(400).json({
        message: "Product image is required",
      });
      return;
    }

    if (!sizeId) {
      res.status(400).json({
        message: "Size Id is required",
      });
      return;
    }

    if (!sellingPoint) {
      res.status(400).json({
        message: "Selling Point is required",
      });
      return;
    }

    if (!stock) {
      res.status(400).json({
        message: "stock is required",
      });
      return;
    }

    if (!description || !description.length) {
      res.status(400).json({
        message: "Description is required",
      });
      return;
    }

    const product = await db.product.create({
      data: {
        name,
        description,
        sellingPoint,
        price,
        stock,
        categoryId,
        sizeId,
        isFeatured,
        isArchived,
        isBestSeller,
        isDisscounted,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    res.status(201).json({
      data: {
        product,
      },
    });
  } catch (error) {
    console.log("[PRODUCT_POST]", error);
    res.status(500).json("Internal Error");
  }
};

export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.params;

    if (!productId) {
      res.status(400).json({
        message: "Product ID is required",
      });
      return;
    }

    const product = await db.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        images: true,
        category: true,
        size: true,
      },
    });

    res.status(200).json({
      data: {
        product,
      },
    });
  } catch (error) {
    console.log("[PRODUCT_GET_BY_ID]", error);
    res.status(500).json("Internal Error");
  }
};

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.params;

    if (!productId) {
      res.status(400).json({
        message: "Product ID is Required",
      });
      return;
    }

    const body = req.body;

    const {
      name,
      price,
      categoryId,
      sizeId,
      images,
      stock,
      description,
      sellingPoint,
      isFeatured,
      isBestSeller,
      isArchived,
      isDisscounted,
    } = body;

    if (!name) {
      res.status(400).json({
        message: "Name is Required",
      });
      return;
    }

    if (!price) {
      res.status(400).json({
        message: "Price is required",
      });
      return;
    }

    if (!categoryId) {
      res.status(400).json({
        message: "Category is required",
      });
      return;
    }

    if (!images || !images.length) {
      res.status(400).json({
        message: "Product image is required",
      });
      return;
    }

    if (!sizeId) {
      res.status(400).json({
        message: "Size Id is required",
      });
      return;
    }

    if (!sellingPoint) {
      res.status(400).json({
        message: "Selling Point is required",
      });
      return;
    }

    if (!stock) {
      res.status(400).json({
        message: "stock is required",
      });
      return;
    }

    if (!description || !description.length) {
      res.status(400).json({
        message: "Description is required",
      });
      return;
    }

    await db.product.update({
      where: {
        id: productId,
      },
      data: {
        name,
        description,
        price,
        categoryId,
        sizeId,
        images: {
          deleteMany: {},
        },
        stock,
        sellingPoint,
        isFeatured,
        isArchived,
        isBestSeller,
        isDisscounted,
      },
    });

    const product = await db.product.update({
      where: {
        id: productId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    res.status(200).json({
      data: {
        product,
      },
    });
  } catch (error) {
    console.log("[PRODUCT_UPDATE]", error);
    res.status(500).json("Internal Error");
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.params;

    if (!productId) {
      res.status(400).json({
        message: "Product ID is Required",
      });
      return;
    }

    const product = await db.product.delete({
      where: {
        id: productId,
      },
    });

    res.status(200).json({
      data: {
        product,
      },
    });
  } catch (error) {
    console.log("[PRODUCT_DELETE]", error);
    res.status(500).json("Internal Error");
  }
};

