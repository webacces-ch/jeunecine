"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return "/placeholder.png";
  if (imageUrl.startsWith("http")) return imageUrl;
  return `http://localhost:4000${imageUrl}`;
};

export default function FilmPage() {
  const { id } = useParams();
  const [film, setFilm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`http://localhost:4000/api/films/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setFilm(data);
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-20 animate-pulse">
        <div className="h-64 bg-gray-200 rounded-2xl mb-8" />
        <div className="h-8 w-2/3 bg-gray-200 rounded mb-4" />
        <div className="h-4 w-1/3 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-1/4 bg-gray-200 rounded mb-6" />
        <div className="h-4 w-full bg-gray-200 rounded mb-2" />
        <div className="h-4 w-5/6 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-2/3 bg-gray-200 rounded mb-2" />
      </div>
    );
  }
  if (notFound || !film) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center text-gray-500">
        <p>Film introuvable.</p>
        <Link href="/" className="text-blue-600 underline mt-4 inline-block">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="w-full bg-white min-h-screen flex flex-col items-center justify-start pt-32 pb-12 px-2 sm:px-6">
        <article className="w-full max-w-3xl bg-white rounded-2xl shadow-xl px-6 sm:px-16 md:px-24 py-12 flex flex-col gap-8 mt-6 mb-10">
          <div className="flex justify-center items-center flex-col gap-3 mb-2">
            <div className="px-5 py-1 bg-neutral-200 rounded-full flex flex-row items-center">
              <span className="text-neutral-400 text-xs font-semibold font-inter leading-none">
                Film #{film.id}
              </span>
            </div>
          </div>

          <h1 className="text-center text-neutral-800 text-5xl font-semibold font-manrope leading-tight tracking-tight mb-2">
            {film.title}
          </h1>
          {film.subtitle && (
            <div
              className="text-center text-black text-base font-normal font-inter leading-tight opacity-80 mb-2 mx-auto justify-center"
              style={{ maxWidth: "700px", textAlign: "justify" }}
            >
              {film.subtitle}
            </div>
          )}
          <div className="w-full flex justify-center mb-6">
            <img
              src={getImageUrl(film.imageUrl)}
              alt={film.title}
              className="w-full h-96 object-cover rounded-xl bg-gray-100"
              style={{ maxHeight: 384 }}
            />
          </div>
          {film.youtube && (
            <div className="w-full flex justify-center mb-6">
              <iframe
                width="100%"
                height="400"
                src={film.youtube.replace("watch?v=", "embed/")}
                title={film.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-xl"
              ></iframe>
            </div>
          )}
          <div
            className="prose prose-neutral text-neutral-700 prose-lg max-w-none w-full mb-2 mx-auto justify-center leading-relaxed font-inter"
            style={{ fontSize: "1rem", maxWidth: "700px", lineHeight: "1.8" }}
          >
            {film.description}
          </div>
        </article>
      </div>
    </>
  );
}
