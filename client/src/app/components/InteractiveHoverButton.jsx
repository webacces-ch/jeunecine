import React from "react";
import { ArrowRight } from "lucide-react";

export const InteractiveHoverButton = React.forwardRef(
  ({ children, className = "", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`group relative w-auto cursor-pointer overflow-hidden rounded-full border border-indigo-600 bg-indigo-600 px-6 py-2 text-center font-semibold text-white shadow transition-transform duration-200 active:scale-95 hover:scale-105 ${className}`}
        {...props}
      >
        <div className="flex items-center gap-2">
          <span className="inline-block transition-all duration-300 group-hover:translate-x-10 group-hover:opacity-0">
            {children}
          </span>
        </div>
        <div className="absolute top-0 left-0 z-10 flex h-full w-full translate-x-10 items-center justify-center gap-2 text-white opacity-0 transition-all duration-300 group-hover:-translate-x-2 group-hover:opacity-100">
          <span>{children}</span>
          <ArrowRight />
        </div>
      </button>
    );
  }
);

InteractiveHoverButton.displayName = "InteractiveHoverButton";
