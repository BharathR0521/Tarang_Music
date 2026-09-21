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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(identifier, password);
      navigate("/");
    } catch (err) {
      const backendMessage = err?.response?.data?.message;
      const networkMessage = err?.message === "Network Error" ? "Unable to reach the server. Check your connection and try again." : "";
      setError(backendMessage || networkMessage || "Something went wrong. Try again.");
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
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Username or Email"
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
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button type="submit" className="bg-amber text-base font-medium rounded-full py-2.5 mt-2 hover:brightness-110 transition-transform active:scale-95">
            Log in
          </button>
        </form>

        <p className="text-sm text-muted text-center mt-6">
          New to Tarang? <Link to="/register" className="text-teal hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
