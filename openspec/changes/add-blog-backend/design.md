## Context

Ver `proposal.md` — Why. O que já existe e restringe o desenho:

- `lib/blog/content-source.js` é o único ponto de acesso a conteúdo, com seis funções `async` consumidas por `app/blog/page.jsx`, `app/blog/pagina/[page]/page.jsx`, `app/blog/[slug]/page.jsx` e `app/sitemap.xml/route.js`. Nenhum componente busca dado por outro caminho.
- `lib/blog/model.js` concentra o modelo e `assertPostsIntegrity()`: campos obrigatórios, padrão de slug (`^[a-z0-9]+(?:-[a-z0-9]+)*$`), slug reservado `pagina`, `status` em `published|draft`, `content` não vazio de tipos declarados, `publishedAt` ISO 8601, `readingMinutes` inteiro ≥ 1.
- Constantes a respeitar: `POSTS_PER_PAGE = 6`, `RELATED_POSTS_COUNT = 3`.
- Cinco categorias em uso: Automação, GED, Gestão Pública, Segurança e Compliance, Transformação Digital.
- `next.config.js` liga `output: "export"` com `STATIC_EXPORT=1`, e `scripts/build-static.js` move `middleware.js`, `app/api` e `app/diretoria` para fora do build — porque o export estático não hospeda middleware nem route handler com POST.
- `app/api/auth/{login,logout}/route.js` já existem para a área da diretoria, com auth mock em `lib/mock-directoria-auth.js`.
- Decisões do usuário: backend no mesmo projeto; leitura direto do banco nos server components; nenhuma rota HTTP de leitura, só o PUT de ingestão; **SQL Server**, banco próprio (`notpaperBlog`) na instância padrão, ao lado do `marketingAutomatizado`; acesso por **driver nativo com autenticação Windows integrada**, sem Entity Framework.
- Terreno verificado na máquina: SQL Server 2025 RTM, instâncias `MSSQLSERVER` e `SQLEXPRESS` de pé, `sqlcmd` e `dotnet` disponíveis. A instância padrão está em `IsIntegratedSecurityOnly = 1` (**só autenticação Windows**), tem `json` nativo, e collation `SQL_Latin1_General_CP1_CI_AS`.
- **Entity Framework está fora**, e não por preferência: EF Core é biblioteca .NET e este app roda em Node. A alternativa que traria EF seria um serviço .NET separado, recusada porque devolveria HTTP entre as páginas e os dados — justamente o que a decisão 1 elimina.

**O outro lado já existe.** O módulo `MARKETING_AUTOMATO` (.NET 10 + SQL Server, painel React, aprovação humana) tem `PublicadorDeBlogNoSite.cs` implementado, e ele define o contrato que este projeto tem que aceitar:

- rota `PUT api/blog/posts/{Publicacao.Id}` — o identificador é um Guid do módulo, na URL, e é o que faz a entrega ser idempotente;
- credencial no cabeçalho `X-Ingestao-Token`;
- corpo com `titulo`, `resumo`, `corpo` (lista de blocos já convertidos de Markdown **do lado deles**), `categoria` (nome legível) e `minutosDeLeitura` (calculado lá, a 200 palavras/minuto);
- blocos no vocabulário deles: `paragrafo`, `subtitulo`, `citacao` (com `citado`), `lista` (com `itens` e `ordenada`). Não existe bloco de imagem no que o módulo envia. Medido em 69 gerações reais do lado deles, só `subtitulo` e `paragrafo` apareceram — os outros dois são defesa, porque a cartilha editorial é Markdown e pode passar a pedi-los. A tradução cobre os quatro de qualquer forma;
- resposta esperada `{ "url": "..." }`. Sucesso sem `url` é tratado por eles como **indisponibilidade**, e a fila retenta;
- as cinco categorias deles (`GestaoPublica`, `Ged`, `Automacao`, `SegurancaECompliance`, `TransformacaoDigital`) têm nomes legíveis idênticos aos que o blog já usa;
- a fronteira está escrita no código deles: *"o módulo manda o que é CONTEÚDO; o site preenche o que é IDENTIDADE dele — capa, autor, destaque, situação, slug e data de publicação"*.

**O cabeçalho de autenticação era um defeito real do doc deles**, e foi corrigido lá em 24/08 depois de esta análise apontá-lo: o doc dizia `Authorization: Bearer` e o código sempre enviou `X-Ingestao-Token`. Quem implementasse o receptor pelo doc receberia **toda entrega como não autenticada**, com os dois lados achando que o outro estava errado.

