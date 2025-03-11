import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // 🔹 Allow iFrame embedding & Cross-Origin access
  response.headers.set("X-Frame-Options", "ALLOWALL");
  response.headers.set("Content-Security-Policy", "frame-ancestors 'self' https://psiprototype.carrd.co;");
  response.headers.set("Access-Control-Allow-Origin", "https://psiprototype.carrd.co");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Authorization, Content-Type");

  return response;
}

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next|auth).*)"
};

