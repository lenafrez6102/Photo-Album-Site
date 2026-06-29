'use client';
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogClose, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { FolderMinus } from "./icons/folder-minus";
import { useState } from "react";
import { SearchResult } from "@/app/gallery/page";
import { removeImageFromFolder } from "./actions";
import { useRouter } from "next/navigation";

export function RemoveFromAlbumButton({
  image,
  folderId,
  onClose,
}: {
  image: SearchResult;
  folderId: string;
  onClose: () => void;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpenState) => {
        setOpen(newOpenState);
        if (!newOpenState) onClose();
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 w-full bg-transparent border-none outline-none cursor-pointer"
        >
          <FolderMinus />
          <span>Remove from Album</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Remove from Album</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove this image from the album?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={async () => {
                onClose();
                setOpen(false);
                await removeImageFromFolder(image, folderId);
                router.refresh();
                setTimeout(() => router.refresh(), 1000);
                setTimeout(() => router.refresh(), 2000);
                setTimeout(() => router.refresh(), 4000);
            }}
          >
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}