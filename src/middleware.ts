import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_NAME, verifyToken } from "@/lib/auth";

async function isAdminToken(token: string): Promise<boolean> {
  try {
    const secret = process.env.SESSION_SECRET;
    if (!secret) return false;
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return payload.isAdmin === true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const needsAuth =
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/") ||
    pathname === "/admin" ||
    pathname.startsWith("/admin/");
  const isLogin = pathname === "/login";
  if (!needsAuth && !isLogin) return NextResponse.next();

  const token = req.cookies.get(COOKIE_NAME)?.value;
  const valid = token ? await verifyToken(token) : false;

  if (needsAuth && !valid) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  const needsAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
  if (needsAdmin && valid && token && !(await isAdminToken(token))) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }
  if (isLogin && valid) {
    const url = req.nextUrl.clone();
    url.pathname = token && (await isAdminToken(token)) ? "/admin" : "/dashboard";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login"],
};
