import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiMusic, FiTrash2 } from "react-icons/fi";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Playlists() {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState(null);

  const load = () => api.get("/playlists/mine").then((res) => setPlaylists(res.data));

  useEffect(() => {
    if (user) load();
  }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (coverImage) formData.append("coverImage", coverImage);
    await api.post("/playlists", formData);
    setName("");
    setDescription("");
    setCoverImage(null);
    setShowForm(false);
    load();
  };

  const handleDelete = async (event, playlist) => {
    event.preventDefault();
    event.stopPropagation();
    if (!window.confirm(`Delete playlist "${playlist.name}" permanently?`)) return;
    await api.delete(`/playlists/${playlist._id}`);
    load();
  };

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-5 pt-16 text-center">
        <p className="text-muted">Log in to create and manage your playlists.</p>
        <Link to="/login" className="inline-block mt-4 bg-amber text-base px-5 py-2 rounded-full text-sm font-medium">
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-5 pt-10 pb-28">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-medium text-ink">Your playlists</h1>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="flex items-center gap-2 bg-amber text-base px-4 py-2 rounded-full text-sm font-medium hover:brightness-110"
        >
          <FiPlus size={14} /> New playlist
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-surface rounded-xl p-5 mb-8 flex flex-col gap-3 max-w-md">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Playlist name"
            className="bg-surface2 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber"
          />
          <label className="text-xs text-muted">Playlist cover image
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files[0])}
              className="block mt-1 w-full text-xs file:mr-2 file:rounded-full file:border-0 file:bg-teal file:px-3 file:py-2 file:text-base"
            />
          </label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className="bg-surface2 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber"
          />
          <button type="submit" className="self-start bg-teal text-base px-4 py-2 rounded-full text-sm font-medium">
            Create
          </button>
        </form>
      )}

      {playlists.length === 0 ? (
        <p className="text-sm text-muted">You haven't made a playlist yet. Start one above.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {playlists.map((p) => (
            <div
              key={p._id}
              className="relative bg-surface hover:bg-surface2 transition rounded-xl"
            >
              <Link to={`/playlists/${p._id}`} className="flex flex-col gap-3 p-4">
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
              <button onClick={(event) => handleDelete(event, p)} className="absolute top-4 right-4 text-muted hover:text-red-400 transition" title="Delete playlist" aria-label={`Delete ${p.name}`}>
                <FiTrash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
