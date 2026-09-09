# Backend e banco de dados do site

> Documento de **estrutura**: o que existe, por que existe nessa forma, e onde
> encostar a mão quando algo quebrar. O procedimento de subida está em
> [`subir-o-blog-em-producao.md`](subir-o-blog-em-producao.md) — este aqui é o
> mapa que aquele pressupõe.
>
> A seção 10 responde à pergunta direta: **essa arquitetura atende?** Ela tem
> um bloqueador que precisa ser respondido antes de qualquer outra coisa, e
> está no topo dela.
>
> Levantado do código em **08/09/2026**.

---

## 1. O mapa em uma página

Não existe "o backend" como aplicação separada. O site é **um processo Next.js**
que renderiza no servidor e fala com o SQL Server direto, sem camada HTTP no
meio.

```
   MARKETING_AUTOMATO (.NET)                      visitante
   PublicadorDeBlogNoSite.cs                          │
            │                                         │
            │ PUT /api/blog/posts/{Guid}              │ GET /blog...
            │ X-Ingestao-Token                        │
            ▼                                         ▼
   ┌─────────────────────── IIS (:80 / :443) ───────────────────────┐
   │  URL Rewrite + ARR  →  proxy reverso para localhost:3000       │
   └────────────────────────────────┬───────────────────────────────┘
                                    ▼
   ┌──────────────── processo Node (next start, :3000) ─────────────┐
   │                                                                │
   │  ESCRITA                        LEITURA                        │
   │  app/api/blog/posts/[idExterno] app/blog/**/page.jsx           │
   │        │                              │                        │
   │  lib/blog/ingest.js             lib/blog/content-source.js     │
   │  lib/blog/ingest-mapping.js       (unstable_cache + tags)      │
   │  lib/blog/covers.js                   │                        │
   │  lib/blog/slug.js               lib/blog/queries.js            │
   │        │                              │                        │
   │        └──────► lib/blog/validate.js ◄┘   ← MESMA definição    │
   │                       │                     nas duas pontas    │
   │                       ▼                                        │
   │                 lib/blog/db.js  (pool em globalThis)           │
   │                 lib/blog/db-config.cjs  (string ODBC)          │
   └────────────────────────────────┬───────────────────────────────┘
                                    │ msnodesqlv8 → ODBC 18
                                    │ Trusted_Connection=yes
                                    ▼
                        SQL Server — banco `notpaperBlog`
                        dbo.posts + dbo.vw_post_destaque
                              + dbo.schema_migrations
```

Três coisas para reter desse desenho:

1. **A leitura não passa por HTTP.** As páginas são server components que chamam
   `content-source.js`, que chama `queries.js`, que fala com o banco. Não existe
   `GET /api/blog/...`. Uma página que buscasse do próprio site falharia no
   build, quando servidor nenhum está de pé.
2. **Só existe uma rota de API de verdade**: o `PUT` de ingestão. Todo o resto
   sob `/api` é pasta privada (seção 8).
3. **A validação é uma só**, e as duas pontas a atravessam — `validate.js` é
   chamado pela ingestão (validando o que veio da rede) e pela leitura
   (validando o que saiu do banco).

---

## 2. A decisão de fundo, e o que ela compra

Ler do banco dentro do server component em vez de expor uma API de leitura é a
decisão que define o resto. O que ela compra:

- **Nada a autenticar na leitura.** Uma API de leitura precisaria decidir quem
  pode chamá-la; a função que roda no servidor não.
- **Nada a versionar.** O contrato entre a página e o banco é interno; muda no
  mesmo commit.
- **Uma ida ao banco em vez de duas.** Sem `fetch` do processo para ele mesmo.

O que ela custa, e o custo é real: **o site inteiro passa a depender do processo
Node**. Antes, `E:\Notpaper_SITE` era pasta estática e o IIS servia sozinho.
Depois, se o Node morre, `notpaper.com.br` morre — não só o `/blog`, porque as
páginas institucionais também são renderizadas por ele. Isso está na seção 3 do
guia de subida como o motivo de guardar a pasta estática atual antes de mexer.

---

## 3. O banco

Um banco só, `notpaperBlog`, com **uma tabela, uma view e uma tabela de
controle**. Não há mais nada.

### 3.1 `dbo.posts` — a tabela

`db/migrations/001_create_posts.sql`

