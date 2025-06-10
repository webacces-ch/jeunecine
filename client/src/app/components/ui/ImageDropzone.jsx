"use client";
import { useRef, useState } from "react";
import { XCircle, ImageUp } from "lucide-react";

export default function ImageDropzone({
  value,
  onChange,
  onRemove,
  label = "Déposez une image ici ou cliquez pour importer",
  className = "",
  height = 220,
  accept = "image/*",
  previewClass = "object-cover w-full h-60 rounded-2xl border border-neutral-200 shadow",
}) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef();

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onChange(e.dataTransfer.files[0]);
    }
  };
  const handleInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      onChange(e.target.files[0]);
    }
  };
  return (
    <div
      className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl transition-all duration-200 w-full cursor-pointer select-none ${
        dragActive
          ? "border-blue-500 bg-blue-50"
          : "border-neutral-200 bg-neutral-50"
      } ${className}`}
      style={{ minHeight: height }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleInput}
      />
      {value ? (
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={typeof value === "string" ? value : URL.createObjectURL(value)}
            alt="Image de couverture"
            className={previewClass}
            style={{ maxHeight: height - 20 }}
          />
          {onRemove && (
            <button
              className="absolute top-2 right-2 bg-white/80 hover:bg-white text-neutral-700 rounded-full p-1 shadow border border-neutral-200"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              title="Supprimer l'image"
            >
              <XCircle size={22} />
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full select-none">
          <ImageUp size={48} className="mb-2 text-neutral-400" />
          <span className="text-neutral-500 font-medium">{label}</span>
          <span className="text-xs text-neutral-400 mt-1">
            (JPG, PNG, GIF, ...)
          </span>
        </div>
      )}
    </div>
  );
}
