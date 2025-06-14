"use client";
import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { ImageUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { getApiUrl } from "../utils/api";

export default function FilmsPage() {
  const router = useRouter();
  const [films, setFilms] = useState([]);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [youtube, setYoutube] = useState("");
  const [description, setDescription] = useState("");
  const [filmImage, setFilmImage] = useState(null);
  const [filmVideo, setFilmVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);

  // Charger les films depuis l'API
  useEffect(() => {
    // Vérifie le token au chargement
    const token =
      typeof window !== "undefined" && localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    fetch(getApiUrl("/api/protected"), {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return fetch(getApiUrl("/api/films"), {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement des films");
        return res.json();
      })
      .then((data) => setFilms(Array.isArray(data) ? data : []))
      .catch(() => {
        localStorage.removeItem("token");
        router.replace("/login");
      });
  }, [router]);

  // Gestion du drag & drop image
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setFilmImage(file);
      setError("");
    } else {
      setError("Merci de déposer une image valide.");
      toast.error("Merci de déposer une image valide.");
    }
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
  };

  // Upload vidéo dès sélection
  const handleVideoSelect = (file) => {
    if (!file) return;
    setFilmVideo(file);
    setUploading(true);
    setUploadProgress(0);
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("video", file);
    const xhr = new window.XMLHttpRequest();
    xhr.open("POST", getApiUrl("/api/films/upload-video"));
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        setUploadProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    xhr.onload = () => {
      setUploading(false);
      setUploadProgress(0);
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          setVideoUrl(data.videoUrl || "");
          toast.success("Vidéo uploadée !");
        } catch {
          setError("Erreur lors de l'upload vidéo");
        }
      } else {
        setError("Erreur lors de l'upload vidéo");
      }
    };
    xhr.onerror = () => {
      setUploading(false);
      setError("Erreur réseau lors de l'upload vidéo");
    };
    xhr.send(formData);
  };

  // Ajout ou édition d'un film
  const handleAddFilm = async () => {
    setError("");
    if (!title.trim()) {
      setError("Le titre est requis.");
      toast.error("Le titre est requis.");
      return;
    }
    if (!filmImage && !editId) {
      setError("Dépose une image de film.");
      toast.error("Dépose une image de film.");
      return;
    }
    if (uploading) {
      setError("Attends la fin de l'upload vidéo.");
      toast.error("Attends la fin de l'upload vidéo.");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subtitle", subtitle);
      formData.append("youtube", youtube);
      formData.append("description", description);
      if (filmImage) formData.append("image", filmImage);
      if (videoUrl) formData.append("videoUrl", videoUrl);
      let url = getApiUrl("/api/films");
      let method = "POST";
      if (editId) {
        url = getApiUrl(`/api/films/${editId}`);
        method = "PUT";
      }
      const res = await fetch(url, {
        method,
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });
      let film;
      try {
        film = await res.json();
      } catch {
        throw new Error("Réponse du serveur invalide (ajout film)");
      }
      if (!res.ok) {
        throw new Error(
          film && film.error ? film.error : "Erreur lors de l'ajout du film"
        );
      }
      setFilms((f) => [film, ...f.filter((x) => x.id !== film.id)]);
      setTitle("");
      setSubtitle("");
      setYoutube("");
      setDescription("");
      setFilmImage(null);
      setFilmVideo(null);
      setVideoUrl("");
      setEditId(null);
      toast.success(editId ? "Film modifié !" : "Film ajouté !");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Pré-remplir le formulaire pour édition
  const handleEditFilm = (film) => {
    setEditId(film.id);
    setTitle(film.title || "");
    setSubtitle(film.subtitle || "");
    setYoutube(film.youtube || "");
    setDescription(film.description || "");
    setFilmImage(null);
  };

  // Suppression d'un film
  const handleDeleteFilm = async (id) => {
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(getApiUrl(`/api/films/${id}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erreur lors de la suppression");
      }
      setFilms((f) => f.filter((film) => film.id !== id));
      toast.success("Film supprimé");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      <label className="block mb-2 font-semibold text-neutral-800">
        Titre du film
      </label>
      <input
        className="w-full mb-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors border-[#C5C5C5] focus:ring-blue-200"
        placeholder="Titre"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label className="block mb-2 font-semibold text-neutral-800">
        Sous-titre{" "}
        <span className=" font-normal  text-sm">
          (environ 10 mots conseillés)
        </span>
      </label>
      <input
        className="w-full mb-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors border-[#C5C5C5] focus:ring-blue-200"
        placeholder="Sous-titre"
        value={subtitle}
        onChange={(e) => setSubtitle(e.target.value)}
      />
      <div className="text-sm text-gray-500 mb-2">
        {subtitle.split(/\s+/).filter((word) => word.length > 0).length}/10 mots
      </div>
      <label className="block mb-2 font-semibold text-neutral-800">
        Lien YouTube <span className=" font-normal  text-sm">(optionnel)</span>
      </label>
      <input
        className="w-full mb-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors border-[#C5C5C5] focus:ring-blue-200"
        placeholder="Lien YouTube"
        value={youtube}
        onChange={(e) => setYoutube(e.target.value)}
      />
      <label className="block mb-2 font-semibold text-neutral-800">
        Description
      </label>
      <textarea
        className="w-full mb-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors border-[#C5C5C5] focus:ring-blue-200 min-h-[100px]"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <label className="block mb-2 font-semibold text-neutral-800">
        Affiche du film
      </label>
      <div
        className={
          "flex flex-col items-center justify-center border-2 border-dashed rounded-2xl mb-4 transition-all duration-200 cursor-pointer border-[#C5C5C5] bg-neutral-50"
        }
        style={{ minHeight: 220 }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById("film-file-input").click()}
      >
        <input
          type="file"
          id="film-file-input"
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setFilmImage(e.target.files[0]);
            }
          }}
        />
        {filmImage ? (
          <img
            src={URL.createObjectURL(filmImage)}
            alt="preview"
            className="max-h-40 object-contain my-4 rounded-xl"
          />
        ) : editId ? (
          (() => {
            const film = films.find((f) => f.id === editId);
            if (film && film.imageUrl) {
              const url = film.imageUrl.startsWith("http")
                ? film.imageUrl
                : getApiUrl(film.imageUrl);
              return (
                <img
                  src={url}
                  alt="aperçu"
                  className="max-h-40 object-contain my-4 rounded-xl"
                />
              );
            }
            return (
              <span className="text-neutral-500 flex flex-col gap-4 justify-center items-center text-lg select-none">
                <ImageUp size={32} />
                Dépose ici l'affiche du film ou clique pour sélectionner
              </span>
            );
          })()
        ) : (
          <span className="text-neutral-400 flex flex-col gap-4 justify-center items-center select-none">
            <ImageUp size={32} />
            Dépose ici l'affiche du film ou clique pour sélectionner
          </span>
        )}
      </div>
      <label className="block mb-2 font-semibold text-neutral-800">
        Vidéo du film (max 10Go)
      </label>
      <div
        className={
          "flex flex-col items-center justify-center border-2 border-dashed rounded-2xl mb-4 transition-all duration-200 cursor-pointer border-[#C5C5C5] bg-neutral-50"
        }
        style={{ minHeight: 180 }}
        onClick={() => document.getElementById("film-video-input").click()}
      >
        <input
          type="file"
          id="film-video-input"
          className="hidden"
          accept="video/*"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleVideoSelect(e.target.files[0]);
            }
          }}
        />
        {filmVideo ? (
          <span className="text-neutral-700 my-2">{filmVideo.name}</span>
        ) : (
          <span className="text-neutral-400 flex flex-col justify-center items-center gap-4 select-none">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
              <path
                d="M17 16V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2Zm0 0 4 2V6l-4 2"
                stroke="#a3a3a3"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Dépose ici la vidéo du film ou clique pour sélectionner
          </span>
        )}
      </div>
      {uploading && (
        <div className="w-full mb-4">
          <div className="h-3 bg-neutral-300 rounded-full overflow-hidden">
            <div
              className="bg-neutral-900 h-3 rounded-full transition-all"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <div className="text-xs text-neutral-800 mt-1 text-right">
            {uploadProgress}%
          </div>
        </div>
      )}
      <button
        className={`w-full mb-8 py-3 rounded-xl font-semibold transition ${
          loading || !title.trim()
            ? "bg-neutral-400 text-neutral-600 cursor-not-allowed"
            : "bg-neutral-900 text-white hover:bg-neutral-800"
        }`}
        onClick={handleAddFilm}
        disabled={loading || !title.trim()}
      >
        {editId ? "Mettre à jour" : "Ajouter ce film"}
      </button>
      {editId && (
        <button
          type="button"
          className="mb-8 ml-2 text-red-500 font-semibold"
          onClick={() => {
            setEditId(null);
            setTitle("");
            setSubtitle("");
            setYoutube("");
            setDescription("");
            setFilmImage(null);
          }}
        >
          Annuler
        </button>
      )}
      {error && (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-700 border border-red-200">
          {error}
        </div>
      )}
      {Array.isArray(films) && films.length > 0 && (
        <div className="mt-8 overflow-x-auto">
          <h3 className="font-semibold mb-4 text-neutral-800">
            Liste des films
          </h3>
          <div className="rounded-xl border border-[#C5C5C5] bg-white overflow-x-auto">
            <table className="min-w-full text-left align-middle">
              <thead className="bg-neutral-100">
                <tr>
                  <th className="px-4 py-3 font-semibold">Affiche</th>
                  <th className="px-4 py-3 font-semibold">Titre</th>
                  <th className="px-4 py-3 font-semibold">Sous-titre</th>
                  <th className="px-4 py-3 font-semibold">YouTube</th>
                  <th className="px-4 py-3 font-semibold">Description</th>
                  <th className="px-4 py-3 font-semibold text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(films) &&
                  films.map((film) => (
                    <tr
                      key={film.id}
                      className="border-b last:border-b-0 align-top"
                    >
                      <td className="px-4 py-3">
                        {film.imageUrl && (
                          <img
                            src={
                              film.imageUrl && film.imageUrl.startsWith("http")
                                ? film.imageUrl
                                : film.imageUrl
                                ? getApiUrl(film.imageUrl)
                                : "/placeholder.png"
                            }
                            alt="affiche"
                            className="h-12 max-w-[120px] object-contain rounded bg-neutral-100 border border-[#C5C5C5]"
                          />
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-neutral-900">
                        {film.title}
                      </td>
                      <td className="px-4 py-3 text-neutral-700">
                        {film.subtitle}
                      </td>
                      <td className="px-4 py-3 break-all">
                        {film.youtube && (
                          <a
                            href={film.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            Lien
                          </a>
                        )}
                      </td>
                      <td className="px-4 py-3 max-w-xs truncate text-neutral-700">
                        {film.description}
                      </td>
                      <td className="px-4 py-3 flex gap-2 justify-center">
                        <button
                          className="px-3 py-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700"
                          onClick={() => handleEditFilm(film)}
                        >
                          Éditer
                        </button>
                        <button
                          className="px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700"
                          onClick={() => handleDeleteFilm(film.id)}
                        >
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
