Assunções adotadas para as Open Questions do design (nenhuma altera o que será construído, só valores de mock/constantes): autor institucional `Equipe notPaper` nos posts mock, `POSTS_PER_PAGE = 6`, `RELATED_POSTS_COUNT = 3`.

## 1. Modelo e camada de dados

- [x] 1.1 Criar `lib/blog/model.js` com os tipos de bloco válidos (`paragraph | heading | list | quote | image`), as constantes `POSTS_PER_PAGE = 6` e `RELATED_POSTS_COUNT = 3`, o slug reservado `pagina` e `assertPostsIntegrity(posts)` validando campos obrigatórios, slug único, slug em minúsculas sem acento/espaço e slug não reservado — verificar chamando a função com uma lista contendo slug duplicado e com um slug `pagina`, confirmando que cada caso lança erro com o slug citado na mensagem
- [x] 1.2 Criar `lib/blog/headings.js` com o slugify de subtítulo e o desempate numérico de âncoras colididas — verificar que dois `heading` com o mesmo texto produzem ids diferentes e estáveis na mesma ordem
- [x] 1.3 Criar `lib/blog/urls.js` com os helpers de caminho e URL absoluta do blog (índice, página N, post), respeitando barra final para casar com `trailingSlash` do export estático — verificar que o helper de post devolve `/blog/<slug>/` e a URL absoluta usa o domínio de `metadataBase`
- [x] 1.4 Criar `data/blog-posts.js` com no mínimo 8 posts mock (pelo menos 1 `featured`, pelo menos 3 categorias distintas, 1 post exercitando todos os tipos de bloco e 1 post com `status: "draft"`) — verificar que `assertPostsIntegrity` passa sobre o arquivo e que o volume gera mais de uma página de listagem
- [x] 1.5 Criar `lib/blog/mock-source.js` lendo `data/blog-posts.js`, filtrando `status: "published"` e ordenando por `publishedAt` desc com desempate por `slug` — verificar que o rascunho da tarefa 1.4 não aparece no resultado e que duas execuções devolvem a mesma ordem
- [x] 1.6 Criar `lib/blog/content-source.js` expondo o contrato `async` (`getPostsPage`, `getPageCount`, `getPostBySlug`, `getFeaturedPost`, `getRelatedPosts`, `getAllPublishedSlugs`) delegando ao mock-source — verificar que `getPostBySlug` com slug inexistente devolve ausência de resultado sem lançar, que `getFeaturedPost` cai no post mais recente quando nenhum está marcado, e que `getRelatedPosts` prioriza a mesma categoria, exclui o próprio post e completa com os mais recentes

## 2. Componentes de apresentação

- [x] 2.1 Adicionar as capas mock em `public/image/blog/` com dimensões reais e registrar largura/altura usadas nos componentes — verificar que as imagens carregam em `npm run dev` sem salto de layout
- [x] 2.2 Criar `components/sections/blog/post-card.jsx` (capa, categoria, título, resumo, data e tempo de leitura, card inteiro linkando o post) seguindo o padrão visual do site (`#eceff6`, azul `#0043FE`, `font-inter`) — verificar que o card renderiza os seis dados e navega para o post ao ser acionado
- [x] 2.3 Criar `components/sections/blog/blog-hero.jsx` com o cabeçalho da área e o post em destaque em formato ampliado, com `priority` na capa — verificar que o destaque aparece no topo de `/blog` e não se repete na grade
- [x] 2.4 Criar `components/sections/blog/post-grid.jsx` renderizando os cards da página e o estado de lista vazia com a mensagem de ausência de conteúdo — verificar os dois estados (com posts e com lista vazia)
- [x] 2.5 Criar `components/sections/blog/blog-pagination.jsx` com indicação da página atual, anterior/seguinte apenas quando existirem, e primeira página sempre apontando para `/blog` — verificar em `/blog` (sem "anterior") e na última página (sem "seguinte")
- [x] 2.6 Criar `components/sections/blog/post-header.jsx` (capa, categoria, título, resumo, autor com cargo, data, tempo de leitura e tags) — verificar que todos os metadados aparecem na página de um post
- [x] 2.7 Criar `components/sections/blog/post-body.jsx` com dispatch por tipo de bloco, `id` nos `heading` vindo de `lib/blog/headings.js` e bloco de tipo desconhecido ignorado — verificar renderizando o post da tarefa 1.4 que usa todos os tipos, e um bloco de tipo inventado que deve ser omitido sem quebrar a página
- [x] 2.8 Criar `components/sections/blog/post-toc.jsx` gerando o sumário a partir dos `heading` e ancorando na seção, omitido quando o post não tem subtítulo — verificar a navegação por âncora e o post sem `heading`
- [x] 2.9 Criar `components/sections/blog/post-share.jsx` (`"use client"`) com copiar link via `navigator.clipboard` mais fallback e confirmação por `sweetalert2`, e links de LinkedIn e WhatsApp com `target="_blank" rel="noopener"` usando a URL canônica — verificar que o link copiado é a URL canônica e que nenhum script de terceiro é carregado na página
- [x] 2.10 Criar `components/sections/blog/related-posts.jsx` exibindo até `RELATED_POSTS_COUNT` sugestões e omitindo a seção quando não houver outro post publicado — verificar com um post que tem relacionados na categoria e simulando fonte com um único post

