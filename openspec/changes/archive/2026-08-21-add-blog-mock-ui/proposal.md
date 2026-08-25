## Why

O site de marketing da notPaper já tem as páginas institucionais no ar, mas não tem canal de conteúdo: hoje não existe onde publicar artigos que gerem tráfego orgânico e alimentem a jornada de captação. A API e o banco do blog ainda não existem, e esperar por eles trava a definição da experiência de leitura — que é o que o marketing precisa aprovar primeiro. Esta mudança entrega a estrutura e a interface do blog com dados mock, atrás de uma camada de acesso a conteúdo isolada, para que a troca por API depois não exija reescrever telas.

## What Changes

- Nova rota pública `/blog` com post em destaque, grade de cards e paginação.
- Nova rota pública de página de post (`/blog/[slug]`) com capa, autor, data, tempo de leitura, sumário, corpo formatado, ações de compartilhar e posts relacionados.
- Trilha lateral na página do post em telas largas, reunindo o sumário fixo (com destaque da seção em leitura), as ações de compartilhar e uma chamada para contato no WhatsApp; em telas estreitas os blocos voltam ao fluxo vertical.
- Nova rota de paginação estática (`/blog/pagina/[page]`) para que a navegação entre páginas funcione no export estático — a página 1 continua sendo `/blog`.
- Nova camada de acesso a conteúdo do blog (`lib/blog/`) com um contrato único de leitura (listar página, buscar por slug, relacionados) servido hoje por dados mock em arquivo local; a implementação por API entra depois sem alterar as telas.
- Modelo de post definido em um único lugar (slug, título, resumo, capa, autor, data de publicação, tempo de leitura, categoria, tags, blocos de conteúdo, destaque, status de publicação) — inclusive os campos que o post automático vai preencher.
- Blog incluído no export estático (`npm run build:static`): rotas geradas no build via `generateStaticParams`, sem middleware nem route handler.
- Blog incluído na navegação do site (header, menu mobile) e no `sitemap.xml`, com metadata e Open Graph por post.

## Capabilities

### New Capabilities
- `blog/fonte-de-conteudo`: contrato de leitura do conteúdo do blog — modelo do post, regras de slug, status de publicação e ordenação, implementado agora por fonte mock e depois por API, sem mudança de contrato.
- `blog/catalogo`: página índice do blog — post em destaque, grade de cards, paginação estável e navegável, estados de lista vazia.
- `blog/artigo`: página de leitura de um post — conteúdo renderizado a partir de blocos, metadados de leitura, compartilhamento, posts relacionados, SEO por post e comportamento para slug inexistente.

### Modified Capabilities
<!-- Nenhuma. O projeto ainda não tem specs em openspec/specs/; as páginas institucionais existentes não mudam de comportamento. -->

## Impact

- **Código novo**: `app/blog/` (índice, `[slug]`, `pagina/[page]`), `components/sections/blog/*` (incluindo `post-cta.jsx` e o sumário lateral), `lib/blog/*`, `data/blog-posts.js`.
- **Código alterado**: `components/layout/header.jsx` (link Blog no menu desktop e mobile), `app/sitemap.xml/route.js` (rotas do blog), `components/layout/footer.jsx` (link Blog na navegação), `app/globals.css` (`body` passa de `overflow-x: hidden` para `clip`, pré-requisito do `sticky` da trilha — afeta o site todo).
- **Build**: as novas rotas precisam ser compatíveis com `STATIC_EXPORT=1`; nada do blog entra na lista de exclusão de `scripts/build-static.js`.
- **Dependências**: nenhuma nova para o blog — Next 15 App Router, React 19, Tailwind, `BtnWhatsapp` e os componentes de animação já existentes. O ESLint (preset Strict do Next) foi configurado à parte, porque o projeto não tinha linter.
- **Fora de escopo (fica para depois)**: API e banco do blog, endpoint de ingestão do post automático, tela de login do painel e qualquer edição manual de post pela interface.
