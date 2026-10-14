# Fazer o site rodar no servidor de dev

> Passo a passo executável, na ordem. Cada passo tem **o comando**, **o que
> esperar** e **se falhar, olhe aqui** — porque num deploy o que custa tempo não
> é o comando, é descobrir qual dos dez passos anteriores foi o que quebrou.
>
> Escrito para o **servidor de dev**, com o estado real medido lá em
> **09/09/2026**. O que muda quando for para produção está na seção final.
>
> Estrutura do backend e do banco: [`backend-e-banco-de-dados.md`](backend-e-banco-de-dados.md).
> Procedimento de produção: [`subir-o-blog-em-producao.md`](subir-o-blog-em-producao.md).

---

## 0. O que o dev já tem — e é mais do que parece

Medido pelos seus checks:

| | dev | produção (medido 08/09) |
|---|---|---|
| **Node** | ✅ **v24.14.1**, npm 11.11.0 | ❌ não instalado |
| **ODBC Driver 18** | ✅ **instalado** | ❌ só o legado `SQL Server` |
| **SQL Server local** | ✅ `MSSQLSERVER` + `SQLEXPRESS`, os dois rodando | ❌ nenhuma instância |
| **IIS** | ❌ `Get-Website` não reconhecido | ✅ com 45 sites |
| **ARR** | ❌ | ❌ |
| **Porta 3000** | ⚠️ **ocupada** | ✅ livre |

**Três dos itens mais chatos já estão resolvidos no dev.** Node, ODBC 18 e um SQL
Server alcançável são exatamente o que a produção não tem — então os passos 1 a 7
daqui vão rodar rápido.

E há uma simplificação grande que vale nomear: **o banco do dev é local.**
`Trusted_Connection=yes` autentica com a identidade do processo, e numa conexão
na mesma máquina isso funciona com a sua própria conta de login. **Você não
precisa de conta de domínio no dev.** Isso é problema exclusivo da produção, onde
o banco fica em outra máquina.

### O que este roteiro cobre, e o que não cobre

Os passos 1 a 8 provam **o site inteiro funcionando**, incluindo a ingestão, sem
IIS nenhum. O passo 9 é opcional hoje e obrigatório antes da produção: é o ensaio
do proxy.

---

## 1. Liberar a porta 3000

Seus checks disseram `OCUPADA`. Descubra quem é antes de qualquer coisa:

```powershell
$p = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
if ($p) { Get-Process -Id $p.OwningProcess | Select-Object Id, ProcessName, Path }
```

**O que esperar:** provavelmente um `node.exe` de algum `next dev` esquecido.

**Duas saídas.** Se for processo descartável, encerre (`Stop-Process -Id <id>`).
Se for algo que precisa continuar, **não mate** — use outra porta, e o resto do
roteiro segue igual trocando `3000` por `3001`:

```powershell
$env:PORT = "3001"
```

Anote qual porta você escolheu. Ela reaparece nos passos 6, 7 e 9.

---

## 2. 🚨 A versão do SQL Server — o bloqueador, e aqui ele é testável

`db/migrations/001_create_posts.sql` usa o tipo **`json` nativo**, que só existe a
partir do **SQL Server 2025**. Antes de criar banco nenhum, descubra a versão das
**duas** instâncias — elas podem ser diferentes:

```powershell
sqlcmd -S localhost            -E -C -Q "SELECT SERVERPROPERTY('ProductMajorVersion') AS maior, SERVERPROPERTY('Edition') AS edicao"
sqlcmd -S localhost\SQLEXPRESS -E -C -Q "SELECT SERVERPROPERTY('ProductMajorVersion') AS maior, SERVERPROPERTY('Edition') AS edicao"
```

> ### ⚠️ O `-C` não é opcional, e a razão está no código
>
> Sem ele, o Driver 18 recusa a conexão com **"the certificate chain was issued
> by an authority that is not trusted"** — e não é problema do servidor.
>
> **O Driver 18 mudou o padrão**: ele exige criptografia (`Encrypt=yes`) por
> default, o que o 17 não fazia. O SQL Server usa certificado autoassinado, a
> cadeia não é confiável, e o driver corta.
>
> `-C` é o "trust server certificate" do `sqlcmd`, e é o mesmo que
> `TrustServerCertificate=yes` faz em `lib/blog/db-config.cjs:64`. Se você bater
> nesse erro, ele é a prova de que aquela linha da string de conexão está
> fazendo trabalho real — e também de por que ela vira pendência em produção,
> onde "aceitar qualquer certificado" passa a valer **atravessando a rede**.
>
> Isto vale para qualquer `sqlcmd` deste projeto, não só para esta query.