| coluna | tipo | o que é |
|---|---|---|
| `id` | `bigint IDENTITY` | chave técnica, PK |
| `id_externo` | `uniqueidentifier` | **`Publicacao.Id` do módulo** — chave de idempotência da ingestão |
| `slug` | `nvarchar(200)` | **identidade pública**, gerada por este lado |
| `title` | `nvarchar(300)` | |
| `excerpt` | `nvarchar(1000)` | |
| `content` | `json` | blocos do corpo, no vocabulário do blog |
| `author` | `json` | `{ name, role }` — sempre o autor institucional |
| `cover_bytes` | `varbinary(max)` | os bytes da imagem de capa |
| `cover_format` | `varchar(10)` | `webp` \| `png` \| `jpeg`, com CHECK |
| `cover_alt` | `nvarchar(500)` | |
| `published_at` | `datetimeoffset` | |
| `reading_minutes` | `int` | CHECK `>= 1` |
| `category` | `nvarchar(100)` | uma das cinco de `model.js` |
| `tags` | `json` | default `[]` — **não usado hoje** |
| `featured` | `bit` | default 0 |
| `status` | `varchar(20)` | `published` \| `draft`, com CHECK (`:43`) |
| `created_at` / `updated_at` | `datetimeoffset` | `updated_at` é a **versão da capa** |

**As duas identidades não se confundem, e essa é a ideia central do esquema.**

- `id_externo` é como uma reentrega reconhece o post. O módulo pode reenviar o
  mesmo `Publicacao.Id` quantas vezes quiser — a fila dele retenta — e isso
  atualiza a linha em vez de criar outra.
- `slug` é a URL. Ele **sobrevive à reentrega**: corrigir o texto de um post
  publicado não muda o endereço dele. Por isso o `MERGE` não toca em `slug`,
  `published_at` nem `created_at` no ramo `MATCHED`.

As duas unicidades (`:52-53`) são o que a aplicação não consegue garantir
sozinha: é elas que fazem duas ingestões simultâneas do mesmo `id_externo` não
virarem dois posts.

O índice `IX_posts_listagem` (`:59`) cobre `(status, published_at DESC, slug)` —
exatamente a ordenação de toda listagem, incluindo o desempate por slug quando
duas datas coincidem.

**`updated_at` é a versão da capa.** `blogCoverPath` monta
`/blog/capa/{slug}?v={Date.parse(updated_at)}`, então cada regeração dá endereço
novo à imagem. É isso que permite servir a capa com `max-age=31536000, immutable`
sem risco de o navegador guardar a antiga.

### 3.2 `dbo.vw_post_destaque` — a regra do destaque, em um lugar

`db/migrations/002_view_post_destaque.sql`

```sql
SELECT TOP 1 id, slug FROM dbo.posts
WHERE status = 'published'
ORDER BY featured DESC, published_at DESC, slug;
```

A view existe para eliminar um risco específico: a consulta do destaque diz "o
marcado, senão o mais recente" e a da listagem diz "exclua o destaque". Se cada
uma expressar a regra por conta, elas divergem — e o destaque aparece duplicado
no índice ou desaparece dele.

Sem post publicado ela devolve zero linhas, e é assim que o índice sabe
renderizar o estado vazio.

**A exclusividade do destaque NÃO está na view.** A view tolera dois marcados (o
mais recente ganha). Quem garante um só é a ingestão, que desmarca os outros na
mesma transação do `MERGE` (`lib/blog/ingest.js:225-240`). O motivo está
comentado lá: com dois marcados, promover um post **antigo** gravaria a marcação
e não mudaria nada na página — o revisor veria o painel confirmar uma escolha que
o blog ignora.

### 3.3 `dbo.schema_migrations` — o controle

Criada pelo próprio aplicador. Uma coluna `nome` (PK) e um `aplicada_em`. É daí
que vem a idempotência: rodar de novo não reaplica o que já consta.

### 3.4 O aplicador de migrações

`scripts/db-migrate.cjs`, rodado por `npm run db:migrate`.

O que ele faz, em ordem:

1. **Cria o banco se não existir** — conecta em `master` e faz `CREATE DATABASE`.
   O nome vem do ambiente e é validado contra `DATABASE_NAME_PATTERN` antes,
   porque `CREATE DATABASE` não aceita parâmetro.
2. Garante `dbo.schema_migrations`.
3. Lê `db/migrations/*.sql` **em ordem alfabética** — é o prefixo `NNN_` que
   define a sequência.
4. Para cada arquivo não aplicado: abre transação, **quebra o script em lotes
   pelo `GO`** (que não é comando do servidor, e sim separador de ferramenta),
   executa, registra o nome, commita.

DDL é transacional no SQL Server, então uma migração que falha no meio não deixa
metade aplicada.

> **Quem roda precisa de permissão para criar banco.** Rode com a **sua** conta
> de administrador, não com a conta do serviço — ela só precisa ler e escrever.
> Ver seção 4.3 e 4.4 do guia de subida.

