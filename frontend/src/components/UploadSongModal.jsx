import { useEffect, useState } from "react";
import { FiUpload, FiX } from "react-icons/fi";
import api from "../api/axios.js";

export default function UploadSongModal({ onClose, onUploaded }) {
  const [form, setForm] = useState({ title: "", artist: "", genre: "", audio: null, coverImage: null, coverUrl: "" });
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [coverPreview, setCoverPreview] = useState("");

  useEffect(() => {
    if (form.coverImage) {
      const previewUrl = URL.createObjectURL(form.coverImage);
      setCoverPreview(previewUrl);
      return () => URL.revokeObjectURL(previewUrl);
    }
    setCoverPreview(form.coverUrl);
    return undefined;
  }, [form.coverImage, form.coverUrl]);

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
      else if (form.coverUrl.trim()) data.append("coverImage", form.coverUrl.trim());
      const response = await api.post("/songs/upload", data);
      onUploaded(response.data);
      onClose();
    } catch (uploadError) {
      setError(uploadError.response?.data?.message || "Could not upload song.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="modal-backdrop fixed inset-0 z-[100] bg-black/60 px-4 py-6 sm:py-10" onClick={onClose}>
      <div className="flex min-h-full items-center justify-center">
        <form onSubmit={handleSubmit} className="modal-panel w-full max-w-lg rounded-xl bg-surface p-5" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="flex items-center gap-2 text-sm font-medium text-ink"><FiUpload /> Upload song</h3>
          <button type="button" onClick={onClose} className="text-muted hover:text-ink" title="Close"><FiX size={18} /></button>
        </div>
        <div className="grid gap-3">
            <input required value={form.title} onChange={(event) => update("title", event.target.value)} placeholder="Song title" className="bg-base border border-surface2 rounded-lg px-3 py-2 text-sm" />
            <input required value={form.artist} onChange={(event) => update("artist", event.target.value)} placeholder="Artist" className="bg-base border border-surface2 rounded-lg px-3 py-2 text-sm" />
            <input value={form.genre} onChange={(event) => update("genre", event.target.value)} placeholder="Genre (optional)" className="bg-base border border-surface2 rounded-lg px-3 py-2 text-sm" />
            <label className="text-xs text-muted">Audio file<input required type="file" accept="audio/*" onChange={(event) => update("audio", event.target.files[0])} className="block mt-1 w-full text-xs file:mr-2 file:rounded-full file:border-0 file:bg-amber file:px-3 file:py-2 file:text-base" /></label>
            <label className="text-xs text-muted">Cover image file<input type="file" accept="image/*" onChange={(event) => update("coverImage", event.target.files[0] || null)} className="block mt-1 w-full text-xs file:mr-2 file:rounded-full file:border-0 file:bg-teal file:px-3 file:py-2 file:text-base" /></label>
            <input type="url" value={form.coverUrl} onChange={(event) => update("coverUrl", event.target.value)} placeholder="Or paste an online image URL" className="bg-base border border-surface2 rounded-lg px-3 py-2 text-sm" />
            {coverPreview && <img src={coverPreview} alt="Cover preview" className="w-full h-48 rounded-lg object-cover object-center bg-surface2" />}
        </div>
        {error && <p className="text-xs text-red-400 mt-3">{error}</p>}
        <button type="submit" disabled={uploading || !form.audio} className="bg-amber text-base font-medium rounded-full px-4 py-2 mt-5 disabled:opacity-50 transition-transform active:scale-95">{uploading ? "Uploading..." : "Upload song"}</button>
        </form>
      </div>
    </div>
  );
}
