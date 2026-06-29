export const revalidate = 60;

import cloudinary from "cloudinary";
import { SearchResult } from "../gallery/page";
import { ForceRefresh } from "@/components/force-refresh";
import FavoritesList from "./favorites-list";

export default async function FavoritesPage() {
  const results = (await cloudinary.v2.search
    .expression("(resource_type:image OR resource_type:video) AND tags=favorite")
    .sort_by("created_at", "desc")
    .with_field("tags")
    .max_results(10)
    .execute()) as { resources: SearchResult[] };

  return (
    <section>
      <ForceRefresh />
      <div className="flex flex-col gap-8">
        <div style={{marginBottom: '1rem'}} className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Favorites</h1>
        </div>
        <FavoritesList initialResources={results.resources} />
      </div>
    </section>
  );
}