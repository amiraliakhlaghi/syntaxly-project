"use server";

import { signOut } from "@/auth";
import { cookies } from "next/headers";

export async function logout() {
  const cookieStore = await cookies();

  const allCookies = [
    "syntaxly.session-token",
    "__Secure-syntaxly.session-token",
    "syntaxly.callback-url",
    "__Secure-syntaxly.callback-url",
    "syntaxly.csrf-token",
    "__Host-syntaxly.csrf-token",
    "syntaxly.pkce.code_verifier",
    "__Secure-syntaxly.pkce.code_verifier",
    "syntaxly.state",
    "__Secure-syntaxly.state",
    "syntaxly.nonce",
    "__Secure-syntaxly.nonce",
  ];

  allCookies.forEach((name) => {
    try {
      cookieStore.set(name, "", {
        path: "/",
        maxAge: 0,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    } catch {}
  });

  const legacyCookies = [
    "__Secure-authjs.session-token",
    "authjs.session-token",
    "next-auth.session-token",
    "__Secure-next-auth.session-token",
    "__Host-authjs.csrf-token",
    "authjs.csrf-token",
  ];

  legacyCookies.forEach((name) => {
    try {
      cookieStore.set(name, "", {
        path: "/",
        maxAge: 0,
        secure: true,
      });
    } catch {}
  });

  await signOut({ redirect: false });

  return { success: true };
}
