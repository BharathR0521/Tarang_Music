import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiDisc, FiHeadphones, FiList, FiMusic, FiPlay, FiPlus, FiX } from "react-icons/fi";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import { usePlayer } from "../context/PlayerContext.jsx";

function CollectionArtwork({ collection }) {
  const covers = collection.songs?.filter((song) => song?.coverImage).slice(0, 4) || [];

  return (
    <div className="collection-artwork relative aspect-square overflow-hidden rounded-xl bg-surface2 shadow-xl shadow-black/20">
      {collection.coverImage ? (
        <img src={collection.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      ) : covers.length ? (
        <div className="grid h-full w-full grid-cols-2">
          {covers.map((song) => <img key={song._id} src={song.coverImage} alt="" className="h-full w-full object-cover" />)}
          {covers.length === 1 && <div className="bg-surface2" />}
          {covers.length < 3 && <div className="bg-surface" />}
          {covers.length < 4 && <div className="bg-surface2" />}
        </div>
      ) : (
        <div className="flex h-full items-center justify-center bg-gradient-to-br from-teal/25 via-surface2 to-amber/20">
          {collection.type === "playlist" ? <FiHeadphones size={42} className="text-teal/80" /> : <FiDisc size={42} className="text-amber/80" />}
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70 transition-opacity group-hover:opacity-100" />
    </div>
  );
}

function CreateCollectionModal({ type, onClose, onCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const label = type === "album" ? "album" : "playlist";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", description.trim());
      formData.append("type", type);
      if (coverImage) formData.append("coverImage", coverImage);
      await api.post("/playlists", formData);
      await onCreated();
      onClose();
    } catch (createError) {
      setError(createError.response?.data?.message || `Could not create ${label}.`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm" onClick={onClose}>
      <form onSubmit={handleSubmit} className="modal-panel w-full max-w-md rounded-2xl border border-white/10 bg-surface p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="eyebrow">Make it yours</p>
            <h2 className="mt-1 text-2xl font-semibold text-ink">Create {label}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-muted transition hover:bg-white/10 hover:text-ink" aria-label="Close"><FiX size={18} /></button>
        </div>
        <div className="space-y-4">
          <label className="block text-xs text-muted">Name
            <input autoFocus required maxLength={80} value={name} onChange={(event) => setName(event.target.value)} placeholder={`Give your ${label} a name`} className="mt-1.5 w-full rounded-lg border border-white/10 bg-base px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:border-teal focus:outline-none" />
          </label>
          <label className="block text-xs text-muted">Description <span className="text-muted/70">(optional)</span>
            <textarea maxLength={300} rows={3} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What does this collection sound like?" className="mt-1.5 w-full resize-none rounded-lg border border-white/10 bg-base px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:border-teal focus:outline-none" />
          </label>
          <label className="block text-xs text-muted">Cover art <span className="text-muted/70">(optional)</span>
            <input type="file" accept="image/*" onChange={(event) => setCoverImage(event.target.files?.[0] || null)} className="mt-2 block w-full text-xs file:mr-3 file:rounded-full file:border-0 file:bg-teal file:px-4 file:py-2 file:font-medium file:text-base" />
          </label>
        </div>
        {error && <p role="alert" className="mt-4 text-sm text-red-300">{error}</p>}
        <button type="submit" disabled={saving || !name.trim()} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber px-5 py-3 text-sm font-semibold text-base transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50">
          <FiPlus size={16} /> {saving ? "Creating..." : `Create ${label}`}
        </button>
      </form>
    </div>
  );
}

export default function Playlists({ type = "playlist" }) {
  const { user } = useAuth();
  const { playSong } = usePlayer();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const loadCollections = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(`/playlists/mine?type=${type}`);
      setCollections(data);
    } catch (loadError) {
      setError(loadError.response?.data?.message || `Could not load ${type === "album" ? "albums" : "playlists"}.`);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    if (!user) {
      setCollections([]);
      setLoading(false);
      return;
    }
    loadCollections();
  }, [loadCollections, user]);

  const isAlbum = type === "album";
  const label = isAlbum ? "albums" : "playlists";
  const noun = isAlbum ? "album" : "playlist";

  return (
    <div className="mx-auto max-w-6xl px-5 pb-32 pt-8 md:pt-10 animate-fade-in-up">
      <section className="library-hero relative mb-8 overflow-hidden rounded-3xl border border-white/[0.08] px-6 py-8 md:px-10 md:py-10">
        <div className="relative z-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Your music, collected</p>
            <h1 className="mt-3 text-4xl font-semibold capitalize leading-tight text-ink md:text-5xl">{label}</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
              {isAlbum ? "Soundtracks and records you want to keep close." : "Your own soundtrack for every mood, moment, and memory."}
            </p>
          </div>
          {user && <button onClick={() => setShowCreate(true)} className="inline-flex items-center gap-2 rounded-full bg-amber px-5 py-3 text-sm font-semibold text-base shadow-lg shadow-amber/15 transition hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0"><FiPlus size={17} /> Create {noun}</button>}
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-2" aria-label="Collection type">
          <Link to="/albums" className={`rounded-full px-4 py-2 text-xs font-medium transition ${isAlbum ? "bg-ink text-base" : "border border-white/10 bg-white/[0.04] text-muted hover:text-ink"}`}>Albums</Link>
          <Link to="/playlists" className={`rounded-full px-4 py-2 text-xs font-medium transition ${!isAlbum ? "bg-ink text-base" : "border border-white/10 bg-white/[0.04] text-muted hover:text-ink"}`}>Playlists</Link>
        </div>
        <div className="library-hero-orb" aria-hidden="true" />
      </section>

      {!user ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-14 text-center">
          <FiHeadphones size={32} className="mx-auto text-teal" />
          <h2 className="mt-4 text-lg font-medium text-ink">Your collection starts here</h2>
          <p className="mt-2 text-sm text-muted">Log in to create and listen to your {label}.</p>
          <Link to="/login" className="mt-5 inline-flex rounded-full bg-amber px-5 py-2.5 text-sm font-semibold text-base transition hover:brightness-110">Log in</Link>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 5 }, (_, index) => <div key={index} className="rounded-2xl bg-white/[0.025] p-3"><div className="skeleton aspect-square rounded-xl" /><div className="skeleton mt-4 h-3 w-3/4 rounded-full" /><div className="skeleton mt-2 h-3 w-1/2 rounded-full" /></div>)}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-400/20 bg-red-400/5 p-5 text-sm text-red-200" role="alert">
          <p>{error}</p>
          <button onClick={loadCollections} className="mt-3 font-medium text-ink underline underline-offset-4">Try again</button>
        </div>
      ) : collections.length ? (
        <>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-semibold text-ink">Made for your life</h2>
              <p className="mt-1 text-xs text-muted">{collections.length} {collections.length === 1 ? noun : label}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {collections.map((collection, index) => {
              const songs = collection.songs?.filter(Boolean) || [];
              return (
                <article key={collection._id} className="collection-card group relative min-w-0 rounded-2xl border border-transparent p-3 transition duration-300 hover:-translate-y-1 hover:border-white/[0.08] hover:bg-white/[0.045]" style={{ "--delay": `${Math.min(index, 14) * 45}ms` }}>
                  <Link to={`/${isAlbum ? "albums" : "playlists"}/${collection._id}`} className="block" aria-label={`Open ${collection.name}`}>
                    <CollectionArtwork collection={collection} />
                    <h3 className="mt-4 truncate text-sm font-semibold text-ink">{collection.name}</h3>
                    <p className="mt-1 truncate text-xs text-muted">{songs.length} {songs.length === 1 ? "song" : "songs"}{collection.description ? ` · ${collection.description}` : ""}</p>
                  </Link>
                  {songs.length > 0 && <button onClick={() => playSong(songs[0], songs)} className="absolute bottom-[4.6rem] right-5 flex h-11 w-11 translate-y-2 items-center justify-center rounded-full bg-amber text-base opacity-0 shadow-xl shadow-black/30 transition duration-200 hover:scale-105 hover:brightness-110 group-hover:translate-y-0 group-hover:opacity-100 focus:translate-y-0 focus:opacity-100" aria-label={`Play ${collection.name}`}><FiPlay size={18} className="ml-0.5" /></button>}
                </article>
              );
            })}
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-14 text-center">
          {isAlbum ? <FiDisc size={34} className="mx-auto text-amber" /> : <FiList size={34} className="mx-auto text-teal" />}
          <h2 className="mt-4 text-lg font-medium text-ink">No {label} yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">{isAlbum ? "Start an album and gather the songs that belong together." : "Build a playlist for whatever you’re in the mood for."}</p>
          <button onClick={() => setShowCreate(true)} className="mt-5 inline-flex items-center gap-2 rounded-full bg-amber px-5 py-2.5 text-sm font-semibold text-base transition hover:brightness-110"><FiPlus size={16} /> Create your first {noun}</button>
        </div>
      )}
      {showCreate && <CreateCollectionModal type={type} onClose={() => setShowCreate(false)} onCreated={loadCollections} />}
    </div>
  );
}