**A migração 003 é histórica e não faz nada em produção.**
`003_trechos_nos_posts_antigos.sql` são `UPDATE ... WHERE id = 31..36`, com os
ids do banco de desenvolvimento. Num banco novo a tabela está vazia: ela afeta
zero linhas e é registrada como aplicada. Inofensivo — e permanentemente
inofensivo, porque ela roda na mesma primeira passada que cria a tabela.

---

## 4. A camada de acesso

### 4.1 `lib/blog/db-config.cjs` — a string de conexão

Em CommonJS de propósito: o aplicador de migrações (`.cjs`, fora do Next) e o app
leem **a mesma** configuração, em vez de cada um montar a sua.

Três variáveis obrigatórias, e ele falha com mensagem clara se faltar alguma:

| variável | por que é variável e não constante |
|---|---|
| `SQLSERVER_SERVER` | muda entre dev e produção |
| `SQLSERVER_DATABASE` | idem, e é validado contra `/^[A-Za-z][A-Za-z0-9_]{0,62}$/` |
| `SQLSERVER_ODBC_DRIVER` | **é exatamente o que difere entre as máquinas** — o nome instalado e o nome no ambiente têm que ser o mesmo texto |

A string montada:

```
Driver={<ODBC_DRIVER>};Server=<SERVER>;Database=<DATABASE>;
Trusted_Connection=yes;TrustServerCertificate=yes;Connection Timeout=5;
```

**Não há senha em lugar nenhum.** `Trusted_Connection=yes` autentica com a
identidade do processo. É a decisão certa, e ela tem uma consequência dura em
produção: uma conta **local** (`LocalSystem`, `NetworkService`, `IIS APPPOOL\…`)
não se autentica em outra máquina. Com o banco no servidor da empresa, o serviço
do Node **precisa rodar sob conta de domínio**. Isso está detalhado na seção 2
do guia de subida.

`masterConnectionString()` existe só para o `CREATE DATABASE` do aplicador.

### 4.2 `lib/blog/db.js` — o pool e os três limites de tempo

O pool vive em `globalThis` sob `Symbol.for("notpaper.blog.pool")`. Dois motivos,
e os dois importam:

- **`globalThis`** porque o hot reload do Next reavalia módulos: um pool por
  módulo criaria um pool novo a cada recarga, vazando conexões até o servidor
  recusar.
- **`Symbol.for` e não uma propriedade de string** porque `globalThis` é
  compartilhado com todo o resto do processo, e uma chave por string colidiria em
  silêncio.

Ele guarda a **promessa**, não o pool resolvido — senão duas chamadas
concorrentes na primeira consulta criariam dois pools. E **falha não fica em
cache**: no `catch`, a chave volta a `undefined`, senão um banco indisponível no
primeiro acesso deixaria o processo inteiro sem banco até ser reiniciado.

Os três limites, e por que são três:

| limite | valor | onde |
|---|---|---|
| `Connection Timeout` da string ODBC | 5 s | `db-config.cjs:23` |
| `connectionTimeout` / `requestTimeout` do pool | 5 s / 15 s | `db.js:58-59` |
| **`withTimeout` — imposto por nós** | **6 s** | `db.js:29` |

O terceiro existe porque os dois primeiros **foram medidos e não surtem efeito**:
o `mssql` descarta as opções irmãs quando recebe `connectionString`, e o driver
ODBC ainda tenta outros protocolos antes de desistir. Sem o `Promise.race`, a
requisição ficava pendurada indefinidamente e o visitante via um carregamento que
nunca termina. Falhar rápido é o que permite a fronteira de erro do blog
aparecer.

> ⚠️ **O motivo dos 5 segundos mudou, e o número não.** Ele foi escolhido quando
> o banco ficava na mesma máquina. Em produção o banco está em outra. Cinco
> segundos provavelmente bastam numa LAN — mas isso é suposição, não medição.
> **Meça o tempo real de conexão** no servidor antes de mexer. O comentário no
> código já foi corrigido para dizer isso.

`types` reexporta os tipos do driver (`uuid`, `text`, `int`, `bytes`, `ascii`,
`timestamp`, `bool`) para as consultas não importarem o driver.

---

## 5. A leitura

### 5.1 `lib/blog/queries.js` — o SQL

Nove consultas, e **as regras de exposição e ordenação vivem no SQL**, não em
filtragem depois. O critério é explícito: o custo não pode crescer com o volume
de posts. **Rascunho nunca sai daqui** — todo `SELECT` tem
`status = 'published'`.

