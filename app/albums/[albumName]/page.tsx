import { AlbumGrid } from './album-grid';
import { SearchResult } from '@/app/gallery/page';
import { ForceRefresh } from '@/components/force-refresh';
import cloudinary from "@/lib/cloudinary";

export const revalidate = 60;

export default async function AlbumsPage({
  params,
}: {
  params: Promise<{ albumName: string }>;
}) {
    const { albumName } = await params;
    // const results = (await cloudinary.search
    //     .expression(`resource_type:image AND public_id="${albumName}"`)
    //     .sort_by("created_at", "desc")
    //     .with_field("tags")
    //     .max_results(10)
    //     .execute()) as { resources: SearchResult[] };

    // console.log("albumName", albumName);
    // console.log("results", JSON.stringify(results.resources, null, 2));

    // const allResults = await cloudinary.search
    //     .expression("resource_type:image")
    //     .max_results(10)
    //     .execute();
    // console.log("All images:", allResults.resources.map((r: any) => r.public_id));

    const results = (await cloudinary.search
        .expression(`(resource_type:image OR resource_type:video) AND tags="${albumName}"`)
        .sort_by("created_at", "desc")
        .with_field("tags")
        .max_results(500)
        .execute()) as { resources: SearchResult[] };

    // console.log("albumName", albumName);
    // console.log("results:", results.resources.map((r: any) => r.public_id));

    return (
        <section>
            <ForceRefresh />
            <div className="flex flex-col gap-8">
                <div style={{marginBottom: '1rem'}} className="flex justify-between items-center">
                    <h1 className="text-4xl font-bold">{albumName}</h1>
                </div>

                <AlbumGrid images={results.resources} folderId={albumName} />

            </div>
        </section>
    );
}