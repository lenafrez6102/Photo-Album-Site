import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ albumTag: string }> }
) {
  const { albumTag } = await params;
  const response = NextResponse.redirect(new URL(`/albums/${albumTag}`, req.url));
  response.cookies.set("guest_album", albumTag, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  return response;
}