## Context

Ver `proposal.md` — Why. Restrições do projeto que moldam o desenho:

- Next 15 App Router, React 19, JavaScript puro (`.jsx`/`.js`, sem TypeScript), Tailwind, alias `@/*` para a raiz.
- `next.config.js` liga `output: "export"` + `trailingSlash: true` + `images.unoptimized` quando `STATIC_EXPORT=1`. O blog **precisa** sair no `out/` (decisão do usuário), logo: sem middleware, sem route handler dinâmico, sem `searchParams` como fonte de dados de página.
- `scripts/build-static.js` move `middleware.js`, `app/api` e `app/diretoria` para fora do build estático. O blog não pode depender de nada que esteja nessa lista.
- Convenções existentes: página fina em `app/<rota>/page.jsx` exportando `metadata` e compondo `<SiteHeader />` + `<main className="font-inter bg-[#eceff6]">` + seções de `components/sections/<area>/` + `<SiteFooter />`. Mocks vivem em `data/` (conteúdo) e `lib/` (acesso/constantes), como `data/notpaper-items.js` e `lib/mock-directoria-presentations.js`.
- Azul da marca: `#0043FE`. Fundo de página: `#eceff6`.
- A API e o banco do blog ainda não existem; o post automático (IA/marketing) será a única forma de criação. Nada disso é implementado aqui.

## Goals / Non-Goals

**Goals:**

- Isolar 100% do acesso a conteúdo em um módulo só (`lib/blog/`), de forma que trocar mock por API seja mudar um arquivo, não as páginas.
- Manter todas as rotas do blog geráveis no build (`generateStaticParams`), compatíveis com `npm run dev` e com `npm run build:static`.
- Modelar o post já com os campos que o post automático vai preencher, para não haver migração de formato quando a API entrar.
- Render de conteúdo por blocos tipados, sem `dangerouslySetInnerHTML`, para que conteúdo gerado por IA não possa injetar markup na página.

**Non-Goals:**

- Não desenhar o schema do banco nem os endpoints da API — só o contrato de leitura que a API terá que satisfazer.
- Não introduzir CMS, MDX, biblioteca de markdown ou qualquer dependência nova.
- Não implementar busca, filtro por categoria/tag ou rota de categoria (o modelo já carrega `category`/`tags`, mas as rotas ficam para depois).
- Não tratar revalidação/ISR: no modo estático o conteúdo é congelado no build por definição.

## Decisions

### 1. Camada de dados: contrato síncrono em `lib/blog/`, mock por trás

`lib/blog/content-source.js` exporta as operações do contrato (`getPostsPage`, `getPostBySlug`, `getFeaturedPost`, `getRelatedPosts`, `getAllPublishedSlugs`, `getPageCount`). Hoje elas leem `data/blog-posts.js` via `lib/blog/mock-source.js`; amanhã `content-source.js` passa a chamar a API. As páginas importam **apenas** `lib/blog/content-source.js`.

As funções são declaradas `async` mesmo servindo mock. Motivo: quando a fonte virar `fetch`, a assinatura não muda e nenhum componente precisa ser convertido — em Server Components o custo de um `await` em valor já resolvido é irrelevante. Alternativa considerada: contrato síncrono agora e refatorar depois — rejeitada porque é exatamente o retrabalho que esta mudança existe para evitar.

`lib/blog/model.js` concentra o modelo: os tipos de bloco válidos, os defaults e um `assertPostsIntegrity()` que valida slug único e campos obrigatórios. Alternativa considerada: Zod para validação — rejeitada por ser dependência nova para um problema que três checagens resolvem.

### 2. Paginação por rota, não por query string

Página 1 em `/blog`; páginas 2+ em `/blog/pagina/[page]` com `generateStaticParams` gerando 2..N. `?page=2` está fora: `searchParams` não existe em export estático e produziria URL não indexável.

`/blog/pagina/1` gera `redirect("/blog")` (dev) e, no estático, simplesmente **não é gerado** — mantendo um único endereço canônico para a primeira página, como pede o spec. `POSTS_PER_PAGE` vive em `lib/blog/model.js`, valor inicial 6 (1 destaque + 6 cards na primeira tela).

Alternativa considerada: "carregar mais" client-side. Rejeitada: com mock funciona, mas manda todos os posts para o bundle e não gera URL por página — quebra quando o volume crescer e não serve para SEO, que é a razão de existir do blog.

### 3. Rotas e composição

```
app/blog/page.jsx                 -> índice (página 1)
app/blog/pagina/[page]/page.jsx   -> páginas 2..N (generateStaticParams)
app/blog/[slug]/page.jsx          -> post (generateStaticParams + generateMetadata)
app/blog/not-found.jsx            -> slug/página inexistente, com volta para /blog
```

