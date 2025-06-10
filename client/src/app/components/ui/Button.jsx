import React from "react";

export function Button({ children, onClick, type = "button", className = "" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-6 py-3 flex gap-2 rounded-full bg-[var(--brand-500)] hover:bg-[var(--brand-600)] text-[var(--neutral-0)] ${className}`}
    >
      {children}
    </button>
  );
}
