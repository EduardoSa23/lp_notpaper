import { FaChartLine } from "react-icons/fa6";
import Link from "next/link";
import styles from "./hero.module.scss";

export default function QuemSomosHeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.hero__container}>
        <div className={styles.hero__grid}>
          <div className={styles.hero__content}>
            <span className={styles.hero__badge}>NOSSA HISTORIA</span>

            <h1 className={styles.hero__title}>
              Nossa Evolucao <span className={styles.hero__titleHighlight}>Digital</span>
            </h1>

            <p className={styles.hero__text}>
              Nascemos no coracao da era fisica, transformando a eficiencia operacional por meio de solucoes inteligentes. Mas o mundo acelerou, e nos tambem.
            </p>
            <p className={styles.hero__text}>
              Hoje, a notPaper atua com visao de Gestao 4.0, conectando ecossistemas de ECM, automacao de workflow e digitalizacao inteligente em uma jornada continua de evolucao.
            </p>

            <Link href="/" className={styles.hero__button}>Explorar Solucoes</Link>
          </div>

          <div className={styles.hero__media}>
            <img className={styles.hero__image} src="/image/nossa_evolucao.png" alt="Abstracao digital da evolucao tecnologica" />
            <div className={styles.hero__floatingCard}>
              <div className={styles.hero__floatingTitle}>
                <FaChartLine />
                <span>INOVACAO</span>
              </div>
              <p className={styles.hero__floatingText}>Eficiencia 4.0 integrada ao seu fluxo de trabalho.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
