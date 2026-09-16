# Tarang — Music Streaming App (MERN)

"Tarang" means *wave* — the idea is music flowing to you, personalized to
your taste. Full-stack project: React + Tailwind on the frontend,
Node/Express + MongoDB Atlas on the backend.

## Folder structure

```
tarang-music-app/
  backend/     <- Express API + MongoDB (see backend/API_GUIDE.md for a plain-language menu of every endpoint)
  frontend/    <- React + Tailwind app
```

## 1. Run the backend

```
cd backend
npm install
npm run seed     # fills the database with 10 sample songs (run once)
npm run dev      # starts the API on http://localhost:5000
```

Your MongoDB Atlas connection string is already placed in `backend/.env`.
**Important:** `.env` holds your database password — it's already excluded
from git via `.gitignore`, so don't remove that line, and never paste this
file into a public repo or chat. If you ever share this project publicly,
change your Atlas password first and put a fresh one in `.env`.

## 2. Run the frontend

In a second terminal:

```
cd frontend
npm install
npm run dev      # opens on http://localhost:5173
```

Open http://localhost:5173 in your browser. Create an account, pick a few
genres you like, and the homepage will personalize itself.

## What's included

  you picked at signup.
  seek bar — a persistent bar at the bottom of every page.
- **Albums and playlists** — create, rename, delete, add/remove songs. Deleting an album removes its album record and artwork without deleting the original songs.
- **Songs library** — upload any number of songs, keep them across restarts, and permanently delete your own uploads with their stored media.
- **Streaming player** — play/pause, next/previous, shuffle, volume, and seek bar. Only one track plays at a time; playback stops when a song ends.
- **Personal home** — recently played songs, recently added albums, and recently created playlists are loaded from MongoDB with empty states for new accounts.
  on playlists.

## Design

Dark "late-night radio" theme: deep navy background (`#0F1420`), a warm
amber accent (`#F4A94D`) for the player and primary actions, and a teal
accent (`#38BFA7`) for links and highlights. Headings use Space Grotesk,
body text uses Inter — both loaded from Google Fonts in `index.html`.

## Swapping in real songs

The seed script (`backend/seed/seedSongs.js`) uses free sample audio just so
the app works immediately. To use real tracks: upload your mp3 files
somewhere (Cloudinary's free tier is easiest), then either edit the seed
file with your own `audioUrl`/`coverImage` links and re-run `npm run seed`,
or `POST` new songs to `/api/songs` (see `backend/API_GUIDE.md`).
