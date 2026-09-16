import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FiPlay, FiTrash2, FiMusic, FiPlus } from "react-icons/fi";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import { usePlayer } from "../context/PlayerContext.jsx";
import ShareButtons from "../components/ShareButtons.jsx";
import CommentSection from "../components/CommentSection.jsx";
import AddSongToPlaylistModal from "../components/AddSongToPlaylistModal.jsx";
import ImagePreview from "../components/ImagePreview.jsx";

export default function PlaylistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { playSong } = usePlayer();
  const [playlist, setPlaylist] = useState(null);
  const [showAddSongs, setShowAddSongs] = useState(false);
  const [coverError, setCoverError] = useState("");
  const [uploadingCover, setUploadingCover] = useState(false);
  const [showCover, setShowCover] = useState(false);
  const isPlaylistRoute = location.pathname.startsWith("/playlists/");

  const load = () => api.get(`/playlists/${id}`).then((res) => setPlaylist(res.data));

  useEffect(() => {
    load().then(() => {
      if (new URLSearchParams(location.search).get("addSongs") === "true") setShowAddSongs(true);
    });
  }, [id, location.search]);

  const handleRemove = async (songId) => {
    await api.delete(`/playlists/${id}/songs/${songId}`);
    load();
  };

  const handleCoverUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setCoverError("");
    setUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append("coverImage", file);
      const response = await api.put(`/playlists/${id}`, formData);
      setPlaylist((current) => ({ ...current, coverImage: response.data.coverImage }));
    } catch (error) {
      setCoverError(error.response?.data?.message || "Could not update album image.");
    } finally {
      setUploadingCover(false);
      event.target.value = "";
    }
  };

  const handleDeletePlaylist = async () => {
    if (!window.confirm(`Delete ${isPlaylistRoute ? "playlist" : "movie album"} "${playlist.name}" permanently?`)) return;
    await api.delete(`/playlists/${id}`);
    navigate(isPlaylistRoute ? "/playlists" : "/albums");
  };

  if (!playlist) return <div className="max-w-6xl mx-auto px-5 pt-10 text-muted">Loading...</div>;

  const isOwner = user && playlist.owner?._id === user._id;

  return (
    <div className="max-w-6xl mx-auto px-5 pt-10 pb-28">
      <div className="flex flex-col md:flex-row gap-6 mb-10">
        <div className="relative w-40 h-40 md:w-56 md:h-56 aspect-square rounded-xl bg-surface flex items-center justify-center overflow-hidden shrink-0">
          {playlist.coverImage ? (
            <button onClick={() => setShowCover(true)} className="absolute inset-0 w-full h-full cursor-zoom-in" title="View cover image">
              <img src={playlist.coverImage} alt={`${playlist.name} cover`} className="absolute inset-0 block w-full h-full object-cover object-center" />
            </button>
          ) : (
            <FiMusic size={36} className="text-muted" />
          )}
          {isOwner && <label className="absolute inset-x-0 bottom-0 bg-black/70 text-center text-xs text-ink py-2 cursor-pointer">{uploadingCover ? "Uploading..." : "Change image"}<input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" /></label>}
        </div>
        <div className="flex flex-col justify-end">
          <p className="text-xs text-muted uppercase tracking-wide">{isPlaylistRoute ? "Playlist" : "Movie album"}</p>
          <h1 className="text-3xl font-semibold text-ink mt-1">{playlist.name}</h1>
          {playlist.description && <p className="text-sm text-muted mt-2">{playlist.description}</p>}
          <p className="text-xs text-muted mt-2">
            By {playlist.owner?.name || "Someone"} · {playlist.songs.length} songs
          </p>
          <div className="mt-4">
            <div className="flex flex-wrap items-center gap-3">
              <ShareButtons title={playlist.name} />
              {isOwner && <button onClick={() => setShowAddSongs(true)} className="inline-flex items-center gap-2 bg-teal text-base text-sm font-medium rounded-full px-4 py-2 hover:brightness-110"><FiPlus size={15} /> Add songs</button>}
              {isOwner && <button onClick={handleDeletePlaylist} className="inline-flex items-center gap-2 border border-red-400/40 text-red-300 text-sm font-medium rounded-full px-4 py-2 hover:bg-red-400/10" title={`Delete ${isPlaylistRoute ? "playlist" : "movie album"}`}><FiTrash2 size={15} /> Delete {isPlaylistRoute ? "playlist" : "album"}</button>}
            </div>
          </div>
          {coverError && <p className="text-xs text-red-400 mt-2">{coverError}</p>}
        </div>
      </div>

      {playlist.songs.length === 0 ? (
        <p className="text-sm text-muted mb-10">No songs here yet. Add some from the Home or Search page.</p>
      ) : (
        <ul className="mb-10">
          {playlist.songs.map((song, i) => (
            <li
              key={song._id}
              className="group flex items-center gap-4 py-2 px-2 rounded-lg hover:bg-surface transition"
            >
              <span className="w-5 text-xs text-muted text-right">{i + 1}</span>
              <button onClick={() => playSong(song, playlist.songs)} className="relative shrink-0 w-10 h-10 rounded bg-surface2 flex items-center justify-center overflow-hidden">
                {song.coverImage ? <img src={song.coverImage} alt="" className="absolute inset-0 block w-full h-full object-cover object-center" /> : <FiMusic className="text-muted" />}
              </button>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-ink truncate">{song.title}</p>
                <p className="text-xs text-muted truncate">{song.artist}</p>
              </div>
              <button onClick={() => playSong(song, playlist.songs)} className="text-muted hover:text-amber opacity-0 group-hover:opacity-100 transition">
                <FiPlay size={16} />
              </button>
              {isOwner && (
                <button onClick={() => handleRemove(song._id)} title="Remove from playlist" className="text-muted hover:text-red-400 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition">
                  <FiTrash2 size={16} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <CommentSection playlistId={playlist._id} />
      {showAddSongs && <AddSongToPlaylistModal playlist={playlist} collectionType={isPlaylistRoute ? "playlist" : "album"} onClose={() => setShowAddSongs(false)} onAdded={() => { setShowAddSongs(false); load(); }} />}
      {showCover && <ImagePreview src={playlist.coverImage} alt={`${playlist.name} cover`} onClose={() => setShowCover(false)} />}
    </div>
  );
}