## 3. Rotas

- [x] 3.1 Criar `app/blog/page.jsx` compondo `SiteHeader` + `main` + hero/destaque, grade e paginação + `SiteFooter`, com `metadata` (título, descrição, canônico `/blog`) no padrão das páginas existentes — verificar `/blog` em `npm run dev` exibindo destaque, grade e paginação
- [x] 3.2 Criar `app/blog/pagina/[page]/page.jsx` com `generateStaticParams` gerando as páginas 2..N, `notFound()` para página fora do intervalo e redirecionamento de `/blog/pagina/1` para `/blog` — verificar `/blog/pagina/2` com os posts seguintes sem repetir a página 1, uma página inexistente caindo no não encontrado, e `/blog/pagina/1` levando a `/blog`
- [x] 3.3 Criar `app/blog/[slug]/page.jsx` com `generateStaticParams` a partir de `getAllPublishedSlugs`, `generateMetadata` (título, descrição, canônico, Open Graph com a capa) e `notFound()` para slug ausente ou rascunho — verificar a página de um post publicado, a prévia de compartilhamento com título/descrição/capa, e um slug inválido caindo no não encontrado
- [x] 3.4 Adicionar os dados estruturados de artigo (título, autor, data de publicação) na página do post, reaproveitando o padrão de `components/seo/structured-data.jsx` — verificar que o JSON-LD aparece no HTML da página do post
- [x] 3.5 Criar `app/blog/not-found.jsx` mantendo cabeçalho e rodapé e com link de retorno para `/blog` — verificar acessando um slug inexistente

## 4. Integração com o site

- [x] 4.1 Adicionar o link "Blog" ao menu desktop e ao menu mobile em `components/layout/header.jsx`, no mesmo estilo dos demais itens — verificar que o link aparece e leva a `/blog` nas duas larguras
- [x] 4.2 Incluir no `app/sitemap.xml/route.js` a rota do índice, as páginas de listagem e cada post publicado, sem nenhum rascunho — verificar o XML gerado contendo as URLs esperadas e nenhuma URL de rascunho
- [x] 4.3 Adicionar o link do blog na navegação do `components/layout/footer.jsx` se o rodapé listar rotas do site — verificar visualmente o rodapé (ou registrar que o rodapé não lista rotas e nada muda)

## 5. Verificação final

- [x] 5.1 Rodar `npm run dev` e percorrer o fluxo completo: `/blog` → página 2 → post → sumário → compartilhar (copiar link) → relacionado → volta ao blog, mais um slug inválido — verificar que cada passo se comporta como nos cenários dos specs
- [x] 5.2 Rodar `npm run build:static` e conferir a saída — verificar que existem `out/blog/`, `out/blog/pagina/2/` e uma pasta por post publicado, que não existe `out/blog/pagina/1/` e que nenhum rascunho gerou pasta
- [x] 5.3 Rodar `npm run lint` e corrigir o que aparecer nos arquivos novos — verificar que o lint termina sem erro

## 6. Trilha lateral na página do post (desktop)

- [x] 6.1 Criar `components/sections/blog/post-cta.jsx` com a chamada para contato reaproveitando `BtnWhatsapp` — verificar que o botão abre o WhatsApp em nova aba e que o link é o mesmo de `components/ui/btn-whatsapp.jsx`, sem número duplicado no código
- [x] 6.2 Converter `components/sections/blog/post-toc.jsx` em client component com `IntersectionObserver` sobre os `id` dos subtítulos, marcando a seção em leitura — verificar que ao descer o post o item destacado troca, que só um item fica marcado por vez, e que no topo (antes do primeiro subtítulo) nenhum fica marcado
- [x] 6.3 Reestruturar `app/blog/[slug]/page.jsx` para a grade `lg:grid-cols-[minmax(0,1fr)_20rem]` com a trilha `sticky top-28 self-start` à direita (sumário, compartilhar, CTA) e `Leia também` em largura completa abaixo — verificar em tela larga que a trilha acompanha o scroll sem cobrir conteúdo nem header, e que os relacionados ocupam a largura toda
- [x] 6.4 Garantir a ordem no mobile por `order-*` na grade, sem duplicar componente (sumário antes do corpo, compartilhar depois do corpo, CTA antes dos relacionados) — verificar em tela estreita a ordem dos blocos e que cada `id` de âncora aparece uma única vez no HTML
- [x] 6.5 Rodar `npm run lint` e `npm run build:static` depois da reestruturação — verificar que o lint segue sem erro nos arquivos novos e que as rotas do blog continuam sendo geradas em `out/`
