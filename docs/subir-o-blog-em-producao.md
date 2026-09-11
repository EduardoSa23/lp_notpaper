# Subir o blog em produção

> Guia de decisões, não receita. Cada seção diz **o que fazer e por quê** — os
> comandos estão aqui para você não procurar, mas o que importa é entender o que
> cada um faz e o que ele quebra se der errado.
>
> Levantado no servidor em **08/09/2026**. O que está escrito na seção 1 é o
> estado real medido naquele dia, e não suposição.
>
> A estrutura do backend e do banco que este guia pressupõe está em
> [`backend-e-banco-de-dados.md`](backend-e-banco-de-dados.md) — leia a seção 10
> dele **antes** de começar: ela tem um bloqueador (a versão do SQL Server) que,
> se não for verificado, faz o passo 4.3 falhar.
>
> **O ambiente de desenvolvimento foi provado ponta a ponta em 10–11/09/2026** —
> banco, build, serviço do Windows, proxy IIS/ARR e uma publicação real do módulo
> renderizando em `blog.silodev.com.br`. Muito do que este guia aprendeu veio de
> lá, marcado abaixo com «provado no dev».

---

> ## 🛑 O PONTO DE PARADA — leia antes de tudo
>
> **Uma única ação neste guia derruba os 45 sites: instalar o ARR (e o URL
> Rewrite) — o instalador reinicia o serviço do IIS inteiro.** Ela está na
> **fase 5 (seção 6.1)**, marcada com 🛑. Tudo antes dela — preparar, banco,
> build, serviço, provar em `localhost:3000` — **não toca no IIS e pode ser feito
> em horário comercial**.
>
> **NÃO execute a fase 5 em horário comercial.** Faça tudo até a fase 4, pare na
> porta da 5, e execute a 5 em janela combinada.
>
> **Mas confira primeiro se o ARR já está instalado** (seção 1): no servidor de
> dev ele **já estava**. Se em produção também estiver, **não há o que instalar — e
> o passo que reinicia tudo deixa de existir.** Ligar o proxy e criar o site não
> reiniciam o IIS.

---

## 1. O que o servidor tem hoje — medido, não suposto

| | estado |
|---|---|
| **Node** | ❌ não instalado |
| **Driver ODBC** | ⚠️ só o legado `SQL Server`. **Falta o `ODBC Driver 18 for SQL Server`**, que é o nome que `db-config.cjs` monta na string de conexão |
| **URL Rewrite (IIS)** | ✅ instalado |
| **ARR (IIS)** | ❌ não instalado — e é ele que faz o proxy reverso |
| **SQL Server local** | ❌ **nenhuma instância nesta máquina** |
| **Porta 3000** | ✅ livre |
| **Site alvo** | `notpaper_site` → `E:\Notpaper_SITE`, `notpaper.com.br` em `:80` e `:443` com SNI |

### ⚠️ O fato que muda o tamanho de tudo

Esta máquina hospeda **cerca de 45 sites de clientes em produção** — prefeituras,
câmaras, Ciminas, Makita, Ituran, a Secretaria de Cultura de São Paulo.

O ARR não é configuração de um site. Ele é **módulo global do IIS**: o instalador
reinicia o serviço do IIS (todos os 45 caem por alguns segundos) e o proxy é um
interruptor no `applicationHost.config`, ou seja, servidor inteiro.

**Consequência para o planejamento:** isso não é tarefa de tarde. É **janela de
manutenção combinada**, e o resto do trabalho deve ser organizado para que a
janela seja o mais curta possível — ver a seção 3.

> ### ⚠️ Meça de novo antes de começar — a tabela acima é de 08/09/2026
>
> O estado real muda, e o do dev surpreendeu: aquele servidor **já tinha IIS e o
> ARR instalados**, ao contrário do que se supunha. Rode o `verificar-servidor.ps1`
> (na pasta de deploy) no servidor de produção e confira, em especial:
>
> - **ARR e URL Rewrite** — se já estiverem instalados, **a fase 5 não reinicia
>   nada**: ligar o proxy e criar o site não derrubam o IIS. Todo o peso da
>   «janela» está na *instalação* do ARR.
> - **Versão do SQL Server** da empresa (o bloqueador — seção 4.3).
> - **Node e ODBC 18** — o dev já os tinha; produção, na medição de 08/09, não.

---