Os blocos tipados e a saída do `publicadoEm` do payload já estavam corretos no código e no doc atualizado — o que estava atrasado era o checkout local deste lado.

**A capa já viaja no PUT** (`add-capa-gerada-por-ia`, entregue em 24/08/2026): a IA gera uma imagem por post, e ela é **obrigatória** — a entidade do módulo recusa aprovar post de blog sem capa. O contrato tem exatamente **seis campos**, com teste do lado deles contando-os, porque um a mais seria o módulo decidindo algo que não é dele.

## Goals / Non-Goals

**Goals:**

- Satisfazer o contrato existente sem que nenhuma página do blog mude.
- Uma definição só de validação, valendo para ingestão e leitura.
- Publicação automática que falha visivelmente em vez de publicar conteúdo degradado.
- Blog que continua servindo o que já renderizou quando o banco cai.

**Non-Goals:**

- Não expor endpoints HTTP de leitura enquanto não houver consumidor externo.
- Não desenhar a automação que gera o post; só o contrato que ela cumpre.
- Não implementar busca, rota de categoria/tag, login real nem painel de edição manual.
- Não migrar os posts mock como conteúdo real — se entrarem, entram pela ingestão.

## Decisions

### 1. Leitura direto do banco, sem HTTP para o proprio app

`content-source.js` deixa de ler `data/blog-posts.js` e passa a chamar `lib/blog/db.js`. As seis funções e suas assinaturas ficam idênticas — é exatamente o que a change anterior preparou ao declará-las `async`.

O blog **não** consome as próprias rotas. Duas razões, e a segunda é a decisiva:

1. Uma página renderizada no servidor que faz `fetch` no próprio app paga serialização e um salto de rede para chegar ao mesmo processo.
2. Durante `next build` o servidor ainda não está de pé. Uma página que buscasse `http://localhost:3000/api/...` no build falharia ou precisaria de um servidor auxiliar só para se atender — armadilha conhecida do Next e razão pela qual o requisito de construção existe em `blog/fonte-de-conteudo`.

Consequência: nenhuma rota GET é criada. As consultas vivem em `lib/blog/db.js` e, se um consumidor externo aparecer, um route handler passa a chamá-las — sem duplicar regra.

Alternativa considerada: manter a fronteira HTTP para facilitar extrair a API depois. Rejeitada — o custo é permanente e o benefício é hipotético; extrair depois significa criar route handlers sobre consultas que já existem, o que é o trabalho fácil.

### 2. Uma tabela: `id_externo` é a identidade da entrega, `slug` é a da URL

```sql
CREATE TABLE dbo.posts (
  id                bigint          IDENTITY(1,1) NOT NULL CONSTRAINT PK_posts PRIMARY KEY,
  id_externo        uniqueidentifier NOT NULL,          -- Publicacao.Id do modulo
  slug              nvarchar(200)   NOT NULL,           -- gerado aqui, a partir do titulo
  title             nvarchar(300)   NOT NULL,
  excerpt           nvarchar(1000)  NOT NULL,
  content           json            NOT NULL,           -- blocos no vocabulario do blog
  author            json            NOT NULL,           -- { name, role }
  cover_bytes       varbinary(max)  NOT NULL,
  cover_format      varchar(10)     NOT NULL,           -- webp | png | jpeg
  cover_alt         nvarchar(500)   NOT NULL,
  published_at      datetimeoffset  NOT NULL,
  reading_minutes   int             NOT NULL CONSTRAINT CK_posts_reading CHECK (reading_minutes >= 1),
  category          nvarchar(100)   NOT NULL,
  tags              json            NOT NULL CONSTRAINT DF_posts_tags DEFAULT (N'[]'),
  featured          bit             NOT NULL CONSTRAINT DF_posts_featured DEFAULT (0),
  status            varchar(20)     NOT NULL CONSTRAINT CK_posts_status CHECK (status IN ('published','draft')),
  created_at        datetimeoffset  NOT NULL CONSTRAINT DF_posts_created DEFAULT (SYSDATETIMEOFFSET()),
  updated_at        datetimeoffset  NOT NULL CONSTRAINT DF_posts_updated DEFAULT (SYSDATETIMEOFFSET()),
  CONSTRAINT UQ_posts_id_externo UNIQUE (id_externo),
  CONSTRAINT UQ_posts_slug       UNIQUE (slug)
);

CREATE INDEX IX_posts_listagem ON dbo.posts (status, published_at DESC, slug);
```

