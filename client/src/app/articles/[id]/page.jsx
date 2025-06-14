import Navbar from "../../components/Navbar";
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
    "https://leonardwicki.emf-informatique.ch";
  return `${base}${
    coverImage.startsWith("/uploads/")
      ? coverImage
      : "/uploads/articles/" + coverImage
  }`;
};

export default async function ArticlePage({ params }) {
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
          href="/articles"
          className="text-blue-600 underline mt-4 inline-block"
        >
          Retour aux articles
        </Link>
      </div>
    );
  }

  // Patch images dans le contenu (pour affichage correct)
  let content = article.content || "";
  const base =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://leonardwicki.emf-informatique.ch";
  content = content.replace(
    /src=["'](\/uploads\/[^"']+)["']/g,
    `src="${base}$1"`
  );

  return (
    <>
      <Navbar />
      <div className="w-full bg-white min-h-screen flex flex-col items-center justify-start pt-32 pb-12 px-2 sm:px-6">
        <article className="w-full max-w-3xl bg-white rounded-2xl shadow-xl px-6 sm:px-16 md:px-24 py-12 flex flex-col gap-8 mt-6 mb-10">
          <div className="flex justify-center items-center flex-col gap-3 mb-2">
            <div className="px-5 py-1 bg-neutral-200 rounded-full flex flex-row items-center">
              <span className="text-neutral-400 text-xs font-semibold font-inter leading-none">
                {formatDate(article.date)}
              </span>
            </div>
            {renderTags(article.tags)}
          </div>

          <h1 className="text-center text-neutral-800 text-5xl font-semibold font-manrope leading-tight tracking-tight mb-2">
            {article.title}
          </h1>
          {article.summary && (
            <div
              className="text-center text-black text-base font-normal font-inter leading-tight opacity-80 mb-2 mx-auto justify-center"
              style={{ maxWidth: "700px", textAlign: "justify" }}
            >
              {article.summary}
            </div>
          )}
          <div className="w-full flex justify-center mb-6">
            <img
              src={getImageUrl(article.coverImage)}
              alt={article.title}
              className="w-full h-96 object-cover rounded-xl bg-gray-100"
              style={{ maxHeight: 384 }}
            />
          </div>
          <div
            className="prose prose-neutral text-neutral-700 prose-lg max-w-none w-full mb-2 mx-auto justify-center leading-relaxed font-inter"
            style={{
              fontSize: "1rem",
              maxWidth: "700px",
              lineHeight: "1.8",
            }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </article>
      </div>
    </>
  );
}