| função | o que devolve |
|---|---|
| `selectFeatured()` | o post do topo (`JOIN vw_post_destaque`), ou `null` |
| `selectPage(page)` | uma página da grade, **excluindo o destaque efetivo** |
| `selectPageCount()` | mínimo **1**, para o índice sempre renderizar |
| `selectCategoryPage(cat, page)` | uma página da categoria, **incluindo o destaque** |
| `selectCategoryPageCount(cat)` | **0** quando vazia — aqui o zero é informação |
| `selectCategoryCounts()` | `{ categoria: total }` em **uma** consulta |
| `selectBySlug(slug)` | o post, ou `null` para inexistente **ou** rascunho |
| `selectRelated(slug, n)` | mesma categoria primeiro, completa com recentes |
| `selectPublishedSlugs()` | todos os slugs, para rotas e sitemap |
| `selectCover(slug)` | os bytes da capa |

**A diferença entre `selectPage` e `selectCategoryPage` é deliberada, e é uma
cláusula só.** O índice exclui o destaque da grade porque ele já está no topo da
mesma página; a listagem de categoria não tem esse topo. Reusar a consulta do
índice ali faria o post em destaque **desaparecer da própria categoria dele** —
justamente o post mais promovido, ausente de onde mais se procura.

**A constante `CAMPOS` não inclui `cover_bytes`.** Uma listagem que os trouxesse
carregaria megabytes para desenhar seis cards. A capa tem rota própria.

`toPost(row)` traduz linha → modelo e **chama `assertPostShape`**. Validar aqui é
deliberado: `json` não garante forma, e uma escrita manual no banco (uma correção
às pressas) poderia colocar um `content` malformado que só apareceria como página
torta.

### 5.2 `lib/blog/content-source.js` — o contrato e o cache

**Único ponto de acesso ao conteúdo.** As páginas importam daqui e de nenhum
outro lugar. As assinaturas são as mesmas de quando a fonte era mock — foi isso
que permitiu trocar mock por banco sem tocar em tela.

Cada leitura é envolvida por `unstable_cache` com as tags de `cache-tags.js`:

- `TAG_BLOG` (`"blog"`) — tudo que depende da lista: índice, paginação,
  categorias, relacionados, sitemap.
- `tagForPost(slug)` (`"post:<slug>"`) — a página de um post.

**É esse par que faz um post novo aparecer sem novo deploy.** A ingestão revalida
as duas tags depois de gravar. Duas visitas seguidas à mesma página não consultam
o banco duas vezes.

`getPostBySlug` envolve por chamada, e não no topo do módulo, porque a tag do
post depende do slug e `unstable_cache` fixa as tags na criação. A entrada de
cache continua compartilhada — quem decide é a chave, não a instância da função.

### 5.3 O que roda no build, e isso importa para amanhã

Duas páginas têm `generateStaticParams`, e **as duas consultam o banco**:

- `app/blog/[slug]/page.jsx:16` → `getAllPublishedSlugs()`
- `app/blog/pagina/[page]/page.jsx:12` → `getPageCount()`

> ### ⚠️ Consequência direta no deploy
>
> **`npm run build` precisa do banco de pé e alcançável**, e a conta que roda o
> build precisa de **leitura** em `notpaperBlog`. Com o banco fora, essas
> funções estouram e o build falha.
>
> A ordem de fases do guia de subida já está certa (banco na fase 2, build na
> fase 3) — mas o guia não diz que o build toca o banco. **Diz agora.**

Um post publicado **depois** do build não fica de fora: `dynamicParams` é `true`
por padrão, então a página dele é renderizada sob demanda no primeiro acesso.

### 5.4 As páginas e a fronteira de erro

`app/blog/error.jsx` é a fronteira. Duas coisas escapam dela, e as duas foram
tratadas à mão:

- **`generateMetadata`** roda antes da árvore de componentes, então um erro ali
  impede a fronteira de sequer existir — o visitante receberia a página de erro
  embutida do Next. Em `app/blog/[slug]/page.jsx:30-34` a falha de infra é
  engolida de propósito e devolve um título genérico; quem estoura de verdade é o
  componente logo abaixo, e aí a fronteira aparece.
- **Route handlers não têm fronteira de erro.** Por isso a rota da capa trata no
  próprio `try` (seção 7).

---

## 6. A escrita: a rota de ingestão

`app/api/blog/posts/[idExterno]/route.js` — **a única rota de API do site.**

```
PUT /api/blog/posts/{Publicacao.Id}
X-Ingestao-Token: <token>
{ titulo, resumo, corpo: [...], categoria, minutosDeLeitura, capa: {…}, destaque? }
→ 200 { url, slug, acao }
```

O contrato é definido pelo lado que chama (`PublicadorDeBlogNoSite.cs`), não por
este lado.

### 6.1 Os códigos de resposta SÃO o contrato

O módulo interpreta o status e decide se retenta:

| resposta | o módulo faz |
|---|---|
| `2xx` **com** `url` | publicado, grava a URL |
| `2xx` **sem** `url` | trata como indisponibilidade e **RETENTA** |
| `401` / `403` | credencial recusada, **não** retenta |
| `400` / `409` / `422` / `413` | conteúdo recusado, **não** retenta |
| qualquer outro | indisponibilidade, **RETENTA** até o teto |

