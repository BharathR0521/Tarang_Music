import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiCheck, FiMusic, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Playlists({ type = "album" }) {
  const { user } = useAuth();
  const isPlaylistPage = type === "playlist";
  const label = isPlaylistPage ? "playlist" : "album";
  const [collections, setCollections] = useState([]);
  const [songs, setSongs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [songQuery, setSongQuery] = useState("");
  const [selectedSongIds, setSelectedSongIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    const [{ data: collectionData }, { data: songData }] = await Promise.all([
      api.get(`/playlists/mine?type=${type}`),
      api.get("/songs/mine"),
    ]);
    setCollections(collectionData);
    setSongs(songData);
  };

  useEffect(() => {
    if (user) load().catch(() => setError(`Could not load your ${label}s.`));
  }, [user, type]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setCoverUrl("");
    setSongQuery("");
    setSelectedSongIds([]);
    setError("");
    setShowForm(false);
  };

  const toggleSong = (songId) => {
    setSelectedSongIds((current) => current.includes(songId)
      ? current.filter((id) => id !== songId)
      : [...current, songId]);
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError("");
    try {
      await api.post("/playlists", {
        name: name.trim(),
        description: description.trim(),
        coverImage: coverUrl.trim(),
        type,
        songIds: selectedSongIds,
      });
      await load();
      resetForm();
    } catch (createError) {
      setError(createError.response?.data?.message || `Could not create ${label}.`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (collection) => {
    if (!window.confirm(`Delete ${label} "${collection.name}" permanently?`)) return;
    try {
      await api.delete(`/playlists/${collection._id}`);
      setCollections((current) => current.filter((item) => item._id !== collection._id));
    } catch (deleteError) {
      setError(deleteError.response?.data?.message || `Could not delete ${label}.`);
    }
  };

  const filteredSongs = songs.filter((song) =>
    `${song.title} ${song.artist}`.toLowerCase().includes(songQuery.toLowerCase())
  );

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-5 pt-16 text-center">
        <p className="text-muted">Log in to create and manage your {label}s.</p>
        <Link to="/login" className="inline-block mt-4 bg-amber text-base px-5 py-2 rounded-full text-sm font-medium">Log in</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-5 pt-10 pb-28 animate-fade-in-up">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="eyebrow">Your collection</p>
          <h1 className="text-3xl font-semibold text-ink mt-2">Your {label}s</h1>
        </div>
        <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 bg-amber text-base px-4 py-2 rounded-full text-sm font-medium hover:brightness-110 transition-transform active:scale-95">
          <FiPlus size={15} /> Create {label}
        </button>
      </div>

      {error && <p className="mb-5 text-sm text-red-300">{error}</p>}
      {collections.length === 0 ? (
        <div className="empty-state py-12"><FiMusic size={28} className="mx-auto text-teal" /><p className="text-ink mt-3">No {label}s yet.</p><p className="text-sm text-muted mt-1">Create one and add your songs.</p></div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {collections.map((collection, index) => (
            <div key={collection._id} style={{ "--delay": `${Math.min(index, 14) * 40}ms` }} className="group stagger-item relative bg-surface hover:bg-surface2 transition-all duration-300 hover:-translate-y-1 rounded-xl overflow-hidden">
              <Link to={`/${isPlaylistPage ? "playlists" : "albums"}/${collection._id}`} className="flex flex-col gap-3 p-4">
                <div className="relative w-full aspect-square rounded-lg bg-surface2 flex items-center justify-center overflow-hidden">
                  {collection.coverImage ? <img src={collection.coverImage} alt={`${collection.name} cover`} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" /> : <FiMusic size={28} className="text-muted" />}
                </div>
                <div><p className="text-sm text-ink font-medium truncate">{collection.name}</p><p className="text-xs text-muted">{collection.songs?.length || 0} songs</p></div>
              </Link>
              <button onClick={() => handleDelete(collection)} className="absolute top-4 right-4 text-muted hover:text-red-400 transition" title={`Delete ${label}`} aria-label={`Delete ${collection.name}`}><FiTrash2 size={16} /></button>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="modal-backdrop fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4" onClick={resetForm}>
          <form onSubmit={handleCreate} className="modal-panel bg-surface rounded-xl p-5 w-full max-w-lg flex flex-col gap-3" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between"><div><h2 className="text-base font-medium text-ink">Create {label}</h2><p className="text-xs text-muted mt-1">Add a cover image URL and choose songs.</p></div><button type="button" onClick={resetForm} className="text-muted hover:text-ink" title="Close"><FiX size={18} /></button></div>
            <input required value={name} onChange={(event) => setName(event.target.value)} placeholder={`${isPlaylistPage ? "Playlist" : "Album"} name`} className="bg-surface2 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber" />
            <input type="url" value={coverUrl} onChange={(event) => setCoverUrl(event.target.value)} placeholder="Cover image URL" className="bg-surface2 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber" />
            <input value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Description (optional)" className="bg-surface2 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber" />
            <input value={songQuery} onChange={(event) => setSongQuery(event.target.value)} placeholder="Search songs to add" className="bg-surface2 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber" />
            <div className="max-h-48 overflow-y-auto space-y-1 rounded-lg bg-base p-2">
              {filteredSongs.map((song) => {
                const selected = selectedSongIds.includes(song._id);
                return <button type="button" key={song._id} onClick={() => toggleSong(song._id)} className={`w-full flex items-center gap-3 text-left p-2 rounded-lg transition ${selected ? "bg-teal/20" : "hover:bg-surface2"}`}><span className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${selected ? "bg-teal border-teal text-base" : "border-surface2"}`}>{selected && <FiCheck size={13} />}</span><span className="min-w-0"><span className="block text-sm text-ink truncate">{song.title}</span><span className="block text-xs text-muted truncate">{song.artist}</span></span></button>;
              })}
              {filteredSongs.length === 0 && <p className="text-xs text-muted text-center py-4">No uploaded songs found.</p>}
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}
            <button type="submit" disabled={loading} className="self-start bg-amber text-base px-5 py-2 rounded-full text-sm font-medium hover:brightness-110 disabled:opacity-60">{loading ? "Creating..." : `Submit ${label}`}</button>
          </form>
        </div>
      )}
    </div>
  );
}
