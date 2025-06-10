// Ce fichier n'est plus utilisé, voir /articles/[id]/page.jsx

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

// Utilitaires pour tags et couleurs (repris de Blog34)
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
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
const getImageUrl = (coverImage) => {
  if (!coverImage) return "/placeholder.png";
  if (coverImage.startsWith("http")) return coverImage;
  return `http://localhost:4000${
    coverImage.startsWith("/uploads/")
      ? coverImage
      : "/uploads/articles/" + coverImage
  }`;
};

export default function ArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`http://localhost:4000/api/articles/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setArticle(data);
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
  if (notFound || !article) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center text-gray-500">
        <p>Article introuvable.</p>
        <Link
          href="/actualites"
          className="text-blue-600 underline mt-4 inline-block"
        >
          Retour aux actualités
        </Link>
      </div>
    );
  }

  // Patch images dans le contenu (pour affichage correct)
  let content = article.content || "";
  content = content.replace(
    /src=["'](\/uploads\/[^"']+)["']/g,
    'src="http://localhost:4000$1"'
  );

  return (
    <article className="max-w-3xl mx-auto py-12 px-4 sm:px-0">
      <Link
        href="/actualites"
        className="text-blue-600 underline mb-8 inline-block"
      >
        ← Retour aux actualités
      </Link>
      <div className="rounded-2xl overflow-hidden shadow-lg mb-8">
        <img
          src={getImageUrl(article.coverImage)}
          alt={article.title}
          className="w-full h-80 object-cover bg-gray-100"
        />
      </div>
      {renderTags(article.tags)}
      <h1 className="text-4xl font-extrabold mb-2 text-gray-900">
        {article.title}
      </h1>
      <div className="flex items-center gap-4 mb-8 text-sm text-gray-500">
        <span>{formatDate(article.date)}</span>
        {article.author && <span>• Par {article.author}</span>}
      </div>
      <div
        className="prose max-w-none text-lg"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  );
}
