"use client";

import { useEffect, useRef, useState } from "react";

const HOME_ROUTE = "/";
const CACHE_KEY = "notpaper-home-preloaded-v1";
const SECONDARY_ROUTES = ["/comparacao", "/contato", "/quem-somos", "/servicos", "/solucoes"];
const RESOURCE_TIMEOUT_MS = 8000;
const VIDEO_TIMEOUT_MS = 45000;
const CRITICAL_HOME_VIDEOS = ["/videos/bg_hero.mp4", "/videos/bg_recursos_poderosos.mp4", "/videos/bg_contato.mp4"];

function withTimeout(promise, timeoutMs = RESOURCE_TIMEOUT_MS) {
  return Promise.race([
    promise,
    new Promise((resolve) => {
      window.setTimeout(resolve, timeoutMs);
    }),
  ]);
}

function waitForImage(image) {
  const isLazyImage = image.loading === "lazy";
  if (isLazyImage || image.complete) return Promise.resolve();

  return withTimeout(
    new Promise((resolve) => {
      const done = () => {
        image.removeEventListener("load", done);
        image.removeEventListener("error", done);
        resolve();
      };

      image.addEventListener("load", done, { once: true });
      image.addEventListener("error", done, { once: true });
    }),
  );
}

function waitForVideo(video) {
  const preloadMode = (video.getAttribute("preload") || "").toLowerCase();
  if (preloadMode === "none") return Promise.resolve();
  if (!video.getAttribute("src") && video.querySelectorAll("source").length === 0) return Promise.resolve();
  if (video.readyState >= 2) return Promise.resolve();

  return withTimeout(
    new Promise((resolve) => {
      const done = () => {
        video.removeEventListener("loadeddata", done);
        video.removeEventListener("error", done);
        resolve();
      };

      video.addEventListener("loadeddata", done, { once: true });
      video.addEventListener("error", done, { once: true });
    }),
  );
}

async function fetchWithTimeout(url, options = {}, timeoutMs = RESOURCE_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    window.clearTimeout(timer);
  }
}

async function preloadVideoFile(url) {
  try {
    const response = await fetchWithTimeout(url, { credentials: "same-origin" }, VIDEO_TIMEOUT_MS);
    if (!response || !response.ok) return;
    await response.arrayBuffer();
  } catch {
    // Ignore preload errors and continue.
  }
}

function toAbsoluteUrl(rawUrl) {
  if (!rawUrl) return null;
  if (rawUrl.startsWith("data:") || rawUrl.startsWith("blob:")) return null;

  try {
    return new URL(rawUrl, window.location.origin).href;
  } catch {
    return null;
  }
}

function extractAssetUrlsFromHtml(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const assets = new Set();

  const mappings = [
    ["img[src]", "src"],
    ["source[src]", "src"],
    ["video[poster]", "poster"],
    ["script[src]", "src"],
    ["link[rel='stylesheet'][href]", "href"],
    ["link[rel='preload'][href]", "href"],
  ];

  mappings.forEach(([selector, attr]) => {
    doc.querySelectorAll(selector).forEach((node) => {
      const absolute = toAbsoluteUrl(node.getAttribute(attr));
      if (!absolute) return;

      const isSameOrigin = absolute.startsWith(window.location.origin);
      if (isSameOrigin) {
        assets.add(absolute);
      }
    });
  });

  return Array.from(assets);
}

async function warmRouteAndAssets(route) {
  try {
    const response = await fetchWithTimeout(route, { credentials: "same-origin" });
    if (!response || !response.ok) return;

    const html = await response.text();
    const assetUrls = extractAssetUrlsFromHtml(html);

    await Promise.allSettled(
      assetUrls.map((url) =>
        fetchWithTimeout(url, {
          credentials: "same-origin",
        }),
      ),
    );
  } catch {
    // Ignore route warm-up errors and keep fallback behavior.
  }
}

function runInBackground(task) {
  if (typeof window === "undefined") return;

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(() => {
      task();
    });
    return;
  }

  window.setTimeout(task, 0);
}

export default function SiteLoadingGate({ children }) {
  const [ready, setReady] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    const warmSecondaryRoutesInBackground = () => {
      runInBackground(async () => {
        await Promise.allSettled(SECONDARY_ROUTES.map((route) => warmRouteAndAssets(route)));
      });
    };

    const preloadHomeFirst = async () => {
      const images = Array.from(document.querySelectorAll("img"));
      const videos = Array.from(document.querySelectorAll("video"));
      const fontReady = document.fonts?.ready ?? Promise.resolve();
      const homeAssets = warmRouteAndAssets(HOME_ROUTE);
      const criticalVideos = CRITICAL_HOME_VIDEOS.map((videoUrl) => preloadVideoFile(videoUrl));

      await Promise.allSettled([...images.map(waitForImage), ...videos.map(waitForVideo), fontReady, homeAssets, ...criticalVideos]);
      await new Promise((resolve) => requestAnimationFrame(() => resolve()));
      await new Promise((resolve) => requestAnimationFrame(() => resolve()));

      if (isMountedRef.current) {
        try {
          localStorage.setItem(CACHE_KEY, "1");
        } catch {
          // Ignore storage errors.
        }
        setReady(true);
      }

      warmSecondaryRoutesInBackground();
    };

    preloadHomeFirst();

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return (
    <>
      {!ready && (
        <div className="site-loader-overlay" role="status" aria-live="polite" aria-label="Carregando conteudo">
          <div className="site-loader-card">
            <div className="site-loader-ring">
              <div className="site-loader-core">
                <img className="site-loader-logo" src="/image/Logo_notpaper.png" alt="notPaper" />
              </div>
            </div>
            <p className="site-loader-title">Preparando sua experiencia</p>
            <div className="site-loader-progress" aria-hidden="true">
              <span />
            </div>
            <div className="site-loader-dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      )}
      {children}
    </>
  );
}
