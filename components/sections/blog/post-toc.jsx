"use client";

import { useEffect, useMemo, useState } from "react";

// Linha de referencia abaixo do header fixo: o subtitulo passa a ser "o que
// esta sendo lido" quando cruza essa altura. Precisa ser maior que o
// scroll-margin-top de .section-anchor (96px), senao clicar em um item do
// sumario nao marcaria a propria secao de destino.
const ACTIVE_LINE = 140;

/**
 * Recebe `headings` ja resolvido no servidor (e nao o `content` do post) para
 * que o corpo do artigo nao seja serializado uma segunda vez nas props deste
 * client component.
 */
export default function PostToc({ headings = [], className = "" }) {
  const ids = useMemo(() => headings.map((heading) => heading.id), [headings]);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    if (ids.length === 0) return undefined;

    const targets = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (targets.length === 0) return undefined;

    // Ultimo subtitulo que ja cruzou a linha. Antes do primeiro, nenhum.
    function update() {
      let current = null;

      for (const target of targets) {
        if (target.getBoundingClientRect().top - ACTIVE_LINE > 0) break;
        current = target.id;
      }

      setActiveId(current);
    }

    // O observer serve de gatilho: ele dispara justamente quando um subtitulo
    // cruza a linha, que e o unico momento em que o destaque pode mudar.
    const observer = new IntersectionObserver(update, {
      rootMargin: `-${ACTIVE_LINE}px 0px 0px 0px`,
    });

    targets.forEach((target) => observer.observe(target));
    update();

    return () => observer.disconnect();
  }, [ids]);

  // Post sem subtitulo nao mostra sumario.
  if (headings.length === 0) return null;

  return (
    <nav aria-labelledby="sumario-do-post" className={className}>
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 id="sumario-do-post" className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-500">
          Neste artigo
        </h2>
        <ol className="space-y-2">
          {headings.map((heading, index) => {
            const isActive = heading.id === activeId;

            return (
              <li key={heading.id} className="flex gap-3 text-sm">
                <span
                  aria-hidden="true"
                  className={`font-semibold transition-colors ${isActive ? "text-[#0043FE]" : "text-gray-300"}`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <a
                  href={`#${heading.id}`}
                  aria-current={isActive ? "location" : undefined}
                  className={`transition-colors hover:text-[#0043FE] ${
                    isActive ? "font-semibold text-[#0043FE]" : "text-gray-600"
                  }`}
                >
                  {heading.text}
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
