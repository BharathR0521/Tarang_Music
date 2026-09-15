import { useEffect, useState } from "react";
import { FiSend } from "react-icons/fi";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

// Drop this on a song page or playlist page: pass EITHER songId OR playlistId.
export default function CommentSection({ songId, playlistId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  const endpoint = songId ? `/comments/song/${songId}` : `/comments/playlist/${playlistId}`;

  useEffect(() => {
    api.get(endpoint).then((res) => setComments(res.data)).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songId, playlistId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || !user) return;
    const { data } = await api.post("/comments", { text, songId, playlistId });
    setComments([data, ...comments]);
    setText("");
  };

  return (
    <div>
      <h3 className="text-sm font-medium text-ink mb-3">Comments ({comments.length})</h3>

      {user ? (
        <form onSubmit={handleSubmit} className="flex items-center gap-2 mb-4">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-surface border border-surface2 rounded-full px-4 py-2 text-sm placeholder:text-muted focus:outline-none focus:border-amber"
          />
          <button type="submit" className="w-9 h-9 rounded-full bg-amber flex items-center justify-center text-base">
            <FiSend size={14} />
          </button>
        </form>
      ) : (
        <p className="text-xs text-muted mb-4">Log in to leave a comment.</p>
      )}

      {loading ? (
        <p className="text-xs text-muted">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-xs text-muted">No comments yet. Be the first to say something.</p>
      ) : (
        <ul className="space-y-3">
          {comments.map((c) => (
            <li key={c._id} className="bg-surface rounded-lg p-3">
              <p className="text-xs text-teal font-medium">{c.user?.name || "Someone"}</p>
              <p className="text-sm text-ink mt-1">{c.text}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
