"use client";
import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { ImageUp } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SponsorPage() {
  const router = useRouter();
  const [sponsors, setSponsors] = useState([]);
  const [sponsorLink, setSponsorLink] = useState("");
  const [sponsorImage, setSponsorImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [linkError, setLinkError] = useState("");

  // Fonction pour valider l'URL (sans https://, on l'ajoute nous-même)
  const validateUrl = (url) => {
    if (!url.trim()) {
      return { isValid: false, error: "Le lien est requis." };
    }
    // On ajoute https:// pour la validation
    try {
      const fullUrl = "https://" + url;
      const parsed = new URL(fullUrl);
      // Vérifie qu'il y a bien un point dans le domaine (xxx.xx)
      const host = parsed.hostname;
      if (!/\.[a-zA-Z]{2,}$/.test(host)) {
        return {
          isValid: false,
          error: "Le domaine doit contenir un point (ex: .com, .fr)",
        };
      }
      return { isValid: true, error: "" };
    } catch {
      return { isValid: false, error: "Format d'URL invalide." };
    }
  };

  // Charger les sponsors depuis l'API
  useEffect(() => {
    // Vérifie le token au chargement
    const token =
      typeof window !== "undefined" && localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    fetch("http://localhost:4000/api/protected", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return fetch("http://localhost:4000/api/sponsors", {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement des sponsors");
        return res.json();
      })
      .then((data) => {
        // Correction : chaque sponsor doit avoir sp.image = chemin public
        setSponsors(
          data.map((sp) => ({
            ...sp,
            image: sp.imageUrl?.startsWith("/sponsors/")
              ? sp.imageUrl
              : `/sponsors/${sp.imageUrl}`,
          }))
        );
      })
      .catch(() => {
        localStorage.removeItem("token");
        router.replace("/login");
      });
  }, [router]);

  const handleLinkChange = (e) => {
    const value = e.target.value;
    setSponsorLink(value);
    // Valider l'URL en temps réel
    if (value.trim()) {
      const validation = validateUrl(value);
      setLinkError(validation.error);
    } else {
      setLinkError("");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setSponsorImage(file);
      setError("");
    } else {
      setError("Merci de déposer une image valide.");
      toast.error("Merci de déposer une image valide.");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleAddSponsor = async () => {
    setError("");
    // Valider l'URL
    const urlValidation = validateUrl(sponsorLink);
    if (!urlValidation.isValid) {
      setLinkError(urlValidation.error);
      toast.error(urlValidation.error);
      return;
    }
    if (!sponsorImage) {
      setError("Dépose une image de sponsor.");
      toast.error("Dépose une image de sponsor.");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("image", sponsorImage);
      // Ajoute https:// devant le lien
      formData.append("link", "https://" + sponsorLink);

      const res = await fetch("http://localhost:4000/api/sponsors", {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });
      let sponsor;
      try {
        sponsor = await res.json();
      } catch {
        throw new Error("Réponse du serveur invalide (ajout sponsor)");
      }
      if (!res.ok) {
        throw new Error(
          sponsor && sponsor.error
            ? sponsor.error
            : "Erreur lors de l'ajout du sponsor"
        );
      }
      // Correction : garantir que sponsor.image est bien l'URL publique
      setSponsors((s) => [
        {
          ...sponsor,
          image: sponsor.imageUrl?.startsWith("/sponsors/")
            ? sponsor.imageUrl
            : `/sponsors/${sponsor.imageUrl}`,
        },
        ...s,
      ]);
      setSponsorImage(null);
      setSponsorLink("");
      setLinkError("");
      toast.success("Sponsor ajouté !");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSponsor = async (id) => {
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/api/sponsors/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erreur lors de la suppression");
      }
      setSponsors((s) => s.filter((sp) => sp.id !== id));
      toast.success("Sponsor supprimé");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      <label className="block mb-2 font-semibold text-neutral-800">
        Lien vers le sponsor
      </label>
      <div
        className={`flex mb-2 ${
          linkError ? "border-red-400" : "border-[#C5C5C5]"
        }`}
      >
        <span
          className={`inline-flex items-center px-3 rounded-l-lg border border-r-0 ${
            linkError
              ? "border-red-400 bg-red-50 text-red-600"
              : "border-[#C5C5C5] bg-neutral-100"
          } text-neutral-500 select-none`}
        >
          https://
        </span>
        <input
          type="text"
          className={`w-full px-4 py-2 border rounded-r-lg focus:outline-none focus:ring-0 transition-colors ${
            linkError
              ? "border-red-400 bg-red-50 text-red-600"
              : "border-[#C5C5C5] bg-neutral-50 text-neutral-900"
          }`}
          placeholder="site-du-sponsor.com"
          value={sponsorLink}
          onChange={handleLinkChange}
        />
      </div>
      {linkError && (
        <div className="mb-4 p-2 text-sm rounded bg-red-100 text-red-700 border border-red-200">
          {linkError}
        </div>
      )}
      {!linkError && sponsorLink && validateUrl(sponsorLink).isValid && (
        <div className="mb-4 p-2 text-sm rounded bg-green-100 text-green-700 border border-green-200">
          ✓ URL valide
        </div>
      )}
      <div
        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl mb-4 transition-all duration-500 cursor-pointer ${
          isDragging
            ? "border-blue-400 bg-blue-50"
            : "border-[#C5C5C5] bg-neutral-50"
        }`}
        style={{ minHeight: 220 }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById("sponsor-file-input").click()}
      >
        <input
          type="file"
          id="sponsor-file-input"
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setSponsorImage(e.target.files[0]);
            }
          }}
        />
        {sponsorImage ? (
          <img
            src={URL.createObjectURL(sponsorImage)}
            alt="Sponsor preview"
            className="max-h-40 object-contain my-4"
          />
        ) : (
          <span className="text-neutral-500 flex flex-col justify-center items-center text-lg select-none">
            <ImageUp size={48} />
            Dépose ici le logo du sponsor
          </span>
        )}
      </div>
      <button
        className={`w-full mb-8 py-3 rounded-xl font-semibold transition ${
          loading || linkError || !sponsorLink.trim()
            ? "bg-neutral-400 text-neutral-600 cursor-not-allowed"
            : "bg-neutral-900 text-white hover:bg-neutral-800"
        }`}
        onClick={handleAddSponsor}
        disabled={loading || !!linkError || !sponsorLink.trim()}
      >
        {loading ? "Ajout..." : "Ajouter ce sponsor"}
      </button>
      {error && (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-700 border border-red-200">
          {error}
        </div>
      )}
      {sponsors.length > 0 && (
        <div className="mt-8">
          <h3 className="font-semibold mb-4 text-neutral-800">
            Liste des sponsors
          </h3>
          <div className="overflow-x-auto rounded-xl border border-[#C5C5C5] bg-white">
            <table className="min-w-full text-left">
              <thead className="bg-neutral-100">
                <tr>
                  <th className="px-6 py-3 font-semibold">Logo</th>
                  <th className="px-6 py-3 font-semibold">Lien</th>
                  <th className="px-6 py-3 font-semibold text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sponsors.map((sp) => (
                  <tr key={sp.id} className="border-b last:border-b-0">
                    <td className="px-6 py-4">
                      <a
                        href={sp.link || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={sp.image}
                          alt="logo"
                          className="h-12 max-w-[120px] object-contain rounded bg-neutral-100 border border-[#C5C5C5]"
                        />
                      </a>
                    </td>
                    <td className="px-6 py-4 break-all text-blue-700 underline">
                      {sp.link ? (
                        <a
                          href={sp.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {sp.link}
                        </a>
                      ) : (
                        <span className="text-neutral-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 flex gap-2 justify-center">
                      <button
                        className="px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700"
                        onClick={() => handleDeleteSponsor(sp.id)}
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
