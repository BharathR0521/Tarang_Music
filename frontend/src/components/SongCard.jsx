import { useState } from "react";
import { FiPlay, FiHeart, FiDownload, FiPlus, FiTrash2, FiMusic } from "react-icons/fi";
import { usePlayer } from "../context/PlayerContext.jsx";
import ImagePreview from "./ImagePreview.jsx";

// One song, shown as a small card. `songList` is the full list this card
// belongs to, so Next/Previous in the player know what's around it.
export default function SongCard({ song, songList, onLike, liked, onAddToPlaylist, onDelete, selectionMode, selected, onToggleSelect }) {
  const { playSong, currentSong, isPlaying } = usePlayer();
  const [showImage, setShowImage] = useState(false);
  const isCurrent = currentSong?._id === song._id;

  const handleDownload = (e) => {
    e.stopPropagation();
    const link = document.createElement("a");
    link.href = song.audioUrl;
    link.download = `${song.title} - ${song.artist}.mp3`;
    link.click();
  };

  return (
    <div
      onClick={() => playSong(song, songList)}
      className={`group relative bg-surface hover:bg-surface2 transition rounded-xl p-3 cursor-pointer ${
        isCurrent ? "ring-1 ring-amber" : ""
      }`}
    >
      <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-3 bg-surface2" onClick={(event) => { if (song.coverImage) { event.stopPropagation(); setShowImage(true); } }} role={song.coverImage ? "button" : undefined} tabIndex={song.coverImage ? 0 : undefined}>
        {selectionMode && onToggleSelect && <input type="checkbox" checked={selected} onChange={(e) => { e.stopPropagation(); onToggleSelect(song); }} onClick={(e) => e.stopPropagation()} className="absolute top-2 right-2 z-10 w-5 h-5 accent-amber cursor-pointer" aria-label={`Select ${song.title}`} />}
        {song.coverImage ? <img src={song.coverImage} alt={song.title} className="absolute inset-0 block w-full h-full object-cover object-center" /> : <FiMusic className="absolute inset-0 m-auto text-muted" size={32} />}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
          <div className="w-11 h-11 rounded-full bg-amber flex items-center justify-center">
            <FiPlay className="text-base ml-0.5" size={18} />
          </div>
        </div>
        {isCurrent && isPlaying && (
          <span className="absolute bottom-2 left-2 text-[10px] bg-amber text-base px-2 py-0.5 rounded-full font-medium">
            Now playing
          </span>
        )}
      </div>

      <h3 className="text-sm font-medium text-ink truncate">{song.title}</h3>
      <p className="text-xs text-muted truncate">{song.artist}</p>

      <div className="flex items-center gap-3 mt-2">
        <button
          onClick={(e) => { e.stopPropagation(); onLike && onLike(song); }}
          className={`flex items-center gap-1 text-xs ${liked ? "text-amber" : "text-muted hover:text-amber"} transition`}
        >
          <FiHeart fill={liked ? "#F4A94D" : "none"} size={14} /> {song.likes?.length ?? 0}
        </button>
        <button onClick={handleDownload} className="text-muted hover:text-teal transition" title="Download">
          <FiDownload size={14} />
        </button>
        {onAddToPlaylist && (
          <button
            onClick={(e) => { e.stopPropagation(); onAddToPlaylist(song); }}
            className="text-muted hover:text-teal transition"
            title="Add to album"
          >
            <FiPlus size={14} />
          </button>
        )}
        {onDelete && (
          <button onClick={(e) => { e.stopPropagation(); onDelete(song); }} className="text-muted hover:text-red-400 transition" title="Delete uploaded song">
            <FiTrash2 size={14} />
          </button>
        )}
      </div>
      {showImage && <ImagePreview src={song.coverImage} alt={song.title} onClose={() => setShowImage(false)} />}
    </div>
  );
}
