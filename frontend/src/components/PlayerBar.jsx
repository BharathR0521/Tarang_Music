import { FiPlay, FiPause, FiSkipBack, FiSkipForward, FiShuffle, FiVolume2 } from "react-icons/fi";
import { usePlayer } from "../context/PlayerContext.jsx";

const formatTime = (secs = 0) => {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

export default function PlayerBar() {
  const {
    currentSong, isPlaying, progress, duration,
    togglePlay, playNext, playPrevious, seekTo,
    volume, setVolume, shuffle, setShuffle,
  } = usePlayer();

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-surface2 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center gap-4">
        {/* Song info */}
        <div className="flex items-center gap-3 w-1/4 min-w-[160px]">
          <img src={currentSong.coverImage} alt="" className="w-12 h-12 rounded-md object-cover" />
          <div className="min-w-0">
            <p className="text-sm text-ink truncate">{currentSong.title}</p>
            <p className="text-xs text-muted truncate">{currentSong.artist}</p>
          </div>
        </div>

        {/* Controls + seek bar */}
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="flex items-center gap-5">
            <button
              onClick={() => setShuffle(!shuffle)}
              className={shuffle ? "text-amber" : "text-muted hover:text-ink"}
              title="Shuffle"
            >
              <FiShuffle size={16} />
            </button>
            <button onClick={playPrevious} className="text-ink hover:text-amber" title="Previous">
              <FiSkipBack size={18} />
            </button>
            <button
              onClick={togglePlay}
              className="w-9 h-9 rounded-full bg-amber flex items-center justify-center text-base hover:brightness-110"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <FiPause size={16} /> : <FiPlay size={16} className="ml-0.5" />}
            </button>
            <button onClick={playNext} className="text-ink hover:text-amber" title="Next">
              <FiSkipForward size={18} />
            </button>
          </div>

          <div className="w-full max-w-xl flex items-center gap-2">
            <span className="text-[11px] text-muted w-9 text-right">{formatTime(progress)}</span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={progress}
              onChange={(e) => seekTo(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-[11px] text-muted w-9">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume */}
        <div className="hidden sm:flex items-center gap-2 w-1/6 min-w-[110px] justify-end">
          <FiVolume2 className="text-muted" size={16} />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-20"
          />
        </div>
      </div>
    </div>
  );
}
