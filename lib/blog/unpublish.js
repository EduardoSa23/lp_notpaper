import { query, types } from "@/lib/blog/db";

/**
 * Despublicacao de um post pelo identificador externo.
 *
 * ── POR QUE DESPUBLICAR, E NAO APAGAR A LINHA ───────────────────────────────
 *
 * Toda leitura filtra `status = 'published'` (`queries.js`), entao virar
 * rascunho tira o post do site por completo: indice, paginacao, categoria,
 * relacionados, sitemap, rotas geradas e a propria capa, que responde 404
 * quando o post nao esta publicado. O efeito visivel e o mesmo de apagar.
 *
 * O que se ganha em nao apagar: o texto e os bytes da capa continuam no banco,
 * e o `id_externo` segue reconhecido - uma reentrega do modulo volta a ser
 * atualizacao do MESMO post, com o MESMO slug, e nao um post novo com slug
 * sufixado. Apagar a linha jogaria fora a unica copia do conteudo que o site
 * tem e romperia a identidade publica do endereco.
 *
 * ── IDEMPOTENTE POR CONSTRUCAO ──────────────────────────────────────────────
 *
 * Despublicar o que ja esta em rascunho nao e erro: o estado final e o pedido.
 * Isso e o que permite a quem chama repetir a operacao sem consultar antes.
 */

/**
 * Marca o post como rascunho.
 *
 * @param {string} idExterno `Publicacao.Id` do modulo de marketing.
 * @returns {Promise<{ slug: string, jaEraRascunho: boolean } | null>} `null`
 *   quando nenhum post tem esse identificador externo.
 */
export async function unpublishPost(idExterno) {
  // O slug sai do OUTPUT, e nao de um SELECT antes: em duas consultas, uma
  // reentrega simultanea poderia mudar a linha no meio, e quem chama revalidaria
  // a tag de um slug que nao e mais o do post.
  //
  // `featured = 0` junto: a view do destaque so olha publicados, entao um
  // rascunho marcado nao muda nada HOJE. Mas ele e uma armadilha guardada -
  // republicar essa linha a mao devolveria ao ar um destaque que ninguem
  // escolheu. Despublicar e desistir do post, inclusive do destaque dele.
  const rows = await query(
    `UPDATE dbo.posts
        SET status = 'draft',
            featured = 0,
            updated_at = SYSDATETIMEOFFSET()
      OUTPUT deleted.slug AS slug, deleted.status AS situacao_anterior
      WHERE id_externo = @id`,
    { id: { type: types.uuid, value: idExterno } }
  );

  if (rows.length === 0) return null;

  return { slug: rows[0].slug, jaEraRascunho: rows[0].situacao_anterior === "draft" };
}
