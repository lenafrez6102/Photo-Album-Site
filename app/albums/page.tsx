export const revalidate = 10;
import cloudinary from "@/lib/cloudinary";
import { AlbumCard } from "./album-card";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export type Folder = { name: string; path: string };

export default async function AlbumsPage() {
  const session = await getServerSession(authOptions);
  const guestAlbum = (await cookies()).get("guest_album")?.value;
  const isGuest = !session && !!guestAlbum;

  const results = await cloudinary.search
    .expression("resource_type:image OR resource_type:video")
    .with_field("tags")
    .max_results(500)
    .execute();

  const allTags = results.resources.flatMap((r: any) => r.tags as string[]);
  const uniqueTags = [...new Set(allTags)] as string[];
  const albumTags = uniqueTags.filter(tag => tag !== "favorite");

  // If guest, only show their album
  const visibleTags = isGuest
    ? albumTags.filter(tag => tag === guestAlbum)
    : albumTags;

  return (
    <section>
      <div className="flex flex-col gap-8">
        <div style={{ marginBottom: '1rem' }} className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Albums</h1>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {visibleTags.map((tag) => (
            <AlbumCard
              key={tag}
              folder={{ name: tag, path: tag }}
              isGuest={isGuest}
            />
          ))}
        </div>
      </div>
    </section>
  );
}