**Duas identidades, e confundi-las foi meu erro no desenho anterior.** `id_externo` é a chave de idempotência: o módulo reentrega pelo Guid dele. `slug` é a identidade pública, gerada aqui a partir do título. São coisas diferentes porque o título pode mudar numa correção e a URL não pode: `blog/persistencia-de-posts` exige que o slug sobreviva à reentrega. Daí a chave primária sintética — com duas colunas únicas concorrentes, eleger uma como primária só sugere hierarquia onde não há.

**`json` nativo, recurso do SQL Server 2025.** Verificado na instância. Em versão anterior isto seria `nvarchar(max)` com `CHECK (ISJSON(col) = 1)`; o tipo nativo valida por si e dispensa a restrição. Blocos nunca são consultados individualmente, só lidos inteiros com o post, então normalizar em tabela de blocos criaria join e ordenação para nada.

**A capa em três colunas, não em `json`.** Os bytes vão em `varbinary(max)` porque base64 dentro de JSON custaria mais 33% em disco e uma decodificação a cada leitura. `cover_format` fica `varchar(10)` restrito à lista do site.

**A collation da instância é `CI_AS`** — case-insensitive, accent-sensitive. Para `UQ_posts_slug` isso é exatamente o desejado: `Meu-Post` e `meu-post` colidem, e acento não é dobrado (irrelevante, porque o slug é ASCII por validação). Não é preciso collation explícita na coluna.

### 2b. Geração do slug, e a colisão

Slug derivado do título pelo mesmo `slugifyHeading` que o sumário do post já usa (`lib/blog/headings.js`), que remove acento e normaliza — o formato que `lib/blog/model.js` exige.

Três casos que a geração tem que tratar, e cada um já causou defeito em algum blog:

1. **colisão**: dois títulos diferentes que produzem o mesmo slug. Sufixo numérico, como as âncoras do sumário já fazem;
2. **segmento reservado**: um título que produza `pagina` sequestraria `/blog/pagina/[page]`. `RESERVED_SLUGS` já existe e a geração tem que consultá-lo;
3. **título que não produz nada**: título só de pontuação ou emoji resultaria em slug vazio. Precisa de recurso final — e o `id_externo` serve.

A geração roda **somente quando o post ainda não existe**. Post que já tem slug conserva o dele.

### 2c. Migrações: arquivos `.sql` numerados e um aplicador de trinta linhas

Sem ferramenta de migração. Arquivos em `db/migrations/NNN_nome.sql`, aplicados em ordem por `scripts/db-migrate.cjs`, que registra o que já rodou em `dbo.schema_migrations`.

Motivo: as ferramentas de migração do ecossistema JavaScript ou não falam SQL Server, ou trazem um DSL que gera o T-SQL por você — e aqui o esquema usa `json` nativo, `MERGE ... WITH (HOLDLOCK)` e `varbinary(max)`, coisas que a gente quer escrever à mão e revisar. Um aplicador que lê arquivo, confere numa tabela e executa é menor que a configuração de qualquer ferramenta, e não esconde o SQL de quem vai mantê-lo.

Idempotência vem da tabela de controle, não de cada script ser reescritível: rodar de novo não reaplica o que já consta. É o que `blog/persistencia-de-posts` pede.

Alternativa considerada: `dotnet ef migrations` num projeto .NET só para esquema. Rejeitada na conversa — daria o fluxo que a equipe conhece, mas o esquema passaria a ser definido por entidades C# que nada em execução usa, e divergência entre elas e o que a camada JavaScript espera seria silenciosa.

### 3. Destaque numa definicao so, compartilhada por duas consultas

O risco concreto: a consulta de destaque diz "marcado, senão o mais recente" e a de listagem exclui "o destaque". Se cada uma expressar a regra por conta, elas divergem e o destaque aparece duplicado no índice ou desaparece dele.

Solução: uma view (ou CTE reutilizada) que resolve o slug do destaque efetivo, consumida pelas duas consultas. `blog/persistencia-de-posts` exige isso explicitamente.

Atenção ao caso que o mock já tratava: a listagem exclui o destaque **efetivo**, que pode ser o mais recente quando nenhum está marcado — não `featured = false`.

### 4. Validacao extraida para um modulo, nao duplicada