**Se `sqlcmd` não existir** — ou se você quiser desviar do assunto do
certificado de uma vez —, isto não precisa de nada instalado e já traz o
`TrustServerCertificate=true` embutido:

```powershell
foreach ($inst in @("localhost", "localhost\SQLEXPRESS")) {
  $c = New-Object System.Data.SqlClient.SqlConnection "Server=$inst;Integrated Security=true;TrustServerCertificate=true;Connect Timeout=5"
  try { $c.Open(); "$inst -> $($c.ServerVersion)"; $c.Close() }
  catch { "$inst -> FALHOU: $($_.Exception.Message)" }
}
```

**O que esperar:** `17.x` é SQL Server 2025 — segue em frente. Medido na máquina
de desenvolvimento em 09/09/2026: `v17 (17.0.1000.7)` nas duas instâncias.

**Se a instância nomeada falhar e a default responder, ignore a nomeada.** Erro
`Error Locating Server/Instance Specified` seguido de `Login timeout expired`
significa que o cliente não traduziu o nome `SQLEXPRESS` para uma porta —
normalmente o serviço **`SQLBrowser`** parado (ele não aparece num filtro
`MSSQL*`, porque o nome dele não começa assim). Não perca tempo: o roteiro usa a
default, e uma instância que chegou ao handshake TLS já provou que está de pé.

**Se as duas vierem 16 ou menos** (16 = 2022, 15 = 2019, 14 = 2017, 13 = 2016),
**pare aqui e conserte a migração antes**, porque ela vai falhar no primeiro lote.
Troque as três colunas `json` em `db/migrations/001_create_posts.sql`:

```sql
content  nvarchar(max) NOT NULL CONSTRAINT CK_posts_content_json CHECK (ISJSON(content) = 1),
author   nvarchar(max) NOT NULL CONSTRAINT CK_posts_author_json  CHECK (ISJSON(author)  = 1),
tags     nvarchar(max) NOT NULL CONSTRAINT CK_posts_tags_json    CHECK (ISJSON(tags)    = 1)
                              CONSTRAINT DF_posts_tags DEFAULT (N'[]'),
```

**Nenhuma linha de código de aplicação muda** — a escrita já manda string
(`JSON.stringify` com tipo `NVarChar`) e a leitura já faz `JSON.parse`. Edite a
própria 001; ela nunca rodou em produção, então não há o que migrar.

> **Anote a versão que você achou.** Se o SQL do dev for 2025 e o da empresa for
> 2022, a migração **passa no ensaio e falha na estreia** — é a pior inversão
> possível deste plano. A versão do SQL da empresa continua sendo pergunta
> aberta, e ela é independente desta.

---

## 3. Escolher a instância e criar o `.env.local`

Escolha a instância que passou no passo 2. Se as duas passaram, use a **default**
(`MSSQLSERVER`), que é o que `localhost` resolve sem sufixo.

Na raiz da pasta do site, no servidor de dev:

```powershell
@"
SQLSERVER_SERVER=localhost
SQLSERVER_DATABASE=notpaperBlog
SQLSERVER_ODBC_DRIVER=ODBC Driver 18 for SQL Server
BLOG_INGESTAO_TOKEN=COLE_O_TOKEN_AQUI
NEXT_PUBLIC_SITE_URL=http://localhost:3000
"@ | Out-File -FilePath .env.local -Encoding utf8
```

Gere o token antes e cole na linha:

```powershell
-join ((1..32) | ForEach-Object { '{0:x2}' -f (Get-Random -Max 256) })
```

Três decisões dentro desse arquivo, e cada uma tem motivo:

- **`.env.local` no dev é o caminho certo**, e não uma preguiça. O
  `npm run db:migrate` lê esse arquivo explicitamente
  (`--env-file-if-exists=.env.local`), e o Next também o carrega no `build` e no
  `start`. A regra "variáveis vão no serviço, não em arquivo" é decisão de
  **produção** — lá o servidor hospeda 45 sites e um arquivo de segredo na pasta
  é superfície a mais. No dev, esse cálculo não se aplica.
