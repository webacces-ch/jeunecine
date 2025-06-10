"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function SponsorPublicPage() {
  const [sponsors, setSponsors] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/sponsors")
      .then((res) => res.json())
      .then((data) => setSponsors(data))
      .catch(() => setSponsors([]));
  }, []);

  return (
    <section className="min-h-screen bg-neutral-50 flex flex-col items-center py-16 px-4">
      {/* Bloc portrait + texte */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-8 md:p-14 flex flex-col md:flex-row gap-10 items-center mb-16">
        <div className="flex-shrink-0 flex items-center justify-center">
          <Image
            src="/Frame 45.png"
            alt="Portrait président Jeune Ciné Fribourg"
            width={180}
            height={180}
            className="rounded-2xl border shadow-lg object-cover w-40 h-40 md:w-44 md:h-44"
            priority
          />
        </div>
        <div className="flex-1 flex flex-col justify-center items-start gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">
            Un grand merci !
          </h1>
          <p className="text-lg text-neutral-700 leading-relaxed">
            "Votre soutien permet à Jeune Ciné Fribourg de continuer à faire
            vivre la passion du cinéma auprès des jeunes et du public
            fribourgeois. Grâce à vous, nous pouvons organiser des projections,
            des ateliers, et de nombreux événements tout au long de l'année.{" "}
            <br className="hidden md:block" />
            Un immense merci pour votre générosité et votre confiance !"
          </p>
          <span className="mt-2 text-neutral-500 font-medium">
            — Le comité de Jeune Ciné Fribourg
          </span>
        </div>
      </div>
      {/* Bloc moyens de paiement */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-8 md:p-14 flex flex-col md:flex-row gap-12 items-center mb-16">
        <div className="flex-1 flex flex-col gap-8 items-center justify-center w-full">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2 text-center">
            Nous soutenir
          </h2>
          <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col items-center gap-2">
              <span className="font-semibold text-neutral-700">Par Twint</span>
              <img
                src="/sponsors/twint-qr.png"
                alt="QR Twint"
                className="w-36 h-36 md:w-44 md:h-44 rounded-xl border shadow"
              />
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="font-semibold text-neutral-700">Par IBAN</span>
              <div className="bg-neutral-100 rounded-xl px-4 py-2 text-center font-mono text-lg border border-neutral-200 select-all">
                CH12 3456 7890 1234 5678 9
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="font-semibold text-neutral-700">Par PayPal</span>
              <a
                href="https://paypal.me/jeune-cine-fribourg"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition shadow"
              >
                Faire un don
              </a>
            </div>
          </div>
        </div>
        {/* Illustration logo */}
        <div className="hidden md:flex flex-1 items-center justify-center">
          <img
            src="/logo.svg"
            alt="Logo Jeune Ciné Fribourg"
            className="w-48 h-48 object-contain opacity-80"
          />
        </div>
      </div>
      {/* Carousel sponsors */}
      <div className="w-full max-w-5xl mt-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-neutral-900">
          Nos sponsors
        </h2>
        <div className="relative w-full overflow-x-hidden">
          <div className="flex gap-16 animate-carousel whitespace-nowrap py-6">
            {sponsors.concat(sponsors).map((sp, i) => (
              <a
                key={sp.id + "-" + i}
                href={sp.link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block group"
                style={{ minWidth: 140 }}
              >
                <div className="bg-white rounded-xl border border-neutral-200 shadow-md p-4 flex items-center justify-center transition group-hover:scale-105">
                  <img
                    src={
                      sp.imageUrl?.startsWith("/sponsors/")
                        ? sp.imageUrl
                        : `/sponsors/${sp.imageUrl}`
                    }
                    alt="logo sponsor"
                    className="h-16 md:h-20 max-w-[180px] object-contain"
                  />
                </div>
              </a>
            ))}
          </div>
        </div>
        <style jsx>{`
          @keyframes carousel {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .animate-carousel {
            animation: carousel 40s linear infinite;
          }
        `}</style>
      </div>
    </section>
  );
}
