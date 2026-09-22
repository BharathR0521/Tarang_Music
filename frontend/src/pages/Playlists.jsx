import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const GENRES = ["Electronic", "Tamil Film", "Chill", "Rock", "Carnatic", "Hip-Hop"];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleGenre = (g) =>
    setGenres((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));

  const getErrorMessage = (err) =>
    err?.response?.data?.message || err?.message || "Something went wrong. Try again.";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError("");

    if (!name.trim() || !username.trim() || !email.trim() || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      await register(name.trim(), username.trim(), email.trim(), password, genres);
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Register failed:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-sm animate-fade-in-up">
        <div className="flex justify-center mb-8"><Logo size="lg" /></div>
        <h1 className="text-lg font-medium text-ink text-center mb-6">Create your account</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" disabled={loading}
            className="bg-surface border border-surface2 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber disabled:opacity-60" />
          <input required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" disabled={loading}
            className="bg-surface border border-surface2 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber disabled:opacity-60" />
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" disabled={loading}
            className="bg-surface border border-surface2 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber disabled:opacity-60" />
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" disabled={loading}
            className="bg-surface border border-surface2 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber disabled:opacity-60" />

          <p className="text-xs text-muted mt-2">Pick a few genres you like (optional):</p>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((g) => (
              <button
                type="button"
                key={g}
                disabled={loading}
                onClick={() => toggleGenre(g)}
                className={`px-3 py-1 rounded-full text-xs transition-all active:scale-90 disabled:opacity-60 ${
                  genres.includes(g) ? "bg-teal text-base" : "bg-surface2 text-muted hover:text-ink"
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
          <button type="submit" disabled={loading}
            className="bg-amber text-base font-medium rounded-full py-2.5 mt-3 hover:brightness-110 transition-transform active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-sm text-muted text-center mt-6">
          Already have an account? <Link to="/login" className="text-teal hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}