## Why

As cinco categorias do blog já existem, já vêm em toda entrega e já aparecem em cada card — mas não organizam nada. Hoje elas são um rótulo: quem chega por um artigo de assinatura eletrônica e quer ler os outros de Segurança e Compliance não tem caminho, e quem chega por busca cai sempre na mesma listagem cronológica única.

O acervo passou de dezesseis posts publicados e cresce por publicação automática. Ordem cronológica é a organização certa para quem acompanha; é a errada para quem chega procurando um assunto — e é por busca orgânica que este blog é lido.

A categoria também é a única informação de assunto que o site tem. Ela vem validada contra uma lista fechada de cinco nomes, o que a torna confiável como eixo de navegação de um jeito que tag livre não seria.

## What Changes

- Cada categoria ganha listagem própria, paginada e com URL estável: `/blog/categoria/<categoria>`, e `/blog/categoria/<categoria>/pagina/<n>` para as seguintes — a mesma forma que a paginação do índice já tem.
- O rótulo de categoria que hoje é texto decorativo no card, no destaque e no cabeçalho do post passa a levar à listagem daquela categoria.
- O índice e as listagens de categoria ganham a barra de categorias, com a contagem de cada uma e a indicação de qual está ativa.
- A fonte de conteúdo ganha as leituras por categoria, no mesmo contrato das existentes: uma página de posts da categoria, o total de páginas dela e a contagem por categoria.
- As listagens de categoria entram no `sitemap.xml`, com título, descrição e canônica próprios.
- `categoria` entra na lista de segmentos reservados, porque `/blog/categoria` passa a ganhar de `/blog/<slug>` na precedência de rotas.

## Capabilities

### New Capabilities

Nenhuma. Duas capacidades existentes crescem.

### Modified Capabilities

- **blog/catalogo** — ganha a navegação por categoria e as listagens por categoria no sitemap.
- **blog/fonte-de-conteudo** — ganha as leituras por categoria.

## Impact

- **Rotas novas:** `app/blog/categoria/[categoria]/page.jsx` e `app/blog/categoria/[categoria]/pagina/[page]/page.jsx`.
- **Leitura:** `lib/blog/queries.js` e `lib/blog/content-source.js` ganham as consultas por categoria; nenhuma consulta existente muda.
- **Modelo:** `lib/blog/model.js` ganha o mapa nome↔URL das cinco categorias e `categoria` em `RESERVED_SLUGS`.
- **Componentes:** o rótulo de categoria vira link em `post-card.jsx`, `blog-hero.jsx` e `post-header.jsx`; entra um componente de barra de categorias.
- **Sem migração de banco.** A coluna `category` já existe, já é preenchida por toda entrega e já tem os cinco valores validados.
- **Sem mudança no contrato de ingestão.** O módulo não precisa saber que isto existe.
