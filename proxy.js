import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

function getRole(req) {
  const token = req.cookies.get("skillup_token")?.value;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return payload.role;
  } catch {
    return null;
  }
}

// ✅ CHANGE HERE: middleware → proxy
export function proxy(req) {
  const { pathname } = req.nextUrl;

  const protectedPaths = ["/dashboard", "/courses", "/my-courses", "/admin"];
  if (!protectedPaths.some((p) => pathname.startsWith(p))) return NextResponse.next();

  const role = getRole(req);
  if (!role) return NextResponse.redirect(new URL("/login", req.url));

  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

// keep this same
export const config = {
  matcher: ["/dashboard/:path*", "/courses/:path*", "/my-courses/:path*", "/admin/:path*"],
};