`lib/blog/model.js` hoje exporta constantes e `assertPostsIntegrity(posts)` (uma lista). A ingestão precisa validar **um** post. Extraio `lib/blog/validate.js` com a validação de um post, e `assertPostsIntegrity` passa a ser um laço sobre ela.

O mesmo módulo valida o que sai do banco na fronteira da camada de dados. Motivo: `jsonb` não valida forma, e uma escrita manual no banco (operação, correção às pressas) poderia colocar um `content` malformado que só apareceria como página torta.

Alternativa considerada: JSON Schema como fonte compartilhada. Rejeitada por agora — resolve o mesmo problema com uma dependência e uma etapa de build a mais, e ganha sentido quando existir consumidor que não seja JavaScript.

### 5. Ingestao: o contrato e do outro lado, e este lado obedece

`PUT /api/blog/posts/[idExterno]` — `app/api/blog/posts/[idExterno]/route.js`. Credencial no cabeçalho `X-Ingestao-Token`, comparada com **comparação de tempo constante**: comparar token com `===` vaza o prefixo correto pelo tempo de resposta.

Sequência: autentica → valida o payload → traduz os blocos → verifica a capa → resolve o slug (só se o post é novo) → grava → revalida → responde `{ url }`.

**O upsert precisa de `HOLDLOCK`, e isto não é detalhe.** `MERGE` sem hint não serializa a leitura contra outra transação: duas ingestões simultâneas do mesmo `id_externo` podem ambas não encontrar a linha e ambas tentar inserir, e a segunda estoura violação de chave única. É defeito conhecido do `MERGE` no SQL Server, e o requisito de concorrência de `blog/persistencia-de-posts` cai exatamente nele.

```sql
MERGE dbo.posts WITH (HOLDLOCK) AS destino
USING (SELECT @id_externo AS id_externo) AS origem
    ON destino.id_externo = origem.id_externo
WHEN MATCHED THEN UPDATE SET ...      -- nao toca slug, created_at nem published_at
WHEN NOT MATCHED THEN INSERT (...) VALUES (...);
```

`HOLDLOCK` (equivalente a `SERIALIZABLE` na tabela alvo) faz a segunda transação esperar e enxergar a linha da primeira, então ela atualiza em vez de inserir. Alternativa considerada: `UPDATE` e, com `@@ROWCOUNT = 0`, `INSERT`, capturando erro 2627 numa retentativa. Rejeitada — resolve o mesmo problema com mais código e tratando como exceção o que o hint evita.

**A revalidação acontece antes da resposta**, e não depois. O módulo considera o post publicado no instante em que recebe o `{ url }` e registra esse endereço; devolver antes de revalidar faria o endereço registrado apontar, por um instante, para uma página que ainda não mostra o post.

`revalidateTag` é chamada de função no mesmo processo, não requisição HTTP entre serviços. Isso elimina, de uma vez: um segundo token, uma rota de revalidação exposta, e o caso "o blog está fora no momento da ingestão". Não é conveniência — é uma classe de falha que deixa de existir.

**`PUT` e não `POST` não é escolha deste lado**: a fila do módulo retenta, e uma queda depois de gravar e antes da resposta é indistinguível de falha total. Com `POST` a retentativa criaria um segundo post.

### 5a. Concorrencia no upsert: o custo medido do `HOLDLOCK`

Medido com duas entregas simultaneas do mesmo `id_externo`: **503 e 200**. O `HOLDLOCK` serializou como esperado, a segunda transacao ficou esperando o lock, bateu no limite de 6 segundos de `db.js` e respondeu indisponibilidade.

Isso e correto, e nao um defeito: o modulo retenta 5xx, e a retentativa encontra a linha e atualiza. O que o requisito exige — um unico post ao fim das duas, sem base inconsistente — foi verificado.

O custo aceito e uma retentativa quando duas entregas do mesmo post se cruzam. Na pratica isso quase nao acontece: a fila do modulo processa um trabalho por vez, e duas entregas do mesmo `id_externo` ao mesmo tempo significam que a primeira travou no meio.

### 5b. Tradução do vocabulário na fronteira

Os blocos chegam como `paragrafo | subtitulo | citacao | lista`, com campos `texto`, `itens`, `ordenada`, `citado`. O blog usa `paragraph | heading | quote | list`, com `text`, `items`, `ordered`, `cite`. São vocabulários diferentes para a mesma coisa.

