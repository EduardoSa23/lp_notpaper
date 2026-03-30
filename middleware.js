import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, MOCK_DIRETORIA_SESSION_TOKEN } from "@/lib/mock-directoria-auth";

export function middleware(request) {
  const { pathname, search } = request.nextUrl;
  const hasSession = request.cookies.get(AUTH_COOKIE_NAME)?.value === MOCK_DIRETORIA_SESSION_TOKEN;
  const isLoginRoute = pathname === "/diretoria/login";

  if (!hasSession && !isLoginRoute) {
    const loginUrl = new URL("/diretoria/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (hasSession && isLoginRoute) {
    return NextResponse.redirect(new URL("/diretoria", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/diretoria/:path*"],
};
