import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl.clone();
  const token = req.cookies.get("session_token")?.value;

  // 🔓 Si on est sur /admin/login → pas de protection
  if (url.pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  // 🔐 Toutes les pages /admin/* nécessitent un token
  if (url.pathname.startsWith("/admin")) {
    if (!token) {
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