A tradução vive **só na fronteira da ingestão** (`lib/blog/ingest-mapping.js`), e o vocabulário do módulo não entra no banco nem chega a componente. Aceitar os dois vocabulários no modelo dobraria os casos em `post-body.jsx`, que hoje ignora tipo desconhecido em silêncio — um bloco no vocabulário errado desapareceria da página sem erro nenhum. Por isso tipo não traduzível é **recusa**, e não descarte.

O módulo não envia bloco de imagem. O tipo `image` do blog permanece no modelo (a capa e conteúdo futuro o usam), só não chega pela ingestão.

### 5c. Códigos de resposta: cada um manda uma ação diferente do outro lado

O publicador do módulo interpreta o status, e a interpretação dele é parte do contrato:

| resposta | como o módulo entende | consequência lá |
|---|---|---|
| 2xx com `{ url }` | publicado | grava a URL, encerra |
| 2xx sem `url` | indisponibilidade | **retenta** |
| 401 / 403 | credencial recusada | para, e alerta configuração |
| 400 / 409 / 422 / 413 | conteúdo recusado | para, exige editar o texto |
| 5xx / 429 e demais | site passando mal | **retenta** |

Consequência prática para este lado: falha de validação tem que sair como 4xx e falha de banco como 5xx. Trocar os dois é o defeito mais caro possível aqui — validar mal e responder 500 faria a fila retentar até o teto um post que nunca vai passar; falhar o banco e responder 422 faria o módulo desistir de uma falha passageira e exigir intervenção manual.

### 5d. O que a medição do outro lado ensinou, e o contrato escrito não diz

Três defeitos que o time do módulo encontrou medindo contra o dublê que escreveram, e que um receptor novo repetiria:

**1. O corpo chega sem tamanho declarado.** `JsonContent.Create` serializa em fluxo e não calcula `Content-Length`, então a requisição sai com `Transfer-Encoding: chunked`. Um receptor que dependesse do cabeçalho de tamanho leria corpo vazio e gravaria post sem título. `await request.json()` do route handler lê o fluxo e não tem esse problema — mas qualquer limite de tamanho que venhamos a aplicar **não pode** se basear em `Content-Length`, que aqui não existe.

**2. E a consequência disso é pior do que o defeito.** Um corpo truncado no transporte faz a validação falhar por "título ausente" — e título ausente é recusa de conteúdo, que o módulo **não retenta**. Uma perda de rede seria diagnosticada como texto ruim, e o post ficaria abandonado até alguém editar e aprovar de novo, sem nada indicando que o texto estava bom.

Daí a assimetria escolhida: corpo ilegível, vazio ou truncado responde **indisponibilidade**, não recusa. O pior caso do outro lado é gastar três tentativas e parar de forma visível em `/api/trabalhos`; o pior caso da escolha inversa é perder o post em silêncio. Validação de campo em corpo que **foi** interpretado continua sendo recusa.

**3. Slug com acento derruba o build inteiro, não uma página.** `SLUG_PATTERN` recusa acento e `assertPostsIntegrity` roda no carregamento da fonte; com `generateStaticParams` lendo o banco no build, um único slug inválido na tabela quebra a construção do site todo. É o argumento mais forte a favor de o **site** gerar o slug (decisão 2b): a ingestão nunca aceita slug, então o dado inválido não tem por onde entrar. `pagina` como reservado entra na mesma geração.

**Risco de operação a verificar, não resolvido aqui:** o site hoje é servido por IIS a partir de uma pasta. Com runtime, o IIS passa a ser proxy reverso para o Node — e proxy reverso com corpo `chunked` em `PUT` é combinação que exige conferir configuração, não supor. Entra como tarefa de verificação contra o módulo de verdade.

### 6. Capa: sempre vem na entrega, e o site guarda os bytes

O contrato de hoje (commit `3023f7e`, 24/08/2026) traz a capa **obrigatória** no PUT:

```json
"capa": { "base64": "UklGRi...", "formato": "webp", "textoAlternativo": "..." }
```

`base64` é puro — sem prefixo `data:`. `formato` é token nu (`webp`, `png`, `jpeg`), **lido dos bytes reais** pelo módulo, porque o parâmetro de formato da OpenAI é ignorado na prática. Os três campos são obrigatórios: `coverImage` do blog exige `src` e `alt`, e `assertPostsIntegrity` recusa sem o texto alternativo.

