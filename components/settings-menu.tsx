'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogClose, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { SettingsIcon } from "@/components/icons/settings-icon";
import { useState, useRef, useEffect } from "react";
import { updateSiteSettings } from "@/components/actions";
import { useRouter } from "next/navigation";

const BG_COLORS = [
  { label: "Black", value: "#000000" },
  { label: "White", value: "#ffffff" },
  { label: "Gray", value: "#1a1a2e" },
  { label: "Navy", value: "#0f172a" },
  { label: "Forest", value: "#14532d" },
  { label: "Wine", value: "#4c0519" },
  { label: "Pink", value: "#831843" },
{ label: "Purple", value: "#3b0764" },
];

const TEXT_COLORS = [
  { label: "Black", value: "#000000" },
  { label: "White", value: "#ffffff" },
  { label: "Gray", value: "#9ca3af" },
  { label: "Yellow", value: "#fbbf24" },
  { label: "Blue", value: "#60a5fa" },
  { label: "Green", value: "#4ade80" },
  { label: "Pink", value: "#f9a8d4" },
{ label: "Purple", value: "#c084fc" },
];

export function SettingsMenu({
  currentName,
  currentProfilePic,
  cloudName,
}: {
  currentName: string;
  currentProfilePic?: string;
  cloudName: string;
}) {
  const [openSettings, setOpenSettings] = useState(false);
  const [siteName, setSiteName] = useState(currentName);
  const [previewUrl, setPreviewUrl] = useState(
    currentProfilePic
      ? `https://res.cloudinary.com/${cloudName}/image/upload/${currentProfilePic}`
      : null
  );
  const [file, setFile] = useState<File | null>(null);
  const [bgColor, setBgColor] = useState(() => 
    typeof window !== 'undefined' ? localStorage.getItem('bgColor') || '#000000' : '#000000'
  );
  const [textColor, setTextColor] = useState(() =>
    typeof window !== 'undefined' ? localStorage.getItem('textColor') || '#ffffff' : '#ffffff'
  );
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    document.body.style.backgroundColor = bgColor;
    document.body.style.color = textColor;
  }, [bgColor, textColor]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="rounded-full">
            <Avatar>
              <AvatarImage src={previewUrl ?? undefined} alt="Profile" />
              <AvatarFallback>?</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" style={{ backgroundColor: 'black' }}>
          <DropdownMenuItem
            onSelect={() => setOpenSettings(true)}
            className="flex items-center gap-2"
          >
            <SettingsIcon />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={openSettings} onOpenChange={setOpenSettings}>
        <DialogContent className="sm:max-w-sm max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>Manage your site settings.</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {/* Profile Picture */}
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold">Profile Picture</h3>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={previewUrl ?? undefined} alt="Preview" />
                  <AvatarFallback>?</AvatarFallback>
                </Avatar>
                <Button variant="outline" onClick={() => fileRef.current?.click()}>
                  Choose Photo
                </Button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={e => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setFile(f);
                      setPreviewUrl(URL.createObjectURL(f));
                    }
                  }}
                />
              </div>
            </div>

            <hr className="border-gray-700" />

            {/* Site Name */}
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold">Site Name</h3>
              <input
                className="w-full px-3 py-2 border rounded-md bg-transparent"
                value={siteName}
                onChange={e => setSiteName(e.target.value)}
              />
            </div>

            <hr className="border-gray-700" />

            {/* Background Color */}
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold">Background Color</h3>
              <div className="flex gap-2 flex-wrap">
                {BG_COLORS.map((color) => (
                  <button
                    key={color.value}
                    title={color.label}
                    onClick={() => setBgColor(color.value)}
                    style={{ backgroundColor: color.value }}
                    className={`w-8 h-8 rounded-full border-2 ${bgColor === color.value ? 'border-blue-500' : 'border-gray-600'}`}
                  />
                ))}
              </div>
            </div>

            <hr className="border-gray-700" />

            {/* Text Color */}
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold">Text Color</h3>
              <div className="flex gap-2 flex-wrap">
                {TEXT_COLORS.map((color) => (
                  <button
                    key={color.value}
                    title={color.label}
                    onClick={() => setTextColor(color.value)}
                    style={{ backgroundColor: color.value }}
                    className={`w-8 h-8 rounded-full border-2 ${textColor === color.value ? 'border-blue-500' : 'border-gray-600'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={async () => {
              let profilePicPublicId = currentProfilePic;
              if (file) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', 'profile_pic');
                const res = await fetch(
                  `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                  { method: 'POST', body: formData }
                );
                const data = await res.json();
                profilePicPublicId = data.public_id;
              }
              localStorage.setItem('bgColor', bgColor);
              localStorage.setItem('textColor', textColor);
              await updateSiteSettings(siteName, profilePicPublicId);
              setOpenSettings(false);
              router.refresh();
            }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}