## 2. O banco fica no SQL Server que a empresa já tem

Decisão do dev, 08/09/2026. Não se instala engine de banco num servidor web que
já sustenta 45 sites, e o servidor de banco existente já tem backup e
monitoramento que alguém mantém.

### O que essa escolha custa, e as duas coisas estão no código

**(a) O serviço do Node precisa rodar sob CONTA DE DOMÍNIO.**

`db-config.cjs` monta `Trusted_Connection=yes` — autenticação Windows, sem senha
em lugar nenhum. É a decisão certa e ela continua valendo. Mas uma conta **local**
(`LocalSystem`, `NetworkService`, `IIS APPPOOL\...`) **não se autentica em outra
máquina**. Com o banco remoto, a identidade tem que ser um usuário de domínio.

> **Isto corrige uma linha errada do `CLAUDE.md` do módulo**, que diz *"a conta do
> pool do IIS precisa de acesso ao banco `notpaperBlog`"*. Sob a arquitetura
> escolhida — Node como serviço do Windows, IIS só proxiando — quem abre a
> conexão é a **conta do serviço**, e o pool do IIS não fala com o banco nunca.

**(b) `TrustServerCertificate=yes` deixou de ser inofensivo.**

Ele está fixo em `db-config.cjs` e manda o cliente **não validar** o certificado
do servidor. Na mesma máquina isso não tinha o que atacar. Numa conexão que
atravessa a rede, é o cliente aceitando qualquer certificado — inclusive um
trocado no meio do caminho.

O `docs/subir-o-banco-em-producao.md` do módulo já tinha previsto este dia:
*"no dia em que o banco mudar de máquina, isso vira certificado de verdade"*.
Para o blog, esse dia é agora. **Não bloqueia a subida** — bloquear seria trocar
uma coisa que funciona por outra antes de saber se o certificado existe —, mas
entra na lista do que fica em aberto (seção 7).

**(c) Um comentário do código ficou falso.** `db-config.cjs:15` diz *"Curto de
propósito: o banco fica na mesma máquina"* para justificar
`Connection Timeout=5`, e `db.js` usa 6 s pelo mesmo raciocínio. Os cinco
segundos provavelmente continuam bastando numa LAN — o que não vale mais é o
**motivo**. Ajustar o comentário, e medir o tempo real de conexão antes de mexer
no número.

### O que você precisa saber antes de começar

- o **nome do servidor\instância** do SQL Server (a `SQLSERVER_SERVER`);
- a **versão** desse SQL Server — e esta é a primeira, porque abaixo de **2025**
  a migração 001 não roda como está. Ver 4.3;
- que ele é **alcançável** a partir do servidor web (porta 1433, ou a porta da
  instância nomeada, liberada no caminho);
- uma **conta de domínio** para o serviço do Node;
- alguém com permissão de **criar banco** naquele servidor, para o passo 4.3.

---

## 3. A ordem do trabalho, e por que ela é assim

**Quase tudo pode ser feito e verificado sem tocar no IIS.** Node, driver, banco,
migration, build, serviço — e, no fim, abrir `http://localhost:3000` no próprio
servidor e ver o blog funcionando por inteiro.

Só o **último** passo precisa da janela de manutenção. Organizar assim significa
que, quando os 45 sites forem reiniciados, tudo o mais já foi provado — e o que
resta é uma regra de proxy que se liga e se desliga em segundos.

| fase | o que é | derruba alguém? |
|---|---|---|
| **1. Preparar** | Node, ODBC, conta de domínio | não |
| **2. Banco** | criar `notpaperBlog`, aplicar migrations, dar acesso | não |
| **3. O site como processo** | copiar fonte, `npm ci`, `npm run build`, serviço do Windows | não |
| **4. Provar na porta** | abrir `localhost:3000` no servidor e percorrer o blog | não |
| **5. ⚠️ A janela** | instalar ARR, ligar o proxy, apontar o `notpaper_site` | **sim, todos** |
| **6. Provar pelo IIS** | o `PUT` chunked e a verificação de ponta a ponta | não |
| **7. Ligar o módulo** | `Blog:BaseUrl` e `Blog:Token`, aprovar um post | não |

### O rollback, decidido antes de precisar

