// Run this once with: npm run seed
// It fills your database with sample songs so the app has something to show.
// The audio files are free sample tracks (SoundHelix) — swap in your own
// song URLs later (e.g. files hosted on Cloudinary, S3, etc).
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Song from "../models/Song.js";

dotenv.config();

const sampleSongs = [
  {
    title: "Midnight Drive",
    artist: "Arjun Kumar",
    album: "Neon Nights",
    genre: "Electronic",
    coverImage: "https://picsum.photos/seed/tarang1/400/400",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: 320,
  },
  {
    title: "Kadhal Kanave",
    artist: "Priya Sundaram",
    album: "Vaanam",
    movie: "Vaanam Paartha Kadhal",
    genre: "Tamil Film",
    coverImage: "https://picsum.photos/seed/tarang2/400/400",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: 265,
  },
  {
    title: "Coastal Breeze",
    artist: "The Waveforms",
    album: "Shorelines",
    genre: "Chill",
    coverImage: "https://picsum.photos/seed/tarang3/400/400",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: 210,
  },
  {
    title: "Iron Horizon",
    artist: "Deccan Riot",
    album: "Ignition",
    genre: "Rock",
    coverImage: "https://picsum.photos/seed/tarang4/400/400",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    duration: 245,
  },
  {
    title: "Ragamalika",
    artist: "Vidya Raghunathan",
    album: "Classical Roots",
    genre: "Carnatic",
    coverImage: "https://picsum.photos/seed/tarang5/400/400",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    duration: 300,
  },
  {
    title: "Basement Sessions",
    artist: "MC Theran",
    album: "Street Verse",
    genre: "Hip-Hop",
    coverImage: "https://picsum.photos/seed/tarang6/400/400",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    duration: 198,
  },
  {
    title: "Monsoon Diaries",
    artist: "Arjun Kumar",
    album: "Neon Nights",
    genre: "Chill",
    coverImage: "https://picsum.photos/seed/tarang7/400/400",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    duration: 280,
  },
  {
    title: "Vaanil Mazhai",
    artist: "Priya Sundaram",
    album: "Mazhai Thuli",
    movie: "Mazhai Thuli",
    genre: "Tamil Film",
    coverImage: "https://picsum.photos/seed/tarang8/400/400",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    duration: 255,
  },
  {
    title: "Analog Sunrise",
    artist: "The Waveforms",
    album: "Shorelines",
    genre: "Electronic",
    coverImage: "https://picsum.photos/seed/tarang9/400/400",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    duration: 230,
  },
  {
    title: "Steel City",
    artist: "Deccan Riot",
    album: "Ignition",
    genre: "Rock",
    coverImage: "https://picsum.photos/seed/tarang10/400/400",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
    duration: 270,
  },
];

const runSeed = async () => {
  await connectDB();
  await Song.deleteMany({});
  await Song.insertMany(sampleSongs);
  console.log(`Seeded ${sampleSongs.length} songs into the database.`);
  process.exit();
};

runSeed();
