import { db } from "./db";
import { v4 as uuidv4 } from "uuid";
import { mailerooTransporter } from "./maileroo";

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordResetToken = await db.passwordResetToken.findUnique({
      where: { token },
    });

    return passwordResetToken;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await db.passwordResetToken.findFirst({
      where: { email },
    });

    return passwordResetToken;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await db.passwordResetToken.delete({
      where: { id: existingToken.id },
    });
  }

  const passwordResetToken = await db.passwordResetToken.create({
    data: { email, token, expires },
  });

  return passwordResetToken;
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${process.env.BASE_URL}/password-reset-form?token=${token}`;

  try {
    await mailerooTransporter.sendMail({
      from: `Syntaxly <${process.env.MAILEROO_FROM_EMAIL}>`,
      to: email,
      subject: "Password reset link 🎉",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password!</p>`,
    });

    return { error: null };
  } catch (error) {
    console.error("Maileroo error: ", error);
    return { error: "Failed to send password reset email!" };
  }
};
