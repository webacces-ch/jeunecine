"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { LineSpinner } from "ldrs/react";
import "ldrs/react/LineSpinner.css";
import { getApiUrl } from "../utils/api";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false); // Loader pour redirection

  // Gestion du loader lors des redirections manuelles
  const handleRedirect = (url) => {
    setIsRedirecting(true);
    router.push(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    toast.dismiss();
    toast.loading("Connexion en cours...");
    try {
      const res = await fetch(getApiUrl("/api/user"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur serveur");
      localStorage.setItem("token", data.token);
      toast.dismiss();
      toast.success("Connexion réussie !");
      handleRedirect("/admin"); // Utilise le loader
    } catch (err) {
      toast.dismiss();
      setError(err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  if (isRedirecting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <Toaster position="bottom-right" />
        <LineSpinner className="mb-4" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Toaster position="bottom-right" />
      <form
        onSubmit={handleSubmit}
        className="bg-white md:border md:border-white rounded-2xl shadow-lg p-8 w-full max-w-xs flex flex-col gap-7"
        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
      >
        <h1 className="text-3xl font-semibold text-center mb-2 text-neutral-900 tracking-tight font-title">
          Connexion
        </h1>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="username"
            className="font-semibold text-sm text-neutral-700"
          >
            Nom d'utilisateur
          </label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            className="border border-neutral-200 bg-neutral-50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base text-neutral-900 placeholder:text-neutral-400 transition"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="admin"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="password"
            className="font-semibold text-sm text-neutral-700"
          >
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className="border border-neutral-200 bg-neutral-50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base text-neutral-900 placeholder:text-neutral-400 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Votre mot de passe"
          />
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm text-center rounded-lg py-2 px-3 font-medium animate-shake">
            {error === "Identifiants invalides"
              ? "L’utilisateur ou le mot de passe est incorrect. Merci de réessayer."
              : error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-lg py-2 mt-2 transition disabled:opacity-60 text-base tracking-wide shadow-sm"
        >
          {loading ? "Connexion en cours..." : "Se connecter"}
        </button>
        <a
          href="/"
          className="text-center flex hover:underline justify-center items-center text-sm text-black"
          onClick={(e) => {
            e.preventDefault();
            handleRedirect("/");
          }}
        >
          <ArrowLeft size={14} className="inline mr-1" />
          retourner au site
        </a>
      </form>
      <style jsx global>{`
        .font-title {
          font-family: var(--font-manrope), system-ui, sans-serif;
        }
        @keyframes shake {
          10%,
          90% {
            transform: translateX(-1px);
          }
          20%,
          80% {
            transform: translateX(2px);
          }
          30%,
          50%,
          70% {
            transform: translateX(-4px);
          }
          40%,
          60% {
            transform: translateX(4px);
          }
        }
        .animate-shake {
          animation: shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
      `}</style>
    </div>
  );
}
