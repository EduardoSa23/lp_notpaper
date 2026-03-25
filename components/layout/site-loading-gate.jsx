"use client";

import { useEffect, useRef, useState } from "react";

const MAX_WAIT_MS = 5000;
const APP_ROUTES = ["/", "/comparacao", "/contato", "/quem-somos", "/servicos", "/solucoes"];

function waitForImage(image) {
  if (image.complete) return Promise.resolve();

  return new Promise((resolve) => {
    const done = () => {
      image.removeEventListener("load", done);
      image.removeEventListener("error", done);
      resolve();
    };

    image.addEventListener("load", done, { once: true });
    image.addEventListener("error", done, { once: true });
  });
}

function waitForVideo(video) {
  if (video.readyState >= 2) return Promise.resolve();

  return new Promise((resolve) => {
    const done = () => {
      video.removeEventListener("loadeddata", done);
      video.removeEventListener("error", done);
      resolve();
    };

    video.addEventListener("loadeddata", done, { once: true });
    video.addEventListener("error", done, { once: true });
  });
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
    const response = await fetch(route, { credentials: "same-origin" });
    if (!response.ok) return;

    const html = await response.text();
    const assetUrls = extractAssetUrlsFromHtml(html);

    await Promise.allSettled(
      assetUrls.map((url) =>
        fetch(url, {
          credentials: "same-origin",
        }),
      ),
    );
  } catch {
    // Ignore route warm-up errors and keep fallback behavior.
  }
}

export default function SiteLoadingGate({ children }) {
  const [ready, setReady] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (sessionStorage.getItem("site-ready") === "1") {
      setReady(true);
      return undefined;
    }

    let cancelled = false;

    const finish = () => {
      if (cancelled) return;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      sessionStorage.setItem("site-ready", "1");
      setReady(true);
    };

    timeoutRef.current = setTimeout(finish, MAX_WAIT_MS);

    const preloadEverything = async () => {
      const images = Array.from(document.querySelectorAll("img"));
      const videos = Array.from(document.querySelectorAll("video"));
      const fontReady = document.fonts?.ready ?? Promise.resolve();

      const currentPageAssets = [...images.map(waitForImage), ...videos.map(waitForVideo), fontReady];
      const routeWarmups = APP_ROUTES.map((route) => warmRouteAndAssets(route));

      await Promise.allSettled([...currentPageAssets, ...routeWarmups]);
      finish();
    };

    preloadEverything();

    return () => {
      cancelled = true;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
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
