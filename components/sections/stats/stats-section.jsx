"use client";

import { useEffect, useState } from "react";

const stats = [
  { label: "Projetos Concluídos", target: 500, suffix: "+", color: "text-[#0043FE]" },
  { label: "Satisfação do Cliente", target: 98, suffix: "%", color: "text-blue-500" },
  { label: "Especialistas", target: 50, suffix: "+", color: "text-purple-500" },
  { label: "Cidades atendidas", target: 20, suffix: "+", color: "text-yellow-500" },
];

export default function StatsSection() {
  const [statsVisible, setStatsVisible] = useState(false);
  const [counts, setCounts] = useState(stats.map(() => 0));

  useEffect(() => {
    const section = document.getElementById("stats");
    if (!section) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStatsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!statsVisible) return undefined;

    const duration = 1600;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      setCounts(stats.map((item) => Math.floor(item.target * progress)));
      if (progress < 1) requestAnimationFrame(tick);
    };

    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [statsVisible]);

  return (
    <section id="stats" className="bg-gray-900 py-20 text-white section-anchor">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 text-center md:grid-cols-4">
          {stats.map((item, index) => (
            <div key={item.label}>
              <div className={`mb-2 text-4xl font-bold ${item.color}`}>
                {counts[index]}
                {item.suffix}
              </div>
              <div className="text-gray-300">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
