import { Request, Response } from "express";
import { db } from "../lib/db";

export const signUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name) {
      res.status(400).json({
        message: "user name is required",
      });
      return;
    }

    if (!email) {
      res.status(400).json({
        message: "User email is required",
      });
    }

    if (!phone) {
      res.status(200).json({
        message: "User Phone number is required",
      });
    }

    const newUser = await db.user.create({
      data: {
        name,
        email,
        phone,
      },
    });
  } catch (error) {
    console.log("[SIGN_UP_ERROR]", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
