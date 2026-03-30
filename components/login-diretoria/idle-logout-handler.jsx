"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { DIRETORIA_IDLE_TIMEOUT_MS } from "@/lib/mock-directoria-auth";

const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "scroll", "touchstart", "click", "wheel"];

export default function IdleLogoutHandler() {
  const router = useRouter();
  const timerRef = useRef(null);
  const isLoggingOutRef = useRef(false);

  useEffect(() => {
    async function logoutByInactivity() {
      if (isLoggingOutRef.current) return;
      isLoggingOutRef.current = true;

      try {
        await fetch("/api/auth/logout", { method: "POST" });
      } finally {
        router.replace("/diretoria/login?session=expired");
        router.refresh();
      }
    }

    function resetTimer() {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(logoutByInactivity, DIRETORIA_IDLE_TIMEOUT_MS);
    }

    resetTimer();
    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, resetTimer, { passive: true });
    });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, resetTimer);
      });
    };
  }, [router]);

  return null;
}

