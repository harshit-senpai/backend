// import { Request, Response } from "express";
// import { db } from "../lib/db";
// import bcrypt from "bcryptjs";
// import { generateVerificationToken } from "../lib/token";
// import { sendVerificationEmail } from "../utils/mail";
// import { getVerificationTokenByToken } from "../utils/verificationToken";

// export const signUp = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { name, email, password, phone } = req.body;

//     if (!name) {
//       res.status(400).json({
//         message: "user name is required",
//       });
//       return;
//     }

//     if (!email) {
//       res.status(400).json({
//         message: "User email is required",
//       });
//       return;
//     }

//     if (!phone) {
//       res.status(400).json({
//         message: "User Phone number is required",
//       });
//       return;
//     }

//     if (!password) {
//       res.status(400).json({
//         message: "Password is required",
//       });
//     }

//     const existingUser = await db.user.findUnique({
//       where: {
//         email,
//       },
//     });

//     if (existingUser) {
//       res.status(400).json({
//         message: "Email already in use",
//       });
//     }

//     const hashPassword = await bcrypt.hash(password, 10);

//     const newUser = await db.user.create({
//       data: {
//         name,
//         email,
//         phone,
//         hashPassword,
//       },
//     });

//     const verificationToken = await generateVerificationToken(email);

//     await sendVerificationEmail(
//       verificationToken.email,
//       verificationToken.token
//     );

//     res.status(200).json({ message: "Email sent" });
//   } catch (error) {
//     console.log("[SIGN_UP_ERROR]", error);
//     res.status(500).json({
//       message: "Internal server error",
//     });
//   }
// };

// export const newVerification = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { token } = req.params;
//     const existingToken = await getVerificationTokenByToken(token);

//     if (!existingToken) {
//       res.status(404).json({
//         message: "Token does not exist",
//       });
//       return;
//     }

//     const hasExpired = new Date(existingToken.expires) < new Date();

//     if (hasExpired) {
//       await db.verificationToken.delete({
//         where: {
//           id: existingToken.id,
//         },
//       });
//       res.status(404).json({
//         message: "Token has expired",
//       });
//       return;
//     }

//     const existingUser = await db.user.findUnique({
//       where: {
//         email: existingToken.email,
//       },
//     });

//     if (!existingUser) {
//       res.status(404).json({
//         message: "User does not exist",
//       });
//       return;
//     }

//     await db.user.update({
//       where: {
//         id: existingUser.id,
//       },
//       data: {
//         emailVerified: new Date(),
//         email: existingToken.email,
//       },
//     });

//     setTimeout(async () => {
//       await db.verificationToken.delete({
//         where: { id: existingToken.id },
//       });
//     }, 1000);

//     res.status(200).json({ message: "Email verified" });
//   } catch (error) {
//     console.log("NEW_VERIFICATION_ERROR", error);
//     res.status(500).json({
//       message: "Internal server error",
//     });
//   }
// };
