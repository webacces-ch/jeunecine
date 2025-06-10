"use client";
import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import { Geist, Geist_Mono } from "next/font/google";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

// Since this is a client component, we need to create a separate file for metadata
// Create a new file called src/app/metadata.js with the following content

export default function RootLayout({ children }) {
  /* useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1, // plus haut = plus lent (1.2 à 2.5 max)
      smooth: true,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // ease out
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
 }, []);
 */
  return (
    <html lang="fr">
      <head>
        <title>Jeune Ciné</title>
        <meta name="description" content="Découvrez le cinéma autrement" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta property="og:title" content="Jeune Ciné" />
        <meta
          property="og:description"
          content="Découvrez le cinéma autrement"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://jeune-cine.com" />
        <meta property="og:locale" content="fr_FR" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${manrope.variable} ${inter.variable} antialiased bg-white`}
      >
        {/*         <CustomCursor /> */}
        {children}
      </body>
    </html>
  );
}
