import { useEffect, useState } from "react";
import { FiUpload, FiTrash2 } from "react-icons/fi";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import SongCard from "../components/SongCard.jsx";
import AddToPlaylistModal from "../components/AddToPlaylistModal.jsx";
import UploadSongModal from "../components/UploadSongModal.jsx";

const GENRES = ["Electronic", "Tamil Film", "Chill", "Rock", "Carnatic", "Hip-Hop"];

export default function Home() {
  const { user } = useAuth();
  const [recommended, setRecommended] = useState([]);
  const [allSongs, setAllSongs] = useState([]);
  const [activeGenre, setActiveGenre] = useState(null);
  const [addingSong, setAddingSong] = useState(null);
  const [uploadingSong, setUploadingSong] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedSongs, setSelectedSongs] = useState([]);

  const fetchAll = async (genre) => {
    const { data } = await api.get("/songs", { params: genre ? { genre } : {} });
    setAllSongs(data);
  };

  useEffect(() => {
    api.get("/songs/recommended").then((res) => setRecommended(res.data));
    fetchAll(null);
  }, []);

  const handleLike = async (song) => {
    if (!user) return alert("Log in to like songs.");
    await api.put(`/songs/${song._id}/like`);
    fetchAll(activeGenre);
    api.get("/songs/recommended").then((res) => setRecommended(res.data));
  };

  const isLiked = (song) => user && song.likes?.includes(user._id);

  const handleDelete = async (song) => {
    if (!window.confirm(`Delete "${song.title}"?`)) return;
    await api.delete(`/songs/${song._id}`);
    fetchAll(activeGenre);
    api.get("/songs/recommended").then((res) => setRecommended(res.data));
  };

  const canDelete = (song) => user && song.uploadedBy?.toString() === user._id;

  const toggleSongSelection = (song) => {
    setSelectedSongs((current) => current.includes(song._id)
      ? current.filter((id) => id !== song._id)
      : [...current, song._id]);
  };

  const handleDeleteSelected = async () => {
    if (selectedSongs.length === 0) return;
    if (!window.confirm(`Delete ${selectedSongs.length} selected uploaded song${selectedSongs.length === 1 ? "" : "s"} permanently?`)) return;
    await api.delete("/songs/uploaded/selected", { data: { songIds: selectedSongs } });
    setSelectedSongs([]);
    setSelectionMode(false);
    fetchAll(activeGenre);
    api.get("/songs/recommended").then((res) => setRecommended(res.data));
  };

  const selectionProps = (song) => canDelete(song) ? {
    selectionMode,
    selected: selectedSongs.includes(song._id),
    onToggleSelect: toggleSongSelection,
  } : {};

  return (
    <div className="max-w-6xl mx-auto px-5 pt-10 pb-28">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface via-surface to-teal/10 p-8 md:p-12 mb-12">
        <div className="flex items-end gap-1 mb-5" aria-hidden>
          {[14, 24, 10, 30, 18, 26, 12].map((h, i) => (
            <span
              key={i}
              className="w-1.5 rounded-full bg-amber"
              style={{ height: `${h}px`, opacity: 0.5 + (i % 3) * 0.2 }}
            />
          ))}
        </div>
        <h1 className="text-3xl md:text-5xl font-semibold text-ink max-w-xl leading-tight">
          Every mood has a wave.
        </h1>
        <p className="text-muted mt-3 max-w-md">
          Tarang learns what you like and streams it back to you — Tamil film hits,
          Carnatic ragas, or late-night electronic. No two people get the same homepage.
        </p>
        {user && <div className="flex flex-wrap gap-3 mt-5">
          <button onClick={() => setUploadingSong(true)} className="inline-flex items-center gap-2 bg-amber text-base font-medium rounded-full px-4 py-2"><FiUpload size={16} /> Upload song</button>
          {!selectionMode ? <button onClick={() => setSelectionMode(true)} className="inline-flex items-center gap-2 border border-red-400/40 text-red-300 font-medium rounded-full px-4 py-2 hover:bg-red-400/10"><FiTrash2 size={16} /> Select songs to delete</button> : <>
            <button onClick={handleDeleteSelected} disabled={selectedSongs.length === 0} className="inline-flex items-center gap-2 bg-red-400 text-base font-medium rounded-full px-4 py-2 disabled:opacity-50"><FiTrash2 size={16} /> Delete selected ({selectedSongs.length})</button>
            <button onClick={() => { setSelectionMode(false); setSelectedSongs([]); }} className="inline-flex items-center gap-2 border border-surface2 text-muted font-medium rounded-full px-4 py-2 hover:text-ink">Cancel</button>
          </>}
        </div>}
      </section>

      {/* Genre filter */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1">
        <button
          onClick={() => { setActiveGenre(null); fetchAll(null); }}
          className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition ${
            !activeGenre ? "bg-amber text-base" : "bg-surface text-muted hover:text-ink"
          }`}
        >
          All
        </button>
        {GENRES.map((g) => (
          <button
            key={g}
            onClick={() => { setActiveGenre(g); fetchAll(g); }}
            className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition ${
              activeGenre === g ? "bg-amber text-base" : "bg-surface text-muted hover:text-ink"
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Recommended for you */}
      {recommended.length > 0 && (
        <section className="mb-12">
          <h2 className="text-lg font-medium text-ink mb-4">
            {user ? `Picked for you, ${user.name.split(" ")[0]}` : "Trending now"}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {recommended.map((song) => (
              <SongCard
                key={song._id}
                song={song}
                songList={recommended}
                liked={isLiked(song)}
                onLike={handleLike}
                onAddToPlaylist={user ? setAddingSong : null}
                onDelete={canDelete(song) ? handleDelete : null}
                {...selectionProps(song)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Browse all */}
      <section>
        <h2 className="text-lg font-medium text-ink mb-4">
          {activeGenre ? activeGenre : "Browse all songs"}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {allSongs.map((song) => (
            <SongCard
              key={song._id}
              song={song}
              songList={allSongs}
              liked={isLiked(song)}
              onLike={handleLike}
              onAddToPlaylist={user ? setAddingSong : null}
              onDelete={canDelete(song) ? handleDelete : null}
              {...selectionProps(song)}
            />
          ))}
        </div>
      </section>

      {addingSong && <AddToPlaylistModal song={addingSong} onClose={() => setAddingSong(null)} />}
      {uploadingSong && <UploadSongModal onClose={() => setUploadingSong(false)} onUploaded={() => { fetchAll(activeGenre); api.get("/songs/recommended").then((res) => setRecommended(res.data)); }} />}
    </div>
  );
}
