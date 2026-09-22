import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Song from '../models/Song.js';
import Playlist from '../models/Playlist.js';

const run = async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/tarang');

  const email = 'tamilfan@example.com';
  const username = 'tamilfan';

  let user = await User.findOne({ $or: [{ email }, { username }] });
  if (!user) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('tarang123', salt);
    user = await User.create({
      name: 'Tamil Fan',
      username,
      email,
      password: hash,
      favoriteGenres: ['Tamil Film'],
    });
  }

  const payload = [];

  const createdSongs = [];
  for (const item of payload) {
    const exists = await Song.findOne({ title: item.title, artist: item.artist, movie: item.movie });
    if (exists) {
      createdSongs.push(exists);
      continue;
    }

    const song = await Song.create({ ...item, uploadedBy: user._id, duration: 220 });
    createdSongs.push(song);
  }

  let playlist = await Playlist.findOne({ name: 'Tamil Movie Hits', owner: user._id });
  if (!playlist) {
    playlist = await Playlist.create({
      name: 'Tamil Movie Hits',
      description: 'Three Tamil movie songs',
      coverImage: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?auto=format&fit=crop&w=800&q=80',
      owner: user._id,
      songs: createdSongs.map((song) => song._id),
      isPublic: true,
    });
    await User.findByIdAndUpdate(user._id, { $addToSet: { playlists: playlist._id } });
  } else {
    for (const song of createdSongs) {
      if (!playlist.songs.some((id) => id.toString() === song._id.toString())) {
        playlist.songs.push(song._id);
      }
    }
    await playlist.save();
  }

  const finalPlaylist = await Playlist.findById(playlist._id).populate('songs');
  console.log(JSON.stringify({
    user: { id: user._id.toString(), username: user.username },
    playlist: { id: finalPlaylist._id.toString(), name: finalPlaylist.name, songCount: finalPlaylist.songs.length },
    songs: finalPlaylist.songs.map((song) => ({ title: song.title, artist: song.artist, movie: song.movie }))
  }, null, 2));

  await mongoose.disconnect();
};

run().catch((error) => {
  console.error('Tamil playlist seed failed:', error);
  process.exit(1);
});
