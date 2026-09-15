import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8"><Logo size="lg" /></div>
        <h1 className="text-lg font-medium text-ink text-center mb-6">Welcome back</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button type="submit" className="bg-amber text-base font-medium rounded-full py-2.5 mt-2 hover:brightness-110 transition">
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
