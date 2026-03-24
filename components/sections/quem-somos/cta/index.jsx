import Link from "next/link";
import styles from "./cta.module.scss";

const metrics = [
  { value: "+500", label: "Empresas Transformadas" },
  { value: "99%", label: "Uptime Garantido" },
  { value: "+15k", label: "Dispositivos Ativos" },
  { value: "24/7", label: "Suporte Especializado" },
];

export default function QuemSomosCtaSection() {
  return (
    <section className={styles.ctaWapper}>
      <div className={styles.ctaWapper__container}>
        <div className={styles.cta}>
          <div className={styles.cta__content}>
            <h2 className={styles.cta__title}>Pronto para a Proxima Fase?</h2>
            <p className={styles.cta__description}>
              A transformacao digital nao e um destino, mas uma evolucao continua. Vamos desenhar juntos o futuro da sua infraestrutura.
            </p>
            <Link href="/contato" className={styles.cta__button}>Falar com um Especialista</Link>
          </div>

          <div className={styles.cta__metrics}>
            {metrics.map((item) => (
              <article key={item.label} className={styles.cta__metricCard}>
                <p className={styles.cta__metricValue}>{item.value}</p>
                <p className={styles.cta__metricLabel}>{item.label}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
