import { getVerificationTokenByEmail } from "../utils/verificationToken";
import { db } from "./db";

export const generateVerificationToken = async (email: string) => {
  const token = Math.floor(1000 + Math.random()*9000).toString();
  
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return verificationToken;
};
