"use client";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Folder } from "./page"
import Link from "next/link"
import { DeleteAlbumButton } from "./delete-album-button";

export function AlbumCard({ folder, isGuest = false }: { folder: Folder; isGuest?: boolean }) {
  const shareUrl = `${window.location.origin}/share/${folder.path}`;

  const handleShare = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Share link copied to clipboard!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{folder.name}</CardTitle>
        <CardDescription>All your {folder.name} images.</CardDescription>
      </CardHeader>
      <CardContent />
      <CardFooter className="flex justify-between">
        <Button asChild>
          <Link href={`/albums/${folder.path}`}>View Album</Link>
        </Button>
        <div className="flex gap-2">
          {!isGuest && (
            <Button variant="outline" onClick={handleShare}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.935-2.186 2.25 2.25 0 0 0-3.935 2.186Z" />
              </svg>
          </Button>
          )}
          {!isGuest && <DeleteAlbumButton folderPath={folder.path} />}
        </div>
      </CardFooter>
    </Card>
  );
}