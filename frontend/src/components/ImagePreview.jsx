import { FiX } from "react-icons/fi";

export default function ImagePreview({ src, alt, onClose }) {
  if (!src) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-5" onClick={onClose}>
      <div className="relative max-w-4xl max-h-[90vh]" onClick={(event) => event.stopPropagation()}>
        <img src={src} alt={alt} className="block max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-xl shadow-2xl" />
        <button onClick={onClose} className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-surface text-ink flex items-center justify-center hover:bg-surface2" title="Close image" aria-label="Close image">
          <FiX size={18} />
        </button>
      </div>
    </div>
  );
}
