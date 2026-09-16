import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiPlus, FiMusic, FiTrash2, FiX } from "react-icons/fi";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Playlists({ type = "album" }) {
  const isPlaylistPage = type === "playlist";
  const navigate = useNavigate();
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [coverUrl, setCoverUrl] = useState("");

  const load = () => api.get("/playlists/mine").then((res) => setPlaylists(
    res.data.filter((playlist) => (playlist.type || "album") === type)
  ));

  useEffect(() => {
    if (user) load();
  }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const playlistName = isPlaylistPage ? name.trim() : name.trim();
    if (!playlistName) return;
    const formData = new FormData();
    formData.append("name", playlistName);
    formData.append("type", type);
    if (!isPlaylistPage) {
      formData.append("description", description);
      if (coverFile) formData.append("coverImage", coverFile);
      else if (coverUrl.trim()) formData.append("coverImage", coverUrl.trim());
    } else if (coverUrl.trim()) {
      formData.append("coverImage", coverUrl.trim());
    }
    const { data } = await api.post("/playlists", formData);
    setName("");
    setDescription("");
    setCoverFile(null);
    setCoverUrl("");
    setShowForm(false);
    load();
    if (isPlaylistPage) navigate(`/playlists/${data._id}`);
  };

  const handleDelete = async (event, playlist) => {
    event.preventDefault();
    event.stopPropagation();
    if (!window.confirm(`Delete movie album "${playlist.name}" permanently?`)) return;
    await api.delete(`/playlists/${playlist._id}`);
    load();
  };

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-5 pt-16 text-center">
        <p className="text-muted">Log in to create and manage your {isPlaylistPage ? "playlists" : "movie albums"}.</p>
        <Link to="/login" className="inline-block mt-4 bg-amber text-base px-5 py-2 rounded-full text-sm font-medium">
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-5 pt-10 pb-28">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-medium text-ink">Your {isPlaylistPage ? "playlists" : "movie albums"}</h1>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="flex items-center gap-2 bg-amber text-base px-4 py-2 rounded-full text-sm font-medium hover:brightness-110"
        >
          <FiPlus size={14} /> New {isPlaylistPage ? "playlist" : "movie album"}
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4" onClick={() => setShowForm(false)}>
          <form onSubmit={handleCreate} className="bg-surface rounded-xl p-5 w-full max-w-md flex flex-col gap-3" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-ink">New {isPlaylistPage ? "playlist" : "movie album"}</h2>
              <button type="button" onClick={() => setShowForm(false)} className="text-muted hover:text-ink" title="Close"><FiX size={18} /></button>
            </div>
            {isPlaylistPage && <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Playlist name"
              className="bg-surface2 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber"
            />}
            {isPlaylistPage && <input
              type="url"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="Playlist cover image online URL (optional)"
              className="bg-surface2 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber"
            />}
            {!isPlaylistPage && <>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Movie album name"
                className="bg-surface2 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber"
              />
              <label className="text-xs text-muted">Movie album cover image
                <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files[0] || null)} className="block mt-1 w-full text-xs file:mr-2 file:rounded-full file:border-0 file:bg-teal file:px-3 file:py-2 file:text-base" />
              </label>
              <input type="url" value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} placeholder="Or paste an online image URL" className="bg-surface2 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber" />
              <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Movie or album description (optional)" className="bg-surface2 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber" />
            </>}
            {isPlaylistPage ? <button type="submit" className="self-start bg-amber text-base px-4 py-2 rounded-full text-sm font-medium">OK</button> : <button type="submit" className="self-start bg-teal text-base px-4 py-2 rounded-full text-sm font-medium">Create</button>}
          </form>
        </div>
      )}

      {playlists.length === 0 ? (
            <p className="text-sm text-muted">You haven't made a {isPlaylistPage ? "playlist" : "movie album"} yet. Create one above.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {playlists.map((p) => (
            <div
              key={p._id}
              className="relative bg-surface hover:bg-surface2 transition rounded-xl"
            >
              <Link to={`/${isPlaylistPage ? "playlists" : "albums"}/${p._id}`} className="flex flex-col gap-3 p-4">
                <div className="relative w-full aspect-square rounded-lg bg-surface2 flex items-center justify-center overflow-hidden">
                  {p.coverImage ? (
                    <img src={p.coverImage} alt={`${p.name} cover`} className="absolute inset-0 block w-full h-full object-cover object-center" />
                  ) : (
                    <FiMusic size={28} className="text-muted" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-ink font-medium truncate">{p.name}</p>
                  <p className="text-xs text-muted">{p.songs?.length || 0} songs</p>
                </div>
              </Link>
              <button onClick={(event) => handleDelete(event, p)} className="absolute top-4 right-4 text-muted hover:text-red-400 transition" title="Delete movie album" aria-label={`Delete ${p.name}`}>
                <FiTrash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
