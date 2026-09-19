import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import SongCard from "../components/SongCard.jsx";

export default function Home() {
  const { user } = useAuth();
  const [recentSongs, setRecentSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRecentSongs([]);
      setLoading(false);
      return;
    }

    const loadRecentSongs = () => api.get("/songs/recent").then((recentResponse) => {
      setRecentSongs(recentResponse.data);
    }).catch(() => {
      setRecentSongs([]);
    }).finally(() => setLoading(false));

    loadRecentSongs();
    window.addEventListener("tarang:recent-played", loadRecentSongs);
    return () => window.removeEventListener("tarang:recent-played", loadRecentSongs);
  }, [user]);

  const displayedRecentSongs = recentSongs.slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto px-5 pt-8 pb-32">
      <section className="hero-panel mb-12 animate-fade-in-up">
        <div className="hero-copy">
          <p className="eyebrow">Tarang / your sound, in motion</p>
          <h1 className="text-4xl md:text-6xl font-semibold text-ink leading-[0.98] mt-4 max-w-2xl">Find the rhythm that follows you.</h1>
          <p className="text-muted mt-5 max-w-lg">A personal listening room for the songs, albums, and playlists you keep coming back to.</p>
          <Link to="/songs" className="inline-flex items-center gap-2 bg-amber text-base font-medium rounded-full px-4 py-2 mt-7 hover:brightness-110 transition-transform active:scale-95 group">Explore songs <FiArrowUpRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link>
        </div>
        <div className="hero-wave" aria-hidden>{[28, 44, 20, 58, 36, 76, 30, 50, 24, 64, 38, 52].map((height, index) => <span key={index} style={{ height: `${height}px` }} />)}</div>
      </section>

      {user && !loading && displayedRecentSongs.length > 0 && (
        <section className="animate-fade-in-up" style={{ animationDelay: "80ms" }}>
          <div className="section-heading"><h2 className="text-xl font-medium text-ink">Recently Played Songs</h2><Link to="/songs" className="text-xs text-teal hover:text-ink">All songs</Link></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">{displayedRecentSongs.map((song, index) => <SongCard key={song._id} song={song} songList={displayedRecentSongs} index={index} />)}</div>
        </section>
      )}
    </div>
  );
}