Hoje `E:\Notpaper_SITE` é uma pasta de arquivos estáticos, e o IIS a serve sem
depender de nada. Depois da fase 5, **o site inteiro depende do processo Node** —
não só o `/blog`, porque as páginas institucionais também são renderizadas por
ele.

Então: **guarde a pasta atual intacta** (copie para `E:\Notpaper_SITE_estatico`
antes de qualquer coisa). Se algo der errado, o rollback é remover o `web.config`
de proxy e reapontar o site para ela. Segundos, não uma noite.

---

## 4. Fase 1 e 2 — preparar e o banco

### 4.1 Node

Instale um **LTS atual (22 ou 24)** pelo instalador oficial `.msi`. Next 15 exige
18.18 ou mais, mas o dev rodou em **Node 24.15.0** sem problema — e é bom que
produção seja o **mesmo major** do que foi provado.

> **Provado no dev:** o `msnodesqlv8` tem binário pronto para o Node 24 (ABI 137),
> então o `npm ci` **não** precisou de compilador C++. Se em produção o `npm ci`
> pedir ferramentas de build, é porque a versão de Node não tem binário pronto —
> troque a versão do Node, não instale o Visual Studio Build Tools.

**A versão importa mais do que parece.** `msnodesqlv8` é **módulo nativo**: o
binário `.node` é compilado por versão maior de Node e por arquitetura. Isso tem
uma consequência direta no deploy:

> **Não copie `node_modules` da sua máquina.** Rode `npm ci` no servidor. Se as
> versões maiores diferirem, o módulo não carrega — e o erro fala de um `.node`
> ilegível, não de versão.

### 4.2 O driver ODBC

Baixe e instale o **Microsoft ODBC Driver 18 for SQL Server** (x64). Conferir:

```powershell
Get-OdbcDriver -Platform 64-bit | Where-Object Name -like "*ODBC Driver 18*"
```

Se você instalar o 17 em vez do 18, funciona — mas então `SQLSERVER_ODBC_DRIVER`
tem que dizer `ODBC Driver 17 for SQL Server`. O nome no ambiente e o nome
instalado têm que ser **o mesmo texto**; é por isso que ele é variável de
ambiente e não constante no código.

> ### ⚠️ `sqlcmd` com o Driver 18 exige `-C` (provado no dev)
>
> O Driver 18 passou a **exigir criptografia por padrão** e a **validar o
> certificado** — o que o 17 não fazia. Contra um SQL Server com certificado
> autoassinado, `sqlcmd` falha com *"the certificate chain was issued by an
> authority that is not trusted"*. A correção é **`-C`** (trust server
> certificate):
>
> ```powershell
> sqlcmd -S <servidor\instancia> -E -C -Q "SELECT SERVERPROPERTY('ProductMajorVersion')"
> ```
>
> É o mesmo que `TrustServerCertificate=yes` faz na string do app
> (`db-config.cjs`), e vale para toda query `sqlcmd` deste projeto. Também é o
> lembrete vivo da pendência da seção 7: em produção, **sobre a rede**, "confiar em
> qualquer certificado" deixa de ser inofensivo.

### 4.3 O banco

> ### 🚨 Confira a versão do SQL Server ANTES de migrar
>
> A migração 001 declara `content`, `author` e `tags` como **`json`** — o tipo
> **nativo**, que só existe a partir do **SQL Server 2025**. Isso foi verificado
> na máquina de desenvolvimento, não no servidor da empresa. Abaixo de 2025,
> `npm run db:migrate` **falha no primeiro lote** e nada sobe.
>
> ```sql
> SELECT SERVERPROPERTY('ProductMajorVersion') AS versao, @@VERSION AS completo;
> -- 17 = 2025 · 16 = 2022 · 15 = 2019 · 14 = 2017 · 13 = 2016
> ```
>
> Se vier menos que 17: troque as três colunas por `nvarchar(max)` com
> `CHECK (ISJSON(col) = 1)` **na própria 001** (ela nunca rodou em produção — não
> crie uma 004 para consertar o que ainda não existe). **Nenhuma linha de código
> de aplicação muda** — a escrita já manda string e a leitura já faz
> `JSON.parse`. O SQL exato está na seção 10 de
> [`backend-e-banco-de-dados.md`](backend-e-banco-de-dados.md).

O aplicador de migrations **cria o banco se ele não existir** (`CREATE DATABASE`
via `master`), então quem roda o passo precisa de permissão para isso. Rode uma
vez com a **sua** conta de administrador, e não com a conta do serviço — a conta
do serviço só precisa ler e escrever.

