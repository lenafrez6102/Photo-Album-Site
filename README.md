# Photo-Album-Site

A full-stack personal photo and video album built with Typescript, CSS, Javascript, React, Next.js and Cloudinary. Upload, organize, and share your memories with a clean, modern interface.

## Features

- **Gallery** — View all your photos and videos in a responsive masonry grid
- **Favorites** — Heart photos and videos to save them to a favorites page
- **Albums** — Organize media into albums using tags, add/remove/move between albums
- **Lightbox** — Click any photo or video to view it full screen with keyboard navigation
- **Upload** — Upload photos and videos directly from the browser
- **Delete** — Delete individual photos/videos or entire albums
- **Settings** — Customize your site name, profile picture, background color, and text color
- **Authentication** — Password-protected so only you and your family can access it
- **Responsive** — Works on desktop and mobile
- **Share Album/Guest View** — Guests who do not have password can view shared photo albums via share link from owner

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| [Next.js 14](https://nextjs.org/) | React framework with App Router, server components, and server actions |
| [React 18](https://react.dev/) | UI library with hooks (`useState`, `useTransition`, `useContext`) |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS framework for styling |
| [shadcn/ui](https://ui.shadcn.com/) | Pre-built accessible UI components (dialogs, dropdowns, buttons) |
| [yet-another-react-lightbox](https://yet-another-react-lightbox.com/) | Full screen media viewer with keyboard navigation |

### Backend & Infrastructure
| Technology | Purpose |
|---|---|
| [Cloudinary](https://cloudinary.com/) | Media storage, delivery, transformation, and search API |
| [NextAuth.js](https://next-auth.js.org/) | JWT-based authentication with credentials provider |
| [Vercel](https://vercel.com/) | Hosting and serverless deployment |

### Key Libraries
| Library | Purpose |
|---|---|
| `next-cloudinary` | Next.js-optimized Cloudinary image component (`CldImage`) |
| `next/navigation` | Client-side routing and refresh (`useRouter`, `usePathname`) |
| `next/cache` | Server-side cache invalidation (`revalidatePath`) |

---

## Caching Strategy

This project uses a two-layer caching approach to balance performance with Cloudinary's API rate limits.

### Server-Side Cache (Next.js `revalidate`)

Pages that fetch from Cloudinary use Next.js's built-in ISR (Incremental Static Regeneration) to cache responses and avoid hitting the API on every request:

```ts
// app/gallery/page.tsx
export const revalidate = 60; // re-fetch from Cloudinary at most once per minute

// app/albums/page.tsx
export const revalidate = 30;

// app/favorites/page.tsx
export const revalidate = 30;
```

When a user performs an action (favoriting, adding to album, deleting), the server action calls `revalidatePath("/", "layout")` to immediately invalidate the cache so the next page load reflects the change:

```ts
// After any write action
await revalidatePath("/", "layout");
```

### Client-Side Cache (React Context)

For instant UI updates without waiting for the server, favorites state is stored in a React Context (`FavoritesProvider`) that wraps the entire app. This means:

- Clicking the heart **instantly** updates the UI across all pages (gallery, favorites, albums)
- No need to wait for Cloudinary propagation or Next.js revalidation for visual feedback
- The context is initialized from Cloudinary on page load and rebuilt on browser refresh

```ts
// components/favorites-context.tsx
const { favorites, addFavorite, removeFavorite } = useFavorites();
const isFavorite = favorites.has(imageData.public_id);
```

### Why Both?

| Layer | What it solves |
|---|---|
| `revalidate` | Prevents hammering Cloudinary's API (500 req/day free limit) |
| React Context | Makes UI feel instant without waiting for server round-trips |
| `revalidatePath` | Ensures server data is fresh after writes |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Cloudinary](https://cloudinary.com/) account (free tier works)
- A [Vercel](https://vercel.com/) account for deployment (optional)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/photo-album-site.git
cd photo-album-site
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Cloudinary

1. Create a free account at [cloudinary.com](https://cloudinary.com/)
2. Go to **Settings → Upload → Upload Presets** and create two presets:
   - One named `media_upload` (for gallery uploads) — set to **Unsigned**
   - One named `profile_pic` (for profile picture uploads) — set to **Unsigned**
3. Note your **Cloud Name**, **API Key**, and **API Secret** from the Cloudinary dashboard

### 4. Configure environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your values:

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXTAUTH_SECRET=your_random_secret
NEXTAUTH_URL=http://localhost:3000
ADMIN_USERNAME=your_username
ADMIN_PASSWORD=your_password
CLOUDINARY_UPLOAD_PRESET=media_upload
```

Generate a random `NEXTAUTH_SECRET` with:

```bash
openssl rand -base64 32
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and log in with your `ADMIN_USERNAME` and `ADMIN_PASSWORD`.

---

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com/) and import your repository
3. Add all environment variables from `.env.example` under **Settings → Environment Variables**
4. Change `NEXTAUTH_URL` to your Vercel deployment URL (e.g. `https://your-app.vercel.app`)
5. Deploy

### Important Vercel notes

- Make sure your Cloudinary upload presets are set to **Unsigned**
- Add your Vercel URL to Cloudinary's allowed origins under **Settings → Security**
- Cloudinary's free tier allows 500 API operations per day — the `revalidate` caching strategy keeps usage well within this limit

---

## Project Structure

```
app/
├── api/auth/              # NextAuth API routes
├── albums/                # Albums list and individual album pages
├── favorites/             # Favorites page and list component
├── gallery/               # Gallery page, grid, and server actions
├── login/                 # Login page
├── share/[albumTag]       # Guest share route -- sets guest cookie and redirects
└── layout.tsx             # Root layout with FavoritesProvider, sidebar, and header
components/
├── icons/                 # SVG icon components
├── ui/                    # shadcn/ui components
├── cloudinary-image.tsx   # Image/video card with favorite toggle and menu (guest-aware)
├── favorites-context.tsx  # Global favorites state (React Context)
├── image-grid.tsx         # Masonry grid layout
├── image-menu.tsx         # Per-image dropdown (add/remove/move album)
├── lightbox.tsx           # Full screen media viewer
├── settings-menu.tsx      # Site settings dialog
└── side-menu.tsx          # Sidebar navigation with active route highlight (hidden for guests)
```

---

## Usage

### Uploading media
Click the **Upload** button in the gallery to upload photos or videos. Both images and videos are supported.

### Favoriting
Click the heart icon on any photo or video to add it to your Favorites page. Click the full heart to unfavorite. Changes reflect instantly thanks to React Context.

### Albums
Click the **⋮** menu on any photo or video and select **Add to Album**. Choose an existing album from the scrollable list or type a new name to create one. Albums can be moved, removed from, or deleted entirely from the Albums page.

### Settings
Click your profile picture in the top right to open Settings. You can change your site name, profile picture, background color, and text color. Colors persist via `localStorage`.

### Sharing Photo Albums (Guest View)
Click the share button on the album card. A share link will be in your copyboard and can be pasted to anyone you want. Guests that don't have access to the site via password will be put into guest-view, only capable of viewing photos and videos of shared album. 

---

## Major Note about Cloudinary Storage
The storage of Cloudinary is not infinite, so if you want to continue using for many photos, there are paid subscriptions. However, there are also other cheaper alternatives such as Backblaze and Cloudflare.

---

## License

MIT — free to use and modify for personal projects.
