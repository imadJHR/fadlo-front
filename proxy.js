import { NextResponse } from "next/server";

export function proxy(req) {
  const url = req.nextUrl.clone();
  const token = req.cookies.get("session_token")?.value;

  if (url.pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

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
