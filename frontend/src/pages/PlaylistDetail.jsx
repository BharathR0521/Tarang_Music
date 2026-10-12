import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FiClock, FiDisc, FiMusic, FiPlay, FiPlus, FiTrash2 } from "react-icons/fi";
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
  const { playSong, currentSong, isPlaying } = usePlayer();
  const [playlist, setPlaylist] = useState(null);
  const [showAddSongs, setShowAddSongs] = useState(false);
  const [coverError, setCoverError] = useState("");
  const [loadingError, setLoadingError] = useState("");
  const [uploadingCover, setUploadingCover] = useState(false);
  const [showCover, setShowCover] = useState(false);
  const isPlaylistRoute = location.pathname.startsWith("/playlists/");
  const collectionLabel = isPlaylistRoute ? "Playlist" : "Album";

  const load = () => api.get(`/playlists/${id}`).then((res) => {
    setPlaylist(res.data);
    setLoadingError("");
    return res.data;
  }).catch((error) => {
    setLoadingError(error.response?.data?.message || `Could not load ${collectionLabel.toLowerCase()}.`);
    throw error;
  });

  useEffect(() => {
    load().then(() => {
      if (new URLSearchParams(location.search).get("addSongs") === "true") setShowAddSongs(true);
    }).catch(() => {});
  }, [id, location.search]);

  const handleRemove = async (songId) => {
    try {
      await api.delete(`/playlists/${id}/songs/${songId}`);
      await load();
    } catch (error) {
      setLoadingError(error.response?.data?.message || "Could not remove song.");
    }
  };

  const handleCoverUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setCoverError("");
    setUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append("coverImage", file);
      const response = await api.put(`/playlists/${id}`, formData);
      setPlaylist((current) => ({ ...current, coverImage: response.data.coverImage }));
    } catch (error) {
      setCoverError(error.response?.data?.message || "Could not update cover image.");
    } finally {
      setUploadingCover(false);
      event.target.value = "";
    }
  };

  const handleDeletePlaylist = async () => {
    if (!window.confirm(`Delete ${collectionLabel.toLowerCase()} "${playlist.name}" permanently?`)) return;
    try {
      await api.delete(`/playlists/${id}`);
      navigate(isPlaylistRoute ? "/playlists" : "/albums");
    } catch (error) {
      setLoadingError(error.response?.data?.message || `Could not delete ${collectionLabel.toLowerCase()}.`);
    }
  };

  if (!playlist) {
    return (
      <div className="mx-auto max-w-6xl px-5 pt-10">
        {loadingError ? <p role="alert" className="rounded-xl border border-red-400/20 bg-red-400/5 p-5 text-sm text-red-200">{loadingError}</p> : <p className="text-sm text-muted">Loading your {collectionLabel.toLowerCase()}...</p>}
      </div>
    );
  }

  const isOwner = user && playlist.owner?._id === user._id;
  const songs = playlist.songs?.filter(Boolean) || [];
  const currentSongId = currentSong?._id;

  return (
    <div className="mx-auto max-w-6xl px-5 pb-32 pt-6 animate-fade-in-up md:pt-10">
      <section className="relative isolate overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#25453f] via-[#202a39] to-[#151b28] p-5 sm:p-8 md:p-10">
        <div className="pointer-events-none absolute -right-20 -top-32 h-96 w-96 rounded-full bg-teal/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-amber/10 blur-3xl" />
        {playlist.coverImage && <img src={playlist.coverImage} alt="" className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover opacity-[0.12] blur-3xl" />}
        <div className="relative z-10 flex flex-col items-start gap-7 sm:flex-row sm:items-end sm:gap-8">
          <div className="group relative aspect-square w-44 shrink-0 overflow-hidden rounded-2xl bg-surface2 shadow-2xl shadow-black/40 sm:w-52 md:w-60">
            {playlist.coverImage ? (
              <button onClick={() => setShowCover(true)} className="absolute inset-0 h-full w-full cursor-zoom-in" title="View cover image">
                <img src={playlist.coverImage} alt={`${playlist.name} cover`} className="absolute inset-0 block h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105" />
              </button>
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-teal/25 via-surface2 to-amber/20">
                {isPlaylistRoute ? <FiMusic size={46} className="text-teal/80" /> : <FiDisc size={46} className="text-amber/80" />}
              </div>
            )}
            {isOwner && <label className="absolute inset-x-0 bottom-0 cursor-pointer bg-black/70 py-2.5 text-center text-xs text-ink opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">{uploadingCover ? "Uploading..." : "Change cover"}<input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" /></label>}
          </div>
          <div className="min-w-0 flex-1 pb-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">{collectionLabel}</p>
            <h1 className="mt-3 break-words text-4xl font-bold leading-[1.02] tracking-tight text-white sm:text-5xl md:text-6xl">{playlist.name}</h1>
            {playlist.description && <p className="mt-4 max-w-2xl text-sm leading-6 text-white/75">{playlist.description}</p>}
            <p className="mt-5 text-sm text-white/80">
              <span className="font-semibold text-white">{playlist.owner?.name || "Someone"}</span>
              <span className="mx-2 text-white/40">·</span>
              {songs.length} {songs.length === 1 ? "song" : "songs"}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button onClick={() => songs.length && playSong(songs[0], songs)} disabled={!songs.length} className="inline-flex items-center gap-2 rounded-full bg-amber px-6 py-3 text-sm font-semibold text-base shadow-lg shadow-amber/20 transition hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50">
                <FiPlay size={17} fill="currentColor" /> Play {isPlaylistRoute ? "playlist" : "album"}
              </button>
              <ShareButtons title={playlist.name} />
              {isOwner && <button onClick={() => setShowAddSongs(true)} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/[0.12]"><FiPlus size={15} /> Add songs</button>}
              {isOwner && <button onClick={handleDeletePlaylist} className="inline-flex items-center gap-2 rounded-full border border-red-300/25 px-4 py-2.5 text-sm font-medium text-red-200 transition hover:bg-red-300/10" title={`Delete ${collectionLabel.toLowerCase()}`}><FiTrash2 size={15} /> Delete</button>}
            </div>
            {coverError && <p role="alert" className="mt-3 text-xs text-red-200">{coverError}</p>}
          </div>
        </div>
      </section>

      {loadingError && <p role="alert" className="mt-5 rounded-xl border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-200">{loadingError}</p>}

      {songs.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-12 text-center">
          <FiMusic size={30} className="mx-auto text-teal" />
          <h2 className="mt-4 text-lg font-medium text-ink">This {collectionLabel.toLowerCase()} is waiting for its first song</h2>
          <p className="mt-2 text-sm text-muted">{isOwner ? "Add songs from your library and make this collection yours." : "There are no songs in this collection yet."}</p>
          {isOwner && <button onClick={() => setShowAddSongs(true)} className="mt-5 inline-flex items-center gap-2 rounded-full bg-teal px-5 py-2.5 text-sm font-semibold text-base transition hover:brightness-110"><FiPlus size={16} /> Add songs</button>}
        </div>
      ) : (
        <section className="mt-8 md:mt-10">
          <div className="mb-3 grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-4 border-b border-white/[0.08] px-3 pb-3 text-xs text-muted sm:grid-cols-[2rem_minmax(0,1fr)_minmax(7rem,0.7fr)_auto]">
            <span className="text-right">#</span><span>Title</span><span className="hidden sm:block">Artist</span><FiClock size={15} className="mr-1" />
          </div>
          <ul>
            {songs.map((song, index) => {
              const isCurrentSong = currentSongId === song._id;
              return (
                <li key={song._id} style={{ "--delay": `${Math.min(index, 14) * 30}ms` }} className={`stagger-item group grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-4 rounded-xl px-3 py-2.5 transition-colors sm:grid-cols-[2rem_minmax(0,1fr)_minmax(7rem,0.7fr)_auto] ${isCurrentSong ? "bg-white/[0.07]" : "hover:bg-white/[0.055]"}`}>
                  <span className={`text-right text-sm ${isCurrentSong ? "text-teal" : "text-muted"}`}>{isCurrentSong && isPlaying ? <FiPlay className="ml-auto" size={13} fill="currentColor" /> : index + 1}</span>
                  <div className="flex min-w-0 items-center gap-3">
                    <button onClick={() => playSong(song, songs)} className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md bg-surface2" aria-label={`Play ${song.title}`}>
                      {song.coverImage ? <img src={song.coverImage} alt="" className="absolute inset-0 block h-full w-full object-cover object-center" /> : <FiMusic className="text-muted" />}
                      <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition group-hover:opacity-100"><FiPlay size={14} fill="currentColor" /></span>
                    </button>
                    <div className="min-w-0">
                      <p className={`truncate text-sm font-medium ${isCurrentSong ? "text-teal" : "text-ink"}`}>{song.title}</p>
                      <p className="mt-0.5 truncate text-xs text-muted sm:hidden">{song.artist}</p>
                    </div>
                  </div>
                  <span className="hidden truncate text-xs text-muted sm:block">{song.artist}</span>
                  <div className="flex items-center justify-end gap-4">
                    <button onClick={() => playSong(song, songs)} className="text-muted transition hover:text-amber" aria-label={`Play ${song.title}`}><FiPlay size={16} /></button>
                    {isOwner && <button onClick={() => handleRemove(song._id)} title="Remove from collection" aria-label={`Remove ${song.title}`} className="text-muted transition hover:text-red-300"><FiTrash2 size={15} /></button>}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <div className="mt-10"><CommentSection playlistId={playlist._id} /></div>
      {showAddSongs && <AddSongToPlaylistModal playlist={playlist} collectionType={isPlaylistRoute ? "playlist" : "album"} onClose={() => setShowAddSongs(false)} onAdded={() => { setShowAddSongs(false); load().catch(() => {}); }} />}
      {showCover && <ImagePreview src={playlist.coverImage} alt={`${playlist.name} cover`} onClose={() => setShowCover(false)} />}
    </div>
  );
}
