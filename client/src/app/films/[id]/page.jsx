export const dynamicParams = false;

import Navbar from "../../components/Navbar";
import Link from "next/link";
import { getApiUrl } from "../../utils/api";

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return "/placeholder.png";
  if (imageUrl.startsWith("http")) return imageUrl;
  return getApiUrl(imageUrl);
};

export default async function FilmPage({ params }) {
  const { id } = params;
  let film = null;
  let notFound = false;
  try {
    const res = await fetch(getApiUrl(`/api/films/${id}`), {
      cache: "force-cache",
    });
    if (!res.ok) throw new Error();
    film = await res.json();
  } catch {
    notFound = true;
  }

  if (notFound || !film) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center text-gray-500">
        <p>Film introuvable.</p>
        <Link href="/" className="text-neutral-600 underline mt-4 inline-block">
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
          {/* Affichage vidéo uploadée si présente */}
          {film.videoUrl && (
            <div className="w-full flex justify-center mb-6">
              <video
                src={
                  film.videoUrl.startsWith("http")
                    ? film.videoUrl
                    : getImageUrl(film.videoUrl)
                }
                controls
                className="rounded-xl w-full max-h-[480px] bg-black"
                style={{ maxHeight: 480 }}
                poster={getImageUrl(film.imageUrl)}
              >
                Votre navigateur ne supporte pas la lecture vidéo.
              </video>
            </div>
          )}
          {/* Affichage bouton YouTube stylé si le lien est valide */}
          {film.youtube &&
            (() => {
              let videoId = null;
              const short = film.youtube.match(
                /youtu\.be\/([A-Za-z0-9_-]{11})/
              );
              const classic = film.youtube.match(/[?&]v=([A-Za-z0-9_-]{11})/);
              if (short) videoId = short[1];
              else if (classic) videoId = classic[1];
              if (videoId) {
                return (
                  <div className="w-full flex justify-center mb-6">
                    <a
                      href={`https://www.youtube.com/watch?v=${videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 border border-red-200 hover:border-red-300 hover:bg-red-50 rounded-2xl bg-white font-medium transition-colors duration-200 group"
                      style={{
                        textDecoration: "none",
                        minWidth: 220,
                        justifyContent: "center",
                      }}
                    >
                      Regarder sur{" "}
                      <span className="font-bold ml-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-7 h-7 text-red-500 mr-2"
                        >
                          <path d="M23.498 6.186a2.994 2.994 0 0 0-2.107-2.117C19.228 3.5 12 3.5 12 3.5s-7.228 0-9.391.569A2.994 2.994 0 0 0 .502 6.186C0 8.36 0 12 0 12s0 3.64.502 5.814a2.994 2.994 0 0 0 2.107 2.117C4.772 20.5 12 20.5 12 20.5s7.228 0 9.391-.569a2.994 2.994 0 0 0 2.107-2.117C24 15.64 24 12 24 12s0-3.64-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                      </span>
                    </a>
                  </div>
                );
              }
              return null;
            })()}
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
