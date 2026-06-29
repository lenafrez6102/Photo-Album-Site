"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "./icons/menu";
import { AddtoAlbum } from "./add-to-album";
import { SearchResult } from "@/app/gallery/page";
import { useState } from "react";
import { RemoveFromAlbumButton } from "./remove-from-album";
import { MoveToAlbum } from "./move-to-album";

export function ImageMenu({
  image,
  style,
  folderId,
}: {
  image: SearchResult;
  style?: React.CSSProperties;
  folderId: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div style={style}>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" className="w-8 h-8 p-0">
            <Menu />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="bottom"
          align="end"
          className="w-52"
          style={{ backgroundColor: 'black' }}
        >
          <DropdownMenuItem asChild>
            <AddtoAlbum
              image={image}
              onClose={() => setOpen(false)}
            />
          </DropdownMenuItem>
          {folderId && (
            <DropdownMenuItem asChild>
              <RemoveFromAlbumButton
                image={image}
                folderId={folderId}
                onClose={() => setOpen(false)}
              />
            </DropdownMenuItem>
          )}
          {folderId && (
            <DropdownMenuItem asChild>
              <MoveToAlbum
                image={image}
                currentFolderId={folderId}
                onClose={() => setOpen(false)}
              />
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}