// src/proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PRODUCTION_HOSTS = new Set([
  "royalfurnitures.store",
  "www.royalfurnitures.store",
]);

export function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = (request.headers.get("host") || "").split(":")[0];

  // Only ever redirect requests actually arriving at the production
  // domain. localhost, 127.0.0.1, preview deployments, etc. are left
  // completely alone so local dev and staging never bounce to prod.
  if (!PRODUCTION_HOSTS.has(hostname)) {
    return NextResponse.next();
  }

  const proto = request.headers.get("x-forwarded-proto") || url.protocol.replace(":", "");
  const needsWwwStrip = hostname === "www.royalfurnitures.store";
  const needsHttpsUpgrade = proto === "http";

  if (needsWwwStrip || needsHttpsUpgrade) {
    // Do both corrections in a single redirect so crawlers never see a
    // http://www -> https://www -> https:// chain, just one hop straight
    // to the canonical https://royalfurnitures.store URL.
    const newUrl = new URL(
      url.pathname + url.search,
      "https://royalfurnitures.store",
    );
    return NextResponse.redirect(newUrl, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
