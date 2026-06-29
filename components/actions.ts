"use server";
import { SearchResult } from "@/app/gallery/page";
import cloudinary from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

export async function addImageToFolder(image: SearchResult, album: string) {
  await cloudinary.uploader.add_tag(album, [image.public_id], { resource_type: image.resource_type });
  await new Promise(resolve => setTimeout(resolve, 2000));
  revalidatePath("/", "layout");
}

export async function removeImageFromFolder(image: SearchResult, folderId: string) {
  await cloudinary.uploader.remove_tag(folderId, [image.public_id], { resource_type: image.resource_type });
  await new Promise(resolve => setTimeout(resolve, 2000));
  revalidatePath("/", "layout");
}

export async function deleteFolder(folderPath: string) {
  const [imageResults, videoResults] = await Promise.all([
    cloudinary.search
      .expression(`resource_type:image AND tags="${folderPath}"`)
      .max_results(500)
      .execute(),
    cloudinary.search
      .expression(`resource_type:video AND tags="${folderPath}"`)
      .max_results(500)
      .execute(),
  ]);

  await Promise.all([
    ...imageResults.resources.map((r: any) =>
      cloudinary.uploader.remove_tag(folderPath, [r.public_id], { resource_type: 'image' })
    ),
    ...videoResults.resources.map((r: any) =>
      cloudinary.uploader.remove_tag(folderPath, [r.public_id], { resource_type: 'video' })
    ),
  ]);

  await new Promise(resolve => setTimeout(resolve, 2000));
  revalidatePath("/", "layout");
}

export async function deleteImage(image: SearchResult) {
  await cloudinary.uploader.destroy(image.public_id, { resource_type: image.resource_type });
}

export async function updateSiteSettings(name: string, profilePicPublicId?: string) {
  await cloudinary.uploader.upload(
    `data:text/plain;base64,${Buffer.from(JSON.stringify({ name, profilePicPublicId })).toString('base64')}`,
    { public_id: 'site-settings', resource_type: 'raw', overwrite: true }
  );
}

export async function getSiteSettings() {
  try {
    const result = await cloudinary.api.resource('site-settings', { resource_type: 'raw' });
    const response = await fetch(result.secure_url);
    const settings = await response.json();
    return settings as { name: string; profilePicPublicId?: string };
  } catch {
    return { name: 'Padua', profilePicPublicId: undefined };
  }
}

export async function getAlbums(): Promise<string[]> {
  const results = await cloudinary.search
    .expression("resource_type:image OR resource_type:video")
    .with_field("tags")
    .max_results(500)
    .execute();
  const allTags = results.resources.flatMap((r: any) => r.tags as string[]);
  const uniqueTags = [...new Set(allTags)] as string[];
  return uniqueTags.filter(tag => tag !== "favorite");
}

export async function moveImageToFolder(image: SearchResult, fromFolder: string, toFolder: string) {
  await cloudinary.uploader.remove_tag(fromFolder, [image.public_id], { resource_type: image.resource_type });
  await cloudinary.uploader.add_tag(toFolder, [image.public_id], { resource_type: image.resource_type });
}

export async function resetSiteSettings() {
  await cloudinary.api.delete_resources(['site-settings'], { resource_type: 'raw' });
}