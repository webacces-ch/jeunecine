import Link from "next/link";
import { getApiUrl } from "../../utils/api";

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
  // Correction cPanel/prod : utilise la même base que l'API
  const base =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://leonardwicki.emf-informatique.ch:4000";
  return `${base}${
    coverImage.startsWith("/uploads/")
      ? coverImage
      : "/uploads/articles/" + coverImage
  }`;
};

export default async function ActualitePage({ params }) {
  const { id } = params;
  let article = null;
  let notFound = false;
  try {
    const res = await fetch(getApiUrl(`/api/articles/${id}`), {
      cache: "force-cache",
    });
    if (!res.ok) throw new Error();
    article = await res.json();
  } catch {
    notFound = true;
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
  const base =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://leonardwicki.emf-informatique.ch:4000";
  content = content.replace(
    /src=["'](\/uploads\/[^"']+)["']/g,
    `src="${base}$1"`
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