**Errar isso é o defeito mais caro possível aqui.** Validar mal e responder `5xx`
faria a fila retentar um post que nunca vai passar; falhar o banco e responder
`4xx` faria o módulo desistir de uma falha passageira.

É por isso que **corpo ilegível responde `503`, e não `422`**. O raciocínio está
comentado na rota: o módulo barra post sem título antes de enviar (`OQueFalta`),
e o título nunca pode estar vazio do lado dele — então um corpo mutilado aqui é,
por construção, problema de rede. Diagnosticar como conteúdo ruim faria o post
ser abandonado com o texto intacto, e ninguém saberia.

### 6.2 O token

- `BLOG_INGESTAO_TOKEN` ausente → **`503`**, com log de erro. Configuração
  ausente é problema nosso, não credencial errada dele.
- Comparação com **`timingSafeEqual`**: `===` em string vaza o tamanho do prefixo
  correto pelo tempo de resposta.
- Tamanhos diferentes são recusados antes, porque `timingSafeEqual` exige mesmo
  tamanho — e o tamanho do token não é segredo útil.
- Token ausente e token errado dão **a mesma resposta**.

> **O token de produção tem que ser novo.** Nem o do `.env.local`, nem o do
> `.env.example` versionado — aquele tem 64 caracteres e cara de token real, e é
> o candidato natural a ser copiado por engano. Ver o quadro na seção 5.1 do guia
> de subida, com o gerador e o defeito já registrado (token de 48 de um lado, 64
> do outro, sintoma `401`).

### 6.3 O que a entrega traz e o que este lado preenche

| a entrega traz — **CONTEÚDO** | este lado preenche — **IDENTIDADE** |
|---|---|
| `titulo`, `resumo`, `corpo` | `slug` (só este lado conhece o próprio acervo) |
| `categoria`, `minutosDeLeitura` | `published_at` |
| `capa` (bytes, formato, alt) | `status` (é ele que serve a página) |
| `destaque` (opcional) | `author` — sempre `INSTITUTIONAL_AUTHOR` |

**O autor é preenchido aqui, sempre igual.** O módulo conhece quem aprovou o
conteúdo, e mandar isso publicaria identidade interna numa página pública.

**O destaque mudou de lado, e o motivo é bom.** Ele era identidade e virou
conteúdo: é julgamento editorial *sobre o texto*, e quem sabe se um post merece
destaque é quem acabou de lê-lo, com o texto na tela e o botão de aprovar na mão.
Antes disso, trocar o destaque exigia abrir o banco.

`readFeatured` (`ingest.js:101`) **recusa tipo errado em vez de coagir**:
`"false"` como texto é verdadeiro em JavaScript, e coagir transformaria a
intenção de não destacar em destaque — o pior erro possível nesse campo. Ausente
e `null` valem `false` (um booleano anulável do .NET chega assim).

**Nada é corrigido nem completado.** Título vazio, resumo longo demais, categoria
fora das cinco, `minutosDeLeitura` não-inteiro: tudo é **recusa** com `422`
nomeando o campo.

### 6.4 A capa na entrada

`lib/blog/covers.js` faz **duas** defesas, e as duas são necessárias porque esses
bytes chegam pela rede e são servidos a visitantes sob o domínio do site — o
único lugar do sistema onde isso acontece.

1. **O formato declarado é conferido contra o conteúdo**, pela assinatura do
   arquivo (PNG `89 50 4E 47…`, JPEG `FF D8 FF`, WebP = contêiner RIFF com
   `"WEBP"` nos bytes 8-11). O módulo também confere do lado dele, mas confiar
   nisso seria confiar num campo de texto que veio pela rede.
2. **O tipo de mídia servido sai de `COVER_FORMATS`**, nunca do texto recebido.
   Ecoar `"image/" + formato` transformaria a rota da capa em vetor para servir
   conteúdo ativo sob o domínio do site.

Teto de **8 MB** (`ingest.js:35`). Capa é obrigatória — o blog não aceita post
sem imagem.

### 6.5 A gravação

`persist()` em `lib/blog/ingest.js`. Tudo em **uma transação**:

1. **Slug resolvido dentro da transação.** `SELECT slug … WITH (HOLDLOCK)` pelo
   `id_externo`: se o post já existe, reusa o slug dele. Se não, `resolveSlug`
   gera do título e testa disponibilidade também com `HOLDLOCK`, para duas
   entregas de títulos iguais não escolherem o mesmo slug.
2. **`assertPostShape`** no post completo, com a mesma definição que a leitura
   usa.
3. **`MERGE dbo.posts WITH (HOLDLOCK)`** pelo `id_externo`, com
   `OUTPUT $action` para saber se criou ou atualizou.
