import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmationLink = token;

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Confirm your email",
    html: `<p>your OTP is: ${confirmationLink}.</p>`,
  });
};

export const resetPasswordEmail = async (email: string, token: string) => {
  const link = token;

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Rest your password",
    html: `<p>your OTP is: ${link}.</p>`,
  });
};
