import { useEffect, useState } from "react";
import { FiTrash2, FiX } from "react-icons/fi";
import api from "../api/axios.js";

export default function DeleteUploadedSongsModal({ onClose, onDeleted }) {
  const [songs, setSongs] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api.get("/songs/mine")
      .then((response) => setSongs(response.data))
      .catch(() => setError("Could not load your uploaded songs."));
  }, []);

  const toggleSong = (songId) => {
    setSelectedIds((current) => current.includes(songId)
      ? current.filter((id) => id !== songId)
      : [...current, songId]);
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Permanently delete ${selectedIds.length} selected song${selectedIds.length === 1 ? "" : "s"}?`)) return;
    setDeleting(true);
    setError("");
    try {
      await api.delete("/songs/uploaded/selected", { data: { songIds: selectedIds } });
      onDeleted();
      onClose();
    } catch (deleteError) {
      setError(deleteError.response?.data?.message || "Could not delete selected songs.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="modal-backdrop fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4" onClick={onClose}>
      <div className="modal-panel bg-surface rounded-xl p-5 w-full max-w-lg" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-ink">Delete uploaded songs permanently</h2>
          <button onClick={onClose} className="text-muted hover:text-ink" title="Close"><FiX size={18} /></button>
        </div>
        <p className="text-xs text-muted mb-3">This permanently removes selected songs from every album and playlist.</p>
        {error && <p className="text-xs text-red-400 mb-3">{error}</p>}
        <div className="max-h-72 overflow-y-auto space-y-1">
          {songs.map((song) => (
            <label key={song._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface2 cursor-pointer">
              <input type="checkbox" checked={selectedIds.includes(song._id)} onChange={() => toggleSong(song._id)} className="accent-amber" />
              <div className="min-w-0">
                <p className="text-sm text-ink truncate">{song.title}</p>
                <p className="text-xs text-muted truncate">{song.artist}</p>
              </div>
            </label>
          ))}
          {songs.length === 0 && <p className="text-xs text-muted py-4 text-center">No uploaded songs found.</p>}
        </div>
        <button onClick={handleDelete} disabled={deleting || selectedIds.length === 0} className="inline-flex items-center gap-2 bg-red-400 text-base font-medium rounded-full px-4 py-2 mt-4 disabled:opacity-50">
          <FiTrash2 size={15} /> {deleting ? "Deleting..." : "Delete selected"}
        </button>
      </div>
    </div>
  );
}
