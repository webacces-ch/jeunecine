"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { User } from "lucide-react";
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const navItems = [
    { name: "Accueil", href: "/" },
    { name: "Articles", href: "/articles" },
    { name: "Films", href: "/films" },
    { name: "Les jobs !", href: "/jobs" },
    {
      name: "Galerie",
      href: "/galerie",
      hasSubmenu: true,
      submenu: [
        { name: "2020", href: "/galerie/2020" },
        { name: "2021", href: "/galerie/2021" },
        { name: "2022", href: "/galerie/2022" },
      ],
    },
    { name: "Contact", href: "/qui-sommes-nous" },
    { name: "Nous soutenir", href: "/nous-soutenir" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 z-[9999] w-full ${
          isMenuOpen
            ? "bg-white "
            : "bg-white md:bg-white/60 md:backdrop-blur-2xl"
        } transition-colors duration-200`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between  py-2 px-4">
          <Link href="/" className="flex items-center">
            <Logo className="h-8 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-1 justify-end">
            <ul className="flex space-x-2 items-center">
              {navItems.map((item) => (
                <li
                  key={item.name}
                  className="relative text-zinc-700 transition-transform duration-200"
                >
                  {item.hasSubmenu ? (
                    <div
                      className="group relative"
                      onMouseEnter={() => setOpenSubmenu(item.name)}
                      onMouseLeave={() => setOpenSubmenu(null)}
                    >
                      <button className="flex items-center text-zinc-700 hover:bg-zinc-200 px-2 py-2 rounded-lg">
                        {item.name}
                        <svg
                          className={`ml-1 h-4 w-4 transform transition-transform ${
                            openSubmenu === item.name ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      <div
                        className={`absolute left-0 w-24 rounded-lg bg-white/20 backdrop:filter backdrop-blur-2xl transition-all duration-200 origin-top scale-y-0 opacity-0 pointer-events-none group-hover:scale-y-100 group-hover:opacity-100 group-hover:pointer-events-auto ${
                          openSubmenu === item.name
                            ? "scale-y-100 opacity-100 pointer-events-auto"
                            : ""
                        }`}
                        style={{ transitionProperty: "opacity, transform" }}
                      >
                        {item.submenu?.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className="block px-2 py-2 text-zinc-500 hover:text-zinc-800 rounded-lg hover:bg-zinc-200 transition-colors"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-zinc-700 hover:bg-zinc-200 py-2 px-2 rounded-lg"
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
              {/* Login bouton */}
              <li>
                <Link
                  href="/admin"
                  className="flex items-center justify-center p-2 hover:bg-zinc-200 rounded-lg transition-colors"
                >
                  <User className="w-5 h-5 text-zinc-700" />
                </Link>
              </li>
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden flex items-center gap-2 justify-center px-4 py-2 rounded-full bg-white/90 shadow-lg border border-zinc-200 hover:bg-zinc-100 transition-all duration-300 font-semibold text-zinc-700 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
              isMenuOpen ? "scale-105 bg-zinc-100" : ""
            }`}
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setIsMenuOpen((v) => !v)}
            style={{ pointerEvents: "auto" }}
          >
            <span className="relative w-5 h-7 flex items-center justify-center">
              <svg
                className={`absolute transition-all duration-300 ${
                  isMenuOpen ? "opacity-0 scale-90" : "opacity-100 scale-100"
                }`}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
              <svg
                className={`absolute transition-all duration-300 ${
                  isMenuOpen ? "opacity-100 scale-100" : "opacity-0 scale-90"
                }`}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </span>
          </button>

          {/* Mobile Navigation - Dropdown attached to navbar */}
          {isMenuOpen && (
            <div className="md:hidden absolute left-0 top-full w-full z-[1000] animate-slide-down">
              <div className="bg-white shadow-2xl p-6 flex flex-col items-center gap-4">
                <ul className="flex flex-col gap-2 w-full mt-2">
                  {navItems.map((item) => (
                    <li key={item.name} className="w-full">
                      {item.hasSubmenu ? (
                        <div className="w-full">
                          <button
                            className="flex items-center justify-between w-full text-zinc-700 font-semibold py-2 px-4 rounded-xl hover:bg-zinc-200 transition-colors"
                            onClick={() =>
                              setOpenSubmenu(
                                openSubmenu === item.name ? null : item.name
                              )
                            }
                          >
                            {item.name}
                            <svg
                              className={`ml-2 w-4 h-4 transform transition-transform ${
                                openSubmenu === item.name ? "rotate-180" : ""
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </button>
                          {openSubmenu === item.name && (
                            <div className="flex flex-col gap-1 pl-4 mt-1">
                              {item.submenu?.map((subItem) => (
                                <Link
                                  key={subItem.name}
                                  href={subItem.href}
                                  className="block py-1 px-3 text-zinc-500 hover:text-zinc-800 rounded-lg hover:bg-zinc-100 transition-colors"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  {subItem.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link
                          href={item.href}
                          className="block text-zinc-700 font-semibold py-2 px-4 rounded-xl hover:bg-zinc-200 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      )}
                    </li>
                  ))}
                  <li className="w-full">
                    <Link
                      href="/admin"
                      className="flex items-center justify-center py-2 px-4 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold transition-colors gap-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-5 h-5 mr-1" /> Se connecter
                    </Link>
                  </li>
                </ul>
              </div>
              <style jsx>{`
                .animate-slide-down {
                  animation: slideDownMenu 0.2s ease-in;
                }
                @keyframes slideDownMenu {
                  from {
                    opacity: 0;
                    transform: translateY(-64px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
              `}</style>
            </div>
          )}
        </div>
      </header>
      {isMenuOpen && (
        <div
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 bg-black opacity-50 z-[500]"
        />
      )}
    </>
  );
};
export default Navbar;
