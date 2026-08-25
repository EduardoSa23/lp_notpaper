/**
 * Pagina 500 do site.
 *
 * Unico arquivo do pages router no projeto, e ha um motivo medido para ele:
 *
 * Quando o Next renderiza SOB DEMANDA uma pagina que nao foi pre-renderizada no
 * build (um post publicado depois dele) e essa renderizacao falha, ele trata a
 * falha como falha de GERACAO. Nesse caminho, `app/blog/error.jsx` e
 * `app/global-error.jsx` NAO entram - verificado com o banco inalcancavel: as
 * duas fronteiras foram ignoradas e o visitante recebeu a pagina embutida do
 * Next. Quem serve aquele caminho e o `_error` do pages router, e este arquivo
 * e como se troca o conteudo dele.
 *
 * A alternativa era `export const dynamic = "force-dynamic"` na rota do post,
 * que faria as fronteiras funcionarem - ao custo de cada visita consultar o
 * banco, violando o requisito de servir de cache. Este arquivo resolve sem esse
 * custo.
 *
 * Estilo em linha porque esta pagina precisa funcionar quando o resto falhou:
 * ela nao depende do layout, dos componentes nem do Tailwind ter carregado.
 */
export default function Erro500() {
  return (
    <div
      style={{
        minHeight: "100vh",
        margin: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        backgroundColor: "#eceff6",
        fontFamily: 'Inter, -apple-system, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: "36rem",
          width: "100%",
          backgroundColor: "#fff",
          borderRadius: "1.5rem",
          padding: "2.5rem",
          textAlign: "center",
          boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#0043FE",
          }}
        >
          notPaper
        </p>
        <h1 style={{ margin: "0.75rem 0 0", fontSize: "1.75rem", color: "#111827" }}>
          Não foi possível carregar esta página
        </h1>
        <p style={{ margin: "1rem 0 0", lineHeight: 1.6, color: "#4b5563" }}>
          Houve uma falha ao buscar o conteúdo. Tente de novo em alguns instantes — o restante do
          site continua disponível.
        </p>

        <div style={{ marginTop: "2rem" }}>
          {/* `<a>` de proposito, e nao `next/link`: esta pagina aparece quando a
              renderizacao falhou, e uma navegacao real e mais confiavel aqui do
              que uma transicao de rota do cliente. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/blog"
            style={{
              display: "inline-block",
              borderRadius: "0.5rem",
              backgroundColor: "#0043FE",
              color: "#fff",
              fontWeight: 600,
              padding: "0.75rem 1.5rem",
              textDecoration: "none",
            }}
          >
            Voltar para o blog
          </a>
        </div>
      </div>
    </div>
  );
}