> ### ⚠️ "Login failed" pode não ser falta de permissão (provado no dev)
>
> No dev, a conta de administrador **não conseguia** logar no SQL, e a causa não
> era óbvia. Duas armadilhas, em ordem:
>
> 1. **`BUILTIN\Administrators` pode ter sido tirado do `sysadmin`** numa instância
>    endurecida — foi o caso no dev. E o **UAC filtra o SID de Administrators** numa
>    sessão não elevada. Confirme com `whoami /groups | findstr /i Administrators`
>    (elevado, tem que estar `Enabled group`, não `deny only`).
> 2. **Se ainda falhar, o seu login não existe na instância.** Aí alguém com
>    `sysadmin` cria — ou, se a instância aceitar autenticação SQL, você entra com
>    `sa` e cria você mesmo:
>
>    ```sql
>    CREATE LOGIN [DOMINIO\voce] FROM WINDOWS;
>    ALTER SERVER ROLE dbcreator ADD MEMBER [DOMINIO\voce];
>    ```
>
> `dbcreator` basta para o `CREATE DATABASE`, e quem cria o banco vira dono dele —
> as migrations rodam. Não peça `sysadmin`. **Em produção isso é conversa com quem
> administra o SQL da empresa:** peça o login da sua conta de migração com
> `dbcreator`, e o da conta de serviço com `datareader`/`datawriter` (seção 4.4).

```powershell
# no servidor, na pasta do site, com as variáveis já definidas
npm run db:migrate
```

Ele imprime o que aplicou. É idempotente: guarda o que já rodou em
`dbo.schema_migrations` e não repete.

**Não estranhe a 003 não fazer nada.** `003_trechos_nos_posts_antigos.sql` são
`UPDATE ... WHERE id = 31..36`, com os ids do banco de desenvolvimento. Num banco
novo a tabela está vazia: ela afeta zero linhas e é registrada como aplicada.
Correto e definitivo — ela roda na mesma passada que cria a tabela.

### 4.4 O acesso da conta do serviço

```sql
CREATE LOGIN [DOMINIO\svc_notpaper_blog] FROM WINDOWS;
GO
USE [notpaperBlog];
CREATE USER [DOMINIO\svc_notpaper_blog] FOR LOGIN [DOMINIO\svc_notpaper_blog];
ALTER ROLE db_datareader ADD MEMBER [DOMINIO\svc_notpaper_blog];
ALTER ROLE db_datawriter ADD MEMBER [DOMINIO\svc_notpaper_blog];
GO
```

`db_datareader` + `db_datawriter` e nada mais. O caminho fácil é `db_owner`; não
faça. As migrations precisam de mais que isso, e é por isso que **você** as
aplica no deploy, com a sua conta.

---

## 5. Fase 3 e 4 — o site como processo, provado na porta

### 5.1 As variáveis de ambiente

Elas vão no **serviço**, e não num `.env` na pasta. O `.env.local` é de
desenvolvimento e está no `.gitignore`; um arquivo de segredo na pasta do site,
num servidor com 45 sites, é uma superfície a mais.

| variável | valor |
|---|---|
| `SQLSERVER_SERVER` | o servidor\instância do SQL da empresa |
| `SQLSERVER_DATABASE` | `notpaperBlog` |
| `SQLSERVER_ODBC_DRIVER` | `ODBC Driver 18 for SQL Server` |
| `BLOG_INGESTAO_TOKEN` | **um token NOVO** — ver abaixo |
| `NODE_ENV` | `production` |
| `PORT` | `3000` |

> ### ⚠️ `NEXT_PUBLIC_SITE_URL` NÃO ENTRA NESSA TABELA, E O MOTIVO CUSTA UM DEPLOY
>
> Ela é o endereço público do site, e é **dela que sai a URL que a ingestão
> devolve ao módulo** — a que ele grava como endereço publicado. Sem ela vale o
> padrão de `lib/blog/urls.js`, que é `https://notpaper.com.br`.
>
> **`NEXT_PUBLIC_` é assado no pacote por `next build`, e não lido em tempo de
> execução.** Medido em 10/09/2026: o domínio aparece **17 vezes dentro de
> `.next/server`**, inclusive dentro da própria rota de ingestão. Pôr a variável
> no ambiente do serviço **depois** do build não muda nada.
>
> Ela tem de estar no ambiente **ANTES** do `npm run build` (seção 5.2), e
> **trocar de domínio exige reconstruir**:
>
> ```powershell
> $env:NEXT_PUBLIC_SITE_URL = "http://blog.silodev.com.br"   # ou o de producao
> npm run build
> ```
>
> O sintoma de esquecer é silencioso e enganoso: a entrega dá **certo**, o post
> entra no banco do ambiente certo, e o módulo grava um endereço de **outro**
> ambiente — que abre, porque o site de lá existe, e mostra outro conteúdo.

