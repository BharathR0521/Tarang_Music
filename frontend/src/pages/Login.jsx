import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setError("");
    setSubmitting(true);
    try {
      await login(identifier.trim(), password);
      navigate("/");
    } catch (err) {
      if (!err.response) {
        setError("Can't reach the Tarang server. Make sure the backend is running, then try again.");
      } else if (err.response.status === 404) {
        setError("The deployed music API is unavailable. The Tarang backend needs to be redeployed in Render.");
      } else {
        setError(err.response.data?.message || "Could not log in. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-5">
      <div className="w-full max-w-sm animate-fade-in-up">
        <div className="flex justify-center mb-8"><Logo size="lg" /></div>
        <h1 className="text-lg font-medium text-ink text-center mb-6">Welcome back</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            required
            autoComplete="username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Username or Email"
            aria-label="Username or email"
            className="bg-surface border border-surface2 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber"
          />
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            aria-label="Password"
            className="bg-surface border border-surface2 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber"
          />
          {error && <p role="alert" className="text-xs leading-5 text-red-300">{error}</p>}
          <button type="submit" disabled={submitting} className="bg-amber text-base font-medium rounded-full py-2.5 mt-2 hover:brightness-110 transition-transform active:scale-95 disabled:cursor-wait disabled:opacity-60">
            {submitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="text-sm text-muted text-center mt-6">
          New to Tarang? <Link to="/register" className="text-teal hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
