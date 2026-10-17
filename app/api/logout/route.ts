import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL("/blog/feed/1", request.url));

  const cookiesToClear = [
    "__Secure-syntaxly.session-token",
    "__Secure-syntaxly.callback-url",
    "__Host-syntaxly.csrf-token",
    "__Secure-syntaxly.pkce.code_verifier",
    "__Secure-syntaxly.state",
    "__Secure-syntaxly.nonce",
    "syntaxly.session-token",
    "syntaxly.callback-url",
    "syntaxly.csrf-token",
    "syntaxly.pkce.code_verifier",
    "syntaxly.state",
    "syntaxly.nonce",
    "edgestore-ctx",
    "__Secure-authjs.session-token",
    "authjs.session-token",
  ];

  cookiesToClear.forEach((name) => {
    response.cookies.set({
      name,
      value: "",
      maxAge: 0,
      path: "/",
      secure: true,
      sameSite: "lax",
    });
  });

  return response;
}
