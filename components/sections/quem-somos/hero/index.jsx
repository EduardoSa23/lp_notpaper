import { FaChartLine } from "react-icons/fa6";
import Link from "next/link";
import styles from "./hero.module.scss";

export default function QuemSomosHeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.hero__container}>
        <div className={styles.hero__grid}>
          <div className={styles.hero__content}>
            <span className={styles.hero__badge}>NOSSA HISTÓRIA</span>

            <h1 className={styles.hero__title}>
              Nossa Evolução <span className={styles.hero__titleHighlight}>Digital</span>
            </h1>

            <p className={styles.hero__text}>
              Nascemos no coração da era física, transformando a eficiência operacional por meio de soluções inteligentes. Mas o mundo acelerou, e nos também.
            </p>
            <p className={styles.hero__text}>
              Hoje, a notPaper atua com visão de Gestão 4.0, conectando ecossistemas de ECM, automação de workflow e digitalização inteligente em uma jornada contínua de evolução.
            </p>

            <Link href="/solucoes" className={styles.hero__button}>Explorar Soluções</Link>
          </div>

          <div className={styles.hero__media}>
            <img className={styles.hero__image} src="/image/nossa_evolucao.png" alt="Abstracao digital da evolucao tecnologica" />
            <div className={styles.hero__floatingCard}>
              <div className={styles.hero__floatingTitle}>
                <FaChartLine />
                <span>INOVAÇÃO</span>
              </div>
              <p className={styles.hero__floatingText}>Eficiência 4.0 integrada ao seu fluxo de trabalho.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
