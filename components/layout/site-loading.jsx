"use client";

import { useEffect, useState } from "react";

export default function SiteLoading({ children }) {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function preloadAll() {
      let total = 0;
      let loaded = 0;

      const images = [
        "/image/Banner_Landing_Page.png",
      ];

      total = images.length;

      function updateProgress() {
        loaded++;
        setProgress(Math.round((loaded / total) * 100));
      }

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

      setTimeout(() => setLoading(false), 500);
    }

    preloadAll();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#020617]">
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-white text-2xl font-semibold tracking-wide">
            not<span className="text-blue-500">Paper</span>
          </h1>

          <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-gray-400 text-sm">
            Carregando {progress}%
          </p>
        </div>
      </div>
    );
  }

  return children;
}
