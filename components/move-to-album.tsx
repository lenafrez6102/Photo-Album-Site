'use client';
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogClose, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { SearchResult } from "@/app/gallery/page";
import { moveImageToFolder, getAlbums } from "./actions";
import { useRouter } from "next/navigation";
import { MoveIcon } from "./icons/move-icon";

export function MoveToAlbum({
  image,
  currentFolderId,
  onClose,
}: {
  image: SearchResult;
  currentFolderId: string;
  onClose: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [albums, setAlbums] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

  async function handleOpen(newOpenState: boolean) {
    setOpen(newOpenState);
    if (newOpenState) {
      const allAlbums = await getAlbums();
      setAlbums(allAlbums.filter(a => a !== currentFolderId));
    }
    if (!newOpenState) onClose();
  }

  async function handleMove() {
    if (!selected) return;
    await moveImageToFolder(image, currentFolderId, selected);
    setOpen(false);
    onClose();
    router.refresh();
    setTimeout(() => router.refresh(), 1000);
    setTimeout(() => router.refresh(), 2000);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 w-full bg-transparent border-none outline-none cursor-pointer"
        >
          <MoveIcon />
          <span>Move</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Move to Album</DialogTitle>
          <DialogDescription>
            Select an album to move this item to.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-1 max-h-48 overflow-y-auto border rounded-md p-2">
          {albums.length === 0 ? (
            <p className="text-sm text-muted-foreground">No other albums available.</p>
          ) : (
            albums.map((album) => (
              <button
                key={album}
                onClick={() => setSelected(album)}
                className={`text-left px-3 py-2 rounded-md text-sm hover:bg-secondary transition-colors ${
                  selected === album ? "bg-secondary font-medium" : ""
                }`}
              >
                {album}
              </button>
            ))
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleMove} disabled={!selected}>
            Move
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}