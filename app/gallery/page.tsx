export const revalidate = 30;

import UploadButton from './upload-button';
import cloudinary from "@/lib/cloudinary";
import { GalleryGrid } from './gallery-grid';

export type SearchResult = {
  public_id: string;
  tags: string[];
  resource_type: 'image' | 'video';
};

export default async function GalleryPage() {
  const results = (await cloudinary.search
    .expression("resource_type:image OR resource_type:video")
    .sort_by("created_at", "desc")
    .with_field("tags")
    .max_results(500)
    .execute()) as { resources: SearchResult[] };

  return (
    <section>
      <div className="flex flex-col gap-8">
        <div style={{marginBottom: '1rem'}} className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Gallery</h1>
          <UploadButton />
        </div>
        <GalleryGrid images={results.resources} />
      </div>
    </section>
  );
}