**Sem reserva por categoria.** Ela foi o desenho de 21/08 e caiu em 24/08, quando a IA passou a gerar imagem por post — uma capa por categoria daria a mesma imagem para todo post de GED. E a entidade do módulo recusa aprovar post de blog sem capa, com a verificação de saída barrando a entrega antes da requisição. Manter um segundo caminho aqui custaria mais que código: seria exercitado só quando o primeiro falhasse, que é a condição em que ele apodrece sem ninguém notar.

**Os bytes vão para o banco**, em coluna binária, e são servidos por route handler com cache longo. A alternativa era gravar arquivo em volume: rejeitada porque `public/` é substituído a cada implantação (as capas desapareceriam no deploy seguinte) e um volume separado acrescenta ponto de montagem a administrar. Medido do lado deles: 56 a 150 KB por imagem — volume irrelevante para o banco, e o backup do banco passa a cobrir as capas.

### 6b. Bytes que chegam da rede e são servidos a visitantes

Este é o único ponto do sistema em que conteúdo binário de terceiro é servido sob o domínio do site, e isso pede duas defesas que nenhum dos dois lados havia escrito:

1. **verificar os bytes contra o formato declarado** na ingestão, examinando a assinatura do arquivo. O módulo já faz isso do lado dele, mas confiar nisso seria confiar num campo de texto que veio pela rede;
2. **nunca derivar o tipo de mídia do texto recebido.** O tipo servido sai da lista do próprio site (`webp|png|jpeg` → `image/...`), mais `X-Content-Type-Options: nosniff`. Ecoar `"image/" + formato` recebido é o que transformaria a rota de capa em vetor para servir conteúdo ativo.

### 6c. Proporção da capa: 16:9, resolvido

Medição do outro lado: as imagens saem **1536×1024 (3:2)**, e a orientação de estilo compõe o essencial no centro assumindo corte para **16:9**, que descarta 15,6% da altura.

O cabeçalho do post havia passado a `aspect-[16/7]` para reduzir a altura da faixa, o que sobre uma imagem 3:2 descartaria **34,4%** — mais que o dobro do que a arte deles pressupõe. Decisão do dono: **volta para `16/9`**, alinhando com a arte, e o que precisar de ajuste se ajusta no código, não cortando mais a imagem.

Consequência no código, e ela é uma melhoria: as capas passaram a vir do banco, com dimensões que **variam** (1200×675 nas atuais, 1536×1024 nas geradas pela IA). Declarar `width`/`height` fixos em `next/image` seria afirmar uma dimensão que não se conhece, então as três capas (card, destaque e cabeçalho) passaram a usar `fill`, com o container definindo a caixa e a proporção. `COVER_WIDTH`/`COVER_HEIGHT` deixaram de existir — eram uma dimensão de referência que só fazia sentido quando a capa era arquivo conhecido no repositório.

### 6d. O IIS à frente: o que ele proxia, e o que a capa **não** vai ser

Com runtime, o IIS deixa de servir uma pasta e passa a ser proxy reverso para o processo Node. Ele é o ponto de entrada público, então **proxia tudo o que é público** — páginas, rotas de API, a rota da capa. Não existe configuração que proxie só o `PUT`: o que decide é o caminho, não o método.

Tamanho das respostas proxiadas: uma página do índice com seis cards é HTML pequeno, porque o corpo dos posts não vai nela. A **capa** é o único GET grande (56 a 150 KB), e ela passa pelo Node uma vez por falha de cache.

**A capa NÃO será servida como arquivo estático pelo IIS**, e a razão é o requisito de tudo-ou-nada da ingestão, não desempenho. Gravar a imagem em disco para o IIS servir seriam **duas escritas em dois sistemas** — linha no SQL Server e arquivo no volume — sem transação comum. Uma queda entre as duas deixaria um post publicado cuja capa dá 404, e a ingestão teria respondido sucesso: exatamente o estado intermediário que `blog/ingestao-de-post` proíbe. Somem também: o volume tem que ficar fora do pacote de build (senão a implantação apaga as capas), a limpeza da capa antiga passa a ser operação de arquivo que falha por conta, e o backup vira dois assuntos.

Então os bytes ficam no banco e são servidos por route handler. Consequência direta para a pergunta do outro lado: **o desenho da URL não muda por causa do IIS** — `coverImage.src` continua sendo caminho do próprio site, resolvido pelo Next.

