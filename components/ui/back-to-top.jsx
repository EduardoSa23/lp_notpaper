"use client";

import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa6";

export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed bottom-8 right-2 md:right-8 z-50
        w-14 h-14 rounded-full
        flex items-center justify-center
        border border-white
        bg-[radial-gradient(circle,_#020617_0%,_#0132B4_100%)] text-white
        shadow-lg hover:shadow-xl
        transition-all duration-300
        hover:scale-110
        ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}
      `}
    >
      <FaArrowUp />
    </button>
  );
}