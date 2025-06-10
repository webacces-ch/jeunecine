import React from "react";
import Navbar from "./components/Navbar";
import { Header78 } from "./components/Header78";
import Quiz from "./components/Quiz";
import { Blog34 } from "./components/Blog34";
import Films from "./components/Films";
import { Newsletter } from "./components/Newsletter";
import { Footer1 } from "./components/Footer1";

export default function Page() {
  return (
    <div>
      <Navbar />
      <Header78 />
      <div className="bg-[#ecedf6] w-full">
        <Quiz />
        <Films />
        <Blog34 />
        <Newsletter />
      </div>
    </div>
  );
}
