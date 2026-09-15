// The Tarang brand mark: a small 3-bar equalizer + wordmark.
// "tarang" means "wave" — the bars are little sound waves.
export default function Logo({ size = "md" }) {
  const textSize = size === "lg" ? "text-3xl" : "text-xl";
  return (
    <div className="flex items-center gap-2 select-none">
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="1" y="8" width="4" height="13" rx="1.5" fill="#F4A94D" />
        <rect x="9" y="3" width="4" height="18" rx="1.5" fill="#F4A94D" />
        <rect x="17" y="11" width="4" height="10" rx="1.5" fill="#38BFA7" />
      </svg>
      <span className={`font-display font-semibold ${textSize} text-ink tracking-tight`}>
        tarang
      </span>
    </div>
  );
}
