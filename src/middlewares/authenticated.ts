import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { db } from "../lib/db";

declare global {
  namespace Express {
    interface Request {
      user?: any; // You can replace 'any' with a more specific type if available
    }
  }
}

export const isAuthenticated = async (req: Request, res: Response) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({
      message: "You are not Authenticated",
    });
  }

  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as jwt.JwtPayload;

  const currentUser = await db.user.findUnique({
    where: {
      id: decoded?.id as string,
    },
  });

  if (!currentUser) {
    res.status(401).json({
      message: "User does not exist",
    });
  }

  req.user = currentUser;
};
