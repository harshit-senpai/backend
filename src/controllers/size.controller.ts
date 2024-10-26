import { Request, Response } from "express";
import { db } from "../lib/db";

export const getAllSizes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const sizes = await db.size.findMany();

    res.status(200).json({
      data: {
        sizes,
      },
    });
  } catch (error) {
    console.log("[SIZE_GET]", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const createSize = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {name, value} = req.body;

    if (!name || !value) {
      res.status(400).json({
        message: "Name and value are required",
      });
      return;
    }

    const size = await db.size.create({
      data: {
        name,
        value,
      },
    });

    res.status(200).json({
      data: {
        size,
      },
    });
  } catch (error) {
    console.log("[SIZE_POST]", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getSizeById = async (req: Request, res: Response) => {
  try {
    const { sizeId } = req.params;

    if (!sizeId) {
      res.status(400).json({
        message: "Size id is required",
      });
      return;
    }

    const size = await db.size.findUnique({
      where: {
        id: sizeId,
      },
    });

    res.status(200).json({
      data: {
        size,
      },
    });
  } catch (error) {
    console.log("[SIZE_GET_BY_ID]", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateSize = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { sizeId } = req.params;

    if (!sizeId) {
      res.status(400).json({
        message: "Size id is required",
      });
      return;
    }

    const body = req.body;

    const { name, value } = body;

    const size = await db.size.update({
      where: {
        id: sizeId,
      },
      data: {
        name,
        value,
      },
    });

    res.status(200).json({
      data: {
        size,
      },
    });
  } catch (error) {
    console.log("[SIZE_PATCH]", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteSize = async (req: Request, res: Response) => {
  try {
    const { sizeId } = req.params;

    if (!sizeId) {
      res.status(400).json({
        message: "Size id is required",
      });
    }

    const size = await db.size.delete({
      where: {
        id: sizeId,
      },
    });

    res.status(200).json({
      data: {
        size,
      },
    });
  } catch (error) {
    console.log("[SIZE_DELETE]", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