> ### ⚠️ O token de ingestão em produção tem que ser novo
>
> Nem o do seu `.env.local`, nem o que está no `.env.example` versionado — aquele
> tem 64 caracteres e cara de token real, e é o candidato natural a ser copiado
> por engano.
>
> ```powershell
> # gera 64 caracteres hexadecimais
> -join ((1..32) | ForEach-Object { '{0:x2}' -f (Get-Random -Max 256) })
> ```
>
> O **mesmo** valor vai para `Blog:Token` do módulo, na fase 7. O defeito já
> registrado neste projeto é exatamente esse: token do módulo com 48 caracteres e
> do site com 64, sintoma **401**, e o diagnóstico foi comparar `sha256` dos dois
> sem imprimir nenhum.

### 5.2 Build no servidor

```powershell
# a fonte vai para E:\Notpaper_SITE_app (NÃO por cima da pasta estática ainda)
npm ci
npm run build
```

> ### ⚠️ O build consulta o banco
>
> `generateStaticParams` em `app/blog/[slug]/page.jsx` e
> `app/blog/pagina/[page]/page.jsx` chama a fonte de conteúdo, que vai ao banco.
> Então `npm run build` exige o **banco de pé e alcançável**, e a conta que roda
> o build precisa de **leitura** em `notpaperBlog` — não só a do serviço.
>
> É por isso que o banco é a fase 2 e o build a fase 3, e não o contrário. Com o
> banco fora, o build falha.

Construir **no servidor** é o que garante que o binário do `msnodesqlv8` casa com
o Node que vai executá-lo. Se o `npm ci` reclamar de ferramentas de compilação, é
porque não achou binário pronto para essa versão de Node — e aí a saída mais
barata é trocar a versão do Node, não instalar um compilador C++ no servidor.

### 5.3 O serviço do Windows

`next start` num terminal morre quando alguém fecha a sessão, e não volta depois
de um reinício da máquina. A diferença entre um site que se recupera e um site
que espera alguém notar é justamente essa.

Use **NSSM**. Os comandos abaixo são os que subiram o serviço no dev — em produção
muda **só a conta** (no dev foi `LocalSystem` com banco local; aqui é a **conta de
domínio** da seção 2, porque o banco é remoto):

```powershell
$nssm = "C:\nssm\nssm-2.24\win64\nssm.exe"
$node = (Get-Command node).Source            # ex.: C:\Program Files\nodejs\node.exe
$app  = "E:\Notpaper_SITE_app"               # DISCO LOCAL — ver aviso abaixo
New-Item -ItemType Directory -Force -Path "$app\logs" | Out-Null

& $nssm install notpaper_blog $node "node_modules\next\dist\bin\next start"
& $nssm set notpaper_blog AppDirectory $app
& $nssm set notpaper_blog AppStdout "$app\logs\service-out.log"
& $nssm set notpaper_blog AppStderr "$app\logs\service-err.log"
& $nssm set notpaper_blog Start SERVICE_AUTO_START
& $nssm set notpaper_blog AppExit Default Restart

# A CONTA — a diferença de produção. Sem isto roda como LocalSystem, que NÃO se
# autentica no banco remoto (seção 2a). Em produção, a conta de domínio:
& $nssm set notpaper_blog ObjectName "DOMINIO\svc_notpaper_blog" "<senha>"

& $nssm start notpaper_blog
```

O que cada peça garante: **roda da pasta do app** (é de lá que `next start` lê as
variáveis), **início automático** no boot, **log em arquivo** (sem isso, o erro do
Next é uma tela que ninguém vê — no dev, `service-err.log` foi onde se leu o
primeiro erro) e **reinicia sozinho** se o processo morrer.

