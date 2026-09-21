import { FiPlay, FiHeart, FiDownload, FiPlus, FiTrash2, FiMusic } from "react-icons/fi";
import { usePlayer } from "../context/PlayerContext.jsx";

// One song, shown as a small card. `songList` is the full list this card
// belongs to, so Next/Previous in the player know what's around it.
export default function SongCard({ song, songList, onLike, liked, onAddToPlaylist, onDelete, selectionMode, selected, onToggleSelect, index = 0 }) {
  const { playSong, currentSong, isPlaying } = usePlayer();
  const isCurrent = currentSong?._id === song._id;

  const handleDownload = (e) => {
    e.stopPropagation();
    const link = document.createElement("a");
    link.href = song.audioUrl;
    link.download = `${song.title} - ${song.artist}.mp3`;
    link.click();
  };

  const handleCoverClick = (event) => {
    event.stopPropagation();
    playSong(song, songList);
  };

  return (
    <div
      onClick={() => playSong(song, songList)}
      style={{ "--delay": `${Math.min(index, 14) * 40}ms` }}
      className={`stagger-item group relative bg-surface hover:bg-surface2 transition-all duration-300 rounded-xl p-3 cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20 ${
        isCurrent ? "ring-1 ring-amber" : ""
      }`}
    >
      <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-3 bg-surface2" onClick={handleCoverClick} role={song.coverImage ? "button" : undefined} tabIndex={song.coverImage ? 0 : undefined}>
        {selectionMode && onToggleSelect && <input type="checkbox" checked={selected} onChange={(e) => { e.stopPropagation(); onToggleSelect(song); }} onClick={(e) => e.stopPropagation()} className="absolute top-2 right-2 z-10 w-5 h-5 accent-amber cursor-pointer" aria-label={`Select ${song.title}`} />}
        {song.coverImage ? <img src={song.coverImage} alt={song.title} className="absolute inset-0 block w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-110" /> : <FiMusic className="absolute inset-0 m-auto text-muted transition-transform duration-300 group-hover:scale-110" size={32} />}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
          <div className="w-11 h-11 rounded-full bg-amber flex items-center justify-center transition-transform duration-200 scale-90 group-hover:scale-100 active:scale-90">
            <FiPlay className="text-base ml-0.5" size={18} />
          </div>
        </div>
        {isCurrent && isPlaying && (
          <span className="absolute bottom-2 left-2 flex items-center gap-1.5 text-[10px] bg-amber text-base px-2 py-1 rounded-full font-medium animate-fade-in-up">
            <span className="eq-bars"><span style={{ height: "40%" }} /><span style={{ height: "100%" }} /><span style={{ height: "65%" }} /></span>
            Now playing
          </span>
        )}
      </div>

      <h3 className="text-sm font-medium text-ink truncate">{song.title}</h3>
      <p className="text-xs text-muted truncate">{song.artist}</p>

      <div className="flex items-center gap-3 mt-2">
        <button
          onClick={(e) => { e.stopPropagation(); onLike && onLike(song); }}
          className={`flex items-center gap-1 text-xs transition-transform active:scale-90 ${liked ? "text-amber" : "text-muted hover:text-amber"}`}
        >
          <FiHeart fill={liked ? "#F4A94D" : "none"} size={14} className="transition-transform" /> {song.likes?.length ?? 0}
        </button>
        <button onClick={handleDownload} className="text-muted hover:text-teal transition-transform active:scale-90" title="Download">
          <FiDownload size={14} />
        </button>
        {onAddToPlaylist && (
          <button
            onClick={(e) => { e.stopPropagation(); onAddToPlaylist(song); }}
            className="text-muted hover:text-teal transition-transform active:scale-90"
            title="Add to album"
          >
            <FiPlus size={14} />
          </button>
        )}
        {onDelete && (
          <button onClick={(e) => { e.stopPropagation(); onDelete(song); }} className="text-muted hover:text-red-400 transition-transform active:scale-90" title="Delete uploaded song">
            <FiTrash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
