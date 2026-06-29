import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FolderPlus } from "./icons/folder-plus";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react";
import { SearchResult } from "@/app/gallery/page";
import { addImageToFolder, getAlbums } from "./actions";

export function AddtoAlbum({
  image,
  onClose,
}: {
  image: SearchResult;
  onClose: () => void;
}) {
  const [albumName, setAlbumName] = useState("");
  const [open, setOpen] = useState(false);
  const [existingAlbums, setExistingAlbums] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [mode, setMode] = useState<"select" | "create">("select");

  async function handleOpen(newOpenState: boolean) {
    setOpen(newOpenState);
    if (newOpenState) {
      const albums = await getAlbums();
      setExistingAlbums(albums);
    }
    if (!newOpenState) onClose();
  }

  async function handleSubmit() {
    const target = mode === "create" ? albumName : selected;
    if (!target) return;
    await addImageToFolder(image, target);
    setOpen(false);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 w-full bg-transparent border-none outline-none cursor-pointer"
        >
          <FolderPlus />
          <span>Add to Album</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add to Album</DialogTitle>
          <DialogDescription>
            Select an existing album or create a new one.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mb-2">
          <Button
            size="sm"
            variant={mode === "select" ? "secondary" : "ghost"}
            onClick={() => setMode("select")}
          >
            Existing
          </Button>
          <Button
            size="sm"
            variant={mode === "create" ? "secondary" : "ghost"}
            onClick={() => setMode("create")}
          >
            New Album
          </Button>
        </div>

        {mode === "select" ? (
          <div className="flex flex-col gap-1 max-h-48 overflow-y-auto border rounded-md p-2">
            {existingAlbums.length === 0 ? (
              <p className="text-sm text-muted-foreground">No albums yet.</p>
            ) : (
              existingAlbums.map((album) => (
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
        ) : (
          <div className="flex flex-col gap-2">
            <Label htmlFor="album-name">Album Name</Label>
            <Input
              id="album-name"
              value={albumName}
              onChange={(e) => setAlbumName(e.currentTarget.value)}
              placeholder="e.g. Summer 2026"
            />
          </div>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit} type="submit">
            Add to Album
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}