import { db } from "./db";
import { v4 as uuidv4 } from "uuid";
import { mailerooTransporter } from "./maileroo";

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.emailVerificationToken.findFirst({
      where: { email },
    });

    return verificationToken;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const generateEmailVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db.emailVerificationToken.delete({
      where: { id: existingToken.id },
    });
  }

  const emailVerificationToken = await db.emailVerificationToken.create({
    data: { email, token, expires },
  });

  return emailVerificationToken;
};

export const sendEmailVerificationToken = async (
  email: string,
  token: string,
) => {
  const emailVerificationLink = `${process.env.BASE_URL}/email-verification?token=${token}`;

  try {
    await mailerooTransporter.sendMail({
      from: `Syntaxly <${process.env.MAILEROO_FROM_EMAIL}>`,
      to: email,
      subject: "Verify your Email",
      html: `<p>Click <a href="${emailVerificationLink}">here</a> to verify your Email!</p>`,
    });

    return { error: null };
  } catch (error) {
    console.error("Maileroo error: ", error);
    return { error: "Failed to send verification email!" };
  }
};
