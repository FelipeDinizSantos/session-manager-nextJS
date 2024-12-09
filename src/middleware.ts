import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose"; 

const SECRET_KEY = new TextEncoder().encode("asoindasubd12391290___^^^^~~~~");

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    console.log("Token não encontrado. Redirecionando para /login...");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    console.log("Token válido:", payload);

    const response = NextResponse.next();
    response.headers.set("X-User-Payload", JSON.stringify(payload));
    return response;
  } catch (error) {
    console.log("Token inválido ou expirado:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/protected/:path*"],
};
