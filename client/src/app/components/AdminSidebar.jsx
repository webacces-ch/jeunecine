"use client";
import React from "react";
import {
  PanelRight,
  FileText,
  LogOut,
  FilePlus,
  CheckCircle2,
  BadgePercent,
  Clapperboard,
  Home,
  FileEdit,
} from "lucide-react";
import { toast } from "react-hot-toast";

export function AdminSidebar({ open, setOpen, tab, setTab, onLogout }) {
  return (
    <aside
      className={`bg-white shadow-lg h-screen fixed z-30 transition-all duration-300 flex flex-col ${open ? "w-64" : "w-16"
        }`}
      style={{ overflow: "hidden" }}
    >
      <div className="flex items-center justify-start p-4 shrink-0">
        <button
          className="p-1 rounded-lg hover:bg-gray-100"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <PanelRight size={24} />
        </button>
      </div>
      <nav className="mt-6 flex font-medium flex-col gap-2 flex-1">
        {/* Bouton Home en haut */}
        <div className="h-10 flex items-center">
          <button
            onClick={() => (window.location.href = "/")}
            className={`flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded transition text-left w-full h-full ${open ? "" : "justify-center"
              }`}
          >
            <Home size={20} />
            {open && <span>Revenir au site</span>}
          </button>
        </div>

        {/* Séparateur */}
        <div className="border-t mx-4 my-2"></div>

        {/* Boutons de navigation */}
        <div className="h-10 flex items-center">
          <button
            onClick={() => setTab("drafts")}
            className={`flex items-center gap-3 px-4 py-2 rounded transition text-left w-full h-full ${tab === "drafts"
              ? "bg-neutral-100 font-bold"
              : "hover:bg-gray-100"
              } ${open ? "" : "justify-center"}`}
          >
            <FileEdit size={20} />
            {open && <span>Brouillons</span>}
          </button>
        </div>

        <div className="h-10 flex items-center">
          <button
            onClick={() => setTab("published")}
            className={`flex items-center gap-3 px-4 py-2 rounded transition text-left w-full h-full ${tab === "published"
              ? "bg-neutral-100 font-bold"
              : "hover:bg-gray-100"
              } ${open ? "" : "justify-center"}`}
          >
            <CheckCircle2 size={20} />
            {open && <span>Publiés</span>}
          </button>
        </div>

        <div className="h-10 flex items-center">
          <button
            onClick={() => setTab("sponsor")}
            className={`flex items-center gap-3 px-4 py-2 rounded transition text-left w-full h-full ${tab === "sponsor"
              ? "bg-neutral-100 font-bold"
              : "hover:bg-gray-100"
              } ${open ? "" : "justify-center"}`}
          >
            <BadgePercent size={20} />
            {open && <span>Sponsors</span>}
          </button>
        </div>

        <div className="h-10 flex items-center">
          <button
            onClick={() => setTab("films")}
            className={`flex items-center gap-3 px-4 py-2 rounded transition text-left w-full h-full ${tab === "films" ? "bg-neutral-100 font-bold" : "hover:bg-gray-100"
              } ${open ? "" : "justify-center"}`}
          >
            <Clapperboard size={20} />
            {open && <span>Films</span>}
          </button>
        </div>

        <div className="flex-1" />

        {/* Bouton de déconnexion */}
        <div className="w-full flex justify-center mb-6">
          <div className="h-10 flex items-center w-full">
            <button
              className={`flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded transition text-red-500 w-full h-full ${open ? "" : "justify-center"
                }`}
              onClick={() => {
                if (typeof window !== "undefined") {
                  localStorage.removeItem("token");
                  toast(
                    <span className="flex items-center gap-2">
                      <LogOut color="#ef4444" size={20} />
                      Déconnexion réussie
                    </span>,
                    { icon: false, style: { borderRadius: "10px" } }
                  );
                  setTimeout(() => {
                    window.location.href = "/login";
                  }, 800);
                }
              }}
            >
              <LogOut size={20} />
              {open && <span>Déconnexion</span>}
            </button>
          </div>
        </div>
      </nav>
    </aside>
  );
}
