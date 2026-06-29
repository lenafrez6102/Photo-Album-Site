'use client';
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogClose, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { deleteImage } from "@/components/actions";
import { useRouter } from "next/navigation";
import { SearchResult } from "@/app/gallery/page";
import { TrashIcon } from "@/components/icons/trash";

export function DeleteImageButton({ image, style }: { image: SearchResult; style?: React.CSSProperties }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="w-8 h-8 p-0" style={style}>
          <TrashIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete Photo</DialogTitle>
          <DialogDescription>
            This will permanently delete the photo. Are you sure?
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
              await deleteImage(image);
              router.refresh();
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}