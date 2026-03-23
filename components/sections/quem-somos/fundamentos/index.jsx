import { FaBullseye, FaDiagramProject, FaEye } from "react-icons/fa6";
import styles from "./fundamentos.module.scss";

const fundamentos = [
  {
    icon: FaBullseye,
    title: "Missao",
    description: "Agregar valor e gerar novas tecnologias que potencializam marcas em toda a cadeia logistica, do hardware ao workflow.",
  },
  {
    icon: FaEye,
    title: "Visao",
    description: "Criar solucoes tecnologicas e economicas que fortalecam o crescimento dos nossos clientes como parceiros digitais de longo prazo.",
  },
  {
    icon: FaDiagramProject,
    title: "Valores",
    description: "Nossos pilares fundamentais para construir relacoes consistentes e sustentaveis, baseadas em confianca e colaboracao.",
    tags: ["Comunicacao", "Parceria", "Respeito"],
  },
];

export default function FundamentosValorSection() {
  return (
    <section className={styles.fundamentos}>
      <div className={styles.fundamentos__container}>
        <header className={styles.fundamentos__header}>
          <h2 className={styles.fundamentos__title}>Fundamentos de Valor</h2>
          <p className={styles.fundamentos__subtitle}>Construimos o futuro sobre pilares solidos de tecnologia, proximidade e compromisso humano.</p>
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
