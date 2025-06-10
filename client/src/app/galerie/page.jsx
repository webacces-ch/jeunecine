"use client";
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Footer1 } from "../components/Footer1";
import { getApiUrl } from "../utils/api";

// Images par catégorie (exemple, à adapter si besoin)
const galerieData = [
  {
    year: "2022",
    images: [
      "/assets/maquette1.jpeg",
      "/assets/maquette2.jpeg",
      "/assets/maquette3.jpeg",
    ],
  },
  {
    year: "2023",
    images: [
      "/assets/maquette4.jpeg",
      "/assets/maquette5.jpeg",
      "/uploads/galerie/galerie-1748952920145-642094128.jpg",
      "/uploads/galerie/galerie-1748953054987-307767614.jpg",
      "/uploads/galerie/galerie-1748953054991-178127858.jpg",
      "/uploads/galerie/galerie-1748953054992-682369208.jpg",
      "/uploads/galerie/galerie-1748953064860-251702638.jpg",
      "/uploads/galerie/galerie-1748953067933-731304804.jpg",
    ],
  },
];

export default function GaleriePage() {
  const [modalImg, setModalImg] = useState(null);

  return (
    <div className="min-h-screen bg-[#ecedf6]">
      <Navbar />
      <div className="pt-24 pb-12 max-w-6xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-center mb-12 text-neutral-900">
          Galerie
        </h1>
        {galerieData.map((cat) => (
          <div key={cat.year} className="mb-16">
            <h2 className="text-3xl font-semibold mb-6 text-neutral-800">
              {cat.year}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {cat.images.map((img, i) => (
                <button
                  key={img + i}
                  className="group relative overflow-hidden rounded-xl border border-neutral-200 bg-white shadow hover:shadow-lg transition-all"
                  onClick={() => setModalImg(img)}
                  style={{ aspectRatio: "1/1" }}
                >
                  <img
                    src={img.startsWith("/uploads/") ? getApiUrl(img) : img}
                    alt={cat.year + "-" + i}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    style={{ maxHeight: 160 }}
                  />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Footer1 />

      {/* Modal d'agrandissement */}
      {modalImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setModalImg(null)}
        >
          <div
            className="relative max-w-3xl w-full p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 bg-white/80 hover:bg-white text-neutral-700 rounded-full p-2 shadow border border-neutral-200 z-10"
              onClick={() => setModalImg(null)}
              aria-label="Fermer"
            >
              <svg
                width="28"
                height="28"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <img
              src={
                modalImg.startsWith("/uploads/")
                  ? getApiUrl(modalImg)
                  : modalImg
              }
              alt="Agrandissement"
              className="w-full max-h-[80vh] object-contain rounded-xl bg-white"
            />
          </div>
        </div>
      )}
    </div>
  );
}
