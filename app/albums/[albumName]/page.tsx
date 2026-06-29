import { AlbumGrid } from './album-grid';
import { SearchResult } from '@/app/gallery/page';
import { ForceRefresh } from '@/components/force-refresh';
import cloudinary from "@/lib/cloudinary";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const revalidate = 60;

export default async function AlbumsPage({
  params,
}: {
  params: Promise<{ albumName: string }>;
}) {
  const { albumName } = await params;
  const session = await getServerSession(authOptions);
  const guestAlbum = (await cookies()).get("guest_album")?.value;
  const isGuest = !session && !!guestAlbum;

  const results = (await cloudinary.search
    .expression(`(resource_type:image OR resource_type:video) AND tags="${albumName}"`)
    .sort_by("created_at", "desc")
    .with_field("tags")
    .max_results(500)
    .execute()) as { resources: SearchResult[] };

  return (
    <section>
      <ForceRefresh />
      <div className="flex flex-col gap-8">
        <div style={{ marginBottom: '1rem' }} className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">{albumName}</h1>
        </div>
        <AlbumGrid images={results.resources} folderId={albumName} isGuest={isGuest} />
      </div>
    </section>
  );
}