Conflito de rota resolvido por precedência do Next: `pagina` é segmento estático e ganha de `[slug]`, então nenhum post pode ter o slug `pagina` — `assertPostsIntegrity()` trata `pagina` como slug reservado e falha o build se aparecer.

Seções em `components/sections/blog/`: `blog-hero.jsx` (título da área + post em destaque), `post-card.jsx`, `post-grid.jsx`, `blog-pagination.jsx`, `post-header.jsx`, `post-body.jsx` (dispatch por tipo de bloco), `post-toc.jsx` (client), `post-share.jsx` (client), `post-cta.jsx`, `related-posts.jsx`. A lista/índice é toda Server Component; na página do post, apenas `post-toc.jsx` (destaque da seção em leitura) e `post-share.jsx` (clipboard + confirmação) são `"use client"`.

### 4. Conteúdo como blocos tipados

`content` é uma lista de `{ type, ... }` com `type` em `paragraph | heading | list | quote | image`. `post-body.jsx` faz dispatch por `type` e ignora tipo desconhecido. Sem HTML livre: é o que permite aceitar texto gerado por IA sem risco de injeção e é o formato que a API deverá devolver.

Ids de âncora do sumário derivam do texto do `heading` por slugify, com sufixo numérico em caso de colisão — o mesmo cálculo alimenta `post-toc.jsx` e os `id` em `post-body.jsx`, num helper único (`lib/blog/headings.js`) para não divergirem.

### 5. Trilha lateral no post: grade de duas colunas com coluna sticky

A página do post passa de uma coluna centrada para `lg:grid-cols-[minmax(0,1fr)_20rem]` com `gap-12`: conteúdo à esquerda, trilha à direita. Abaixo de `lg` a grade colapsa para uma coluna e os blocos da trilha voltam ao fluxo vertical, cada um na posição que o spec define (sumário antes do corpo, compartilhar depois do corpo, contato depois do compartilhar).

Ordem visual no mobile controlada por `order-*` na própria grade, não por duplicar componente: um bloco renderizado duas vezes (um `hidden lg:block`, outro `lg:hidden`) duplicaria os `id` das âncoras do sumário e quebraria a navegação. Cada bloco existe uma única vez.

A trilha usa `sticky` com `lg:top-20` (5rem, pouco acima dos ~72px do header fixo) — esse `top` é a folga da trilha durante o scroll, e não existe `margin` nenhuma no container, o que costuma confundir quem vai ajustar o espaçamento. O espaço inicial, antes de rolar, vem do `pt-32` do container da página. O container da coluna recebe `self-start`, sem o qual o item de grade estica e o `sticky` não tem folga para agir.

O cabeçalho do post (voltar, categoria, título, resumo, autor, data, tags e capa) fica **dentro** da coluna de conteúdo, acima do corpo, e não como seção de largura total acima da grade. A capa segue a medida do texto (`max-w-3xl`) e recorta para `aspect-[16/7]` via `object-cover`, em vez de usar o 16:9 do arquivo na largura inteira da coluna - a faixa fica mais baixa sem espremer a imagem. É o que alinha tudo à esquerda numa única medida e faz a trilha começar ao lado do título em vez de só depois da capa. O `pt-32` que dava a folga do header fixo saiu do cabeçalho e foi para o container da página, para as duas colunas começarem na mesma altura.

Os posts relacionados ficam **fora** dessa grade, como irmão logo abaixo dela. É o que dá o limite do percurso da trilha: `sticky` só se move dentro do seu bloco container, então terminar a grade no fim do artigo faz a trilha parar exatamente ali, em vez de continuar descendo por cima do "Leia também". Como os relacionados vêm depois da grade no DOM, a ordem no mobile continua correta sem `order` nenhum neles.

Alternativa considerada: posicionar a trilha com `position: fixed` e offsets calculados. Rejeitada — `sticky` dentro da grade resolve sem medir nada em JavaScript e não descola em zoom ou em viewport curta.

**Pré-requisito global**: `app/globals.css` tinha `body { overflow-x: hidden }`, o que torna o `body` um scroll container e faz `sticky` se ancorar nele em vez da viewport — a trilha simplesmente não saía do lugar. Trocado por `overflow-x: clip` dentro de `@supports (overflow: clip)`, mantendo `hidden` como fallback: `clip` corta o transbordo horizontal do mesmo jeito sem criar scroll container. O `html` do projeto já usava `clip`, então o suporte já era pressuposto. Afeta todas as páginas do site, não só o blog.

### 6. Destaque da seção em leitura: observer proprio, nao o `useInView` existente