- **`SQLSERVER_ODBC_DRIVER` tem que ser o texto exato** do driver instalado. Seus
  checks confirmaram `ODBC Driver 18 for SQL Server` no dev. Se você apontar para
  a instância `SQLEXPRESS`, o valor de `SQLSERVER_SERVER` vira
  `localhost\SQLEXPRESS`.
- **`NEXT_PUBLIC_SITE_URL` aponta para o próprio localhost no dev**, e isso não é
  detalhe cosmético: é essa URL que a ingestão **devolve ao módulo**, e o módulo
  a **grava** como endereço publicado. Pôr o domínio de produção aqui faria um
  teste no dev registrar um endereço que não existe lá.

Não defina `NODE_ENV` — o `next start` já assume produção.

---

## 4. Criar o banco e aplicar as migrations

```powershell
npm run db:migrate
```

**O que esperar:**

```
== migracoes do blog ==
  banco "notpaperBlog" criado
  aplicada:    001_create_posts.sql
  aplicada:    002_view_post_destaque.sql
  aplicada:    003_trechos_nos_posts_antigos.sql
  3 migracao(oes) aplicada(s)
```

O aplicador **cria o banco** se não existir, então a conta com que você roda
precisa de permissão de `CREATE DATABASE`.

> ### ⚠️ `Login failed for user 'DOMINIO\voce'` — tente elevado antes de pedir acesso
>
> Medido no dev em 09/09/2026: a conexão chega ao servidor e o SQL recusa o
> login. **Antes de concluir que falta permissão, abra o PowerShell como
> administrador e repita.**
>
> Numa instalação padrão `BUILTIN\Administrators` é `sysadmin`, mas o **UAC
> filtra o SID de Administrators do token** numa sessão não elevada — o SQL
> Server recebe um token onde você não é administrador e corta. Dá para ver o
> filtro:
>
> ```powershell
> whoami /groups | findstr /i "Administrators"
> ```
>
> Não elevado, a linha vem como `Group used for deny only`. Elevado, habilitada.
>
> **Se elevado também falhar**, o login não existe na instância. O mínimo que
> serve, pedido a quem tem `sysadmin`:
>
> ```sql
> CREATE LOGIN [DOMINIO\voce] FROM WINDOWS;
> ALTER SERVER ROLE dbcreator ADD MEMBER [DOMINIO\voce];
> ```
>
> `dbcreator`, não `sysadmin`: é o bastante para o `CREATE DATABASE`, e quem cria
> o banco vira dono dele — as migrations rodam. Pedir `sysadmin` no dev ensaia um
> pedido que produção não vai conceder.

**Não estranhe a 003.** Ela é `UPDATE ... WHERE id = 31..36` com ids do banco da
sua máquina local. No banco novo a tabela está vazia: zero linhas, e é registrada
como aplicada. Correto e definitivo.

**Se falhar:**

| erro | causa |
|---|---|
| `configuracao de banco ausente: ...` | o `.env.local` não foi lido — confira que você está na raiz da pasta |
| algo sobre `json` perto de `CREATE TABLE` | é o passo 2. A instância não é 2025 |
| `CREATE DATABASE permission denied` | conectou, mas falta `dbcreator` — ver o quadro acima |
| `Login failed for user 'DOMINIO\voce'` | conectou e o login foi recusado. **Tente elevado primeiro** — ver o quadro acima |
| `certificate chain ... not trusted` | só acontece fora do app (`sqlcmd` sem `-C`). A string do projeto já trata — ver passo 2 |

Rodar de novo é seguro: ele guarda o que aplicou em `dbo.schema_migrations` e não
repete.

---

## 5. `npm ci` e `npm run build`

```powershell
npm ci
npm run build
```

> ### ⚠️ Não use `--omit=dev`, e não defina `NODE_ENV=production` antes
>
> `tailwindcss`, `autoprefixer` e `postcss` são **devDependencies**, e o
> `postcss.config.js` os exige. Sem eles o build quebra no CSS.

**Duas coisas que esse build faz e que não são óbvias:**

