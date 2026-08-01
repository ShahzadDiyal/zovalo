// src/proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get("host") || "";
  // Some hosts terminate TLS upstream and forward this header instead of
  // giving us a request that's actually http:// at this layer.
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
