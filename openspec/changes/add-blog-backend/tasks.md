A ordem segue o Migration Plan do design: banco e camada de dados → blog lendo do banco ainda no modo estático → decisão da diretoria → troca do modo de execução → ingestão. Tudo neste repositório.

## 1. Validação compartilhada

- [x] 1.1 Extrair `lib/blog/validate.js` com a validação de **um** post (campos obrigatórios, padrão do slug, slug não reservado, `status`, `content` de tipos declarados, `publishedAt` ISO 8601, `readingMinutes` inteiro ≥ 1) e reescrever `assertPostsIntegrity` como laço sobre ela — verificar que os testes de borda da change anterior continuam valendo: slug duplicado, slug `pagina`, slug com acento, campo ausente e `readingMinutes` zero, cada um lançando com o slug citado
- [x] 1.2 Confirmar que o blog segue funcionando após a extração — verificar `npm run dev` no fluxo do blog e `npm run lint` sem erro

## 2. Banco: esquema e conexão

- [x] 2.1 Adicionar `mssql` e `msnodesqlv8` ao projeto e provar conexão ao SQL Server por autenticação Windows integrada — verificar que `npm install` conclui, que o módulo nativo carrega, e que uma consulta simples responde sem senha em configuração
- [x] 2.2 Criar o banco `notpaperBlog` e o script de esquema da tabela `posts` conforme o design (`id_externo` uniqueidentifier único, `slug` único, `content`/`author`/`tags` em `json` nativo, capa em `varbinary(max)` + formato + texto alternativo, `check` de `status` e `reading_minutes`, `created_at`/`updated_at`) — verificar aplicando sobre banco vazio e conferindo as duas restrições de unicidade
- [x] 2.3 Criar o índice `IX_posts_listagem (status, published_at DESC, slug)` — verificar com plano de execução que a listagem ordenada o utiliza
- [x] 2.4 Criar `scripts/db-migrate.cjs` que aplica `db/migrations/NNN_*.sql` em ordem e registra em `dbo.schema_migrations`, mais o script `db:migrate` no `package.json` — verificar rodando duas vezes seguidas: a segunda não altera nada e não falha
- [x] 2.5 Criar `lib/blog/db.js` com pool de conexões guardado em `globalThis`, lendo a configuração do ambiente e falhando explicitamente quando ausente — verificar que o serviço falha nomeando a variável que falta, e que dezenas de recargas em `npm run dev` não esgotam conexões do banco

## 3. Consultas que atendem o contrato

- [x] 3.1 Criar a definição única do destaque efetivo (marcado; senão o publicado mais recente) reaproveitável pelas duas consultas — verificar com base tendo destaque marcado, sem destaque marcado, e vazia (ausência de resultado sem erro)
- [x] 3.2 Implementar a listagem paginada excluindo o destaque efetivo, ordenando por `published_at desc` com desempate por `slug`, e devolvendo também o total de páginas — verificar que duas execuções dão a mesma ordem, que o destaque não aparece em nenhuma página, e que página fora do intervalo devolve lista vazia com total correto
- [x] 3.3 Implementar post por slug, relacionados (mesma categoria primeiro, completando com recentes, excluindo o próprio, limitado a `RELATED_POSTS_COUNT`) e lista de slugs publicados — verificar cada um, incluindo relacionados com categoria populada, post único na categoria e base de um só post
- [x] 3.4 Garantir que nenhuma consulta devolve rascunho — verificar as cinco operações com rascunhos presentes na base, incluindo acesso direto ao slug de um rascunho
- [x] 3.5 Validar na fronteira da camada de dados o que vem do banco, com o módulo da task 1.1 — verificar inserindo manualmente um post com `content` malformado e confirmando que falha de forma nomeada em vez de renderizar torto

## 4. Blog lendo do banco (ainda no modo estático)

- [x] 4.1 Trocar a implementação de `lib/blog/content-source.js` para chamar `lib/blog/db.js`, preservando as seis funções e suas assinaturas — verificar que nenhum arquivo em `app/` ou `components/` precisou de alteração
- [x] 4.2 Popular o banco com alguns posts e rodar o fluxo completo: `/blog` → página 2 → post → sumário → relacionado → slug inválido — verificar que cada passo se comporta como nos cenários de `blog/catalogo` e `blog/artigo`
- [x] 4.3 Verificar os estados de borda com o banco como fonte: base sem posts publicados (mensagem de lista vazia), sem destaque marcado (mais recente assume), e um único post publicado (sem grade, sem relacionados)
- [x] 4.4 Rodar `npm run build:static` com o banco de pé — verificar que as rotas do blog são geradas a partir do banco e que nenhum rascunho gera pasta

## 5. Capa recebida na entrega

