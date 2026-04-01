"use client";

import { useEffect, useState } from "react";

export default function SiteLoading({ children }) {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function preloadAll() {
      let total = 0;
      let loaded = 0;

      // 🔹 Ajuste conforme seus assets reais
      const images = [
        "/image/Banner_Landing_Page.png",
      ];

      const videos = [
        "/videos/bg_hero.mp4",
        "/videos/bg_contato.mp4",
        "/videos/bg_recursos_poderosos.mp4",
      ];

      total = images.length + videos.length;

      function updateProgress() {
        loaded++;
        setProgress(Math.round((loaded / total) * 100));
      }

      // 🔹 Pré-carregar imagens
      await Promise.all(
        images.map(
          (src) =>
            new Promise((resolve) => {
              const img = new Image();
              img.src = src;
              img.onload = () => {
                updateProgress();
                resolve();
              };
              img.onerror = () => {
                updateProgress();
                resolve();
              };
            })
        )
      );

      // 🔹 Pré-carregar vídeos
      await Promise.all(
        videos.map(
          (src) =>
            new Promise((resolve) => {
              const video = document.createElement("video");
              video.src = src;
              video.preload = "auto";

              video.onloadeddata = () => {
                updateProgress();
                resolve();
              };

              video.onerror = () => {
                updateProgress();
                resolve();
              };
            })
        )
      );

      setTimeout(() => setLoading(false), 500);
    }

    preloadAll();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#020617]">
        <div className="flex flex-col items-center gap-6">
          {/* Logo */}
          <h1 className="text-white text-2xl font-semibold tracking-wide">
            not<span className="text-blue-500">Paper</span>
          </h1>

          {/* Barra de progresso */}
          <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Texto */}
          <p className="text-gray-400 text-sm">
            Carregando {progress}%
          </p>
        </div>
      </div>
    );
  }

  return children;
}
