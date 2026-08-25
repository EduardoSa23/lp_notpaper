-- A regra do post em destaque, em UM lugar.
--
-- O risco que esta view existe para eliminar: a consulta do destaque diz
-- "o marcado, senao o mais recente" e a da listagem diz "exclua o destaque".
-- Se cada uma expressar a regra por conta, elas divergem - e o destaque aparece
-- duplicado no indice ou desaparece dele.
--
-- Todo o criterio cabe num ORDER BY:
--   featured DESC      -> marcado como destaque vem primeiro
--   published_at DESC  -> entre os marcados (ou na ausencia deles), o mais recente
--   slug               -> desempate deterministico quando as datas coincidem
--
-- Sem post publicado, a view devolve nenhuma linha - e e assim que o indice
-- sabe renderizar seu estado vazio.

CREATE VIEW dbo.vw_post_destaque
AS
SELECT TOP 1 id, slug
FROM dbo.posts
WHERE status = 'published'
ORDER BY featured DESC, published_at DESC, slug;
GO