> ### ⚠️ Para reinstalar dependências, PARE o serviço antes (mordeu no dev)
>
> Um redeploy que rode `npm ci` com o serviço no ar falha com
> **`EPERM: operation not permitted, unlink ...\@img\sharp-win32-x64\...\libvips-42.dll`**:
> o Next carrega o `sharp` (otimização de imagem), e o Windows trava um DLL em uso.
> A sequência é sempre:
>
> ```powershell
> Stop-Service notpaper_blog
> npm ci
> Start-Service notpaper_blog
> ```
>
> (Se ainda travar no mesmo DLL com o serviço parado, é o antivírus escaneando —
> espere e repita, ou exclua a pasta do app do scan em tempo real.)

> ### ⚠️ O código tem que estar num DISCO LOCAL, não num drive mapeado
>
> A conta do serviço (e o pool do IIS) **não enxergam letra de drive mapeado** —
> ela é por sessão de usuário. No dev o app ficava em `H:`, e só funcionou porque
> `H:` era **disco local**; de rede, o serviço nem acharia o app. Confirme:
> `Get-CimInstance Win32_LogicalDisk -Filter "DeviceID='E:'"` → `DriveType 3` é
> local. Se for `4` (rede), o código tem de sair de lá antes do serviço.

> ### As variáveis de ambiente vão no serviço, via NSSM
>
> Em vez de um `.env` na pasta (seção 5.1), grave-as no próprio serviço:
>
> ```powershell
> & $nssm set notpaper_blog AppEnvironmentExtra `
>     "SQLSERVER_SERVER=<servidor\instancia>" "SQLSERVER_DATABASE=notpaperBlog" `
>     "SQLSERVER_ODBC_DRIVER=ODBC Driver 18 for SQL Server" `
>     "BLOG_INGESTAO_TOKEN=<o token novo>" "NODE_ENV=production" "PORT=3000"
> ```
>
> `NEXT_PUBLIC_SITE_URL` **não** entra aqui — é assada no build (seção 5.1). Se um
> dia usar `.env.local` no lugar, grave-o **UTF-8 sem BOM**: o leitor de
> `--env-file` do Node não remove o BOM, e a primeira variável fica ilegível
> (mordeu no dev).

### 5.4 A prova que fecha esta fase

No próprio servidor, num navegador ou com `curl`:

```powershell
curl.exe -s -o NUL -w "/            %{http_code}`n" http://localhost:3000/
curl.exe -s -o NUL -w "/blog        %{http_code}`n" http://localhost:3000/blog
curl.exe -s -o NUL -w "/solucoes    %{http_code}`n" http://localhost:3000/solucoes
curl.exe -s -o NUL -w "/_diretoria  %{http_code}`n" http://localhost:3000/_diretoria
```

`200` nos três primeiros e **`404` no `/_diretoria`** (área privada, não vai ao ar
— se der `200`, pare: há credencial fixa no código). Com o banco vazio, `/blog`
mostra o estado vazio, que é o correto.

E prove a **ingestão** — a rota que o módulo usa — com o token do serviço:

```powershell
# corpo via ARQUIVO: o PowerShell COME as aspas ao passar JSON para um .exe.
# Provado no dev: `--data-binary $corpo` chega mutilado e vira 503. Sempre @arquivo.
$corpo = '{"titulo":"teste","resumo":"x","categoria":"GED","conteudo":[]}'
[System.IO.File]::WriteAllText("$PWD\corpo.json", $corpo, (New-Object System.Text.UTF8Encoding($false)))

# com token, corpo invalido de proposito -> espera 422 nomeando o campo
curl.exe -X PUT "http://localhost:3000/api/blog/posts/00000000-0000-0000-0000-000000000001" `
  -H "X-Ingestao-Token: <o token>" -H "Content-Type: application/json" --data-binary "@corpo.json" -i
# sem token -> espera 401
curl.exe -X PUT "http://localhost:3000/api/blog/posts/00000000-0000-0000-0000-000000000001" `
  -H "Content-Type: application/json" --data-binary "{}" -i
