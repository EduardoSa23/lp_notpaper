"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { BLUR_DATA_URL } from "@/lib/blur-data-url";

const overviewMetrics = [
  { label: "Facilidade de uso", key: "usabilidade" },
  { label: "Integrações", key: "integrações" },
  { label: "Automação com IA", key: "automação" },
  { label: "Custo-benefício", key: "custo" },
];

const competitors = [
  {
    id: "concorrente-1",
    name: "Concorrente 1",
    logo: "concorrente1.png",
    score: 7.2,
    overview: { usabilidade: 67, integrações: 58, automação: 51, custo: 63 },
  },
  {
    id: "concorrente-2",
    name: "Concorrente 2",
    logo: "concorrente2.png",
    score: 7.6,
    overview: { usabilidade: 73, integrações: 64, automação: 59, custo: 61 },
  },
  {
    id: "concorrente-3",
    name: "Concorrente 3",
    logo: "concorrente3.png",
    score: 7.1,
    overview: { usabilidade: 60, integrações: 55, automação: 52, custo: 58 },
  },
  {
    id: "concorrente-4",
    name: "Concorrente 4",
    logo: "concorrente4.png",
    score: 7.4,
    overview: { usabilidade: 68, integrações: 63, automação: 56, custo: 60 },
  },
];

const notpaperOverview = {
  score: 9.8,
  overview: { usabilidade: 100, integrações: 90, automação: 95, custo: 93 },
};

const featureRows = [
  {
    id: "dashboards",
    feature: "Dashboards ão vivo",
    detail: "Visualização em tempo real para toda a operação",
    sistema: "Sim",
    competitors: {
      "concorrente-1": "Sim",
      "concorrente-2": "Sim",
      "concorrente-3": "Parcial",
      "concorrente-4": "Sim",
    },
  },
  {
    id: "ia",
    feature: "Assistente de IA",
    detail: "Sugestões de automação e apoio em processos",
    sistema: "Nativo",
    competitors: {
      "concorrente-1": "Módulo extra",
      "concorrente-2": "Parcial",
      "concorrente-3": "Não possui",
      "concorrente-4": "Parcial",
    },
  },
  {
    id: "multicliente",
    feature: "Ambiente multicliente",
    detail: "Gestão centralizada para orgãos e equipes",
    sistema: "Ilimitado",
    competitors: {
      "concorrente-1": "Limitado",
      "concorrente-2": "Limitado",
      "concorrente-3": "Limitado",
      "concorrente-4": "Limitado",
    },
  },
  {
    id: "setup",
    feature: "Tempo de implantação",
    detail: "Início da operação com onboarding guiado",
    sistema: "Setup rápido",
    competitors: {
      "concorrente-1": "45-60 dias",
      "concorrente-2": "30-45 dias",
      "concorrente-3": "60+ dias",
      "concorrente-4": "45 dias",
    },
  },
  {
    id: "suporte",
    feature: "Suporte especializado",
    detail: "Atendimento consultivo para operação pública",
    sistema: "Time dedicado",
    competitors: {
      "concorrente-1": "Fila padrão",
      "concorrente-2": "Fila padrão",
      "concorrente-3": "Fila padrão",
      "concorrente-4": "Fila padrão",
    },
  },
];

const appFeatureRows = [
  {
    id: "fluxos",
    feature: "Fluxos visuais de aprovação",
    detail: "Construtor drag-and-drop para processos internos do time",
    app: "Nativo",
    competitors: {
      "concorrente-1": "Limitado",
      "concorrente-2": "Parcial",
      "concorrente-3": "Não possui",
      "concorrente-4": "Parcial",
    },
  },
  {
    id: "mobile",
    feature: "Aplicativo mobile completo",
    detail: "Aprovações, notificações e consultas em tempo real",
    app: "IOS e Android",
    competitors: {
      "concorrente-1": "Somente consulta",
      "concorrente-2": "Android",
      "concorrente-3": "Não possui",
      "concorrente-4": "Parcial",
    },
  },
  {
    id: "relatorios",
    feature: "Relatórios personalizados",
    detail: "Filtros salvos, exportação e agendamento automatizado",
    app: "Ilimitado",
    competitors: {
      "concorrente-1": "5 modelos",
      "concorrente-2": "10 modelos",
      "concorrente-3": "Básico",
      "concorrente-4": "Parcial",
    },
  },
  {
    id: "api",
    feature: "API para integrações",
    detail: "Endpoints com autenticação para conectar sistemas legados",
    app: "Completa",
    competitors: {
      "concorrente-1": "Restrita",
      "concorrente-2": "Restrita",
      "concorrente-3": "Não possui",
      "concorrente-4": "Parcial",
    },
  },
  {
    id: "onboarding",
    feature: "Onboarding guiado",
    detail: "Treinamentos, checklists e playbooks prontos",
    app: "Incluso",
    competitors: {
      "concorrente-1": "Pago",
      "concorrente-2": "Pago",
      "concorrente-3": "Não incluso",
      "concorrente-4": "Parcial",
    },
  },
];

