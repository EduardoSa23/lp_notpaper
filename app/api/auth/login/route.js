import { NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  MOCK_DIRETORIA_SESSION_TOKEN,
  isValidDirectoriaCredentials,
} from "@/lib/mock-directoria-auth";

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const login = typeof body?.login === "string" ? body.login.trim() : "";
  const senha = typeof body?.senha === "string" ? body.senha : "";

  if (!isValidDirectoriaCredentials(login, senha)) {
    return NextResponse.json({ error: "Login ou senha invalidos." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: MOCK_DIRETORIA_SESSION_TOKEN,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}