Remove-Item corpo.json
```

`422` (conteúdo recusado) e `401` (sem token) provam o contrato de resposta.
Percorra o índice, abra um post, veja a capa carregar. **Se algo estiver errado no
banco, no driver ou no build, é aqui que aparece** — antes de a janela existir, e
sem ninguém ter caído.

---

## 6. Fase 5 e 6 — a janela, e a verificação que importa

### 6.1 O que fazer na janela — e o que exatamente derruba os 45 sites

**Só uma ação reinicia o IIS inteiro: instalar o ARR (e o URL Rewrite).** O resto
não. Separe os dois.

> ## 🛑 PARE AQUI se for horário comercial
>
> ```powershell
> # baixar (URL Rewrite primeiro; o ARR depende dele)
> $ProgressPreference = 'SilentlyContinue'
> Invoke-WebRequest "https://download.microsoft.com/download/1/2/8/128E2E22-C1B9-44A4-BE2A-5859ED1D4592/rewrite_amd64_en-US.msi" -OutFile "$env:TEMP\rewrite.msi"
> Invoke-WebRequest "https://go.microsoft.com/fwlink/?LinkID=615136" -OutFile "$env:TEMP\arr.msi"
> # instalar — ISTO REINICIA O W3SVC: OS 45 SITES CAEM POR SEGUNDOS
> Start-Process msiexec.exe -ArgumentList '/i',"`"$env:TEMP\rewrite.msi`"",'/qn','/norestart' -Wait
> Start-Process msiexec.exe -ArgumentList '/i',"`"$env:TEMP\arr.msi`"",'/qn','/norestart' -Wait
> ```
>
> **Se a seção 1 mostrou o ARR já instalado, pule este bloco inteiro** — não há o
> que instalar, e nada reinicia. Foi o caso no dev.

O que **não** derruba ninguém, e pode preceder ou seguir a janela:

```powershell
# 1. ligar o proxy do ARR (interruptor global) — nao reinicia o IIS
& "$env:windir\system32\inetsrv\appcmd.exe" set config -section:system.webServer/proxy /enabled:"True" /commit:apphost

# 2. a pasta VAZIA que recebe SO o web.config (o IIS nunca aponta para o codigo)
$proxy = "C:\inetpub\notpaper_proxy"
New-Item -ItemType Directory -Force -Path $proxy | Out-Null
#    (grave aqui o web.config abaixo)

# 3. apontar o notpaper_site para essa pasta — afeta SO notpaper.com.br, nao os 45
& "$env:windir\system32\inetsrv\appcmd.exe" set vdir "notpaper_site/" /physicalPath:"$proxy"
```

Depois, conferir `https://notpaper.com.br` **de fora**.

A regra mínima (a mesma que subiu no dev):

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
    <httpErrors existingResponse="PassThrough" />
  </system.webServer>
</configuration>
```

O `httpErrors existingResponse="PassThrough"` não é enfeite: sem ele, um `503` do
Node (banco fora) é trocado pela página de erro do IIS, e você perde a resposta que
o Node escreveu — que o módulo também lê.

> ### ⚠️ A armadilha do loop (mordeu no dev)
>
> O `url` do rewrite aponta para **`http://localhost:3000`**, nunca para o domínio
> público. Apontar para `notpaper.com.br` faz o ARR proxiar para si mesmo: o
> sintoma é **`400 Bad Request` com corpo vazio e uma pilha de cabeçalhos
> `X-Powered-By: ASP.NET` repetidos** — a assinatura de um laço.

Deliberadamente mínima. Os ajustes finos — preservar o host, `X-Forwarded-Proto`,
servir `_next/static` direto pelo IIS — **são decididos pelo que a seção 6.2
medir**, e não aplicados preventivamente. Isso vale especialmente para
`uploadReadAheadSize`: é o primeiro lugar a olhar se o corpo chegar truncado, e
não algo para mexer antes de haver sintoma.

**Uma coisa que NÃO precisa de ajuste, e eu fui conferir:** a URL que a ingestão
devolve ao módulo vem de `NEXT_PUBLIC_SITE_URL`, e **não** do host da requisição
(`lib/blog/urls.js`). O proxy não tem como fazer o módulo gravar
`http://localhost:3000/blog/...` como endereço publicado.

### 6.2 O `PUT` chunked — faça isto ANTES de integrar o módulo

É a tarefa `8c.5` do `openspec/changes/add-blog-backend/tasks.md`, e ela existe
por um motivo específico.