- [x] 5.1 Acrescentar à tabela `posts` as colunas da capa (bytes, formato e texto alternativo) e a lista de formatos reconhecidos (`webp`, `png`, `jpeg`) — verificar que a migração aplica e que um formato fora da lista é rejeitado
- [x] 5.2 Verificar os bytes recebidos contra o formato declarado pela assinatura do arquivo — verificar que imagem válida passa, que formato declarado divergente do conteúdo é recusado, e que conteúdo que não é imagem é recusado
- [x] 5.3 Criar a rota que serve a capa a partir do banco, com tipo de mídia derivado da lista do site (nunca do texto recebido), `X-Content-Type-Options: nosniff` e cache longo — verificar o cabeçalho servido e que o valor recebido na entrega não influencia o tipo
- [x] 5.4 Apontar `coverImage.src` do post para essa rota, por slug e sem extensão, com token de versão derivado do conteúdo da imagem e cache longo imutável — verificar que `next/image` a exibe no índice, no card e no cabeçalho, e que regerar a capa muda o endereço
- [x] 5.5 Substituir a capa ao reentregar o post, sem deixar a anterior armazenada nem servível — verificar reentregando com capa nova
- [x] 5.6 Remover as capas por slug de `public/image/blog/` que deixam de ser referenciadas, e **não** criar capas por categoria — verificar que nenhum post servido aponta para arquivo estático
- [x] 5.7 **Decisão visual**: decidido pelo dono — **`16/9`**, alinhando com a arte do outro lado (corte de 15,6%, que a orientação de estilo deles já pressupõe), e o que precisar de ajuste vai no código. Aplicado no cabeçalho do post; as três capas passaram a `fill`, porque as dimensões reais variam e o container define a caixa

## 6. Destino da área da diretoria

- [x] 6.1 Decidir e registrar o destino de `app/diretoria` e das rotas de auth dela ao sair do modo estático — **decidido pelo dono em 24/08/2026: fica inativa**, sem autenticação real e sem ser publicada, e **sem mexer no código agora**: hoje o `build-static.js` já a mantém fora do site publicado. A exclusão explícita executa junto da troca do modo (tarefas 7.6 a 7.8), para não existir janela em que ela fique publicável. Registrado na decisão 7b do design

## 7. Modo de execução do blog

- [x] 7.1 Remover `STATIC_EXPORT` de `next.config.js`, o `scripts/build-static.js` e o script `build:static` do `package.json` — verificar que `npm run build` gera build com runtime e que as páginas institucionais seguem funcionando
- [x] 7.6 **No mesmo passo da 7.1**, renomear `app/diretoria` para `app/_diretoria` e `app/api/auth` para `app/api/_auth` (pasta privada do App Router, fora do roteamento) — verificar que `/diretoria`, `/diretoria/login` e as rotas de auth respondem 404, e que `app/api` segue servindo a ingestão
- [x] 7.7 Remover `middleware.js`, que existe só para proteger `/diretoria` — verificar que nenhuma outra rota depende dele e que o build passa sem ele
- [x] 7.8 Confirmar que o link de login não vira link morto no rodapé — verificar `components/layout/footer.jsx`, onde ele hoje aparece condicionado a `NEXT_PUBLIC_STATIC_EXPORT`
- [x] 7.2 Aplicar cache com tags (`blog`, `post:<slug>`) nas rotas do blog, mantendo `generateStaticParams` e permitindo renderização sob demanda — verificar que um post inserido no banco após o build passa a ter página no primeiro acesso, sem novo deploy
- [x] 7.3 Converter `app/sitemap.xml/route.js` para consultar o banco e ser revalidável pela tag `blog` — verificar que o XML reflete os posts publicados e nenhum rascunho
- [x] 7.4 Verificar que uma visita repetida não consulta o banco de novo e que as páginas institucionais não o consultam nunca — instrumentar as consultas e conferir
- [x] 7.5 Verificar o comportamento com o banco derrubado: post já renderizado continua servido, página nunca renderizada cai em erro tratado do site sem detalhe técnico, e as páginas institucionais seguem intactas — exercitar os três

## 8. Ingestão

