"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return "/placeholder.png";
  if (imageUrl.startsWith("http")) return imageUrl;
  // Utilise le backend Node.js pour servir les images
  const backend = process.env.NEXT_PUBLIC_API_URL || "https://api.jeunecine.ch";
  return `${backend}${imageUrl}`;
};

export default function FilmsListPage() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://leonardwicki.emf-informatique.ch/api/films")
      .then((res) => res.json())
      .then((data) => {
        setFilms(data);
        setLoading(false);
      })
      .catch(() => {
        setFilms([]);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white py-12 flex flex-col items-center">
        <div className="w-full max-w-5xl px-4">
          <div className="pt-16 pb-10 flex flex-col items-center">
            <h1 className="mb-2 text-5xl md:text-7xl font-medium text-neutral-800 text-center">
              Tous les films
            </h1>
          </div>
          {loading ? (
            <div className="w-full flex justify-center items-center h-40 text-neutral-400 text-xl">
              Chargement...
            </div>
          ) : films.length === 0 ? (
            <div className="w-full flex justify-center items-center h-40 text-neutral-400 text-xl">
              Aucun film
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-center">
              {films.map((film) => (
                <Link
                  key={film.id}
                  href={`/films/${film.id}`}
                  className="flex flex-col rounded-2xl shadow hover:shadow-lg transition bg-neutral-50 border border-neutral-200 overflow-hidden h-full"
                  style={{ textDecoration: "none" }}
                >
                  <div className="w-full aspect-[222/131] relative">
                    <img
                      src={getImageUrl(film.imageUrl)}
                      alt={film.title}
                      className="w-full h-full object-cover rounded-t-2xl"
                    />
                  </div>
                  <div className="p-4 flex flex-col gap-1 flex-1">
                    <div className="text-lg font-semibold text-neutral-800">
                      {film.title}
                    </div>
                    <div className="text-sm text-neutral-500">
                      {film.subtitle}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