O `HttpClient` do .NET serializa o JSON preguiçosamente e **não declara
`Content-Length`** — o corpo vai em `chunked`. Não é escolha do módulo; é como
ele funciona. Se o ARR bufferizar ou recusar isso, o sintoma é **post sem
título**, com os dois lados corretos: cada um olha o próprio código, acha tudo
certo, e a causa está no meio.

Disparar isso isolado, **contra o IIS e não contra a porta 3000**, separa a
pergunta do proxy da pergunta da integração:

```powershell
# corpo via ARQUIVO (o PowerShell come as aspas em $corpo — provado no dev), e
# chunked de verdade: o header força chunked, sem Content-Length
$corpo = '{"titulo":"teste de proxy","resumo":"x","categoria":"GED","conteudo":[]}'
[System.IO.File]::WriteAllText("$PWD\corpo.json", $corpo, (New-Object System.Text.UTF8Encoding($false)))
curl.exe -k -X PUT "https://notpaper.com.br/api/blog/posts/00000000-0000-0000-0000-000000000001" `
  -H "X-Ingestao-Token: <o token>" `
  -H "Content-Type: application/json" `
  -H "Transfer-Encoding: chunked" `
  --data-binary "@corpo.json" -i
Remove-Item corpo.json
```

O que importa **não é** o post entrar — este corpo é inválido de propósito, e
`conteudo: []` deve ser recusado. O que importa é **qual** recusa volta:

| resposta | leitura |
|---|---|
| **422** nomeando o campo | ✅ o corpo atravessou o proxy inteiro e chegou à validação |
| **5xx** de corpo ilegível | ❌ o proxy comeu o corpo — é o defeito que se veio procurar |
| **413** ou timeout | ❌ o proxy bufferizou e travou |

> **Provado no dev (11/09/2026):** este teste deu **`422`** através do ARR, com
> `X-Powered-By: ARR/3.0` na resposta — o corpo `chunked` atravessou o proxy
> íntegro, sem nenhum ajuste. É o maior risco da produção, e ele já passou uma vez.

Se der errado, o conserto é do **lado do módulo** e é barato: bufferizar o corpo
antes de enviar dá `Content-Length`. Não se faz preventivamente.

### 6.3 As outras duas verificações registradas

- `8c.6` — rodar a verificação de ponta a ponta **pelo IIS**, e não pela porta do
  Node. Tudo o que foi verificado até hoje falava direto com a porta; o proxy
  nunca foi exercitado.
- `8c.7` — medir uma **capa de ~150 KB** passando pelo proxy, e decidir com o
  número se `_next/static` passa a ser servido direto pelo IIS. A capa é a
  resposta mais pesada que o site serve.

---

## 7. O que fica em aberto, e é melhor estar escrito

- **`TrustServerCertificate=yes` sobre a rede** (seção 2b). Vira certificado de
  verdade quando houver um.
- **O comentário de `db-config.cjs:15`** afirma que o banco fica na mesma
  máquina. Ficou falso.
- **O site institucional passa a poder cair.** Hoje ele é imune a tudo; depois,
  se o processo Node morre, `notpaper.com.br` inteiro morre — não só o `/blog`.
  O serviço reinicia sozinho, mas ninguém é **avisado**: não há monitoramento.
- **O deploy do site mudou de natureza.** Era gerar build e copiar pasta. Passa a
  ser copiar fonte, `npm ci`, `npm run build`, aplicar migration e reiniciar o
  serviço. Não é mais difícil — são mais passos, e passos manuais que ninguém
  escreveu se esquecem.
- **`output: 'standalone'` não foi avaliado.** Ele produziria um pacote
  autocontido e encurtaria o deploy, mas mexe em `next.config.js` junto de
  módulos nativos externalizados. Fica para depois de o caminho simples estar de
  pé.

---

## 8. O que este documento não cobre

- **Subir o módulo de marketing** (a Api e o Worker do `MARKETING_AUTOMATO`). É a
  fase seguinte, e o banco dele tem guia próprio em
  `MARKETING_AUTOMATO/docs/subir-o-banco-em-producao.md` — cuja seção 2 supõe
  banco na mesma máquina e **precisa ser relida à luz da seção 1 daqui**.
- **HTTPS entre o IIS e o Node.** O TLS termina no IIS e a conversa com o
  `localhost:3000` é HTTP. Na mesma máquina, isso é aceitável e consciente.
- **Monitoramento e alerta.** Ninguém lê log automaticamente hoje.
