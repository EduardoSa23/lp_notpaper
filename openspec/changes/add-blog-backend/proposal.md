## Why

O blog está no ar servindo dados mock: as telas funcionam, mas ninguém consegue publicar. A change anterior (`2026-08-21-add-blog-mock-ui`) isolou todo o acesso a conteúdo em `lib/blog/content-source.js` justamente para que a fonte real entrasse sem tocar em tela — é essa peça que falta. Sem ela o marketing não tem canal de publicação e o post automático não tem para onde escrever.

O backend vive neste mesmo projeto, não em repositório separado: o volume é de um blog institucional, e um único app com route handler e banco é menos coisa para manter, implantar e manter em sincronia do que dois serviços.

Duas pendências do blog vêm junto porque sem elas o conteúdo real não renderiza: a capa (hoje existe um arquivo por slug, gerado à mão; o módulo passa a mandar uma imagem por post, e o site precisa guardá-la e servi-la) e o Next ganhando runtime (hoje o blog é congelado no build, então post novo só apareceria com um deploy).

## What Changes

- SQL Server como fonte de conteúdo do blog — banco próprio (`notpaperBlog`) na instância que a equipe já opera — com tabela de posts persistindo o modelo já especificado em `blog/fonte-de-conteudo`, unicidade garantida no banco tanto do identificador da entrega quanto do slug, e migrações reproduzíveis a partir de um banco vazio.
- Nova camada de acesso a dados (`lib/blog/db.js`) consultando o banco, atrás do contrato existente. As páginas do blog leem **direto do banco** nos server components — sem passar por HTTP para falar com o próprio app.
- Novo route handler de ingestão (`PUT`) para o post automático: autenticado pelo cabeçalho `X-Ingestao-Token`, cria-ou-substitui pelo identificador da publicação de origem, **valida** o payload contra o modelo e rejeita o que não conforma. O slug e a URL pública são gerados pelo site, que devolve o endereço na resposta. Depois de persistir, revalida as páginas afetadas no próprio processo.
- Validação do modelo extraída para um módulo único, usado tanto na ingestão quanto na leitura, para que não existam duas definições do que é um post válido.
- **BREAKING** — `lib/blog/content-source.js` passa a consultar o banco em vez de `data/blog-posts.js`. O contrato de funções não muda; o mock e `data/blog-posts.js` saem de cena.
- **BREAKING** — o site deixa o export estático e passa a rodar com runtime: ISR nas rotas do blog e revalidação por tag. `scripts/build-static.js`, `STATIC_EXPORT` e `npm run build:static` perdem a razão de existir. Consequência a decidir no apply: `app/api`, `app/diretoria` e `middleware.js`, hoje removidos do build publicado, passam a ser publicados.
- Capa recebida na própria entrega, guardada no banco e servida por rota própria — substituindo o arquivo-por-slug. **Sem** capa por categoria: o módulo gera uma imagem por post e recusa aprovar post de blog sem ela.

## Capabilities

### New Capabilities
- `blog/persistencia-de-posts`: o armazenamento dos posts — durabilidade, unicidade sob concorrência, slug gerado e estável, guarda da imagem de capa, migrações reproduzíveis e configuração por ambiente.
- `blog/ingestao-de-post`: o endpoint de ingestão — autenticação, validação contra o modelo, tradução do vocabulário dos blocos, semântica cria-ou-substitui, significado dos códigos de resposta e revalidação das páginas afetadas.
- `blog/entrega-dinamica`: o blog com runtime — conteúdo publicado aparecendo sem novo deploy, páginas servidas de cache, e comportamento quando o banco está indisponível.

### Modified Capabilities
- `blog/fonte-de-conteudo`: a fonte passa a ser o banco deste projeto em vez de dados mock locais; o requisito de conteúdo mock representativo deixa de valer e a capa passa a vir na entrega, guardada pelo site.

## Impact

- **Código novo**: `lib/blog/db.js` (acesso ao banco), `lib/blog/validate.js` (modelo compartilhado, extraído de `model.js`), `app/api/blog/posts/[idExterno]/route.js` (ingestão), migrações do banco e a rota que serve a capa a partir do banco.
- **Código alterado**: `lib/blog/content-source.js` (implementação trocada, contrato preservado), `next.config.js` e `scripts/build-static.js` (saída do modo estático), rotas do blog (ISR + tags), `app/sitemap.xml/route.js` (passa a depender do banco), `data/blog-posts.js` (removido), `public/image/blog/` (as capas por slug saem; a capa passa a vir do banco).
- **Dependências novas**: driver SQL Server com autenticação Windows integrada (`mssql` + `msnodesqlv8`). Sem framework de API (os route handlers do Next cobrem o papel) e **sem Entity Framework**, que é biblioteca .NET e não carrega em Node.
- **Specs existentes**: `blog/fonte-de-conteudo` muda de fonte; `blog/catalogo` e `blog/artigo` seguem valendo sem alteração — foi para isso que o contrato foi isolado.
- **Operação**: SQL Server 2025 já em operação, com autenticação Windows integrada — então **nenhuma senha de banco em configuração**; em produção o acesso é concedido à conta de serviço do pool do IIS. O banco precisa estar alcançável no build e em execução, e o token de ingestão precisa existir no ambiente.
- **Fora de escopo**: endpoints HTTP de leitura (a leitura é interna à camada de dados; se um consumidor externo aparecer, as consultas já estarão prontas), busca, rotas de categoria e tag, tela de login e painel de edição manual do blog.