4. **Se `featured`**, desmarca os outros.
5. Commit.

> **`HOLDLOCK` no `MERGE` não é enfeite.** Sem o hint, o `MERGE` não serializa a
> leitura contra outra transação: duas entregas simultâneas do mesmo
> `id_externo` podem ambas não encontrar a linha e ambas tentar inserir, e a
> segunda estoura violação de chave única. É defeito conhecido do `MERGE` no SQL
> Server.

`resolveSlug` (`lib/blog/slug.js`) trata três casos, e cada um já quebrou algum
blog: **colisão** (sufixo `-2`, `-3`…), **segmento reservado** (`pagina`, `capa`,
`categoria` — um título que produzisse um desses sequestraria a rota) e **título
que não produz nada** (só pontuação ou emoji → cai no `id_externo`, e depois em
`"post"`).

### 6.6 A revalidação, e a ordem dela

```js
const { slug, action } = await ingestPost(idExterno, payload);
revalidateTag(TAG_BLOG);
revalidateTag(tagForPost(slug));
return json({ url: blogPostUrl(slug), … }, 200);
```

**Revalida antes de responder**, e a ordem é deliberada: o módulo considera o
post publicado no instante em que recebe a URL e a grava. Devolver antes faria o
endereço registrado apontar, por um instante, para uma página sem o post.

A URL devolvida vem de **`NEXT_PUBLIC_SITE_URL`**, e não do host da requisição
(`lib/blog/urls.js`). Isso foi conferido de propósito: o proxy do IIS **não tem
como** fazer o módulo gravar `http://localhost:3000/blog/...` como endereço
publicado.

---

## 7. A capa na saída

`app/blog/capa/[slug]/route.js` — `GET /blog/capa/{slug}?v={updated_at}`

- `capa` é segmento estático sob `/blog`, então ganha de `/blog/[slug]` na
  precedência do Next. É por isso que `capa` é slug reservado em `model.js`.
- Sem extensão no endereço: o formato pode mudar de webp para png numa
  regeração, e isso não deve mudar a URL. O tipo vem da coluna.
- **Falha de infra responde `503`, não `500`** — o código diz "tente depois" e
  intermediários não guardam a resposta. Route handler não tem fronteira de erro,
  então o `try` é aqui.
- Post inexistente e post em rascunho dão o **mesmo** `404`.
- Cabeçalhos: `Cache-Control: public, max-age=31536000, immutable` (seguro por
  causa do `?v=`) e **`X-Content-Type-Options: nosniff`** — a defesa que faz a
  verificação de formato valer alguma coisa.

**A capa NÃO é servida como arquivo estático pelo IIS**, e a razão é o requisito
de tudo-ou-nada da ingestão, não desempenho. Gravar a imagem em disco seriam duas
escritas em dois sistemas sem transação comum: uma queda entre as duas deixaria
um post publicado cuja capa dá `404`, e a ingestão teria respondido sucesso.
Somem também: o volume tem que ficar fora do pacote de build (senão a implantação
apaga as capas), a limpeza da capa antiga vira operação de arquivo que falha por
conta, e o backup vira dois assuntos.

O custo dessa escolha é que **cada capa é uma ida ao banco**. Está medido como
pendência (`8c.7` do `tasks.md`): medir uma capa de ~150 KB passando pelo proxy e
decidir com o número se vale servir `_next/static` direto pelo IIS.

---

## 8. O que parece rota e não é

`app/_diretoria/` e `app/api/_auth/` **não geram rota nenhuma.** Pasta com
prefixo `_` é *private folder* do App Router: ela e todas as subpastas ficam fora
do roteamento. Conferido no `.next` desta máquina — não há saída para elas em
`.next/server`, e a constante do token de sessão não aparece em nenhum arquivo
compilado. **Confirme no servidor de qualquer forma**, com o `curl` do passo 5 da
seção 9: o custo é uma requisição e o que está em jogo é uma senha.

Isso importa porque a spec `blog/entrega-dinamica` exige que a presença ou
ausência da área restrita no site publicado seja **decisão registrada**, e não
efeito colateral de sair do modo estático. **A decisão está registrada aqui: a
área restrita não vai ao ar, e o mecanismo que a mantém fora é o prefixo `_`.**

Duas coisas para saber, mesmo assim:

- `lib/mock-directoria-auth.js` tem **login, senha e token de sessão fixos no
  código versionado**, e o token de sessão é uma constante — o cookie não é
  derivado da senha. Enquanto as pastas têm `_`, nada disso é alcançável.
- **Renomear a pasta é o suficiente para publicar isso.** Se algum dia a área da
  diretoria for para produção, ela precisa de autenticação de verdade antes, não
  depois. Anote junto: a credencial versionada deve sair do repositório de
  qualquer forma.

