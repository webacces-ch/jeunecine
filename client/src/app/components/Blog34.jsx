"use client";

import { Badge, Button } from "@relume_io/relume-ui";
import React, { useEffect, useState } from "react";
import { RxChevronRight } from "react-icons/rx";

export function Blog34() {
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Utilise la route publique (à adapter selon ton backend)
    fetch("https://leonardwicki.emf-informatique.ch:4000/api/articles")
      .then((res) => res.json())
      .then((data) => {
        const published = (data || [])
          .filter((a) => a.status === "published")
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .reverse(); // Pour avoir les plus récents en premier
        setPosts(published);
        setLoading(false);
      })
      .catch(() => {
        setPosts([]);
        setLoading(false);
      });
  }, []);

  // Utilitaire pour générer l'URL absolue de l'image
  const getImageUrl = (coverImage) => {
    if (!coverImage) return "/placeholder.png"; // Utilise un placeholder local pour éviter le CORS
    if (coverImage.startsWith("http")) return coverImage;
    return `https://leonardwicki.emf-informatique.ch:4000${
      coverImage.startsWith("/uploads/")
        ? coverImage
        : "/uploads/articles/" + coverImage
    }`;
  };

  // Utilitaire pour extraire un extrait du contenu (premières phrases ou 180 caractères)
  const getExcerpt = (content) => {
    if (!content) return "";
    // On retire les balises HTML si besoin
    const text = content.replace(/<[^>]+>/g, "");
    if (text.length <= 180) return text;
    return text.slice(0, 180) + "...";
  };

  // Utilitaire pour afficher les tags colorés (mêmes couleurs que dans l'admin, Tailwind)
  const TAILWIND_COLORS = [
    { bg: "bg-blue-100", text: "text-blue-800" },
    { bg: "bg-green-100", text: "text-green-800" },
    { bg: "bg-yellow-100", text: "text-yellow-800" },
    { bg: "bg-pink-100", text: "text-pink-800" },
    { bg: "bg-purple-100", text: "text-purple-800" },
    { bg: "bg-red-100", text: "text-red-800" },
    { bg: "bg-indigo-100", text: "text-indigo-800" },
    { bg: "bg-teal-100", text: "text-teal-800" },
    { bg: "bg-orange-100", text: "text-orange-800" },
    { bg: "bg-cyan-100", text: "text-cyan-800" },
    { bg: "bg-fuchsia-100", text: "text-fuchsia-800" },
    { bg: "bg-emerald-100", text: "text-emerald-800" },
    { bg: "bg-rose-100", text: "text-rose-800" },
    { bg: "bg-lime-100", text: "text-lime-800" },
    { bg: "bg-violet-100", text: "text-violet-800" },
  ];
  const tagColor = (tag) => {
    let hash = 0;
    for (let i = 0; i < tag.length; i++)
      hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    const idx = Math.abs(hash) % TAILWIND_COLORS.length;
    return TAILWIND_COLORS[idx];
  };

  // Affichage des tags colorés (vraiment ceux de l'article, pas mock)
  const renderTags = (tags) => {
    if (!tags || tags.length === 0) return null;
    // Si tags est un string JSON, on parse
    let tagArr = tags;
    if (typeof tags === "string") {
      try {
        tagArr = JSON.parse(tags);
      } catch {
        tagArr = [];
      }
    }
    if (!Array.isArray(tagArr)) return null;
    return (
      <div className="flex flex-wrap gap-1 mb-3">
        {tagArr.map((tag, i) => {
          const color = tagColor(tag);
          return (
            <span
              key={i}
              className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${color.bg} ${color.text}`}
            >
              {tag}
            </span>
          );
        })}
      </div>
    );
  };

  // Formattage date "il y a X jours" ou date longue
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return "Aujourd'hui";
    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Hier";
    if (diffDays < 7) return `il y a ${diffDays} jours`;
    // Sinon, date longue en français
    return (
      "le " +
      date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    );
  };

  return (
    <div className="w-full bg-neutral-50 py-12">
      <section id="blog" className="py-24 bg-neutral-50">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-5xl md:text-7xl font-semibold text-neutral-800 mb-4">
              Les dernières nouvelles
            </h2>
            <p className="text-md text-black opacity-80">
              Plongez dans nos projets récents, ateliers et événements à venir.
            </p>
          </div>

          {/* Cards */}
          <div className="flex gap-10 flex-row w-full justify-center">
            {loading ? (
              // Squelettes de chargement
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-gray-200 rounded-2xl h-96 shadow-md flex-1 min-w-0"
                  style={{ maxWidth: "420px" }}
                >
                  <div className="h-48 bg-gray-300 rounded-t-2xl" />
                  <div className="p-6 space-y-4">
                    <div className="h-4 w-24 bg-gray-300 rounded" />
                    <div className="h-6 w-40 bg-gray-300 rounded" />
                    <div className="h-4 w-32 bg-gray-300 rounded" />
                    <div className="h-10 w-28 bg-gray-300 rounded mt-6" />
                  </div>
                </div>
              ))
            ) : posts && posts.length > 0 ? (
              posts.slice(0, 3).map((post) => (
                <div
                  key={post.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-neutral-300 flex-1 min-w-0"
                  style={{ maxWidth: "340px", minHeight: "220px" }}
                >
                  <a
                    href={"/articles/" + post.id}
                    className="block overflow-hidden"
                  >
                    <div
                      className="w-full aspect-video bg-gray-100 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-500"
                      style={{ maxHeight: "160px" }}
                    >
                      <img
                        src={getImageUrl(post.coverImage)}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        style={{ minHeight: "160px", width: "100%" }}
                      />
                    </div>
                  </a>
                  <div className="p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-0 w-full">
                        {/* Tags à gauche */}
                        <div className="flex items-center gap-2">
                          {renderTags(post.tags)}
                        </div>
                        {/* Date à droite, centrée verticalement, toujours sur une ligne */}
                        <p className="text-xs text-gray-400 flex items-center gap-1 text-right whitespace-nowrap p-1 ">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-clock-icon lucide-clock"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          {post.time || formatDate(post.date)}
                        </p>
                      </div>
                      <a href={"/articles/" + post.id} className="block">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                          {post.title}
                        </h3>
                      </a>
                      <p className="text-gray-600 mb-4 text-sm leading-relaxed break-words">
                        {post.summary
                          ? post.summary.length > 100
                            ? post.summary.slice(0, 100) + "..."
                            : post.summary
                          : ""}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex-1 text-center text-gray-500 py-16">
                Aucun article disponible pour le moment.
              </div>
            )}
          </div>

          {/* Voir tout */}
          <div className="flex  justify-center mt-12">
            <a
              href="/articles"
              className="py-2 px-4 border border-neutral-300 rounded-2xl hover:bg-neutral-900 hover:text-neutral-100 font-semibold  transition-all"
            >
              Voir tous les articles
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