O hook `hooks/useInView.jsx` do projeto chama `observer.disconnect()` no primeiro cruzamento — ele responde "já apareceu?" e nunca volta atrás. Rastrear a seção atual exige o oposto: um observer que continua reportando entradas e saídas enquanto o leitor sobe e desce. Reaproveitá-lo exigiria alterar seu comportamento, o que afetaria as seções institucionais que já dependem dele.

Então o sumário lateral vira um client component próprio (`post-toc.jsx` com `"use client"`) que observa os `id` dos subtítulos com `IntersectionObserver` e marca o último que entrou na faixa superior da viewport (`rootMargin` negativo no topo, para o destaque trocar quando o título chega ao alto e não quando encosta no rodapé da tela). Sem seção visível — leitor no topo, antes do primeiro subtítulo — nenhum item fica marcado.

Isso adiciona o segundo (e último) client component da página, junto com `post-share.jsx`. O corpo, o cabeçalho e os relacionados seguem server components.

### 7. Compartilhamento sem terceiros

A chamada para contato reaproveita `BtnWhatsapp` (`components/ui/btn-whatsapp.jsx`), que já aponta para o número de atendimento do site - o CTA não redefine o link.

Links `https://www.linkedin.com/sharing/...` e `https://wa.me/?text=...` como `<a target="_blank" rel="noopener">`, mais um botão de copiar via `navigator.clipboard` com fallback e confirmação por `sweetalert2` (já é dependência do projeto). Nenhum SDK de rede social é carregado — evita peso e rastreamento na página de leitura.

### 8. URL canônica no estático

`trailingSlash: true` no modo estático faz a URL real ser `/blog/meu-post/`. As páginas montam canônico e URLs de compartilhamento a partir de `metadataBase` + caminho com barra final, e usam sempre um helper (`lib/blog/urls.js`), para que dev e estático não divirjam.

### 9. Imagens

Capas em `/public/image/blog/`, servidas por `next/image` com `sizes` explícito e `blur` reaproveitando `lib/blur-data-url.js`. No estático `images.unoptimized` já está ligado, então nada a fazer — mas as capas mock precisam entrar no repositório com dimensões reais para o layout não pular.

## Risks / Trade-offs

- **Conteúdo congelado no build**: no export estático, post novo só aparece com novo build. → Aceito por decisão do usuário; quando a API entrar, o disparo do post automático terá que acionar rebuild/deploy, ou o blog migra para modo com servidor (o contrato de dados não muda em nenhum dos casos).
- **Colisão de rota `pagina` vs `[slug]`**: um post com slug `pagina` sequestraria a paginação. → Slug reservado validado no build.
- **Mock e API divergirem**: o mock pode aceitar dados que a API real não produz. → O modelo e a validação ficam em `lib/blog/model.js` e valem para as duas fontes; a fonte da API reusa a mesma validação.
- **Duplicidade de conteúdo para buscadores** entre `/blog` e uma eventual `/blog/pagina/1`. → Página 1 não é gerada nessa rota; canônico sempre `/blog`.
- **Peso da primeira tela** com capas grandes no destaque + grade. → `sizes` explícito, `priority` só na capa do destaque, blur placeholder no resto.
- **Ordenação instável** com posts na mesma data mudando a paginação entre builds. → Desempate determinístico por `slug`.
- **Trilha lateral mais alta que o conteúdo** em post curto, deixando um vão à direita. → `self-start` na coluna e blocos compactos; com poucos subtítulos o sumário encolhe naturalmente.
- **Destaque do sumário competindo com o salto do clique** (o observer marca seções intermediárias durante a rolagem). → O destaque segue só o observer, sem estado próprio no clique: ao fim do salto a seção correta é a visível e a marca converge sem código extra.
- **Dois números de WhatsApp divergindo** entre o CTA do post e o resto do site. → O CTA reaproveita `BtnWhatsapp`, que carrega o link oficial em um lugar só.

## Migration Plan

Não há migração: as rotas são novas e nenhuma página existente muda de comportamento. As únicas edições em código existente são aditivas — link no `header.jsx` e rotas no `sitemap.xml/route.js`.

Verificação antes de considerar pronto: `npm run dev` com as rotas navegáveis, e `npm run build:static` gerando `out/blog/`, `out/blog/pagina/2/` e uma pasta por post. Rollback = remover `app/blog/` e reverter as duas edições aditivas.

## Open Questions

- Autoria dos posts do marketing: autor real por post ou um autor institucional fixo ("Equipe notPaper")? O modelo suporta os dois; a escolha só afeta os dados mock e pode ser trocada depois sem mexer em tela.
- Volume por página (6) e quantidade de relacionados (3) são chutes calibráveis no primeiro review visual — ambos são constantes em `lib/blog/model.js`.
