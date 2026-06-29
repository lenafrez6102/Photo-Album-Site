"use client"
import {CldImage, CldImageProps} from 'next-cloudinary';
import {Heart} from "@/components/icons/heart";
import {FullHeart} from "@/components/icons/fullheart";
import { useTransition } from 'react';
import { useState } from 'react';
import { setFavorite } from '@/app/gallery/actions';
import { SearchResult } from '@/app/gallery/page';
import { ImageMenu } from './image-menu';
import { useFavorites } from './favorites-context';

export default function CloudinaryImage(
  props: {
    imageData: SearchResult;
    onUnHeart?: (unheartedResource: SearchResult) => void;
  } & Omit<CldImageProps, "src">
) {
  const [transition, startTransition] = useTransition();
  const [isHovered, setIsHovered] = useState(false);
  const {imageData, onUnHeart} = props;
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const isFavorite = favorites.has(imageData.public_id);

  return (
    <div style={{position: 'relative'}}>
      {imageData.resource_type === 'video' ? (
        <video
          src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/${imageData.public_id}`}
          width="400"
          height="300"
          controls
          className="object-cover"
        />
      ) : (
        <CldImage src={imageData.public_id} alt={imageData.public_id} width="400" height="300" />
      )}
      {isFavorite ? (
        <FullHeart
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            removeFavorite(imageData.public_id);
            onUnHeart?.(imageData);
            startTransition(() => {
              setFavorite(imageData.public_id, false, imageData.resource_type);
            });
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{position: 'absolute', top: '12px', right: '40px'}}
          fill={isHovered ? 'white' : 'red'}
          className="drop-shadow-lg cursor-pointer transition-colors duration-300"
        />
      ) : (
        <Heart
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            addFavorite(imageData.public_id);
            startTransition(() => {
              setFavorite(imageData.public_id, true, imageData.resource_type);
            });
          }}
          style={{position: 'absolute', top: '12px', right: '40px'}}
          className="text-white drop-shadow-lg hover:text-red-500 cursor-pointer transition-colors duration-300"
        />
      )}
      <div
        style={{position: 'absolute', top: '8px', right: '8px'}}
        onClick={(e) => e.stopPropagation()}
      >
        <ImageMenu
          image={imageData}
          folderId={(imageData as any).folderId}
        />
      </div>
    </div>
  );
}