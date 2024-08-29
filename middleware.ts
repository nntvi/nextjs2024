import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

const privatePaths = ["/me"];
const authPaths = ["/login", "/register"];
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get("sessionToken")?.value;
  if (privatePaths.some((path) => pathname.startsWith(path)) && !sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (authPaths.some((path) => pathname.startsWith(path)) && sessionToken) {
    return NextResponse.redirect(new URL("/me", request.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: ["/login", "/register", "/me"],
};
