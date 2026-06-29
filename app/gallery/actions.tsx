"use server"
import cloudinary from "cloudinary";
import { revalidatePath } from "next/cache";

export async function setFavorite(
  publicId: string,
  isFavorite: boolean,
  resourceType: 'image' | 'video' = 'image'
) {
  if (isFavorite) {
    await cloudinary.v2.uploader.add_tag("favorite", [publicId], { resource_type: resourceType });
  } else {
    await cloudinary.v2.uploader.remove_tag("favorite", [publicId], { resource_type: resourceType });
  }
  await new Promise(resolve => setTimeout(resolve, 3000));
  revalidatePath("/", "layout");
}