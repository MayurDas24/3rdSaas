import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default async function middleware(req) {
  const url = req.nextUrl;

  // ✅ Allow free explore mode without auth
  if (url.pathname.startsWith("/dashboard") && url.searchParams.get("mode") === "free") {
    return NextResponse.next();
  }

  // ✅ Protect premium dashboard only
  if (url.pathname.startsWith("/dashboard")) {
    return withAuth({
      pages: { signIn: "/signin" },
    })(req);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
