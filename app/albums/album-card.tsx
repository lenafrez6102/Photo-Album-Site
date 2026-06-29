import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Folder } from "./page"
import Link from "next/link"
import { DeleteAlbumButton } from "./delete-album-button";

export function AlbumCard({ folder }: { folder: Folder }) {
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
        <DeleteAlbumButton folderPath={folder.path} />
      </CardFooter>
    </Card>
  );
}
