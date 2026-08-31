## 1. Categoria como endereço

- [x] 1.1 Construir em `lib/blog/model.js` o mapa nome↔URL das cinco categorias a partir de `BLOG_CATEGORIES`, com a busca reversa — verificar que as cinco produzem `gestao-publica`, `ged`, `automacao`, `seguranca-e-compliance` e `transformacao-digital`, e que a busca reversa devolve o nome exato para cada
- [x] 1.2 Acrescentar `categoria` a `RESERVED_SLUGS` — verificar que um post entregue com título que produza esse slug ganha slug distinto pela ingestão, e não sequestra a rota
- [x] 1.3 Confirmar que nenhuma das cinco URLs de categoria colide com `pagina`, `capa` ou com slug de post existente — verificar consultando o acervo, não por inspeção

## 2. Leituras por categoria

- [x] 2.1 Escrever em `lib/blog/queries.js` a consulta de uma página de posts por categoria, **sem** excluir o destaque — verificar que o post em destaque aparece na listagem da categoria dele
- [x] 2.2 Escrever a consulta do total de páginas de uma categoria — verificar que confere com a contagem real e que categoria sem post dá zero
- [x] 2.3 Escrever a contagem por categoria em uma única consulta com agrupamento — verificar no log do banco que é uma ida, não cinco
- [x] 2.4 Expor as três em `lib/blog/content-source.js` com a tag de cache `blog` — verificar que uma ingestão revalida as páginas de categoria sem nenhuma linha nova na rota de ingestão
- [x] 2.5 Confirmar que categoria não reconhecida devolve ausência de resultado, sem erro — verificar com um valor inventado
- [x] 2.6 Confirmar que rascunho não entra em listagem nem em contagem de categoria — verificar com o rascunho que já existe no acervo

## 3. Rotas

- [x] 3.1 Criar `app/blog/categoria/[categoria]/page.jsx` com título, descrição e canônica próprios — verificar que a primeira página da categoria responde na URL da categoria
- [x] 3.2 Criar `app/blog/categoria/[categoria]/pagina/[page]/page.jsx` reaproveitando a grade e a paginação existentes — verificar que a navegação entre páginas da categoria não repete post
- [x] 3.3 Fazer categoria desconhecida cair na página de conteúdo não encontrado — verificar com uma URL inventada
- [x] 3.4 Fazer categoria conhecida e sem post publicado renderizar a mensagem de ausência de conteúdo, e **não** 404 — verificar com uma das cinco que estiver vazia no acervo
- [x] 3.5 Fazer página além do total de páginas da categoria cair em conteúdo não encontrado — verificar que não vira listagem vazia
- [x] 3.6 Confirmar que a segunda página da categoria volta para a URL da categoria, e não para uma `pagina/1` — verificar que a primeira página tem endereço único

## 4. Interface

- [x] 4.1 Transformar o rótulo de categoria em link em `post-card.jsx`, `blog-hero.jsx` e `post-header.jsx` — verificar que o link do card não conflita com o card inteiro ser clicável
- [x] 4.2 Criar a barra de categorias com contagem e indicação de ativa, oferecendo o caminho de volta à listagem geral — verificar que ela só lista categorias com post publicado
- [x] 4.3 Colocar a barra no índice, nas páginas de listagem e nas listagens de categoria — verificar que a categoria ativa está indicada em cada caso
- [x] 4.4 Conferir a barra no mobile — verificar que cinco categorias com contagem não estouram a largura nem forçam rolagem horizontal da página

## 5. SEO

- [x] 5.1 Acrescentar as listagens de categoria e suas páginas ao `sitemap.xml` — verificar que aparecem, e que categoria sem post publicado **não** aparece
- [x] 5.2 Conferir título, descrição e canônica de cada listagem de categoria — verificar que a canônica da primeira página é a URL da categoria

## 6. Verificação final

- [x] 6.1 Percorrer as cinco categorias e todas as páginas delas — verificar que a soma dos posts por categoria fecha com o total publicado, sem post ausente nem repetido
- [x] 6.2 Publicar um post pela ingestão e conferir que ele aparece na listagem da categoria dele e que a contagem sobe, sem novo deploy — verificar os dois
- [x] 6.3 Rodar `npm run lint` e `npm run build` — verificar que terminam sem erro