1. **Ele consulta o banco.** `generateStaticParams` em `app/blog/[slug]/page.jsx`
   e `app/blog/pagina/[page]/page.jsx` vai à fonte de conteúdo. É por isso que o
   passo 4 vem antes deste. Com o banco fora, o build falha — e com o banco vazio
   ele passa, gerando zero páginas de post, o que é correto.
2. **Ele compila contra o Node desta máquina.** O `msnodesqlv8` é módulo nativo.
   Já verifiquei que existe binário pronto para o **Node 24 (ABI 137)**, então o
   `npm ci` não deve pedir compilador C++. Se pedir, a saída barata é trocar a
   versão do Node — não instalar Visual Studio Build Tools no servidor.

**O que esperar:** a tabela de rotas do Next, com `/blog`, `/blog/[slug]`,
`/blog/capa/[slug]`, `/api/blog/posts/[idExterno]` e as páginas institucionais.
Se `/api/blog/posts/[idExterno]` **não** aparecer, algo está muito errado — é a
rota que o módulo chama.

---

## 6. Subir e provar na porta

Primeiro num terminal, para ver o erro se houver um:

```powershell
npm start
```

Em **outro** terminal:

```powershell
curl.exe -s -o NUL -w "/            %{http_code}`n" http://localhost:3000/
curl.exe -s -o NUL -w "/blog        %{http_code}`n" http://localhost:3000/blog
curl.exe -s -o NUL -w "/solucoes    %{http_code}`n" http://localhost:3000/solucoes
curl.exe -s -o NUL -w "/sitemap.xml %{http_code}`n" http://localhost:3000/sitemap.xml
curl.exe -s -o NUL -w "/_diretoria  %{http_code}`n" http://localhost:3000/_diretoria
```

**O que esperar:** `200` nos quatro primeiros e **`404` no `/_diretoria`** — essa
área é pasta privada do App Router (prefixo `_`) e não deve ter rota. Se ela
responder `200`, pare: há credencial fixa no código e ela não pode ir a lugar
nenhum.

Com o banco vazio, `/blog` renderiza o **estado vazio** — é o comportamento
correto, não uma falha.

> ### Não procure `index.html`
>
> Este projeto **não tem** um. Era o que a pasta estática antiga entregava, e é
> por isso que jogá-la no IIS funcionava. Aqui o `next start` responde `GET /` em
> memória. Quando o IIS entrar (passo 9), o documento padrão dele deixa de
> importar: a regra de rewrite repassa toda URL para o Node.

**Se falhar:**

| sintoma | onde olhar |
|---|---|
| erro citando `.node` ilegível | `node_modules` veio de outra máquina. `rm -r node_modules` e `npm ci` de novo |
| `/blog` dá erro tratado do site | o banco. Rode o passo 4 de novo e veja o log do terminal do `npm start` |
| a requisição pendura ~6 s e falha | é o `withTimeout` de `lib/blog/db.js` fazendo o trabalho dele: banco inalcançável |
| `EADDRINUSE` | passo 1 |

---

## 7. Provar a ingestão — o `PUT`

É a rota que existe por causa do módulo, e a única de API. Teste com o token do
`.env.local`.

**Primeiro, uma recusa esperada**, para provar que a validação está de pé:

```powershell
$token = "<o token do .env.local>"
$corpo = '{"titulo":"teste","resumo":"x","categoria":"GED","conteudo":[]}'
curl.exe -X PUT "http://localhost:3000/api/blog/posts/00000000-0000-0000-0000-000000000001" `
  -H "X-Ingestao-Token: $token" -H "Content-Type: application/json" `
  --data-binary $corpo -i
```

**O que esperar: `422`** nomeando um campo — este corpo é inválido de propósito
(falta `corpo`, falta `capa`, falta `minutosDeLeitura`). O `422` é a resposta
certa, e ele prova três coisas de uma vez: o token passou, o corpo chegou, e a
validação recusou por conteúdo.

**Confira também o `401`**, sem o cabeçalho de token — ele tem que vir idêntico
para token ausente e token errado:

```powershell
curl.exe -X PUT "http://localhost:3000/api/blog/posts/00000000-0000-0000-0000-000000000001" `
  -H "Content-Type: application/json" --data-binary "{}" -i
```

