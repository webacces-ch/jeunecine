"use client";
import { Button } from "@relume_io/relume-ui";
import React, { useRef } from "react";
import gsap from "gsap";

export function AnimatedButton({
  children,
  className = "",
  circleColor = "#4554AD",
  ...props
}) {
  const btnRef = useRef(null);
  const circleRef = useRef(null);

  // Animation du cercle au survol
  const handleMouseMove = (e) => {
    const btn = btnRef.current;
    const circle = circleRef.current;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.2;

    // Position relative au bouton
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // Décale le cercle pour que son centre soit sous le curseur
    gsap.to(circle, {
      x: x,
      y: y,
      scale: 1,
      opacity: 1,
      duration: 0.25,
      ease: "power2.out"
    });
  };

  // Reset à la sortie
  const handleMouseLeave = () => {
    const circle = circleRef.current;
    gsap.to(circle, {
      scale: 0,
      opacity: 0,
      duration: 0.25,
      ease: "power2.out",
      x: 0,
      y: 0,
    });
  };

  return (
    <div
      ref={btnRef}
      className={`relative inline-block overflow-hidden rounded-full group ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        borderRadius: "9999px",
      }}
    >
      {/* Cercle animé */}
      <span
        ref={circleRef}
        style={{
          pointerEvents: "none",
          position: "absolute",
          left: 0,
          top: 0,
          width: "0px",
          height: "0px",
          background: circleColor,
          borderRadius: "50%",
          transform: "scale(0)",
          opacity: 0,
          zIndex: 1,
          transition: "background 0.2s",
        }}
      />
      {/* Le bouton Relume */}
      <Button
        {...props}
        className="relative z-10 bg-transparent hover:bg-transparent focus:bg-transparent rounded-full px-6 py-3 font-medium"
        style={{
          borderRadius: "9999px",
        }}
      >
        {children}
      </Button>
    </div>
  );
}
