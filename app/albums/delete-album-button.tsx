'use client';
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogClose, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { deleteFolder } from "@/components/actions";
import { useRouter } from "next/navigation";
import { TrashIcon } from "@/components/icons/trash";

export function DeleteAlbumButton({ folderPath }: { folderPath: string }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="flex items-center gap-2">
          <TrashIcon />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete Album</DialogTitle>
          <DialogDescription>
            This will permanently delete the album and move all its images back to the gallery. Are you sure?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={async () => {
                setOpen(false);
                await deleteFolder(folderPath);
                router.refresh();
                setTimeout(() => router.refresh(), 1000);
                setTimeout(() => router.refresh(), 2000);
                setTimeout(() => router.refresh(), 4000);
            }}
          >
            Delete Album
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}