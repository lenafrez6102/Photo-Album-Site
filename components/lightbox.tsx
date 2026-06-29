"use client";
import YALightbox from "yet-another-react-lightbox";
import Video from "yet-another-react-lightbox/plugins/video";
import "yet-another-react-lightbox/styles.css";
import { SearchResult } from "@/app/gallery/page";

export function Lightbox({
  images,
  index,
  onClose,
}: {
  images: SearchResult[];
  index: number;
  onClose: () => void;
}) {
  const slides = images.map((image) =>
    image.resource_type === "video"
      ? {
          type: "video" as const,
          sources: [
            {
              src: `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/${image.public_id}`,
              type: "video/mp4",
            },
          ],
        }
      : {
          src: `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${image.public_id}`,
        }
  );

  return (
    <YALightbox
      open={index >= 0}
      close={onClose}
      index={index}
      slides={slides}
      plugins={[Video]}
    />
  );
}