**Por que estes dois códigos e não outros:** o módulo **interpreta o status** e
decide se retenta. `401` e `422` fazem ele **não** retentar; `503` e qualquer
`5xx` fazem retentar. Um `500` aqui faria a fila retentar para sempre um post que
nunca vai passar.

Para um post que **entra** de verdade, você precisa de um payload completo com
capa em base64 — o mais barato é apontar o módulo de marketing para
`http://localhost:3000` e aprovar uma publicação de canal Blog. É o teste `8c.1`,
e ele exercita o contrato inteiro em vez de um `curl` montado à mão.

---

## 8. Virar serviço do Windows

Enquanto está em `npm start` num terminal, o site morre quando você fecha a
sessão e não volta depois de um reinício. No dev isso talvez baste por uns dias —
mas o serviço é parte do que se está ensaiando, então vale montar.

Use **NSSM**. O que importa, seja qual for a ferramenta:

- **executa** `node node_modules\next\dist\bin\next start`, com a pasta do site
  como diretório de trabalho;
- **início automático**;
- **redireciona stdout/stderr para arquivo** — sem isso, o único registro de um
  erro do Next é a tela que ninguém está vendo;
- **reinicia sozinho** se o processo morrer.

No dev, rodar sob a conta padrão do serviço funciona **porque o banco é local**.
Em produção não funciona, e é a diferença mais importante da seção final.

Depois de criar o serviço, repita o passo 6. Se `/blog` der erro agora e antes
não dava, é a identidade do serviço não tendo acesso ao banco:

```sql
USE [notpaperBlog];
CREATE USER [NT AUTHORITY\SYSTEM] FOR LOGIN [NT AUTHORITY\SYSTEM];
ALTER ROLE db_datareader ADD MEMBER [NT AUTHORITY\SYSTEM];
ALTER ROLE db_datawriter ADD MEMBER [NT AUTHORITY\SYSTEM];
```

`db_datareader` + `db_datawriter`, e nada mais. O caminho fácil é `db_owner`; não
faça, nem no dev — o dev existe para ensaiar o que produção vai fazer.

---

## 9. IIS + ARR — o ensaio que só o dev pode fazer

**Opcional para o site funcionar. Obrigatório antes da produção.**

Seus checks não acharam `Get-Website` nem `Get-WebGlobalModule`, o que indica que
o dev **não tem IIS**. Isso torna este passo mais longo aqui do que será lá — mas
é justamente por isso que ele vale: **o dev é o único lugar onde você pode
instalar o ARR e errar a regra de proxy sem derrubar 45 sites de clientes.**

Confirme primeiro:

```powershell
# Windows Server
Get-WindowsFeature Web-Server, Web-Mgmt-Console | Select-Object Name, InstallState
# Windows cliente
Get-WindowsOptionalFeature -Online -FeatureName IIS-WebServerRole | Select-Object FeatureName, State
```

Depois, na ordem:

1. **IIS** (com o console de gerenciamento — é ele que traz o módulo
   `WebAdministration` que faltou nos seus checks).
2. **URL Rewrite** — a produção já tem.
3. **ARR** — exige o URL Rewrite. No dev, instale sem cerimônia; na produção, é
   ele que reinicia o serviço do IIS inteiro.
4. Ligar o proxy: *Application Request Routing Cache → Server Proxy Settings →
   Enable proxy*.
5. Criar um site apontando para uma pasta vazia e pôr este `web.config` nela:

```xml
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="Next" stopProcessing="true">
          <match url="(.*)" />
          <action type="Rewrite" url="http://localhost:3000/{R:1}" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

Deliberadamente mínima. Os ajustes finos — preservar host,
`X-Forwarded-Proto`, servir `_next/static` direto pelo IIS — se decidem pelo que
os testes abaixo medirem, e não preventivamente.

**A pasta do site no IIS fica vazia de propósito.** Ela não recebe o código; só o
`web.config`. O código vive onde o serviço do Node aponta.

### Os dois testes que só existem com IIS

**A. `PUT` chunked** — é a tarefa `8c.5`, e o teste de maior valor deste roteiro
inteiro:

```powershell
$corpo = '{"titulo":"teste de proxy","resumo":"x","categoria":"GED","conteudo":[]}'
curl.exe -X PUT "http://localhost/api/blog/posts/00000000-0000-0000-0000-000000000001" `
  -H "X-Ingestao-Token: $token" -H "Content-Type: application/json" `
  -H "Transfer-Encoding: chunked" --data-binary $corpo -i
