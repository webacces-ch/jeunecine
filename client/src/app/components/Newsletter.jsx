"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowUp } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSend = () => {
    toast.success("l'email a bien été envoyé !");
    // Here you can add your send logic (API call, etc)
    setEmail("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.length > 0) {
      handleSend();
    }
  };

  return (
    <div className="w-full flex justify-center bg-white items-center min-h-[60vh]">
      <Toaster position="bottom-right" />
      <div className=" w-11/12 md:w-4/6 flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <Image
            src="/letterbox.png"
            alt="Newsletter"
            width={125}
            height={200}
          />
          <h2 className="text-neutral-900 text-7xl text-center tracking-[-2.5px] font-semibold">
            S'inscrire à la{" "}
            <span className="font-['Lora'] font-normal tracking-tight ">
              Newsletter
            </span>
          </h2>
        </div>
        <form
          className="w-full relative flex items-center justify-center"
          onSubmit={handleSubmit}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="exemple@gmail.com"
            className="w-full px-6  py-3 pr-14 border border-neutral-300 rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gradient-to-r from-white/50 to-white/5 text-neutral-600 font-semibold placeholder-neutral-300 placeholder:font-semibold shadow-md transition-all"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit(e);
            }}
          />
          {email.length > 0 && (
            <button
              type="button"
              aria-label="S'inscrire"
              className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center bg-neutral-600 text-neutral-100 rounded-full w-10 h-10 hover:bg-neutral-700 transition-all border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              style={{ minWidth: 40, minHeight: 40 }}
              onClick={handleSend}
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
