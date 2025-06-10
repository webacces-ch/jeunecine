"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "../components/AdminSidebar";
import { ArticleEditor } from "../components/ArticleEditor";
import {
  Pencil,
  Trash2,
  Plus,
  Upload,
  ArrowLeft,
  LogOut,
  Settings,
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import SponsorPage from "./SponsorPage";
import FilmsPage from "./FilmsPage";
import ProfilePage from "./ProfilePage";

export default function AdminPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tab, setTab] = useState("drafts");
  const [drafts, setDrafts] = useState([]);
  const [published, setPublished] = useState([]);
  const [mode, setMode] = useState("list");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  // Vérifie le token JWT au chargement et charge les articles
  useEffect(() => {
    const token =
      typeof window !== "undefined" && localStorage.getItem("token");
    if (!token) {
      setIsRedirecting(true);
      router.replace("/login");
      return;
    }
    fetch("http://localhost:4000/api/protected", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return fetch("http://localhost:4000/api/articles", {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then((res) => res.json())
      .then((articles) => {
        setDrafts(articles.filter((a) => a.status === "draft"));
        setPublished(articles.filter((a) => a.status === "published"));
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setIsRedirecting(true);
        router.replace("/login");
      });
  }, [router]);

  // Charger l'utilisateur connecté
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch {
        setUser(null);
      }
    } else {
      const token = localStorage.getItem("token");
      if (token) {
        fetch("http://localhost:4000/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => {
            setUser(data);
            localStorage.setItem("user", JSON.stringify(data));
          });
      }
    }
  }, []);

  // Gestion du clic en dehors du menu profil
  useEffect(() => {
    if (!profileMenuOpen) return;
    function handleClick(e) {
      if (
        !document.getElementById("profile-menu")?.contains(e.target) &&
        !document.getElementById("profile-pic")?.contains(e.target)
      ) {
        setProfileMenuOpen(false);
      }
    }
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [profileMenuOpen]);

  const editingArticle = (tab === "drafts" ? drafts : published).find(
    (a) => a.id === editingId
  );

  // Actions CRUD
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    toast("Suppression en cours...", {
      icon: "🗑️",
      style: { borderRadius: "10px", background: "#222", color: "#fff" },
    });
    const res = await fetch(`http://localhost:4000/api/articles/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      toast("Article supprimé !", {
        icon: "✅",
        style: { borderRadius: "10px", background: "#222", color: "#fff" },
      });
      setDrafts((arts) => arts.filter((a) => a.id !== id));
      setPublished((arts) => arts.filter((a) => a.id !== id));
    } else {
      toast("Erreur lors de la suppression", {
        icon: "⚠️",
        style: { borderRadius: "10px", background: "#222", color: "#fff" },
      });
    }
  };

  const handlePublish = async (id) => {
    const token = localStorage.getItem("token");
    const art = drafts.find((a) => a.id === id);
    if (!art) return;
    toast("Publication en cours...", {
      icon: "🚀",
      style: { borderRadius: "10px", background: "#222", color: "#fff" },
    });
    const updated = { ...art, status: "published", date: formatDate(art.date) };
    const res = await fetch(`http://localhost:4000/api/articles/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updated),
    });
    if (res.ok) {
      toast("Article publié !", {
        icon: "✅",
        style: { borderRadius: "10px", background: "#222", color: "#fff" },
      });
      setDrafts((ds) => ds.filter((a) => a.id !== id));
      setPublished((ps) => [...ps, updated]);
    } else {
      toast("Erreur lors de la publication", {
        icon: "⚠️",
        style: { borderRadius: "10px", background: "#222", color: "#fff" },
      });
    }
  };

  const formatDate = (d) => {
    if (!d) return new Date().toISOString().slice(0, 10);
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
    return d.slice(0, 10);
  };

  // Table rendering
  const renderTable = (articles, isDrafts) => (
    <div className="rounded-xl border border-neutral-200 shadow bg-white overflow-hidden">
      <table className="min-w-full text-left rounded-xl overflow-hidden">
        <thead className="bg-neutral-100">
          <tr>
            <th className="px-4 py-3 font-semibold">Cover</th>
            <th className="px-6 py-3 font-semibold">Titre</th>
            <th className="px-6 py-3 font-semibold">Auteur</th>
            <th className="px-6 py-3 font-semibold">Date</th>
            <th className="px-6 py-3 font-semibold text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr key={article.id} className="border-b last:border-b-0">
              <td className="px-4 py-3">
                {article.coverImage ? (
                  <img
                    src={
                      article.coverImage.startsWith("http")
                        ? article.coverImage
                        : `http://localhost:4000${
                            article.coverImage.startsWith("/uploads/")
                              ? article.coverImage
                              : "/uploads/articles/" + article.coverImage
                          }`
                    }
                    alt="cover"
                    className="h-12 w-20 object-cover rounded border border-neutral-200 bg-neutral-100"
                  />
                ) : (
                  <div className="h-12 w-20 flex items-center justify-center rounded border border-neutral-200 bg-neutral-100">
                    <svg
                      width="32"
                      height="32"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="#bbb"
                    >
                      <rect
                        x="4"
                        y="4"
                        width="16"
                        height="16"
                        rx="3"
                        strokeWidth="2"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 16l2.5-3.5a1 1 0 011.6 0L15 16m-7-6h.01"
                      />
                    </svg>
                  </div>
                )}
              </td>
              <td className="px-6 py-4">{article.title}</td>
              <td className="px-6 py-4">{article.author}</td>
              <td className="px-6 py-4">{formatDate(article.date)}</td>
              <td className="px-6 py-4 flex gap-2 justify-center">
                <button
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800"
                  onClick={() => {
                    setEditingId(article.id);
                    setMode("edit");
                  }}
                >
                  <Pencil size={20} />
                </button>
                {isDrafts && (
                  <button
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-100 hover:bg-green-200 text-green-700"
                    onClick={() => handlePublish(article.id)}
                  >
                    <Upload size={20} />
                  </button>
                )}
                <button
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700"
                  onClick={() => handleDelete(article.id)}
                >
                  <Trash2 size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (isRedirecting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="animate-spin mb-4" size={48} />
        <span className="text-lg text-neutral-700">Redirection...</span>
      </div>
    );
  }

  // Squelettes de chargement pour les articles
  if (loading) {
    return (
      <>
        <Toaster position="bottom-right" />
        <main className="flex h-screen overflow-hidden bg-white">
          <AdminSidebar
            open={sidebarOpen}
            setOpen={setSidebarOpen}
            tab={tab}
            setTab={setTab}
          />
          <div
            className={`main-content flex flex-col w-full transition-all duration-300 ${
              sidebarOpen ? "pl-64" : "pl-16"
            }`}
          >
            <header className="flex items-center justify-between bg-white px-8 py-4 h-[72px] shadow-sm">
              <span className="font-semibold text-lg text-neutral-800">
                Panel Admin
              </span>
              <div className="flex items-center gap-4">
                {user && (
                  <span
                    className="font-semibold text-neutral-900 text-base max-w-[160px] truncate"
                    title={user.name || user.username}
                  >
                    {user.name || user.username}
                  </span>
                )}
                <div className="relative">
                  <button
                    id="profile-pic"
                    className="w-10 h-10 rounded-full border border-[#C5C5C5] bg-gray-100 overflow-hidden flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <img
                      src="/Frame 45.png"
                      alt="Profil"
                      className="object-cover w-full h-full"
                    />
                  </button>
                </div>
              </div>
            </header>
            <div className="main-container flex-1 min-h-0 overflow-auto border-l border-t rounded-tl-2xl border-[#c5c5c5] bg-white">
              <div className="content-container contenu flex-1 overflow-y-auto p-12">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex gap-2">
                    <button
                      className={`px-4 py-2 rounded-lg font-semibold transition ${
                        tab === "drafts"
                          ? "bg-neutral-900 text-white"
                          : "bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
                      }`}
                    >
                      Brouillons
                    </button>
                    <button
                      className={`px-4 py-2 rounded-lg font-semibold transition ${
                        tab === "published"
                          ? "bg-neutral-900 text-white"
                          : "bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
                      }`}
                    >
                      Publiés
                    </button>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-700 transition">
                    <Plus size={18} /> Ajouter un article
                  </button>
                </div>
                <div className="rounded-xl border border-neutral-200 shadow bg-white overflow-hidden">
                  <table className="min-w-full text-left rounded-xl overflow-hidden">
                    <thead className="bg-neutral-100">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Cover</th>
                        <th className="px-6 py-3 font-semibold">Titre</th>
                        <th className="px-6 py-3 font-semibold">Auteur</th>
                        <th className="px-6 py-3 font-semibold">Date</th>
                        <th className="px-6 py-3 font-semibold text-center">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(5)].map((_, i) => (
                        <tr key={i} className="border-b last:border-b-0">
                          <td className="px-4 py-3">
                            <div className="h-12 w-20 bg-neutral-200 rounded animate-pulse" />
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 w-24 bg-neutral-200 rounded animate-pulse" />
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 w-20 bg-neutral-200 rounded animate-pulse" />
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 w-16 bg-neutral-200 rounded animate-pulse" />
                          </td>
                          <td className="px-6 py-4 flex gap-2 justify-center">
                            <div className="h-8 w-8 bg-neutral-200 rounded-lg animate-pulse" />
                            <div className="h-8 w-8 bg-neutral-200 rounded-lg animate-pulse" />
                            <div className="h-8 w-8 bg-neutral-200 rounded-lg animate-pulse" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Toaster position="bottom-right" />
      {/* Layout principal */}
      <main className="flex h-screen overflow-hidden bg-white">
        {/* Sidebar fixe */}
        <AdminSidebar
          open={sidebarOpen}
          setOpen={setSidebarOpen}
          tab={tab}
          setTab={setTab}
        />

        {/* Contenu principal */}
        <div
          className={`main-content flex flex-col w-full transition-all duration-300 ${
            sidebarOpen ? "pl-64" : "pl-16"
          }`}
        >
          {/* Navbar */}
          <header className="flex items-center justify-between bg-white px-8 py-4 h-[72px] shadow-sm">
            <span className="font-semibold text-lg text-neutral-800">
              Panel Admin
            </span>
            <div className="flex items-center gap-4">
              {user && (
                <span
                  className="font-semibold text-neutral-900 text-base max-w-[160px] truncate"
                  title={user.name || user.username}
                >
                  {user.name || user.username}
                </span>
              )}
              <div className="relative">
                <button
                  id="profile-pic"
                  className="w-10 h-10 rounded-full border border-[#C5C5C5] bg-gray-100 overflow-hidden flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onClick={() => setProfileMenuOpen((v) => !v)}
                >
                  <img
                    src="/Frame 45.png"
                    alt="Profil"
                    className="object-cover w-full h-full"
                  />
                </button>
                {profileMenuOpen && (
                  <div
                    id="profile-menu"
                    className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50 py-2"
                  >
                    <button
                      className="w-full flex items-center gap-2 px-4 py-2 text-neutral-800 hover:bg-neutral-100 rounded-xl"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        setShowProfile(true);
                      }}
                    >
                      <Settings size={18} /> Modifier le profil
                    </button>
                    <button
                      className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-neutral-100 rounded-xl"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        window.location.href = "/login";
                      }}
                    >
                      <LogOut size={18} /> Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Zone qui cache la partie scrollable */}
          <div
            className="main-container flex-1 min-h-0 overflow-auto
                 border-l border-t rounded-tl-2xl border-[#c5c5c5] bg-white"
          >
            {/* Contenu principal AVEC scroll */}
            <div className="content-container contenu flex-1 overflow-y-auto p-12">
              {showProfile ? (
                <ProfilePage
                  onClose={() => setShowProfile(false)}
                  onUpdate={(data) => {
                    setUser(data);
                    setShowProfile(false);
                  }}
                />
              ) : tab === "sponsor" ? (
                <SponsorPage />
              ) : tab === "films" ? (
                <FilmsPage />
              ) : mode === "list" ? (
                <>
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex gap-2">
                      <button
                        className={`px-4 py-2 rounded-lg font-semibold transition ${
                          tab === "drafts"
                            ? "bg-neutral-900 text-white"
                            : "bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
                        }`}
                        onClick={() => setTab("drafts")}
                      >
                        Brouillons
                      </button>
                      <button
                        className={`px-4 py-2 rounded-lg font-semibold transition ${
                          tab === "published"
                            ? "bg-neutral-900 text-white"
                            : "bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
                        }`}
                        onClick={() => setTab("published")}
                      >
                        Publiés
                      </button>
                    </div>
                    <button
                      className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-700 transition"
                      onClick={() => {
                        setMode("create");
                        setEditingId(null);
                      }}
                    >
                      <Plus size={18} /> Ajouter un article
                    </button>
                  </div>
                  {tab === "drafts"
                    ? renderTable(drafts, true)
                    : renderTable(published, false)}
                </>
              ) : (
                <div>
                  <button
                    className="px-4 py-2 flex gap-2 items-center rounded-lg font-semibold transition bg-neutral-100 text-neutral-900 hover:bg-neutral-200 mb-6"
                    onClick={() => setMode("list")}
                  >
                    <ArrowLeft size={18} /> Retour à la liste
                  </button>
                  <ArticleEditor
                    article={editingArticle}
                    mode={mode}
                    onSave={() => {
                      setMode("list");
                      // Recharge les articles après création/édition
                      const token = localStorage.getItem("token");
                      fetch("http://localhost:4000/api/articles", {
                        headers: { Authorization: `Bearer ${token}` },
                      })
                        .then((res) => res.json())
                        .then((articles) => {
                          setDrafts(
                            articles.filter((a) => a.status === "draft")
                          );
                          setPublished(
                            articles.filter((a) => a.status === "published")
                          );
                        });
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