```

O `HttpClient` do .NET serializa preguiçosamente e **não declara
`Content-Length`** — o corpo vai em `chunked`. Não é escolha do módulo; é como
ele funciona.

| resposta | leitura |
|---|---|
| **422** nomeando o campo | ✅ o corpo atravessou o proxy inteiro |
| **5xx** de corpo ilegível | ❌ o proxy comeu o corpo — é o defeito que se veio procurar |
| **413** ou timeout | ❌ o proxy bufferizou e travou. Olhe `uploadReadAheadSize` |

Se der errado, o conserto é do lado do módulo e é barato: bufferizar o corpo
antes de enviar dá `Content-Length`. **Descobrir isso aqui vale a instalação
inteira do IIS no dev** — porque o sintoma em produção seria post sem título, com
os dois lados achando que estão certos.

**B. A capa pelo proxy** — tarefa `8c.7`. É a resposta mais pesada que o site
serve, e ela vem do banco, não do disco:

```powershell
curl.exe -s -o NUL -w "%{http_code} %{size_download} bytes %{time_total}s`n" `
  "http://localhost/blog/capa/<um-slug>?v=0"
```

Compare com o mesmo endereço em `:3000`. A diferença é o custo do proxy, e é com
esse número que se decide se `_next/static` passa a ser servido direto pelo IIS.

---

## 10. O que muda quando for para produção

O dev prova quase tudo. **Três coisas ele não prova**, e vale saber quais são
antes de confundir "funcionou no dev" com "vai funcionar lá".

| # | no dev | em produção |
|---|---|---|
| 1 | **Banco local.** `Trusted_Connection` funciona com a conta padrão do serviço | **Banco em outra máquina.** Conta local (`LocalSystem`, `NetworkService`, `IIS APPPOOL\...`) **não se autentica em outra máquina** — o serviço precisa de **conta de domínio** |
| 2 | `TrustServerCertificate=yes` não tem o que atacar na mesma máquina | Atravessa a rede: é o cliente aceitando qualquer certificado, inclusive um trocado no caminho |
| 3 | Instalar o ARR não incomoda ninguém | O ARR é módulo **global** do IIS: o instalador reinicia o serviço e **os 45 sites caem por alguns segundos**. É janela de manutenção combinada |

E duas que mudam de forma, não de natureza:

- **As variáveis saem do `.env.local` e vão para o serviço.** No dev o arquivo é
  o caminho certo; num servidor com 45 sites, um arquivo de segredo na pasta é
  superfície a mais.
- **O token de ingestão é outro.** Gere um novo para produção — nem o do dev, nem
  o do `.env.example` versionado. O mesmo valor vai em `Blog:Token` do módulo. O
  defeito já registrado neste projeto foi exatamente esse: token de 48 caracteres
  de um lado e 64 do outro, sintoma **401**.

E uma que **não** muda, e é bom saber que foi conferido: a URL que a ingestão
devolve ao módulo vem de `NEXT_PUBLIC_SITE_URL`, não do host da requisição. O
proxy não tem como fazer o módulo gravar `http://localhost:3000/blog/...` como
endereço publicado.

---

## Checklist

```
[ ]  1. porta 3000 livre (ou PORT escolhido e anotado)
[ ]  2. versão do SQL >= 17, ou migração 001 ajustada para nvarchar(max)
[ ]  3. .env.local criado, com o token gerado
[ ]  4. npm run db:migrate — 3 migrações aplicadas
[ ]  5. npm ci + npm run build, com /api/blog/posts/[idExterno] na lista de rotas
[ ]  6. 200 em /, /blog, /solucoes, /sitemap.xml — e 404 em /_diretoria
[ ]  7. 422 no PUT inválido, 401 sem token
[ ]  8. serviço do Windows, com log em arquivo, e passo 6 repetido
[ ]  9. IIS + URL Rewrite + ARR, proxy ligado, PUT chunked dando 422
[ ] 10. módulo de marketing apontado para o dev e uma publicação aprovada
```

Do 1 ao 8, nada depende de IIS. Se você chegar no 8 com tudo verde, o site está
provado — o 9 e o 10 são o ensaio do que produção vai exigir.
