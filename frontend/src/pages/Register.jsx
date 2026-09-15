import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const GENRES = ["Electronic", "Tamil Film", "Chill", "Rock", "Carnatic", "Hip-Hop"];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState("");

  const toggleGenre = (g) =>
    setGenres((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(name, email, password, genres);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8"><Logo size="lg" /></div>
        <h1 className="text-lg font-medium text-ink text-center mb-6">Create your account</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="bg-surface border border-surface2 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber"
          />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="bg-surface border border-surface2 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="bg-surface border border-surface2 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber"
          />

          <p className="text-xs text-muted mt-2">Pick a few genres you like (optional):</p>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((g) => (
              <button
                type="button"
                key={g}
                onClick={() => toggleGenre(g)}
                className={`px-3 py-1 rounded-full text-xs transition ${
                  genres.includes(g) ? "bg-teal text-base" : "bg-surface2 text-muted hover:text-ink"
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
          <button type="submit" className="bg-amber text-base font-medium rounded-full py-2.5 mt-3 hover:brightness-110 transition">
            Create account
          </button>
        </form>

        <p className="text-sm text-muted text-center mt-6">
          Already have an account? <Link to="/login" className="text-teal hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
