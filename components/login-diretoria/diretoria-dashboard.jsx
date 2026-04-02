"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FiExternalLink, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import LogoutButton from "@/components/login-diretoria/logout-button";
import { DEFAULT_DIRETORIA_PRESENTATION_CARDS, DIRETORIA_CARDS_STORAGE_KEY } from "@/lib/mock-directoria-presentations";

const CARD_COLORS = ["bg-[radial-gradient(circle,_#0132B4_0%,_#020617_100%)]", "bg-[radial-gradient(circle,_#020617_0%,_#475569_100%)]"];

function normalizeCards(rawCards) {
  if (!Array.isArray(rawCards)) return DEFAULT_DIRETORIA_PRESENTATION_CARDS;

  const validCards = rawCards.filter((item) => {
    return (
      item &&
      typeof item.id === "string" &&
      typeof item.title === "string" &&
      typeof item.description === "string" &&
      typeof item.url === "string"
    );
  });

  return validCards.length ? validCards : DEFAULT_DIRETORIA_PRESENTATION_CARDS;
}

export default function DiretoriaDashboard() {
  const [cards, setCards] = useState(DEFAULT_DIRETORIA_PRESENTATION_CARDS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [newCard, setNewCard] = useState({
    title: "",
    description: "",
    url: "",
    category: "",
  });

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(DIRETORIA_CARDS_STORAGE_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored);
      setCards(normalizeCards(parsed));
    } catch {
      setCards(DEFAULT_DIRETORIA_PRESENTATION_CARDS);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(DIRETORIA_CARDS_STORAGE_KEY, JSON.stringify(cards));
  }, [cards]);

  const categories = useMemo(() => {
    const unique = new Set(cards.map((card) => card.category?.trim() || "Sem categoria"));
    return ["Todos", ...Array.from(unique)];
  }, [cards]);

  const filteredCards = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return cards.filter((card) => {
      const matchCategory = selectedCategory === "Todos" || (card.category?.trim() || "Sem categoria") === selectedCategory;
      if (!matchCategory) return false;

      if (!term) return true;
      const payload = `${card.title} ${card.description} ${card.category || ""}`.toLowerCase();
      return payload.includes(term);
    });
  }, [cards, searchTerm, selectedCategory]);


  return (
    <main className="min-h-screen bg-slate-200">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-[1400px] flex-wrap items-center justify-between gap-4 px-4 py-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#011C66]">Área autenticada</p>
            <h1 className="text-4xl font-bold text-slate-900">Portal da Diretoria</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
            >
              Retornar ao site
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <section className="bg-[radial-gradient(circle,_#0132B4_0%,_#020617_100%)]">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-6">
          <form
            onSubmit={(event) => {
              event.preventDefault();
            }}
            className="flex flex-col gap-3 md:flex-row"
          >
            <label className="relative flex-1">
              <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar serviços..."
                className="w-full rounded-xl border border-transparent bg-white px-11 py-3 text-slate-800 shadow-sm outline-none transition focus:border-[#002073]"
              />
            </label>
            <button
              type="submit"
              className="rounded-xl bg-slate-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Buscar
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto grid w-full gap-6 px-4 py-6 lg:grid-cols-[280px_1fr]">
        <aside className="overflow-hidden rounded-2xl border border-slate-300 bg-slate-100">
          <div className="border-b border-slate-300 bg-white px-5 py-4">
            <h2 className="text-2xl font-bold text-slate-900">Serviços</h2>
          </div>
          <div className="max-h-[520px] overflow-y-auto">
            {categories.map((category) => {
              const active = category === selectedCategory;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`flex w-full items-center border-b border-slate-300 px-5 py-4 text-left text-lg font-semibold transition ${
                    active ? "bg-[#011C66] text-white" : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </aside>

        <div className="space-y-6">
          {filteredCards.length ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredCards.map((card, index) => (
                <a
                  key={card.id}
                  href={card.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={`group relative block min-h-[230px] rounded-2xl px-5 py-5 text-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                    CARD_COLORS[index % CARD_COLORS.length]
                  }`}
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <h3 className="text-3xl font-bold leading-tight">{card.title}</h3>
                    <FiExternalLink className="mt-1 text-xl opacity-90" />
                  </div>

                  <div className="mb-4 h-px w-full bg-white/80" />

                  <p className="text-[17px] leading-relaxed text-white/95">{card.description}</p>
                  <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-white/90">
                    {card.category?.trim() || "Sem categoria"}
                  </p>
                </a>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-400 bg-slate-100 px-5 py-10 text-center text-slate-700">
              Nenhum card encontrado para os filtros atuais.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
