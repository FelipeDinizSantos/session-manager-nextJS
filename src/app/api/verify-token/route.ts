import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = "asoindasubd12391290___^^^^~~~~";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    // Verifica o token com a secret key
    const decoded = jwt.verify(token, SECRET_KEY);

    return NextResponse.json({ valid: true, payload: decoded });
  } catch (error) {
    return NextResponse.json({ valid: false, error: "Invalid token" }, { status: 401 });
  }
}
