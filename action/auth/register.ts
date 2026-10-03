"use server";

import { RegisterSchema, RegisterSchemaType } from "@/schemas/RegisterSchema";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/lib/user";
import {
  generateEmailVerificationToken,
  sendEmailVerificationToken,
} from "@/lib/emailVerification";

export const signUp = async (values: RegisterSchemaType) => {
  const validFields = RegisterSchema.safeParse(values);

  if (!validFields.success) {
    return { error: "Invalid Fields!" };
  }

  const { name, email, password } = validFields.data;

  const user = await getUserByEmail(email);

  if (user) {
    return { error: "Email Already in use!" };
  }
  const hashedPasswored = await bcrypt.hash(password, 10);

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPasswored,
    },
  });

  const emailVerificationToken = await generateEmailVerificationToken(email);

  const { error } = await sendEmailVerificationToken(
    emailVerificationToken.email,
    emailVerificationToken.token,
  );

  if (error) {
    return {
      error:
        "Something went wrong while sending verification email! Try to login to resend the verification email!",
    };
  }

  return { success: "Verification email sent!" };
};
