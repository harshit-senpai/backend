import { Request, Response } from "express";
import { db } from "../lib/db";
import bcrypt from "bcryptjs";
import {
  generatePasswordResetToken,
  generateVerificationToken,
} from "../lib/token";
import jwt from "jsonwebtoken";
import { resetPasswordEmail, sendVerificationEmail } from "../utils/mail";
import { getVerificationTokenByToken } from "../utils/verificationToken";
import {
  getPasswordResetTokenByEmail,
  getPasswordResetTokenByToken,
} from "../utils/passwordResetToken";

const signToken = (id: string) => {
  const secret = process.env.JWT_SECRET as string;

  return jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (
  user: any,
  statusCode: number,
  res: Response,
  message: string
) => {
  const token = signToken(user.id);

  const expiry = Number(process.env.JWT_COOKIE_EXPIRES_IN as string);

  const cookieOptions = {
    expires: new Date(Date.now() + expiry * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "lax" as "lax",
  };

  res.cookie("token", token, cookieOptions);

  res.status(statusCode).json({
    token: token,
    message,
    data: {
      user,
    },
  });
};

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
      return;
    }

    if (!phone) {
      res.status(400).json({
        message: "User Phone number is required",
      });
      return;
    }

    if (!password) {
      res.status(400).json({
        message: "Password is required",
      });
    }

    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      res.status(400).json({
        message: "Email already in use",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const verificationToken = await generateVerificationToken(email);

    await db.tempUser.create({
      data: {
        name,
        email,
        phone,
        password: hashPassword,
        token: verificationToken.token,
      },
    });

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    res.status(200).json({
      message: "Verification email sent",
    });
  } catch (error) {
    console.log("[SIGN_UP_ERROR]", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const newVerification = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { token } = req.params;

    const tempUser = await db.tempUser.findUnique({
      where: {
        token,
      },
    });

    const existingToken = await getVerificationTokenByToken(token);

    if (!existingToken) {
      res.status(404).json({
        message: "Token does not exist",
      });
      return;
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      await db.verificationToken.delete({
        where: {
          id: existingToken.id,
        },
      });
      res.status(404).json({
        message: "Token has expired",
      });
      return;
    }

    const isValidToken = tempUser?.token === existingToken?.token;

    if (!isValidToken) {
      res.status(400).json({
        message: "Invalid OTP",
      });
    }

    const newUser = await db.user.create({
      data: {
        name: tempUser?.name!,
        email: tempUser?.email!,
        phone: tempUser?.phone,
        hashPassword: tempUser?.password,
        emailVerified: new Date(),
      },
    });

    setTimeout(async () => {
      await db.verificationToken.delete({
        where: { id: existingToken.id },
      });
      await db.tempUser.delete({
        where: {
          id: tempUser?.id,
        },
      });
    }, 1000);

    createSendToken(newUser, 201, res, "User created and email verified");
  } catch (error) {
    console.log("NEW_VERIFICATION_ERROR", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        message: "missing fields",
      });
    }

    const existingUser = await db.user.findFirst({
      where: {
        email,
      },
    });

    if (!existingUser) {
      res.status(404).json({
        message: "User does not exist",
      });
    }

    const correctPassword = await bcrypt.compare(
      password,
      existingUser?.hashPassword!
    );

    if (!correctPassword) {
      res.status(400).json({
        message: "invalid credentials",
      });
    }

    createSendToken(existingUser, 200, res, "user logged in");
  } catch (error) {
    console.log("SIGININ_ERROR", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const logOut = async (req: Request, res: Response) => {
  try {
    res.cookie("token", "Loggout", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    console.log("[LOGOUT_ERROR]", error);
    res.status(500).json({
      message: "internal server error",
    });
  }
};

export const reset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        message: "Email does not exists",
      });
      return;
    }

    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!existingUser) {
      res.status(404).json({
        message: "User with this email does not exists",
      });
      return;
    }

    const passwordResetToken = await generatePasswordResetToken(email);

    await resetPasswordEmail(
      passwordResetToken.email,
      passwordResetToken.token
    );

    res.status(200).json({
      message: "Email sent!",
    });
  } catch (error) {
    console.log("[RESET_ERROR]", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const existingToken = await getPasswordResetTokenByToken(token);

    if (!existingToken) {
      res.status(404).json({
        message: "Invalid Token!",
      });
      return;
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      await db.passwordResetToken.delete({
        where: {
          id: existingToken.id,
        },
      });
      res.status(400).json({
        message: "OTP has expired",
      });
    }

    const existingUser = await db.user.findUnique({
      where: {
        email: existingToken.email,
      },
    });

    if (!existingUser) {
      res.status(404).json({
        message: "User does not exist",
      });
      return;
    }

    const sessionToken = jwt.sign(
      { email: existingToken.email },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "15m",
      }
    );

    const Otp = await getPasswordResetTokenByEmail(existingUser.email);
    const isValidOtp = token == Otp?.token;

    if (!isValidOtp) {
      res.status(400).json({
        message: "Wrong OTP",
      });
      return;
    }

    console.log(sessionToken);

    res.status(200).json({
      message: "OTP is verified",
      sessionToken,
    });
  } catch (error) {
    console.log("[VERIFY_OTP]", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const newPassword = async (req: Request, res: Response) => {
  try {
    const { sessionToken, newPassword } = req.body;

    if (!sessionToken || !newPassword) {
      res.status(400).json({
        message: "Session token and new password are required",
      });
      return;
    }

    const decoded = jwt.verify(
      sessionToken,
      process.env.JWT_SECRET as string
    ) as { email: string };

    const existingUser = await db.user.findUnique({
      where: {
        email: decoded.email,
      },
    });

    if (!existingUser) {
      res.status(404).json({
        message: "User does not exist",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        hashPassword: hashedPassword,
      },
    });

    res.status(200).json({
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.log("[NEW_PASSWORD_ERROR]", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
