"use server";

import { getUserByEmail } from "@/lib/user";
import { LoginSchema, LoginSchemaType } from "@/schemas/LoginSchema";
import { signIn } from "@/auth";
import { LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import {
  generateEmailVerificationToken,
  sendEmailVerificationToken,
} from "@/lib/emailVerification";

export const login = async (values: LoginSchemaType) => {
  const validFields = LoginSchema.safeParse(values);
  if (!validFields.success) {
    return { error: "Invalid Fields!" };
  }

  const { email, password } = validFields.data;

  const user = await getUserByEmail(email);
  if (!user || !email || !password || !user.password) {
    return { error: "Invalid credentials" };
  }

  if (!user.emailVerified) {
    const emailVerificationToken = await generateEmailVerificationToken(
      user.email,
    );

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
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalaid Credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }
  }
};