`pages/500.jsx` é o único arquivo em `pages/` e coexiste com o App Router.

---

## 9. Como isso vira produção no IIS

**O procedimento está em [`subir-o-blog-em-producao.md`](subir-o-blog-em-producao.md)**,
levantado no servidor em 08/09/2026 com o estado real medido. Não repito aqui.
O resumo de uma linha: **IIS não executa o Node** — ele termina o TLS e faz
proxy reverso para `localhost:3000`, onde um serviço do Windows roda
`next start`.

O que este documento **acrescenta** àquele:

| # | acréscimo | onde |
|---|---|---|
| 1 | **`npm run build` consulta o banco** (`generateStaticParams`). Banco fora → build falha. A conta que roda o build precisa de leitura em `notpaperBlog`. | seção 5.3 |
| 2 | **O tipo `json` da migração 001 exige SQL Server 2025.** Bloqueador — seção 10. | seção 10 |
| 3 | A migração 003 é no-op num banco novo; não estranhe "0 rows affected". | seção 3.4 |
| 4 | `app/sitemap.xml/route.js:6` tem o domínio **fixo no código**, e não lê `NEXT_PUBLIC_SITE_URL` como o resto. Em homologação o sitemap aponta para produção. | seção 10 |

E o mapa rápido do que verificar depois de subir, na ordem em que as coisas
quebram:

```powershell
# 1. o processo está de pé e falando com o banco
curl.exe -s -o NUL -w "%{http_code}`n" http://localhost:3000/blog

# 2. o proxy do IIS atravessa a leitura
curl.exe -s -o NUL -w "%{http_code}`n" https://notpaper.com.br/blog

# 3. a capa atravessa o proxy (o corpo mais pesado que o site serve)
curl.exe -s -o NUL -w "%{http_code} %{size_download} %{time_total}`n" `
  "https://notpaper.com.br/blog/capa/<um-slug>?v=0"

# 4. o PUT chunked chega íntegro — tarefa 8c.5, ANTES de integrar o módulo
#    (ver seção 6.2 do guia de subida: 422 = passou, 5xx/413 = o proxy comeu)

# 5. a área restrita continua fora do ar
curl.exe -s -o NUL -w "%{http_code}`n" https://notpaper.com.br/_diretoria   # espera 404
```

---

## 10. Essa arquitetura atende?

**Sim — a arquitetura atende, e é boa.** O desenho está coerente com o problema:
um blog de baixa escrita e leitura alta, alimentado por um módulo externo, com
cache invalidado por tag na ingestão. As decisões difíceis foram tomadas com
motivo escrito e, em vários casos, **medido** — o `withTimeout` de `db.js` existe
porque os timeouts do driver foram testados e não funcionavam; o `HOLDLOCK` está
lá porque o defeito do `MERGE` é conhecido; a verificação de assinatura da capa
existe porque é o único ponto onde bytes de fora são servidos sob o domínio.

O que **não** atende ainda é operacional, não arquitetural. Um bloqueador de
verdade, e uma lista de pendências.

### 🚨 O bloqueador: a versão do SQL Server

`db/migrations/001_create_posts.sql:25,26,38` declaram `content`, `author` e
`tags` como **`json`** — o tipo **nativo**, que só existe a partir do **SQL
Server 2025**.

O `design.md` verificou isso, mas verificou **na máquina de desenvolvimento**
(*"Terreno verificado na máquina: SQL Server 2025 RTM… tem `json` nativo"*). A
decisão de 08/09/2026 mudou o banco para o **SQL Server da empresa, em outra
máquina**, e a versão dele não foi verificada. Se for 2016, 2019 ou 2022,
`npm run db:migrate` **falha no primeiro lote** e nada sobe.

**Verifique antes de qualquer outra coisa:**

```sql
SELECT SERVERPROPERTY('ProductMajorVersion') AS versao,
       SERVERPROPERTY('ProductLevel')        AS nivel,
       @@VERSION                             AS completo;
-- 17 = SQL Server 2025 · 16 = 2022 · 15 = 2019 · 14 = 2017 · 13 = 2016
```

**Se vier menos que 17, o remédio é barato — e o próprio comentário da migração
já o descreve** (*"Em versão anterior isto seria `nvarchar(max)` com
`CHECK (ISJSON(col) = 1)`"*):

```sql
content  nvarchar(max) NOT NULL CONSTRAINT CK_posts_content_json CHECK (ISJSON(content) = 1),
author   nvarchar(max) NOT NULL CONSTRAINT CK_posts_author_json  CHECK (ISJSON(author)  = 1),
tags     nvarchar(max) NOT NULL CONSTRAINT CK_posts_tags_json    CHECK (ISJSON(tags)    = 1)
                              CONSTRAINT DF_posts_tags DEFAULT (N'[]'),
