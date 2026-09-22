import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { FiSearch, FiMenu, FiX, FiLogOut, FiArrowLeft } from "react-icons/fi";
import Logo from "./Logo.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const navLinkClass = ({ isActive }) =>
  `relative py-1 transition-colors after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:rounded-full after:bg-amber after:transition-all after:duration-300 ${
    isActive ? "text-ink font-medium after:w-full" : "text-muted hover:text-ink after:w-0 hover:after:w-full"
  }`;

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileError, setProfileError] = useState("");
  const { user, logout, updateProfileImage } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setMenuOpen(false);
  };

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  const initials = user?.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleProfileImage = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setProfileError("");
    try {
      await updateProfileImage(file);
    } catch (error) {
      setProfileError(error.response?.data?.message || "Could not update profile image.");
    }
    event.target.value = "";
  };

  const profileAvatar = (size) => user?.profileImage ? (
    <img src={user.profileImage} alt={`${user.name}'s profile`} className={`${size} rounded-full object-cover`} />
  ) : (
    <span>{initials || "U"}</span>
  );

  return (
    <header className="sticky top-0 z-40 bg-base/90 backdrop-blur border-b border-surface2">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {location.pathname !== "/" && <button onClick={handleBack} className="text-muted hover:text-ink transition" title="Go back" aria-label="Go back"><FiArrowLeft size={19} /></button>}
          <Link to="/" className="inline-flex transition-transform duration-300 hover:scale-105"><Logo /></Link>
        </div>

        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search songs, artists, albums, movies..."
              className="w-full bg-surface border border-surface2 rounded-full py-2 pl-10 pr-4 text-sm placeholder:text-muted focus:outline-none focus:border-amber"
            />
          </div>
        </form>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <NavLink to="/" end className={navLinkClass}>Home</NavLink>
          <NavLink to="/albums" className={navLinkClass}>Album</NavLink>
          <NavLink to="/playlists" className={navLinkClass}>Playlist</NavLink>
          <NavLink to="/songs" className={navLinkClass}>Songs</NavLink>
          {user ? (
            <div className="flex items-center gap-3 pl-4 border-l border-surface2">
              <label className="w-8 h-8 rounded-full bg-teal/20 text-teal flex items-center justify-center text-xs font-semibold overflow-hidden cursor-pointer" title="Upload profile image">
                {profileAvatar("w-8 h-8")}
                <input type="file" accept="image/*" onChange={handleProfileImage} className="hidden" />
              </label>
              <div className="leading-tight">
                <p className="text-xs text-muted">Signed in as</p>
                <p className="text-sm text-ink max-w-28 truncate">{user.name}</p>
              </div>
              <button onClick={logout} className="text-muted hover:text-amber transition" title="Log out" aria-label="Log out">
                <FiLogOut size={17} />
              </button>
              {profileError && <span className="absolute top-14 right-5 text-xs text-red-400">{profileError}</span>}
            </div>
          ) : (
            <Link to="/login" className="bg-amber text-base font-medium px-4 py-2 rounded-full hover:brightness-110 transition-transform active:scale-95">
              Log in
            </Link>
          )}
        </nav>

        <button className="md:hidden text-ink transition-transform active:scale-90" onClick={() => setMenuOpen((o) => !o)}>
          {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden px-5 pb-4 flex flex-col gap-3 border-t border-surface2 animate-fade-in-up">
          <form onSubmit={handleSearch} className="mt-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-full bg-surface border border-surface2 rounded-full py-2 px-4 text-sm focus:outline-none focus:border-amber"
            />
          </form>
          <Link to="/" onClick={() => setMenuOpen(false)} className="text-muted hover:text-ink">Home</Link>
          <Link to="/albums" onClick={() => setMenuOpen(false)} className="text-muted hover:text-ink">Album</Link>
          <Link to="/playlists" onClick={() => setMenuOpen(false)} className="text-muted hover:text-ink">Playlist</Link>
          <Link to="/songs" onClick={() => setMenuOpen(false)} className="text-muted hover:text-ink">Songs</Link>
          {user ? (
            <div className="flex items-center justify-between pt-3 border-t border-surface2">
              <div className="flex items-center gap-2">
                <label className="w-8 h-8 rounded-full bg-teal/20 text-teal flex items-center justify-center text-xs font-semibold overflow-hidden cursor-pointer" title="Upload profile image">
                  {profileAvatar("w-8 h-8")}
                  <input type="file" accept="image/*" onChange={handleProfileImage} className="hidden" />
                </label>
                <span className="text-sm text-ink truncate">{user.name}</span>
              </div>
              <button onClick={() => { logout(); setMenuOpen(false); }} className="flex items-center gap-2 text-muted hover:text-amber" title="Log out">
                <FiLogOut size={17} /> Log out
              </button>
            </div>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="text-amber">Log in</Link>
          )}
        </div>
      )}
    </header>
  );
}
