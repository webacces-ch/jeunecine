"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ProfilePage({ onClose, onUpdate }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
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
        return fetch("http://localhost:4000/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then((res) => res.json())
      .then((data) => {
        setName(data.name || "");
        setUsername(data.username || "");
        setLoading(false);
      })
      .catch(() => {
        setError("Impossible de charger le profil");
        setLoading(false);
        localStorage.removeItem("token");
        router.replace("/login");
      });
  }, [router]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:4000/api/user/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur serveur");
      toast.success("Profil mis à jour !");
      localStorage.setItem("user", JSON.stringify(data));
      if (onUpdate) onUpdate(data);
      if (onClose) onClose();
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Chargement...</div>;

  return (
    <form
      className="max-w-md mx-auto bg-white rounded-2xl shadow p-8 flex flex-col gap-6"
      onSubmit={handleSave}
    >
      <h2 className="text-2xl font-bold mb-2">Mon profil</h2>
      <div>
        <label className="block font-semibold mb-1">Nom d'utilisateur</label>
        <input
          className="w-full px-4 py-2 border rounded-lg bg-neutral-100 text-neutral-500 cursor-not-allowed"
          value={username}
          disabled
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Nom affiché</label>
        <input
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      {error && <div className="text-red-600">{error}</div>}
      <div className="flex gap-4 mt-2">
        <button
          type="submit"
          className="bg-neutral-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-neutral-800 transition"
          disabled={saving}
        >
          Enregistrer
        </button>
        {onClose && (
          <button
            type="button"
            className="ml-2 text-red-500 font-semibold"
            onClick={onClose}
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}
