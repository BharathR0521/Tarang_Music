import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import PlayerBar from "./components/PlayerBar.jsx";
import Home from "./pages/Home.jsx";
import Search from "./pages/Search.jsx";
import Songs from "./pages/Songs.jsx";
import Playlists from "./pages/Playlists.jsx";
import PlaylistDetail from "./pages/PlaylistDetail.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

function AppRoutes() {
  const location = useLocation();

  return (
    <div key={location.key} className="page-transition">
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/songs" element={<Songs />} />
        <Route path="/albums" element={<Playlists type="album" />} />
        <Route path="/albums/:id" element={<PlaylistDetail />} />
        <Route path="/playlists" element={<Playlists type="playlist" />} />
        <Route path="/playlists/:id" element={<PlaylistDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-base">
      <Navbar />
      <main>
        <AppRoutes />
      </main>
      <PlayerBar />
    </div>
  );
}
