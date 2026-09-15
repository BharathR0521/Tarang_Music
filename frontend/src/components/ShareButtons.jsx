import { FiFacebook, FiTwitter, FiInstagram, FiLink } from "react-icons/fi";

// Simple social share row. Facebook and Twitter/X open a real share dialog.
// Instagram doesn't support web share links, so we copy the link instead
// and let the user paste it into an Instagram Story/DM/Bio.
export default function ShareButtons({ title, url }) {
  const shareUrl = url || window.location.href;
  const text = encodeURIComponent(`Listen to "${title}" on Tarang`);

  const openShare = (platformUrl) => window.open(platformUrl, "_blank", "noopener,noreferrer,width=600,height=500");

  const handleInstagram = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Link copied! Paste it into your Instagram Story, bio, or DM.");
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted">Share:</span>
      <button
        onClick={() => openShare(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`)}
        className="w-8 h-8 rounded-full bg-surface2 flex items-center justify-center text-muted hover:text-ink hover:bg-[#1877F2]/20 transition"
        title="Share on Facebook"
      >
        <FiFacebook size={14} />
      </button>
      <button
        onClick={() => openShare(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`)}
        className="w-8 h-8 rounded-full bg-surface2 flex items-center justify-center text-muted hover:text-ink hover:bg-[#1DA1F2]/20 transition"
        title="Share on Twitter / X"
      >
        <FiTwitter size={14} />
      </button>
      <button
        onClick={handleInstagram}
        className="w-8 h-8 rounded-full bg-surface2 flex items-center justify-center text-muted hover:text-ink hover:bg-[#E1306C]/20 transition"
        title="Share on Instagram"
      >
        <FiInstagram size={14} />
      </button>
      <button
        onClick={() => { navigator.clipboard.writeText(shareUrl); alert("Link copied!"); }}
        className="w-8 h-8 rounded-full bg-surface2 flex items-center justify-center text-muted hover:text-ink transition"
        title="Copy link"
      >
        <FiLink size={14} />
      </button>
    </div>
  );
}
