import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { SideMenu } from "@/components/side-menu";
import { SettingsMenu } from "@/components/settings-menu";
import { getSiteSettings } from "@/components/actions";
import { FavoritesProvider } from "@/components/favorites-context";
import cloudinary from "@/lib/cloudinary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Padua",
  description: "Padua family album.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  const favResults = await cloudinary.search
    .expression("(resource_type:image OR resource_type:video) AND tags=favorite")
    .with_field("tags")
    .max_results(500)
    .execute();
  const initialFavorites = favResults.resources.map((r: any) => r.public_id);

  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <FavoritesProvider initialFavorites={initialFavorites}>
          <div className="border-b">
            <div className="flex h-16 items-center px-4">
              <span className="text-lg font-bold tracking-wider uppercase">{settings.name}</span>
              <div className="ml-auto flex items-center space-x-4">
                <SettingsMenu
                  currentName={settings.name}
                  currentProfilePic={settings.profilePicPublicId}
                  cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!}
                />
              </div>
            </div>
          </div>
          <div className="flex">
            <SideMenu />
            <div className="w-full px-4 py-3 pt-5">{children}</div>
          </div>
        </FavoritesProvider>
      </body>
    </html>
  );
}