- [x] 8.1 Criar `app/api/blog/posts/[idExterno]/route.js` com `PUT` autenticado pelo cabeçalho `X-Ingestao-Token`, comparado em tempo constante — verificar que sem token e com token inválido é rejeitada com respostas indistinguíveis, que nada é persistido, e que o token não aparece em log nem em corpo de erro
- [x] 8.2 Gerar o slug a partir do título, tratando colisão, segmento reservado e título que não produz slug, e conservar o slug existente em reentrega — verificar os quatro casos, incluindo título alterado numa reentrega mantendo a URL
- [x] 8.3 Validar o payload (`titulo`, `resumo`, `corpo`, `categoria`, `minutosDeLeitura`, `capa` — seis campos, nenhum a mais) com o módulo da task 1.1 e traduzir os blocos do vocabulário do módulo para o do blog — verificar que payload conforme publica, que categoria desconhecida e bloco não traduzível são recusados nomeando o problema, e que os minutos de leitura recebidos não são recalculados
- [x] 8.4 Exigir a capa completa na entrega (imagem, formato e texto alternativo) e recusar quando faltar qualquer um dos três — verificar entrega completa, sem capa, sem texto alternativo e com formato não reconhecido
- [x] 8.5 Persistir com `MERGE ... WITH (HOLDLOCK)` por `id_externo`, substituindo integralmente e sem tocar slug, `created_at` nem `published_at`, e garantir que a operação é tudo-ou-nada — verificar que a mesma entrega duas vezes deixa um único post e estado idêntico, que reentrega com correção substitui o conteúdo, e que falha na escrita não deixa post parcial nem post sem capa
- [x] 8.6 Preencher autor institucional, destaque, situação e data de publicação no site; atualizar `updated_at` a cada substituição preservando `created_at` e a `published_at` da primeira entrada — verificar que uma correção dias depois não move o post para o topo da listagem
- [x] 8.7 Revalidar as tags (`blog`, `post:<slug>`) **antes** de responder, e não revalidar quando a escrita falha — verificar que o endereço devolvido na resposta já mostra o post, e que uma ingestão que falhou não alterou nenhuma página
- [x] 8.8 Devolver `{ url }` no sucesso, com o endereço público do post, e o mesmo endereço em reentregas — verificar que a resposta nunca sai sem `url` (o módulo trata sucesso sem endereço como indisponibilidade e retenta)
- [x] 8.9 Mapear os desfechos nos códigos que o módulo interpreta: 4xx para conteúdo recusado, 5xx para indisponibilidade — verificar que validação falha com 4xx e que banco indisponível responde 5xx
- [x] 8.10 Verificar unicidade sob concorrência — disparar duas ingestões simultâneas do mesmo `id_externo` e confirmar um único post, sem base inconsistente

## 8b. As armadilhas medidas pelo outro lado

- [x] 8b.1 Garantir que a ingestão lê o corpo do fluxo, sem depender de `Content-Length` — verificar enviando uma requisição `chunked` sem o cabeçalho de tamanho e confirmando que o post entra completo, com título
- [x] 8b.2 Responder indisponibilidade (5xx) para corpo vazio, truncado ou ilegível, e recusa (4xx) apenas para corpo interpretado que falha validação — verificar os três casos e conferir que nenhum deles grava post parcial
- [x] 8b.3 Aplicar o limite de tamanho sobre o que foi lido, e não sobre cabeçalho de tamanho — verificar que uma entrega grande sem `Content-Length` é barrada pelo limite real
- [x] 8b.4 Confirmar que nenhum slug inválido pode entrar pela ingestão — verificar que título com acento, título que produz `pagina` e título só de pontuação geram slug válido, e que `npm run build` passa com os três na base

## 8c. Verificação contra o módulo de verdade

- [ ] 8c.1 Configurar `Blog__Token` e o endereço do site no módulo, e aprovar uma publicação de canal Blog de ponta a ponta — verificar que o post aparece no blog e que o módulo gravou a URL devolvida em `UrlPublicada`
- [ ] 8c.2 Aprovar a mesma publicação duas vezes (ou forçar retentativa da fila) — verificar que existe um único post e que a URL devolvida é a mesma
- [ ] 8c.3 Derrubar o site no meio de uma entrega — verificar que o trabalho volta pela fila do módulo e conclui na retentativa, sem post duplicado
- [ ] 8c.4 Entregar um payload que o site recusa (categoria desconhecida) — verificar que o módulo registra recusa de conteúdo e **não** retenta
- [ ] 8c.5 **Antes da integração inteira**, disparar um `PUT` qualquer com corpo `chunked` (sem `Content-Length`) contra o IIS de produção — verificar que o corpo chega íntegro ao Node, isolando a pergunta do proxy sem depender do módulo estar configurado
- [ ] 8c.6 Rodar a verificação de ponta a ponta **pelo IIS**, não pela porta do Node — verificar que o caminho de produção é o exercitado, e não um atalho que o dublê do outro lado também tomava
- [ ] 8c.7 Confirmar que o IIS proxia as leituras além da ingestão, e medir a capa passando por ele — verificar o carregamento de uma capa de 150 KB e decidir se `_next/static` passa a ser servido direto pelo IIS

## 9. Verificação final

- [ ] 9.1 Recriar o banco do zero, aplicar migrações, ingerir alguns posts e percorrer o blog inteiro — verificar que o ciclo completo funciona sem passo manual
- [ ] 9.2 Publicar um post pela ingestão com o site rodando e conferir que ele aparece no índice, tem página própria e entra no sitemap sem novo deploy — verificar os três
- [ ] 9.3 Remover `data/blog-posts.js` e confirmar que nenhum conteúdo de post permanece no repositório — verificar que o blog continua funcionando só com o banco
- [ ] 9.4 Rodar `npm run lint` e `npm run build` — verificar que terminam sem erro