O que **pode** ser servido direto pelo IIS sem esse problema é `_next/static`: aquele conteúdo é produzido pelo build e é atómico com a implantação, então não há escrita dividida. Fica como ajuste de operação, não de contrato.

### 6e. Forma da URL da capa, e a capa regerada

`coverImage.src` aponta para a rota da capa por **slug**, não pelo identificador da entrega: o slug é estável por especificação e é o que já aparece na URL do post.

Sem extensão no caminho. O formato pode mudar quando a capa é regerada (`webp` hoje, `png` amanhã), e uma extensão no caminho faria a URL da capa mudar junto — quebrando qualquer referência guardada. O tipo de mídia sai da coluna de formato, pela lista do site.

**Mas a capa regerada precisa de URL nova**, senão navegador e proxy servem a antiga do cache. Daí um token de versão no fim da URL, com cache longo e imutável: capa nova → token novo → URL nova → nada de obsoleto. Sem o token, a alternativa seria cache curto em toda capa, pagando revalidação constante por um evento que acontece raramente.

O token é a **data de atualização do post**, e não um hash dos bytes da imagem. A relação é de dominância: toda troca de capa passa por reentrega, e toda reentrega bumpa `updated_at` — então o token muda sempre que a capa muda. O inverso também ocorre (correção só de texto muda o token e custa um download extra da mesma imagem), e esse é o preço aceito por não carregar uma coluna de hash e não recalcular digest a cada leitura.

### 7. Saida do modo estatico, e o que fazer com a diretoria

As rotas do blog passam a usar cache com tags (`blog`, `post:<slug>`). `generateStaticParams` continua pré-renderizando o que já está publicado no build; `dynamicParams` permite renderizar sob demanda um post publicado depois.

`STATIC_EXPORT`, `scripts/build-static.js` e `npm run build:static` saem.

**Isto exige decisão explícita antes de codar**: o script removia `app/api`, `app/diretoria` e `middleware.js` do build publicado. Sem ele, os três passam a ser publicados — e `app/diretoria` autentica com **auth mock** (`lib/mock-directoria-auth.js`), um token fixo em código. Publicar a área nesse estado é expor uma porta com fechadura de brinquedo.

O spec cobre isso: a presença ou ausência da área no ambiente publicado tem que ser decisão registrada, não efeito colateral. Caminhos possíveis, a escolher no apply: trocar a auth mock por autenticação real antes de publicar; manter a área fora do build por exclusão explícita; ou publicar aceitando o risco por escrito.

Note que `app/api` **precisa** ser publicado — é onde a ingestão vive. Então a exclusão, se houver, é de `app/diretoria` e das rotas de auth dela, não de `app/api` inteiro.

### 7b. Destino da diretoria: **inativa** (decisão do dono, 24/08/2026)

Decidido: nada será feito sobre `app/diretoria` nesta change, e ela fica **inativa** no site publicado. Não entra autenticação real, e não é publicada com o token fixo.

**Nada é tocado agora**, e o momento importa: hoje o `build-static.js` já mantém a área fora do site publicado, então ela já está inativa de fato. O risco nasce **exatamente** quando esse script sai, na troca do modo de execução — e é lá que a exclusão explícita entra, no mesmo passo, para não existir janela em que a área esteja publicável.

Mecanismo, quando chegar a hora: renomear os segmentos para **pasta privada** do App Router (prefixo `_`), que o Next exclui do roteamento. `app/diretoria` vira `app/_diretoria`, e as rotas de auth dela saem de `app/api/auth` para `app/api/_auth`.

Por que assim, e não de outra forma:

- **em vez de apagar**: o código continua no repositório e reativar é renomear de volta. Apagar perderia trabalho que o dono pode querer depois;
- **em vez de porteiro em tempo de execução** (variavel de ambiente que devolve 404): a rota deixaria de existir por configuração, e configuração errada em produção publicaria a área com o token fixo. Pasta privada não tem como ser ligada por engano — a rota não existe no pacote;
- **`app/api` continua publicado**, porque é onde a ingestão mora. A exclusão é dos segmentos da diretoria, não de `app/api`.

`middleware.js` existe apenas para proteger `/diretoria`. Com a rota inexistente ele passa a redirecionar para uma URL que dá 404, então sai junto — e sai inteiro, porque não sobra nada nele.

`lib/mock-directoria-auth.js` e `lib/mock-directoria-presentations.js` ficam onde estão: nada os importa depois disso, e mantê-los deixa a reativação completa.

