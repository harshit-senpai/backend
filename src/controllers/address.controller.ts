import { Request, Response } from "express";
import { db } from "../lib/db";

export const createAddress = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, ...data } = req.body;

    const address = await db.address.create({
      data: {
        userId,
        ...data,
      },
    });

    res.status(200).json({ data: address });
  } catch (error) {
    console.log("[ADDRESS_CREATE]", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getUserAddresses = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.body;

    const addresses = await db.address.findMany({
      where: {
        userId,
      },
    });

    res.status(200).json({ data: addresses });
  } catch (error) {
    console.log("[ADDRESS_GET]", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getUserAddressesById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { addressId } = req.params;

    const address = await db.address.findUnique({
      where: {
        id: addressId,
      },
    });

    res.status(200).json({
      data: {
        address,
      },
    });
  } catch (error) {
    console.log("[ADDRESS_GET_BY_ID]", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateUserAddress = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, ...data } = req.body;
    const { addressId } = req.params;

    const address = await db.address.update({
      where: {
        id: addressId,
        userId,
      },
      data,
    });

    res.status(200).json({ data: address });
  } catch (error) {
    console.log("[ADDRESS_UPDATE]", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const setUserAddress = async (req: Request, res: Response) => {
  try {
    const { userId, addressId } = req.params;

    if (!userId) {
      res.status(400).json({
        message: "User ID is requried",
      });
    }

    if (!addressId) {
      res.status(400).json({
        message: "Address ID is required",
      });
      return;
    }

    await db.address.updateMany({
      where: {
        userId: userId,
      },
      data: {
        isShippingAddress: false,
      },
    });

    const userAddress = await db.address.update({
      where: {
        id: addressId,
        userId: userId,
      },
      data: {
        isShippingAddress: true,
      },
    });

    res.status(200).json({
      data: {
        userAddress,
      },
    });
  } catch (error) {
    console.log("[SET_ADDRESS_ERROR]");
  }
};
