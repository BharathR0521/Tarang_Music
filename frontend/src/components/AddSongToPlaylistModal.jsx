import { useEffect, useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";
import api from "../api/axios.js";

export default function AddSongToPlaylistModal({ playlist, collectionType = "album", onClose, onAdded }) {
  const [songs, setSongs] = useState([]);
  const [collections, setCollections] = useState([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [addingId, setAddingId] = useState("");

  useEffect(() => {
    Promise.all([api.get("/songs/mine"), api.get("/playlists/mine")])
      .then(([songsResponse, collectionsResponse]) => {
        setSongs(songsResponse.data);
        setCollections(collectionsResponse.data);
      })
      .catch(() => setError("Could not load your uploaded songs."));
  }, []);

  const playlistSongIds = new Set(playlist.songs.map((song) => song._id));
  const otherCollectionSongIds = new Set(
    collections
      .filter((collection) => (collection.type || "album") !== collectionType)
      .flatMap((collection) => collection.songs.map((song) => song._id || song))
  );
  const filteredSongs = songs.filter((song) =>
    !otherCollectionSongIds.has(song._id) &&
    `${song.title} ${song.artist}`.toLowerCase().includes(query.toLowerCase())
  );

  const handleAdd = async (song) => {
    setAddingId(song._id);
    setError("");
    try {
      await api.put(`/playlists/${playlist._id}/songs/${song._id}`);
      onAdded();
    } catch (addError) {
      setError(addError.response?.data?.message || "Could not add song.");
    } finally {
      setAddingId("");
    }
  };

  return (
    <div className="modal-backdrop fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4" onClick={onClose}>
      <div className="modal-panel bg-surface rounded-xl p-5 w-full max-w-lg" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-medium text-ink">Add songs to {playlist.name}</h2>
            <p className="text-xs text-muted mt-1">Choose your uploaded songs for this playlist.</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-ink" title="Close"><FiX size={18} /></button>
        </div>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search songs or artists..." className="w-full bg-base border border-surface2 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:border-amber" />
        {error && <p className="text-xs text-red-400 mb-3">{error}</p>}
        <div className="max-h-72 overflow-y-auto space-y-1">
          {filteredSongs.map((song) => {
            const alreadyAdded = playlistSongIds.has(song._id);
            return (
              <div key={song._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface2">
                <div className="w-9 h-9 rounded bg-surface2 overflow-hidden shrink-0">
                  {song.coverImage && <img src={song.coverImage} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-ink truncate">{song.title}</p>
                  <p className="text-xs text-muted truncate">{song.artist}</p>
                </div>
                <button disabled={alreadyAdded || addingId === song._id} onClick={() => handleAdd(song)} className="flex items-center gap-1 text-xs text-teal hover:text-ink disabled:text-muted disabled:cursor-not-allowed" title={alreadyAdded ? "Already in album" : "Add to album"}>
                  <FiPlus size={15} /> {alreadyAdded ? "Added" : addingId === song._id ? "Adding" : "Add"}
                </button>
              </div>
            );
          })}
          {filteredSongs.length === 0 && <p className="text-xs text-muted py-4 text-center">No uploaded songs found.</p>}
        </div>
      </div>
    </div>
  );
}
