## Context

O blog serve dezesseis posts publicados por uma consulta cronológica única, paginada de seis em seis, com o destaque no topo do índice e excluído da grade pela `vw_post_destaque`. A categoria de cada post vem na entrega, é validada contra `BLOG_CATEGORIES` — cinco nomes fixos — e é usada em dois lugares: como rótulo no card e como critério de prioridade dos relacionados (`ORDER BY CASE WHEN p.category = a.category THEN 0 ELSE 1 END`).

Ou seja: a informação está lá, confiável e completa, e o site já sabe consultá-la. Falta expô-la como navegação.

Duas coisas do desenho atual condicionam esta fatia:

- **A paginação já tem uma forma estabelecida** — `/blog` para a primeira página e `/blog/pagina/<n>` para as demais, com a primeira página tendo endereço único. A listagem por categoria deve repetir essa forma, não inventar outra.
- **O destaque é excluído da listagem paginada** porque ele aparece no topo do índice. Isso é do índice, não da categoria.

## Goals / Non-Goals

**Goals**

- Um caminho de navegação por assunto, indexável, com URL compartilhável.
- Reaproveitar a paginação, a grade e o cache que já existem, em vez de duplicá-los.
- Nenhuma mudança no contrato de ingestão, no banco ou no módulo de origem.

**Non-Goals**

- Busca por texto. É outro problema, com outra solução, e não sai da categoria.
- Tags como eixo de navegação. A coluna existe e está vazia em todos os posts; navegar por campo vazio não é navegação.
- Categoria editável pelo site. Ela vem na entrega, e é lá que se corrige.
- Múltiplas categorias por post. O modelo tem uma, o módulo envia uma.

## Decisions

### 1. A URL da categoria deriva do nome, e a lista fechada é o que torna isso seguro

`Segurança e Compliance` vira `seguranca-e-compliance` pela mesma regra que já gera slug de post — minúsculas, sem acento, hífen no lugar do resto. As cinco viram `gestao-publica`, `ged`, `automacao`, `seguranca-e-compliance` e `transformacao-digital`.

A alternativa seria uma lista paralela de URLs escritas à mão. Rejeitada: duas listas que precisam concordar acabam discordando, e o sintoma seria uma categoria com página inacessível.

O mapa nome↔URL SHALL ser construído uma vez a partir de `BLOG_CATEGORIES`, com a busca reversa feita nele. Renomear uma categoria muda a URL dela — é consequência aceita e registrada: renomear uma das cinco é ato deliberado e raro, e a alternativa (URL congelada divergindo do nome exibido) é pior de manter.

### 2. `categoria` vira segmento reservado, pelo mesmo motivo que `pagina` e `capa`

`/blog/categoria/...` ganha de `/blog/[slug]` na precedência do Next. Um post cujo título produza o slug `categoria` sequestraria a rota inteira.

Isto **não** exige mudança de spec: o requisito de slug gerado pelo site já diz "um segmento reservado pelas rotas do blog", sem enumerar quais. Só a lista da implementação cresce. É o desenho genérico pagando o investimento.

### 3. A listagem de categoria NÃO exclui o destaque

O índice exclui o destaque da grade porque ele já está no topo da mesma página. A listagem de categoria não tem topo de destaque — se ela usasse a consulta do índice, o post em destaque **desapareceria da própria categoria dele**, que é o post mais provável de alguém querer achar ali.

Consequência de desenho: a consulta por categoria é uma consulta nova, não um parâmetro na existente. As duas divergem justamente na cláusula que exclui o destaque, e essa diferença é o motivo delas serem duas.

### 4. Categoria desconhecida é 404; categoria conhecida e vazia é página vazia

São dois casos diferentes e merecem respostas diferentes:

- **URL que não corresponde a nenhuma das cinco** — conteúdo não encontrado. Não existe essa seção.
- **Uma das cinco, sem post publicado** — a seção existe e está temporariamente vazia. Devolver 404 aqui seria mentir sobre a estrutura do blog, e faria a página aparecer e desaparecer conforme o que o módulo publica.

A barra de categorias SHALL mostrar apenas as que têm ao menos um post publicado, para que nenhum link levado por ela chegue a uma página vazia. A URL direta continua respondendo.

### 5. A contagem por categoria é uma consulta, não cinco

A barra precisa do total de cada categoria. Cinco consultas de contagem, ou uma com `GROUP BY category` — e a segunda é uma ida ao banco em vez de cinco, para um dado que muda só quando um post entra.

Ela entra no cache com a tag `blog`, como as demais. Isso significa que a ingestão **já** revalida as páginas de categoria e as contagens, sem uma linha nova na rota de ingestão: `revalidateTag("blog")` já está lá.

### 6. Sem `generateStaticParams` para as categorias

As cinco são conhecidas em tempo de build, então dá para pré-gerar. Mas o número de páginas de cada uma depende do banco, e o banco muda por publicação automática — pré-gerar a paginação de categoria criaria a mesma classe de problema que a paginação do índice já resolveu ficando dinâmica.

As páginas de categoria seguem o regime das demais páginas do blog: geradas sob demanda, com cache por tag.

### 7. O sitemap ganha as categorias, e o volume é conhecido

Cinco categorias, cada uma com pelo menos uma página. Com dezesseis posts em cinco categorias, algo entre cinco e dez URLs novas — ordem de grandeza irrelevante para um sitemap que já lista dezesseis posts e suas páginas de listagem.

A regra de composição é a mesma da paginação do índice: página 1 pela URL da categoria, e as seguintes pela URL paginada.
