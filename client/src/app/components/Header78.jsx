"use client";

import { Button } from "@relume_io/relume-ui";
import React from "react";

import { Send, Info } from "lucide-react";

export function Header78() {
  return (
    <section
      id="relume"
      className="py-20 sm:py-22 md:py-28 lg:py-28 bg-[#ecedf6]"
    >
      <div className="container flex flex-col items-center w-full px-0">
        <div className="mb-8 px-11 md:mb-12 lg:mb-16  md:w-10/12 text-center ">
          <a
            href="#"
            className="inline-block mb-4 rounded-full bg-blue-200 py-1 px-4 text-blue-500 hover:bg-blue-300 hover:text-blue-600 font-semibold text-sm transition-colors duration-300 ease-in-out relative z-20 mt-16 sm:mt-0"
            style={{
              marginTop: "calc(env(safe-area-inset-top, 0px) + 4.5rem)",
            }}
          >
            🎉 Nouveaux films dispo
          </a>
          <h1 className="mb-5 text-10xl tracking-[-2] leading-tight sm:text-8xl font-medium md:mb-6 md:text-10xl lg:text-10xl">
            <span className=" hidden md:inline"> Bienvenue chez </span>
            Jeune Ciné Fribourg
          </h1>

          <p className="leading-normal tracking-wide text-base sm:md:text-md">
            Nous offrons aux jeunes un espace créatif pour réaliser leurs
            projets audiovisuels.
            <span className="hidden md:inline">
              Grâce à un accompagnement professionnel, chaque étape de la
              création est soutenue.
            </span>
          </p>
          <div className="mt-6 flex mx-12 flex-col sm:flex-row items-center justify-center gap-3 sm:gap-x-4 md:mt-8">
            <Button
              title="En savoir plus"
              className="bg-[#4554AD] hover:bg-[#37438A] text-white rounded-full px-6 py-3 font-medium border-none w-full sm:w-auto"
            >
              En savoir plus
            </Button>
            <Button
              title="Nous contacter"
              className="bg-[#f2f2f2] transition-colors duration-300 hover:bg-black border-black text-black hover:text-white rounded-full font-medium w-full sm:w-auto"
            >
              Nous contacter <Send strokeWidth={2} />
            </Button>
          </div>
        </div>

        <div className="flex w-screen -mx-4 sm:-mx-8 md:-mx-12 lg:-mx-16 overflow-x-auto sm:overflow-hidden">
          <div className="grid shrink-0 grid-cols-1 gap-y-4 min-w-[600px] sm:min-w-0 px-4 sm:px-8 md:px-12 lg:px-16">
            <div className="grid w-full animate-marquee-top auto-cols-fr grid-cols-2 gap-4 self-center min-w-[600px] sm:min-w-0">
              <div className="grid w-full grid-flow-col gap-4">
                <div className="relative w-[280px] pt-[75%] sm:w-[18rem] md:w-[26rem]">
                  <img
                    className="absolute inset-0 size-full rounded-image object-cover"
                    src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                    alt="Relume placeholder image 1"
                  />
                </div>
                <div className="relative w-[280px] pt-[75%] sm:w-[18rem] md:w-[26rem]">
                  <img
                    className="absolute inset-0 size-full rounded-image object-cover"
                    src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                    alt="Relume placeholder image 2"
                  />
                </div>
                <div className="relative w-[280px] pt-[75%] sm:w-[18rem] md:w-[26rem]">
                  <img
                    className="absolute inset-0 size-full rounded-image object-cover"
                    src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                    alt="Relume placeholder image 3"
                  />
                </div>
                <div className="relative w-[280px] pt-[75%] sm:w-[18rem] md:w-[26rem]">
                  <img
                    className="absolute inset-0 size-full rounded-image object-cover"
                    src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                    alt="Relume placeholder image 4"
                  />
                </div>
                <div className="relative w-[280px] pt-[75%] sm:w-[18rem] md:w-[26rem]">
                  <img
                    className="absolute inset-0 size-full rounded-image object-cover"
                    src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                    alt="Relume placeholder image 5"
                  />
                </div>
                <div className="relative w-[280px] pt-[75%] sm:w-[18rem] md:w-[26rem]">
                  <img
                    className="absolute inset-0 size-full rounded-image object-cover"
                    src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                    alt="Relume placeholder image 6"
                  />
                </div>
              </div>
              <div className="grid w-full grid-flow-col gap-4">
                <div className="relative w-[280px] pt-[75%] sm:w-[18rem] md:w-[26rem]">
                  <img
                    className="absolute inset-0 size-full rounded-image object-cover"
                    src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                    alt="Relume placeholder image 1"
                  />
                </div>
                <div className="relative w-[280px] pt-[75%] sm:w-[18rem] md:w-[26rem]">
                  <img
                    className="absolute inset-0 size-full rounded-image object-cover"
                    src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                    alt="Relume placeholder image 2"
                  />
                </div>
                <div className="relative w-[280px] pt-[75%] sm:w-[18rem] md:w-[26rem]">
                  <img
                    className="absolute inset-0 size-full rounded-image object-cover"
                    src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                    alt="Relume placeholder image 3"
                  />
                </div>
                <div className="relative w-[280px] pt-[75%] sm:w-[18rem] md:w-[26rem]">
                  <img
                    className="absolute inset-0 size-full rounded-image object-cover"
                    src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                    alt="Relume placeholder image 4"
                  />
                </div>
                <div className="relative w-[280px] pt-[75%] sm:w-[18rem] md:w-[26rem]">
                  <img
                    className="absolute inset-0 size-full rounded-image object-cover"
                    src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                    alt="Relume placeholder image 5"
                  />
                </div>
                <div className="relative w-[280px] pt-[75%] sm:w-[18rem] md:w-[26rem]">
                  <img
                    className="absolute inset-0 size-full rounded-image object-cover"
                    src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                    alt="Relume placeholder image 6"
                  />
                </div>
              </div>
            </div>
            <div className="grid w-full animate-marquee-bottom grid-cols-2 gap-4 self-center min-w-[600px] sm:min-w-0">
              <div className="grid w-full grid-flow-col gap-4">
                <div className="relative w-[280px] pt-[75%] sm:w-[18rem] md:w-[26rem]">
                  <img
                    className="absolute inset-0 size-full rounded-image object-cover"
                    src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                    alt="Relume placeholder image 1"
                  />
                </div>
                <div className="relative w-[280px] pt-[75%] sm:w-[18rem] md:w-[26rem]">
                  <img
                    className="absolute inset-0 size-full rounded-image object-cover"
                    src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                    alt="Relume placeholder image 2"
                  />
                </div>
                <div className="relative w-[280px] pt-[75%] sm:w-[18rem] md:w-[26rem]">
                  <img
                    className="absolute inset-0 size-full rounded-image object-cover"
                    src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                    alt="Relume placeholder image 3"
                  />
                </div>
                <div className="relative w-[280px] pt-[75%] sm:w-[18rem] md:w-[26rem]">
                  <img
                    className="absolute inset-0 size-full rounded-image object-cover"
                    src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                    alt="Relume placeholder image 4"
                  />
                </div>
                <div className="relative w-[280px] pt-[75%] sm:w-[18rem] md:w-[26rem]">
                  <img
                    className="absolute inset-0 size-full rounded-image object-cover"
                    src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                    alt="Relume placeholder image 5"
                  />
                </div>
                <div className="relative w-[280px] pt-[75%] sm:w-[18rem] md:w-[26rem]">
                  <img
                    className="absolute inset-0 size-full rounded-image object-cover"
                    src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                    alt="Relume placeholder image 6"
                  />
                </div>
              </div>
              <div className="grid w-full grid-flow-col gap-4">
                <div className="relative w-[280px] pt-[75%] sm:w-[18rem] md:w-[26rem]">
                  <img
                    className="absolute inset-0 size-full rounded-image object-cover"
                    src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                    alt="Relume placeholder image 1"
                  />
                </div>
                <div className="relative w-[280px] pt-[75%] sm:w-[18rem] md:w-[26rem]">
                  <img
                    className="absolute inset-0 size-full rounded-image object-cover"
                    src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                    alt="Relume placeholder image 2"
                  />
                </div>
                <div className="relative w-[280px] pt-[75%] sm:w-[18rem] md:w-[26rem]">
                  <img
                    className="absolute inset-0 size-full rounded-image object-cover"
                    src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                    alt="Relume placeholder image 3"
                  />
                </div>
                <div className="relative w-[280px] pt-[75%] sm:w-[18rem] md:w-[26rem]">
                  <img
                    className="absolute inset-0 size-full rounded-image object-cover"
                    src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                    alt="Relume placeholder image 4"
                  />
                </div>
                <div className="relative w-[280px] pt-[75%] sm:w-[18rem] md:w-[26rem]">
                  <img
                    className="absolute inset-0 size-full rounded-image object-cover"
                    src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                    alt="Relume placeholder image 5"
                  />
                </div>
                <div className="relative w-[280px] pt-[75%] sm:w-[18rem] md:w-[26rem]">
                  <img
                    className="absolute inset-0 size-full rounded-image object-cover"
                    src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                    alt="Relume placeholder image 6"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
