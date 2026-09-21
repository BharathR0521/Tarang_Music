import { FiX } from "react-icons/fi";

export default function ImagePreview({ src, alt, onClose }) {
  if (!src) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="relative max-w-[92vw] max-h-[90vh] rounded-xl" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label={alt || "Cover image preview"}>
        <img src={src} alt={alt} className="block max-w-[92vw] max-h-[85vh] w-auto h-auto object-contain rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.6)]" />
        <button onClick={onClose} className="absolute -top-3 -right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-surface text-ink shadow-lg hover:bg-surface2" title="Close image" aria-label="Close image">
          <FiX size={18} />
        </button>
      </div>
    </div>
  );
}
