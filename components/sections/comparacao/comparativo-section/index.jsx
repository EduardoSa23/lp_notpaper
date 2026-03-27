"use client";

import { useMemo, useState } from "react";
import styles from "./comparativo-section.module.scss";

const overviewMetrics = [
  { label: "Facilidade de uso", key: "usabilidade" },
  { label: "Integracoes", key: "integracoes" },
  { label: "Automacao com IA", key: "automacao" },
  { label: "Custo-beneficio", key: "custo" },
];

const competitors = [
  {
    id: "concorrente-1",
    name: "Concorrente 1",
    logo: "concorrente1.png",
    score: 7.2,
    overview: { usabilidade: 67, integracoes: 58, automacao: 51, custo: 63 },
  },
  {
    id: "concorrente-2",
    name: "Concorrente 2",
    logo: "concorrente2.png",
    score: 7.6,
    overview: { usabilidade: 73, integracoes: 64, automacao: 59, custo: 61 },
  },
  {
    id: "concorrente-3",
    name: "Concorrente 3",
    logo: "concorrente3.png",
    score: 7.1,
    overview: { usabilidade: 60, integracoes: 55, automacao: 52, custo: 58 },
  },
  {
    id: "concorrente-4",
    name: "Concorrente 4",
    logo: "concorrente3.png",
    score: 7.4,
    overview: { usabilidade: 68, integracoes: 63, automacao: 56, custo: 60 },
  },
];

const notpaperOverview = {
  score: 9.8,
  overview: { usabilidade: 100, integracoes: 90, automacao: 95, custo: 93 },
};

const featureRows = [
  {
    id: "dashboards",
    feature: "Dashboards ao vivo",
    detail: "Visualizacao em tempo real para toda a operacao",
    notpaper: "Sim",
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
    detail: "Sugestoes de automacao e apoio em processos",
    notpaper: "Nativo",
    competitors: {
      "concorrente-1": "Módulo extra",
      "concorrente-2": "Parcial",
      "concorrente-3": "Nao possui",
      "concorrente-4": "Parcial",
    },
  },
  {
    id: "multicliente",
    feature: "Ambiente multicliente",
    detail: "Gestao centralizada para orgaos e equipes",
    notpaper: "Ilimitado",
    competitors: {
      "concorrente-1": "Limitado",
      "concorrente-2": "Limitado",
      "concorrente-3": "Limitado",
      "concorrente-4": "Limitado",
    },
  },
  {
    id: "setup",
    feature: "Tempo de implantacao",
    detail: "Inicio da operacao com onboarding guiado",
    notpaper: "Setup rapido",
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
    detail: "Atendimento consultivo para operacao publica",
    notpaper: "Time dedicado",
    competitors: {
      "concorrente-1": "Fila padrao",
      "concorrente-2": "Fila padrao",
      "concorrente-3": "Fila padrao",
      "concorrente-4": "Fila padrao",
    },
  },
];

function MetricBar({ label, value }) {
  return (
    <div className={styles.metricRow}>
      <div className={styles.metricHeader}>
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>
      <div className={styles.metricTrack}>
        <span style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function OverviewCard({ logo, score, metrics, spotlight = false }) {
  return (
    <article className={`${styles.overviewCard} ${spotlight ? styles.overviewCardSpotlight : ""}`}>
      <header className={styles.overviewCardHeader}>
        <img className="max-w-[100px]" src={logo ? `/image/concorrentes/${logo}` : "/image/Logo_notpaper.png"} alt="Logo" />
        {spotlight ? <span className={styles.bestPill}>Melhor escolha</span> : null}
      </header>
      <div className={styles.metricsList}>
        {overviewMetrics.map((metric) => (
          <MetricBar key={metric.key} label={metric.label} value={metrics[metric.key]} />
        ))}
      </div>
      <p className={styles.overviewScore}>{score.toFixed(1)} / 10</p>
    </article>
  );
}

export default function ComparativoSection() {
  const [selectedCompetitor, setSelectedCompetitor] = useState(competitors[0].id);

  const selectedName = useMemo(
    () => competitors.find((item) => item.id === selectedCompetitor)?.name ?? "Concorrente",
    [selectedCompetitor],
  );

  return (
    <section className={styles.comparativo}>
      <div className={styles.comparativo__container}>
        <header className={styles.comparativo__header}>
          <h2>Compare nossa plataforma com os principais concorrentes</h2>
          <p>Veja rapidamente onde entregamos mais valor na visao global e no comparativo individual.</p>
        </header>

        <div className={styles.overviewPanel}>
          <div className={styles.overviewCards}>
            {competitors.slice(0, 2).map((competitor) => (
              <OverviewCard key={competitor.id} logo={competitor.logo} score={competitor.score} metrics={competitor.overview} />
            ))}

            <OverviewCard title="notPaper" score={notpaperOverview.score} metrics={notpaperOverview.overview} spotlight />

            {competitors.slice(2).map((competitor) => (
              <OverviewCard key={competitor.id} logo={competitor.logo} score={competitor.score} metrics={competitor.overview} />
            ))}
          </div>
        </div>

        <p className={styles.midText}>
          Veja o comparativo completo com cada concorrente e descubra por que somos a melhor escolha para seu time.
        </p>

        <div className={styles.competitorPicker} role="tablist" aria-label="Escolha do concorrente">
          {competitors.map((competitor) => (
            <button
              key={competitor.id}
              type="button"
              role="tab"
              aria-selected={selectedCompetitor === competitor.id}
              className={`${styles.competitorButton} ${selectedCompetitor === competitor.id ? styles.competitorButtonActive : ""}`}
              onClick={() => setSelectedCompetitor(competitor.id)}
            >
              <img className="max-w-[100px]" src={`/image/concorrentes/${competitor.logo}`} alt={competitor.name} />
            </button>
          ))}
        </div>

        <article className={styles.detailCard}>
          <header className={styles.detailHeader}>
            <h3>Comparacao individual: notPaper x {selectedName}</h3>
            <p>Considere os pontos que impactam diretamente produtividade, custo e velocidade de entrega.</p>
          </header>

          <div className={styles.tableWrap}>
            <table className={styles.compareTable}>
              <thead>
                <tr>
                  <th className="rounded-l-xl">Recursos</th>
                  <th>notPaper</th>
                  <th className="rounded-r-xl">{selectedName}</th>
                </tr>
              </thead>
              <tbody>
                {featureRows.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <strong>{row.feature}</strong>
                      <span>{row.detail}</span>
                    </td>
                    <td className={styles.valueHighlight}>{row.notpaper}</td>
                    <td>{row.competitors[selectedCompetitor]}</td>
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
