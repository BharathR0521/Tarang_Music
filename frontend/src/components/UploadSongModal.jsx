import { useEffect, useState } from "react";
import { FiUpload, FiX } from "react-icons/fi";
import api from "../api/axios.js";

export default function UploadSongModal({ onClose, onUploaded }) {
  const [playlists, setPlaylists] = useState([]);
  const [form, setForm] = useState({ title: "", artist: "", genre: "", playlistId: "", audio: null, coverImage: null });
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [coverPreview, setCoverPreview] = useState("");

  useEffect(() => {
    api.get("/playlists/mine").then((res) => {
      setPlaylists(res.data);
      if (res.data[0]) setForm((current) => ({ ...current, playlistId: res.data[0]._id }));
    }).catch(() => setError("Could not load your playlists."));
  }, []);

  useEffect(() => {
    if (!form.coverImage) {
      setCoverPreview("");
      return undefined;
    }
    const previewUrl = URL.createObjectURL(form.coverImage);
    setCoverPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [form.coverImage]);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setUploading(true);
    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("artist", form.artist);
      data.append("genre", form.genre);
      data.append("audio", form.audio);
      if (form.coverImage) data.append("coverImage", form.coverImage);
      await api.post(`/playlists/${form.playlistId}/songs/upload`, data);
      onUploaded();
      onClose();
    } catch (uploadError) {
      setError(uploadError.response?.data?.message || "Could not upload song.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <form onSubmit={handleSubmit} className="bg-surface rounded-xl p-5 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="flex items-center gap-2 text-sm font-medium text-ink"><FiUpload /> Upload song</h3>
          <button type="button" onClick={onClose} className="text-muted hover:text-ink" title="Close"><FiX size={18} /></button>
        </div>
        {playlists.length === 0 ? (
          <p className="text-xs text-muted">Create a playlist before uploading a song.</p>
        ) : (
          <div className="grid gap-3">
            <input required value={form.title} onChange={(event) => update("title", event.target.value)} placeholder="Song title" className="bg-base border border-surface2 rounded-lg px-3 py-2 text-sm" />
            <input required value={form.artist} onChange={(event) => update("artist", event.target.value)} placeholder="Artist" className="bg-base border border-surface2 rounded-lg px-3 py-2 text-sm" />
            <input value={form.genre} onChange={(event) => update("genre", event.target.value)} placeholder="Genre (optional)" className="bg-base border border-surface2 rounded-lg px-3 py-2 text-sm" />
            <label className="text-xs text-muted">Add this song to
              <select required value={form.playlistId} onChange={(event) => update("playlistId", event.target.value)} className="block mt-1 w-full bg-base border border-surface2 rounded-lg px-3 py-2 text-sm text-ink">
                <option value="">Choose a playlist</option>
                {playlists.map((playlist) => <option key={playlist._id} value={playlist._id}>{playlist.name}</option>)}
              </select>
            </label>
            <label className="text-xs text-muted">Audio file<input required type="file" accept="audio/*" onChange={(event) => update("audio", event.target.files[0])} className="block mt-1 w-full text-xs file:mr-2 file:rounded-full file:border-0 file:bg-amber file:px-3 file:py-2 file:text-base" /></label>
            <label className="text-xs text-muted">Cover image<input required type="file" accept="image/*" onChange={(event) => update("coverImage", event.target.files[0])} className="block mt-1 w-full text-xs file:mr-2 file:rounded-full file:border-0 file:bg-teal file:px-3 file:py-2 file:text-base" /></label>
            {coverPreview && <img src={coverPreview} alt="Cover preview" className="w-full h-48 rounded-lg object-cover object-center bg-surface2" />}
          </div>
        )}
        {error && <p className="text-xs text-red-400 mt-3">{error}</p>}
        {playlists.length > 0 && <button type="submit" disabled={uploading || !form.audio || !form.playlistId} className="bg-amber text-base font-medium rounded-full px-4 py-2 mt-5 disabled:opacity-50">{uploading ? "Uploading..." : "Upload song"}</button>}
      </form>
    </div>
  );
}