const compareModes = {
  notpaper: {
    id: "notpaper",
    label: "Sistema WEB",
    title: "Comparação individual: notPaper x",
    description: "Considere os pontos que impactam diretamente produtividade, custo e velocidade de entrega.",
    rows: featureRows,
    valueKey: "sistema",
  },
  app: {
    id: "app",
    label: "APP Mobile",
    title: "Comparação individual: notPaper x",
    description: "Veja recursos voltados para operação diária, mobilidade e evolução rápida do seu time.",
    rows: appFeatureRows,
    valueKey: "app",
  },
};

function MetricBar({ label, value }) {
  return (
    <div className="grid gap-[0.3rem]">
      <div className="flex items-center justify-between gap-[0.45rem]">
        <span className="text-[0.64rem] text-slate-600">{label}</span>
        <strong className="text-[0.64rem] text-slate-900">{value}%</strong>
      </div>
      <div className="h-[0.33rem] overflow-hidden rounded-full bg-[#d8e3ff]">
        <span className="block h-full rounded-full bg-gradient-to-r from-[#0043fe] to-[#53c5ff]" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function OverviewCard({ logo, score, metrics, spotlight = false }) {
  return (
    <article
      className={`relative flex flex-col justify-between rounded-2xl border p-[0.85rem] ${
        spotlight
          ? "border-[#7ea5ff] bg-[linear-gradient(160deg,rgba(222,233,255,0.95),rgba(255,255,255,0.92))] shadow-[0_0_0_1px_rgba(139,168,255,0.45),0_12px_26px_rgba(0,67,254,0.2)] min-[1100px]:-translate-y-2 min-[1100px]:scale-[1.04]"
          : "border-[#d6ddf0] bg-[rgba(255,255,255,0.88)]"
      }`}
    >
      {spotlight ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-[10px] -z-10 rounded-[1.15rem] bg-[linear-gradient(120deg,rgba(0,67,254,0.15),rgba(255,175,106,0.2))] blur-[12px]"
        />
      ) : null}
      <header className="mb-[0.7rem] flex items-center justify-center gap-[0.45rem]">
        <Image
          className="h-auto max-w-[100px]"
          src={logo ? `/image/concorrentes/${logo}` : "/image/Logo_notpaper.png"}
          alt="Logo"
          width={100}
          height={40}
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
        />
        {spotlight ? <span className="rounded-full bg-[#0043fe] px-2 py-[0.2rem] text-[0.45rem] font-bold tracking-[0.04em] text-white">Melhor escolha</span> : null}
      </header>
      <div className="grid gap-2">
        {overviewMetrics.map((metric) => (
          <MetricBar key={metric.key} label={metric.label} value={metrics[metric.key]} />
        ))}
        <p className="mt-[0.6rem] text-center text-base font-bold text-slate-900">{score.toFixed(1)} / 10</p>
      </div>
    </article>
  );
}

export default function ComparativoSection() {
  const [selectedCompetitor, setSelectedCompetitor] = useState(competitors[0].id);
  const [selectedMode, setSelectedMode] = useState("notpaper");

  const selectedName = useMemo(
    () => competitors.find((item) => item.id === selectedCompetitor)?.name ?? "Concorrente",
    [selectedCompetitor],
  );
  const activeMode = compareModes[selectedMode];

  return (
    <section className="overflow-x-clip bg-[#f6f8fc] py-20 md:py-24">
      <div className="mx-auto w-full max-w-[1200px] px-4">
        <header className="mx-auto mb-8 max-w-[760px] text-center">
          <h2 className="text-[2rem] font-bold leading-[1.15] text-slate-900 md:text-[2.55rem]">Compare nossa plataforma com os principais concorrentes</h2>
          <p className="mt-[0.9rem] text-base leading-[1.6] text-slate-600">Escolher o sistema certo para sua prefeitura não e sobre tecnologia. E sobre evitar problemas.</p>
        </header>

        <div className="overflow-hidden rounded-3xl border border-[#dbe2f0] bg-[radial-gradient(circle_at_center,#ffffff_0%,#eef2ff_46%,#e5ebfa_100%)] p-[1.1rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_14px_32px_rgba(15,23,42,0.08)]">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 min-[1100px]:grid-cols-5">
            {competitors.slice(0, 2).map((competitor) => (
              <OverviewCard key={competitor.id} logo={competitor.logo} score={competitor.score} metrics={competitor.overview} />
            ))}

            <OverviewCard score={notpaperOverview.score} metrics={notpaperOverview.overview} spotlight />

            {competitors.slice(2).map((competitor) => (
              <OverviewCard key={competitor.id} logo={competitor.logo} score={competitor.score} metrics={competitor.overview} />
            ))}
          </div>
        </div>

        <p className="mx-auto my-6 max-w-[720px] text-center text-[1.02rem] leading-[1.55] text-slate-700">
          Veja o comparativo completo com cada concorrente e descubra por que somos a melhor escolha para seu time.
        </p>

        <div className="mb-7 flex flex-wrap justify-center gap-[0.7rem]" role="tablist" aria-label="Escolha do concorrente">
          {competitors.map((competitor) => (
            <button
              key={competitor.id}
              type="button"
              role="tab"
              aria-selected={selectedCompetitor === competitor.id}
              className={`rounded-full border bg-white px-4 py-[0.52rem] text-[0.9rem] font-semibold text-[#1e3a8a] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-[1px] hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)] ${
                selectedCompetitor === competitor.id
                  ? "border-[#0043fe] bg-[linear-gradient(135deg,#eaf0ff,#ffffff)] shadow-[0_8px_22px_rgba(0,67,254,0.18)]"
                  : "border-[#bfd1ff]"
              }`}
              onClick={() => setSelectedCompetitor(competitor.id)}
            >
              <Image
                className="max-w-[100px]"
                src={`/image/concorrentes/${competitor.logo}`}
                alt={competitor.name}
                width={100}
                height={40}
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                style={{ height: "auto" }}
              />
            </button>
          ))}
        </div>

        <article className="rounded-[1.35rem] border border-[#d7e0f5] bg-white p-[1.15rem] shadow-[0_14px_30px_rgba(15,23,42,0.08)] md:p-6">
          <div className="mb-4 inline-flex items-center gap-[0.55rem] rounded-full bg-[#eef2ff] p-[0.3rem]" role="tablist" aria-label="Tipo de comparativo">
            {Object.values(compareModes).map((mode) => (
              <button
                key={mode.id}
                type="button"
                role="tab"
                aria-selected={selectedMode === mode.id}
                className={`rounded-full border px-4 py-2 text-[0.82rem] font-bold tracking-[0.02em] transition-[color,border-color,background-color,box-shadow] duration-200 ${
                  selectedMode === mode.id
                    ? "border-blue-700 bg-white text-black shadow-[0_8px_20px_rgba(2,6,23,0.25)]"
                    : "border-transparent bg-transparent text-slate-800 hover:border-[#bfd1ff] hover:bg-[rgba(255,255,255,0.9)]"
                }`}
                onClick={() => setSelectedMode(mode.id)}
              >
                {mode.label}
              </button>
            ))}
          </div>
          <header className="mb-4">
            <h3 className="text-[1.18rem] font-bold leading-[1.3] text-slate-900">
              {activeMode.title} {selectedName}
            </h3>
            <p className="mt-[0.45rem] text-[0.95rem] leading-[1.5] text-slate-600">{activeMode.description}</p>
          </header>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr>
                  <th className="rounded-l-xl bg-[linear-gradient(90deg,#0ea5e9,#0043fe)] px-[0.9rem] py-[0.8rem] text-left text-[0.85rem] font-bold text-white">
                    Recursos
                  </th>
                  <th className="bg-[linear-gradient(90deg,#0ea5e9,#0043fe)] px-[0.9rem] py-[0.8rem] text-left text-[0.85rem] font-bold text-white">
                    {activeMode.label}
                  </th>
                  <th className="rounded-r-xl bg-[linear-gradient(90deg,#0ea5e9,#0043fe)] px-[0.9rem] py-[0.8rem] text-left text-[0.85rem] font-bold text-white">
                    {selectedName}
                  </th>
                </tr>
              </thead>
              <tbody>
                {activeMode.rows.map((row, index) => (
                  <tr key={row.id}>
                    <td className={`w-[46%] align-top px-[0.9rem] py-[0.8rem] text-[0.86rem] text-slate-800 ${index === activeMode.rows.length - 1 ? "" : "border-b border-slate-200"}`}>
                      <strong className="block text-[0.9rem] text-slate-900">{row.feature}</strong>
                      <span className="mt-[0.2rem] block text-[0.8rem] leading-[1.45] text-slate-500">{row.detail}</span>
                    </td>
                    <td className={`align-top px-[0.9rem] py-[0.8rem] text-[0.86rem] font-bold ${index === activeMode.rows.length - 1 ? "" : "border-b border-slate-200"}`}>
                      {row[activeMode.valueKey]}
                    </td>
                    <td className={`align-top px-[0.9rem] py-[0.8rem] text-[0.86rem] text-slate-800 ${index === activeMode.rows.length - 1 ? "" : "border-b border-slate-200"}`}>
                      {row.competitors[selectedCompetitor]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </section>
  );
}
