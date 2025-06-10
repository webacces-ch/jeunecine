import { useRef, useState } from "react";
import { ImageUp, XCircle } from "lucide-react";

export default function BetterImageDropzone({
  value,
  onChange,
  onRemove,
  label = "Déposez une image ici ou cliquez pour importer",
  height = 220,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef();
  const file = typeof value === "string" ? null : value;
  const imageUrl = file
    ? URL.createObjectURL(file)
    : typeof value === "string"
    ? value.startsWith("/uploads/")
      ? `https://leonardwicki.emf-informatique.ch:8080${value}`
      : value
    : null;

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      onChange(file);
    }
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleInput = (e) => {
    if (e.target.files?.[0]) {
      onChange(e.target.files[0]);
    }
  };
  return (
    <div
      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl mb-6 transition-all duration-200 cursor-pointer relative ${
        isDragging
          ? "border-blue-400 bg-blue-50"
          : "border-[#C5C5C5] bg-neutral-50"
      }`}
      style={{ minHeight: height }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => inputRef.current?.click()}
    >
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept="image/*"
        onChange={handleInput}
      />
      {imageUrl ? (
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={imageUrl}
            alt="Image de couverture"
            className="object-cover w-max-3xl h-60 rounded-2xl border border-neutral-200 shadow"
            style={{ maxHeight: height - 20 }}
          />
          <button
            className="absolute top-2 right-2 bg-white/80 hover:bg-white text-neutral-700 rounded-full p-1 shadow border border-neutral-200"
            onClick={(e) => {
              e.stopPropagation();
              onRemove && onRemove();
            }}
            title="Supprimer l'image"
          >
            <XCircle size={22} />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full select-none">
          <ImageUp size={48} className="mb-2 text-neutral-400" />
          <span className="text-neutral-500 font-medium">{label}</span>
        </div>
      )}
    </div>
  );
}
