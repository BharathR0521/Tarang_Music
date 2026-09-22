import { useEffect, useState } from "react";
import { FiUpload, FiMusic } from "react-icons/fi";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import SongCard from "../components/SongCard.jsx";
import UploadSongModal from "../components/UploadSongModal.jsx";
import AddToPlaylistModal from "../components/AddToPlaylistModal.jsx";

export default function Songs() {
  const { user } = useAuth();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [addingSong, setAddingSong] = useState(null);

  const loadSongs = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/songs");
      setSongs(data);
      setError("");
    } catch (loadError) {
      setError(loadError.response?.data?.message || "Could not load songs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSongs(); }, []);

  const handleDelete = async (song) => {
    if (!window.confirm(`Delete "${song.title}" permanently?`)) return;
    try {
      await api.delete(`/songs/${song._id}`);
      setSongs((current) => current.filter((item) => item._id !== song._id));
    } catch (deleteError) {
      setError(deleteError.response?.data?.message || "Could not delete song.");
    }
  };

  const handleLike = async (song) => {
    if (!user) return;
    await api.put(`/songs/${song._id}/like`);
    loadSongs();
  };

  return (
    <div className="max-w-6xl mx-auto px-5 pt-10 pb-32 animate-fade-in-up">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="eyebrow">The library</p>
          <h1 className="text-3xl md:text-4xl font-semibold text-ink mt-2">Songs</h1>
          <p className="text-sm text-muted mt-2">Every track in your Tarang collection, ready when you are.</p>
        </div>
        {user && <button onClick={() => setShowUpload(true)} className="inline-flex items-center gap-2 bg-amber text-base font-medium rounded-full px-4 py-2 hover:brightness-110 transition-transform active:scale-95"><FiUpload size={16} /> Upload song</button>}
      </div>
      {error && <p className="mb-5 text-sm text-red-300 animate-fade-in-up">{error}</p>}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="stagger-item" style={{ "--delay": `${i * 40}ms` }}>
              <div className="skeleton w-full aspect-square mb-3" />
              <div className="skeleton h-3 w-4/5 rounded-full mb-2" />
              <div className="skeleton h-3 w-2/5 rounded-full" />
            </div>
          ))}
        </div>
      ) : songs.length === 0 ? (
        <div className="empty-state animate-fade-in-up"><FiMusic size={28} className="text-teal" /><p className="text-ink mt-3">Your library is quiet.</p><p className="text-sm text-muted mt-1">Upload a song to start building it.</p></div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {songs.map((song, index) => <SongCard key={song._id} song={song} songList={songs} index={index} liked={user && song.likes?.includes(user._id)} onLike={handleLike} onAddToPlaylist={user ? setAddingSong : null} onDelete={user && song.uploadedBy === user._id ? handleDelete : null} />)}
        </div>
      )}
      {showUpload && <UploadSongModal onClose={() => setShowUpload(false)} onUploaded={(song) => setSongs((current) => [song, ...current])} />}
      {addingSong && <AddToPlaylistModal song={addingSong} onClose={() => setAddingSong(null)} />}
    </div>
  );
}