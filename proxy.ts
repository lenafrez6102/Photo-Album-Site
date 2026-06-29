import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default withAuth(
  function middleware(req: NextRequest) {
    const guestAlbum = req.cookies.get("guest_album")?.value;
    const token = req.cookies.get("next-auth.session-token")?.value
      || req.cookies.get("__Secure-next-auth.session-token")?.value;

    // If logged in, clear guest cookie and allow everything
    if (token) {
      const response = NextResponse.next();
      response.cookies.delete("guest_album");
      return response;
    }

    if (guestAlbum) {
      const { pathname } = req.nextUrl;
      const allowed = `/albums/${guestAlbum}`;
      if (!pathname.startsWith(allowed)) {
        return NextResponse.redirect(new URL(allowed, req.url));
      }
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/login",
    },
    callbacks: {
      authorized: ({ token, req }) => {
        const guestAlbum = req.cookies.get("guest_album")?.value;
        if (guestAlbum) return true;
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!login|share|api/auth|_next|favicon.ico).*)"],
};