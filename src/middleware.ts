import { NextRequest, NextResponse } from "next/server";

const locales = ["en", "ur"] as const;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/uploads") ||
    pathname.startsWith("/feeds")
  ) {
    return NextResponse.next();
  }

  const pathLocale = locales.find((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  const headers = new Headers(request.headers);
  headers.set("x-next-intl-locale", pathLocale ?? "en");
  headers.set("x-pathname", pathname);

  if (pathLocale) {
    return NextResponse.next({ request: { headers } });
  }

  const url = request.nextUrl.clone();
  url.pathname = `/en${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url, { request: { headers } });
}

export const config = {
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
