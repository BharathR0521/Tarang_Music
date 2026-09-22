export const getPublicApiUrl = (req) =>
  (process.env.PUBLIC_API_URL || `${req.protocol}://${req.get("host")}`).replace(/\/+$/, "");

export const getUploadedMediaUrl = (req, filename) =>
  `${getPublicApiUrl(req)}/uploads/${filename}`;

export const normalizeMediaUrl = (req, mediaUrl) => {
  if (!mediaUrl) return mediaUrl;

  try {
    const publicApiUrl = getPublicApiUrl(req);
    const parsedUrl = new URL(mediaUrl, publicApiUrl);
    const isUploadedMedia = parsedUrl.pathname.startsWith("/uploads/");
    const isLocalHost = ["localhost", "127.0.0.1", "::1"].includes(parsedUrl.hostname);

    return isUploadedMedia && (isLocalHost || mediaUrl.startsWith("/"))
      ? `${publicApiUrl}${parsedUrl.pathname}`
      : mediaUrl;
  } catch {
    return mediaUrl;
  }
};

export const normalizeSong = (song, req) => {
  const normalizedSong = song.toObject ? song.toObject() : { ...song };
  normalizedSong.audioUrl = normalizeMediaUrl(req, normalizedSong.audioUrl);
  normalizedSong.coverImage = normalizeMediaUrl(req, normalizedSong.coverImage);
  return normalizedSong;
};

export const normalizePlaylist = (playlist, req) => {
  const normalizedPlaylist = playlist.toObject ? playlist.toObject() : { ...playlist };
  normalizedPlaylist.coverImage = normalizeMediaUrl(req, normalizedPlaylist.coverImage);
  normalizedPlaylist.songs = (normalizedPlaylist.songs || []).map((song) =>
    song?.audioUrl ? normalizeSong(song, req) : song
  );
  return normalizedPlaylist;
};
