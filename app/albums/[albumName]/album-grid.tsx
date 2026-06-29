'use client';
import { useState } from "react";
import { ImageGrid } from '@/components/image-grid';
import CloudinaryImage from '@/components/cloudinary-image';
import { SearchResult } from '@/app/gallery/page';
import { ImageMenu } from '@/components/image-menu';
import { DeleteImageButton } from '@/components/delete-image-button';
import { Lightbox } from '@/components/lightbox';

export function AlbumGrid({ images, folderId, isGuest = false }: { images: SearchResult[]; folderId: string; isGuest?: boolean }) {
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  return (
    <>
      <ImageGrid
        images={images}
        getImage={(imageData: SearchResult, index: number) => {
          return (
            <div key={imageData.public_id} className="relative cursor-pointer">
              <div onClick={() => setLightboxIndex(index)}>
                <CloudinaryImage
                  imageData={imageData}
                  alt="Description of image"
                  isGuest={isGuest}
                />
              </div>
              {!isGuest && (
                <div style={{ position: 'absolute', top: 8, left: 8 }}>
                  <DeleteImageButton image={imageData} />
                </div>
              )}
              {!isGuest && (
                <ImageMenu
                  image={imageData}
                  folderId={folderId}
                  style={{ position: 'absolute', top: 8, right: 8 }}
                />
              )}
            </div>
          );
        }}
      />
      <Lightbox
        images={images}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(-1)}
      />
    </>
  );
}