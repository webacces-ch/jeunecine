"use client";
import React from "react";
import Link from "next/link";

export default function ArticleCard({ article }) {
  const getImageUrl = (coverImage) => {
    if (!coverImage) return "/placeholder.png";
    if (coverImage.startsWith("http")) return coverImage;
    return `https://leonardwicki.emf-informatique.ch${
      coverImage.startsWith("/uploads/")
        ? coverImage
        : "/uploads/articles/" + coverImage
    }`;
  };

  const getExcerpt = (content) => {
    if (!content) return "";
    const text = content.replace(/<[^>]+>/g, "");
    if (text.length <= 100) return text;
    return text.slice(0, 100) + "...";
  };

  // Calcul du temps de lecture (1 min pour 200 caractères)
  const getReadingTime = (content) => {
    if (!content) return "1 min";
    const text = content.replace(/<[^>]+>/g, "");
    const minutes = Math.max(1, Math.round(text.length / 200));
    return `${minutes} min`;
  };

  // Tags rendering (reprend Blog34)
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
  const renderTags = (tags) => {
    if (!tags || tags.length === 0) return null;
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
      <div className="flex flex-wrap gap-1 mb-2">
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

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-neutral-300 flex-1 min-w-0">
      <Link href={`/articles/${article.id}`} className="block overflow-hidden">
        <div className="w-full aspect-video bg-gray-100 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-500">
          <img
            src={getImageUrl(article.coverImage)}
            alt={article.title}
            className="w-full h-full object-cover"
            style={{ minHeight: "160px", width: "100%" }}
          />
        </div>
      </Link>
      <div className="p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between mb-0 w-full">
            <div className="flex items-center gap-2">
              {renderTags(article.tags)}
            </div>
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
              temps de lecture :{" "}
              {getReadingTime(article.summary || article.content)}
            </p>
          </div>
          <Link href={`/articles/${article.id}`} className="block">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
              {article.title}
            </h3>
          </Link>
          <p className="text-gray-600 mb-4 text-sm leading-relaxed break-words">
            {getExcerpt(article.summary || article.content)}
          </p>
        </div>
      </div>
    </div>
  );
}
