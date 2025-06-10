"use client";
import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";

export default function Films() {
  const carouselRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/api/films")
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

  // Helper pour récupérer la largeur d'une carte (incluant le gap)
  const getCardWidth = () => {
    if (!carouselRef.current) return 0;
    const firstCard = carouselRef.current.firstElementChild;
    if (!firstCard) return 0;
    const cardWidth = firstCard.getBoundingClientRect().width;
    const gapStr =
      window.getComputedStyle(carouselRef.current).gap.split(" ")[0] || "0px";
    const gap = parseInt(gapStr.replace("px", ""), 10);
    return cardWidth + gap;
  };

  const scrollToNext = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    const cardWidth = getCardWidth();

    if (scrollLeft + clientWidth >= scrollWidth - cardWidth) {
      carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      carouselRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
    }
  };

  const scrollToPrev = () => {
    if (!carouselRef.current) return;
    const cardWidth = getCardWidth();
    if (carouselRef.current.scrollLeft <= 0) {
      carouselRef.current.scrollTo({
        left: carouselRef.current.scrollWidth,
        behavior: "smooth",
      });
    } else {
      carouselRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" });
    }
  };

  const handlePause = () => setIsPaused(true);
  const handleResume = () => setIsPaused(false);

  return (
    <div className="w-full bg-neutral-50 py-12">
      <section className="w-full px-0 py-8 flex flex-col items-center justify-center bg-neutral-50">
        <h1 className="text-6xl md:text-8xl font-bold mb-8 text-[#222222]">
          Films
        </h1>

        <div className="relative w-full">
          <div
            ref={carouselRef}
            className="flex justify-center overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-6 pl-6 pr-12 sm:pr-24 scrollbar-hide"
          >
            {loading ? (
              <div className="w-full flex justify-center items-center h-40 text-neutral-400 text-xl">
                Chargement...
              </div>
            ) : films.length === 0 ? (
              <div className="w-full flex justify-center items-center h-40 text-neutral-400 text-xl">
                Aucun film
              </div>
            ) : (
              films.map((film, idx) => (
                <Link
                  key={film.id}
                  href={`/films/${film.id}`}
                  className={`shrink-0 px-4 py-6 inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden rounded-3xl shadow w-[80vw] sm:w-[288px] max-w-[288px] min-w-[80vw] sm:min-w-[288px] snap-start bg-transparent hover:bg-neutral-100 transition`}
                  style={{ textDecoration: "none" }}
                >
                  <div className="w-full aspect-[222/131] relative rounded-3xl overflow-hidden">
                    <img
                      className="absolute inset-0 w-full h-full object-cover rounded-3xl shadow-[0px_2px_10.1px_2px_rgba(0,0,0,0.15)]"
                      src={
                        film.imageUrl
                          ? film.imageUrl.startsWith("http")
                            ? film.imageUrl
                            : `http://localhost:4000${film.imageUrl}`
                          : "/placeholder.png"
                      }
                      alt={film.title}
                    />
                  </div>
                  <div className="inline-flex justify-start items-start gap-2.5 w-full">
                    <div className="text-neutral-500 text-4xl font-bold font-['Inter'] self-start">
                      {idx + 1}
                    </div>
                    <div className="inline-flex flex-col justify-start items-start gap-0.5 w-full">
                      <div className="text-black text-base font-semibold font-['Inter']">
                        {film.title}
                      </div>
                      <div className="text-black text-xs font-normal font-['Inter']">
                        {film.subtitle}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
          {/* Dégradé de fondu à droite */}
          <div className="pointer-events-none absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-[#ecedf6] to-transparent" />
        </div>

        {/* Bouton "Tous les films" */}
        <div className="flex justify-center mt-4">
          <Link
            href="/films"
            className="bg-transparent py-2 px-6 transition-colors duration-300 hover:bg-neutral-800 hover:text-white border border-[#D5D5D5] text-[#222222] rounded-2xl font-medium w-full sm:w-auto text-center"
          >
            Tous les films
          </Link>
        </div>
      </section>
    </div>
  );
}
