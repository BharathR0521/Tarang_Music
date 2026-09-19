import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import SongCard from "../components/SongCard.jsx";
import AddToPlaylistModal from "../components/AddToPlaylistModal.jsx";

export default function Search() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addingSong, setAddingSong] = useState(null);

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    api.get("/songs/search", { params: { q } })
      .then((res) => setResults(res.data))
      .finally(() => setLoading(false));
  }, [q]);

  const handleLike = async (song) => {
    if (!user) return alert("Log in to like songs.");
    await api.put(`/songs/${song._id}/like`);
    const { data } = await api.get("/songs/search", { params: { q } });
    setResults(data);
  };

  const isLiked = (song) => user && song.likes?.includes(user._id);

  return (
    <div className="max-w-6xl mx-auto px-5 pt-10 pb-28 animate-fade-in-up">
      <h1 className="text-xl font-medium text-ink mb-1">
        {q ? `Results for "${q}"` : "Search"}
      </h1>
      <p className="text-sm text-muted mb-8">
        {loading ? "Searching..." : `${results.length} song${results.length === 1 ? "" : "s"} found`}
      </p>

      {results.length === 0 && !loading && q && (
        <p className="text-sm text-muted">
          No matches. Try a different song, artist, album, or movie name.
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {results.map((song, index) => (
          <SongCard
            key={song._id}
            song={song}
            songList={results}
            index={index}
            liked={isLiked(song)}
            onLike={handleLike}
            onAddToPlaylist={user ? setAddingSong : null}
          />
        ))}
      </div>

      {addingSong && <AddToPlaylistModal song={addingSong} onClose={() => setAddingSong(null)} />}
    </div>
  );
}
