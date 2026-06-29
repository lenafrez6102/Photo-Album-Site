'use client';
import { SearchResult } from "../gallery/page";
import { useState } from "react";
import { ImageGrid } from "@/components/image-grid";
import CloudinaryImage from "@/components/cloudinary-image";
import { Lightbox } from "@/components/lightbox";
import { useFavorites } from "@/components/favorites-context";

export default function FavoritesList({
  initialResources,
}: {
  initialResources: SearchResult[];
}) {
  const { favorites } = useFavorites();
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  // Filter resources based on context favorites for instant updates
  const resources = initialResources.filter(r => favorites.has(r.public_id));

  return (
    <>
      <ImageGrid
        images={resources}
        getImage={(imageData: SearchResult, index: number) => {
          return (
            <div
              key={imageData.public_id}
              className="relative cursor-pointer"
              onClick={() => setLightboxIndex(index)}
            >
              <CloudinaryImage
                imageData={imageData}
                alt="Description of image"
              />
            </div>
          );
        }}
      />
      <Lightbox
        images={resources}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(-1)}
      />
    </>
  );
}