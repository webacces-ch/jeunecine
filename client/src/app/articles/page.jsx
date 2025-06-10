"use client";
import { useEffect, useState } from "react";
import ArticleCard from "../components/ArticleCard";
import Navbar from "../components/Navbar";
import { getApiUrl } from "../utils/api";

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(getApiUrl("/api/articles"))
      .then((res) => res.json())
      .then((data) => {
        const published = (data || [])
          .filter((a) => a.status === "published")
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .reverse();
        setArticles(published);
        setLoading(false);
      })
      .catch(() => {
        setArticles([]);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white py-12 flex justify-center">
        <div className="w-full max-w-lg">
          <div className="pt-16 pb-10 flex flex-col items-center">
            <h1 className="mb-2 text-5xl md:text-7xl font-medium text-neutral-800 text-center">
              Articles
            </h1>
          </div>
          {loading ? (
            <div className="text-center text-gray-500 py-16">Chargement...</div>
          ) : articles.length === 0 ? (
            <div className="text-center text-gray-500 py-16">
              Aucun article disponible pour le moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