### 8. Banco fora: tres defeitos que so a medicao encontrou

Rota do blog ja renderizada e servida do cache mesmo com o banco fora — verificado. Paginas institucionais nao tocam o banco e seguem intactas. O que **nao** funcionava era o caso da pagina nunca renderizada, e cada tentativa revelou uma camada:

**1. A requisicao pendurava para sempre.** `Connection Timeout` na string ODBC e `connectionTimeout` no pool do `mssql` **nao surtem efeito** quando se passa `connectionString`: o `mssql` descarta as opcoes irmas, e o driver ODBC ainda tenta outros protocolos antes de desistir. Medido: a requisicao ficou pendurada mais de 10 minutos. A correcao foi impor o limite do nosso lado, com `Promise.race` em `db.js` — 6 segundos, na conexao e na consulta. O banco fica na mesma maquina; se ele nao responde em 6s, esperar mais nao ajuda.

**2. `error.jsx` e `global-error.jsx` nao entram nesse caminho.** Quando o Next renderiza **sob demanda** uma pagina que nao foi pre-renderizada no build e essa renderizacao falha, ele trata como falha de GERACAO — e as fronteiras de erro de segmento nao participam. Testado com as duas: ambas ignoradas, e o visitante recebia a pagina 500 embutida do Next.

Guardar `generateMetadata` contra a falha (ela roda antes da arvore) era necessario mas nao suficiente.

**3. Quem serve aquele caminho e o `_error` do pages router.** Os chunks no HTML do 500 denunciaram: `pages/_app`, `pages/_error`. Daí `pages/500.jsx` — o unico arquivo do pages router no projeto, e o que faz a pagina 500 ser a do site.

Alternativa considerada: `export const dynamic = "force-dynamic"` na rota do post, que faria as fronteiras funcionarem. **Rejeitada** — tiraria a rota do cache e faria cada visita consultar o banco, violando o requisito de servir de cache que `blog/entrega-dinamica` tambem exige. Os dois requisitos se contradizem nesse caminho, e `pages/500.jsx` satisfaz ambos.

**A rota da capa nao tem fronteira de erro** — route handler nao tem. O tratamento e explicito nela, e responde **503 com `no-store`**, nao 500: o codigo diz "tente depois" e intermediarios nao guardam a resposta.

Sobre o build: ele consulta o banco (decisao 1), entao **o banco precisa estar alcancavel no build**. Sem ele o build falha — e falhar e o comportamento correto, porque gerar um site com blog vazio seria pior.

### 9. Driver, autenticação integrada e o pool

`mssql` com o driver `msnodesqlv8`, conectando com `Trusted_Connection=yes`. A instância só aceita autenticação Windows, e a consequência mais valiosa disso é que **não existe senha em configuração nenhuma**: o processo do site acessa o banco como a identidade do Windows que o executa. Em produção isso significa dar acesso à conta de serviço do pool do IIS, e nada de credencial em arquivo.

Custo aceito: `msnodesqlv8` é módulo nativo e só roda em Windows. Irrelevante aqui — o site é servido por IIS em Windows, e o desenvolvimento também é em Windows. A alternativa pura em JavaScript (`tedious`) não faz autenticação integrada, e usá-la exigiria habilitar modo misto na instância que hospeda o `marketingAutomatizado` e passar a guardar senha.

O que a configuração de ambiente carrega, então, é só servidor e nome do banco — e o token de ingestão, que continua sendo segredo de verdade.

**O driver ODBC precisa ser nomeado.** `msnodesqlv8` não escolhe um por padrão: sem `Driver={...}` na string de conexão ele falha com "Nome da fonte de dados não encontrado", que soa como problema de DSN e não de configuração faltando. A máquina tem `ODBC Driver 17` e `18`; o desenho usa o 18, e o nome do driver entra na configuração de ambiente junto do servidor e do banco — porque é exatamente o tipo de coisa que difere entre a máquina de desenvolvimento e o servidor.

Verificado: conexão estabelecida sem senha alguma, autenticando como a identidade Windows do processo, e o tipo `json` nativo atravessa o driver.

**O pool vai em `globalThis`.** O hot reload do Next reavalia módulos e criaria um pool novo a cada recarga, vazando conexões até o servidor recusar. Padrão conhecido, e que morde quem não o aplica. Uma única página do blog faz três consultas (destaque, listagem, contagem), então conexão por consulta esgotaria o limite rapidamente.

