import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import PlayerBar from "./components/PlayerBar.jsx";
import Home from "./pages/Home.jsx";
import Search from "./pages/Search.jsx";
import Playlists from "./pages/Playlists.jsx";
import PlaylistDetail from "./pages/PlaylistDetail.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-base">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/playlists/:id" element={<PlaylistDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
      <PlayerBar />
    </div>
  );
}
