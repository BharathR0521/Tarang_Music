import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import api from "../api/axios.js";

// A small popup listing the user's albums so they can add a song to one.
export default function AddToPlaylistModal({ song, onClose }) {
  const [playlists, setPlaylists] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    api.get("/playlists/mine").then((res) => setPlaylists(res.data));
  }, []);

  const handleAdd = async (playlistId) => {
    await api.put(`/playlists/${playlistId}/songs/${song._id}`);
    setStatus("Added!");
    setTimeout(onClose, 700);
  };

  return (
    <div className="modal-backdrop fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="modal-panel bg-surface rounded-xl p-5 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-ink">Add "{song.title}" to...</h3>
          <button onClick={onClose} className="text-muted hover:text-ink"><FiX size={18} /></button>
        </div>

        {playlists.length === 0 ? (
          <p className="text-xs text-muted">You don't have any movie albums yet. Create one first.</p>
        ) : (
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {playlists.map((p) => (
              <li key={p._id}>
                <button
                  onClick={() => handleAdd(p._id)}
                  className="w-full text-left px-3 py-2 rounded-lg bg-surface2 hover:bg-teal/20 text-sm text-ink transition"
                >
                  {p.name}
                </button>
              </li>
            ))}
          </ul>
        )}
        {status && <p className="text-xs text-teal mt-3">{status}</p>}
      </div>
    </div>
  );
}
