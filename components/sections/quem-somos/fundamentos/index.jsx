import { FaBullseye, FaDiagramProject, FaEye } from "react-icons/fa6";
import styles from "./fundamentos.module.scss";

const fundamentos = [
  {
    icon: FaBullseye,
    title: "Missão",
    description: "Agregar valor e gerar novas tecnologias que potencializam marcas em toda a cadeia logística, do hardware ao workflow.",
  },
  {
    icon: FaEye,
    title: "Visão",
    description: "Criar soluções tecnologicas e economicas que fortalecam o crescimento dos nossos clientes como parceiros digitais de longo prazo.",
  },
  {
    icon: FaDiagramProject,
    title: "Valores",
    description: "Nossos pilares fundamentais para construir relações consistentes e sustentaveis, baseadas em confiança e colaboração.",
    tags: ["Comunicação", "Parceria", "Respeito"],
  },
];

export default function FundamentosValorSection() {
  return (
    <section className={styles.fundamentos}>
      <div className={styles.fundamentos__container}>
        <header className={styles.fundamentos__header}>
          <h2 className={styles.fundamentos__title}>Fundamentos de <span>Valor</span></h2>
          <p className={styles.fundamentos__subtitle}>Construímos o futuro sobre pilares sólidos de tecnologia, proximidade e compromisso humano.</p>
        </header>

        <div className={styles.fundamentos__grid}>
          {fundamentos.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className={styles.fundamentos__card}>
                <div className={styles.fundamentos__iconWrap}>
                  <Icon className={styles.fundamentos__icon} />
                </div>
                <h3 className={styles.fundamentos__cardTitle}>{item.title}</h3>

                {item.tags ? (
                  <div className={styles.fundamentos__tags}>
                    {item.tags.map((tag) => (
                      <span key={tag} className={styles.fundamentos__tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}

                <p className={styles.fundamentos__cardText}>{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
