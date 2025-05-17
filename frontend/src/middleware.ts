"use server";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

/*
    This middleware is used to protect routes that require authentication.
    If the user is not authenticated, they will be redirected to the login page.
    If the user is authenticated, they will be redirected to the profile page.
*/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const middleware = async (req: NextRequest, res: NextResponse) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuthenticated = !!token;
  const isAdmin = typeof token?.role === "string" && token.role === "ADMIN";
  const isLoginPage = req.nextUrl.pathname.startsWith("/login");
  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  const isAdminPage = req.nextUrl.pathname.startsWith("/admin");
  if (isAdminPage) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/not-found", req.url));
    }
  }
  

  return NextResponse.next();
};