```

**Nenhuma linha de código de aplicação muda**, e isso não é sorte — é porque o
código nunca dependeu do tipo nativo:

- a escrita já manda **string**: `.input("content", types.text, JSON.stringify(...))`
  em `ingest.js`, com `types.text` = `NVarChar`;
- a leitura já aceita string: `parseJson()` em `queries.js:23-32` faz
  `JSON.parse` quando o valor vem como texto, com fallback;
- nenhuma consulta usa função JSON do SQL Server. Os blocos nunca são consultados
  individualmente, só lidos inteiros com o post.

Faça a troca **na própria migração 001** (ela nunca rodou em produção — não crie
uma 004 para consertar o que ainda não existe), e deixe o comentário registrando
a versão que motivou a escolha.

### As pendências, em ordem de quanto doem

| # | pendência | quanto dói |
|---|---|---|
| 1 | **`TrustServerCertificate=yes` atravessando a rede** (`db-config.cjs:64`). Na mesma máquina não havia o que atacar; numa conexão em rede é o cliente aceitando qualquer certificado, inclusive um trocado no meio. | Médio. Não bloqueia a subida — vira certificado de verdade quando houver um. |
| 2 | **O site institucional passa a poder cair.** Hoje é pasta estática e é imune. Depois, se o Node morre, `notpaper.com.br` inteiro morre. O serviço reinicia sozinho, mas **ninguém é avisado**: não há monitoramento. | Alto, e é o maior risco residual. Um teste de disponibilidade no `/blog` com alerta resolve. |
| 3 | **Cache de um processo só.** `unstable_cache` grava em `.next/cache`, e `revalidateTag` invalida **o cache do processo que recebeu o `PUT`**. Com um processo, correto. Com *web garden* ou segunda instância, um post novo apareceria em uma e não na outra. | Nenhum hoje. **Restrição a respeitar:** não escalar para múltiplas instâncias sem resolver isso primeiro. |
| 4 | **Cada capa é uma ida ao banco** (seção 7). Tarefa `8c.7`: medir a de 150 KB pelo proxy e decidir com o número. | Baixo, e já tem plano. |
| 5 | **Domínio fixo no sitemap** (`app/sitemap.xml/route.js:6`), enquanto `urls.js` lê `NEXT_PUBLIC_SITE_URL`. Duas fontes para o mesmo dado. | Baixo em produção (o valor está certo), errado em homologação. Trocar por `SITE_URL` de `urls.js`. |
| 6 | **`PUT` chunked pelo IIS não foi exercitado** (`8c.5`). O `HttpClient` do .NET não declara `Content-Length`; se o ARR bufferizar ou recusar, o sintoma é **post sem título**, com os dois lados corretos. | Médio, e é a **primeira** coisa a testar depois da janela. Conserto barato, e do lado do módulo. |
| 7 | **`output: 'standalone'` não foi avaliado.** Encurtaria o deploy, mas mexe em `next.config.js` junto de módulos nativos externalizados. | Nenhum. Depois de o caminho simples estar de pé. |
| 8 | **Credencial versionada** em `lib/mock-directoria-auth.js` (seção 8). Inalcançável hoje pelo prefixo `_`. | Nenhum hoje. Deve sair do repositório de qualquer forma. |
| 9 | **O deploy mudou de natureza.** Era gerar build e copiar pasta; passa a ser copiar fonte → `npm ci` → `npm run build` → migrar → reiniciar serviço. Não é mais difícil — são mais passos, e passos manuais que ninguém escreveu se esquecem. | Médio, e cresce com o tempo. O guia de subida é o remédio; mantenha-o. |
| 10 | **`tags` existe no esquema e não é usada.** `DEFAULT '[]'`, a ingestão grava `N'[]'` fixo, nada lê. | Nenhum. Deixe — remover coluna custa mais que ignorá-la. |

### O que já está resolvido e vale registrar como tal

- **Autenticação Windows sem senha em lugar nenhum**, e a consequência (conta de
  domínio para o serviço) mapeada.
- **Idempotência da ingestão** garantida por `id_externo` + `MERGE` com
  `HOLDLOCK`, e verificada de ponta a ponta (`8c.2`).
- **Códigos de resposta** alinhados com a política de retentativa do módulo, e o
  caso difícil (corpo ilegível = `503`, não `422`) decidido com motivo escrito.
- **Validação nas duas fronteiras** com uma definição só.
- **A URL devolvida ao módulo não depende do host da requisição** — o proxy não
  pode corrompê-la.
- **Rollback pensado antes de precisar**: guardar `E:\Notpaper_SITE` intacta e
  reapontar o site é questão de segundos.
```
