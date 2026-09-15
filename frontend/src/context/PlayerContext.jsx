// This is the "engine room" for music playback. One hidden <audio> element
// lives here, and any page in the app can call playSong() to start it.
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import api from "../api/axios.js";

const PlayerContext = createContext(null);

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(new Audio());
  const [queue, setQueue] = useState([]);       // the list of songs currently playing through
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);  // seconds played
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);   // repeat the current song

  const currentSong = currentIndex >= 0 ? queue[currentIndex] : null;

  // Wire up the audio element's events once
  useEffect(() => {
    const audio = audioRef.current;
    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => handleEnded();

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, queue, repeat, shuffle]);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  const handleEnded = () => {
    if (repeat) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      return;
    }
    playNext();
  };

  // Start playing a song. `songList` is the full list it belongs to
  // (e.g. a playlist or search results), so Next/Previous know what's around it.
  const playSong = (song, songList = [song]) => {
    const list = songList.length ? songList : [song];
    const index = list.findIndex((s) => s._id === song._id);
    setQueue(list);
    setCurrentIndex(index === -1 ? 0 : index);
    loadAndPlay(list[index === -1 ? 0 : index]);
  };

  const loadAndPlay = (song) => {
    const audio = audioRef.current;
    audio.src = song.audioUrl;
    audio.play();
    setIsPlaying(true);
    api.put(`/songs/${song._id}/play`).catch(() => {}); // silently count the play
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!currentSong) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const playNext = () => {
    if (queue.length === 0) return;
    let nextIndex;
    if (shuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = (currentIndex + 1) % queue.length;
    }
    setCurrentIndex(nextIndex);
    loadAndPlay(queue[nextIndex]);
  };

  const playPrevious = () => {
    if (queue.length === 0) return;
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    setCurrentIndex(prevIndex);
    loadAndPlay(queue[prevIndex]);
  };

  const seekTo = (time) => {
    audioRef.current.currentTime = time;
    setProgress(time);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        queue,
        isPlaying,
        progress,
        duration,
        volume,
        shuffle,
        repeat,
        playSong,
        togglePlay,
        playNext,
        playPrevious,
        seekTo,
        setVolume,
        setShuffle,
        setRepeat,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
