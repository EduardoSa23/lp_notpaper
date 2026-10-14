# Trocar o blog de `blog.silodev.com.br` para `notpaper.com.br`

> Escrito em **15/09/2026**, a pedido do dev, para ele executar **no servidor**.
>
> Este documento **não substitui** `docs/subir-o-blog-em-producao.md` — ele é a
> sequência desta troca específica, e aponta para as seções de lá onde o assunto
> já está resolvido. Leia a seção 6.1 de lá antes da janela: ela diz o que
> exatamente derruba os 45 sites, e o que não derruba ninguém.

---

## ⚠️ Antes de tudo: isto não é "apontar o blog"

O `lp_notpaper` **é o site institucional inteiro** — `page.jsx`, `quem-somos`,
`servicos`, `solucoes`, `comparar-solucoes`, `contato` e `blog`. Pôr este app em
`notpaper.com.br` substitui o site estático atual por uma **aplicação Next com
runtime**, num servidor que hospeda 45 sites.

O blog não vai para um subdomínio: ele passa a ser uma rota do site novo. Quem
abrir `notpaper.com.br` depois da troca está vendo este repositório, e não o que
está lá hoje.

**Consequência prática:** o rollback (seção 3 do guia) é apontar o `vdir` de
volta para a pasta estática atual. Anote o caminho dela **antes** de trocar:

```powershell
& "$env:windir\system32\inetsrv\appcmd.exe" list vdir "notpaper_site/" /text:physicalPath
```

---

## O que já está feito, daqui

**1. O módulo já aponta para o endereço novo.** `Blog:BaseUrl` passou de
`http://blog.silodev.com.br` para `https://notpaper.com.br` nos dois
`appsettings.json` (Api e Worker), no repositório do marketing.

> **Conferido:** o `Blog:BaseUrl` **não** está no `dotnet user-secrets`. Isso
> importa porque o cofre tem precedência sobre o `appsettings`, e foi exatamente
> esse o defeito de 25/08/2026 — um endereço antigo esquecido no cofre fazia a
> entrega bater num lugar morto, em silêncio. Hoje o cofre só tem `Blog:Token`.

**2. No código do site não havia nada a trocar.** `https://notpaper.com.br` já é
o `metadataBase` de `app/layout.jsx` e o padrão de `lib/blog/urls.js`. O
`blog.silodev.com.br` só aparece em dois comentários de documentação.

**O que aponta para o dev é a variável do build**, e é por isso que o passo 2
abaixo existe.

---

## Passo 1 — Deixar só um post no banco

O site novo usa **o mesmo banco** do dev (decisão do dev), então ele nasce com o
conteúdo que já existe lá. Fica só *"Automação de processos na prefeitura: como
funciona e por onde começar"*.

Rode no SQL Server **do banco do blog**, e repare que tudo acontece dentro de uma
transação — você confere os números **antes** de confirmar:

```sql
USE notpaperBlog;

BEGIN TRANSACTION;

-- 1) O retrato de antes, para poder voltar. A tabela de backup fica no banco,
--    e você a apaga quando tiver certeza (semanas depois, não no mesmo dia).
SELECT * INTO posts_backup_20260915 FROM posts;

-- 2) Quem fica e quem sai — CONFIRA ESTA LISTA antes de seguir.
SELECT id, slug, title, status
FROM   posts
ORDER  BY published_at DESC;

-- 3) Apaga todos menos o escolhido.
DELETE FROM posts
WHERE  title <> N'Automação de processos na prefeitura: como funciona e por onde começar';

-- 4) As duas conferências que decidem entre COMMIT e ROLLBACK:
SELECT @@ROWCOUNT AS apagados;          -- tem de ser 2
SELECT COUNT(*)   AS restantes FROM posts;  -- tem de ser 1
SELECT slug, title FROM posts;          -- tem de ser o de Automação

-- 5) Se os três conferirem:
COMMIT;
-- Se NÃO conferirem:
-- ROLLBACK;
```

> ### ⚠️ Por que apagar ANTES do build, e não depois
>
> `npm run build` **consulta o banco**: `generateStaticParams` busca os slugs
> para pré-gerar as páginas. Construir antes de limpar assaria no pacote as
> páginas dos dois posts que vão deixar de existir.

> ### Se o título não bater exatamente
>
> O `<>` compara o título inteiro. Se der `apagados = 3` (apagou tudo) ou `0`,
> **faça ROLLBACK** e apague por id, que é à prova de acento e espaço:
>
> ```sql
> DELETE FROM posts WHERE id IN (123, 456);   -- os ids da lista do passo 2
> ```

---

## Passo 2 — Build no servidor, com o domínio certo

Este é o passo que efetivamente "troca o endereço".

```powershell
cd E:\Notpaper_SITE_app          # onde a fonte está no servidor

git pull                          # traga o que mudou no repositório

# ⚠️ ESTA LINHA É A TROCA DE DOMÍNIO. Sem ela, o pacote continua
#    assado com blog.silodev.com.br — inclusive dentro da rota de ingestão.
$env:NEXT_PUBLIC_SITE_URL = "https://notpaper.com.br"

npm ci
npm run build
```

**Confira que o pacote ficou com o domínio certo** antes de seguir — é uma busca
no que foi construído, e ela responde em segundos:

```powershell
# tem de devolver ZERO
(Select-String -Path .\.next\server\**\*.js -Pattern "blog\.silodev" -SimpleMatch -List).Count

# tem de devolver mais de zero
(Select-String -Path .\.next\server\**\*.js -Pattern "notpaper\.com\.br" -SimpleMatch -List).Count
```

> Essa conferência existe porque o sintoma de errar é **silencioso e enganoso**:
> a entrega dá certo, o post entra no banco, e o módulo grava um endereço do
> outro ambiente — que **abre**, porque aquele site existe, e mostra outro
> conteúdo.

---

## Passo 3 — Serviço e IIS

Sem novidade em relação ao guia: **seção 5.3** (o serviço do Windows) e **seção
6.1** (a janela e o `web.config` do proxy).

Duas coisas específicas desta troca:

1. **O serviço já existe** (ele roda hoje para o `blog.silodev`). Depois do build
   novo, basta reiniciá-lo:
   ```powershell
   Restart-Service notpaper-site        # o nome que você deu na seção 5.3
   Start-Sleep 5
   Invoke-WebRequest http://localhost:3000/blog -UseBasicParsing | Select-Object StatusCode
   ```
2. **O `vdir` do `notpaper_site` passa a apontar para a pasta do proxy** — é a
   linha do `appcmd set vdir` da seção 6.1. É ela que muda o que o público vê, e
   é ela que o rollback desfaz.

**O token continua o mesmo**, por decisão sua. O guia recomenda um token novo em
produção; ficando o do dev, o que você aceita é que ele já circulou em ambiente
de teste. Se um dia trocar, lembre que **os dois lados mudam juntos**: o
`BLOG_INGESTAO_TOKEN` do serviço e o `Blog:Token` do módulo — token diferente dá
**401**, e o diagnóstico registrado foi comparar `sha256` dos dois sem imprimir
nenhum.

---

## Passo 4 — A verificação que fecha

Nesta ordem, porque cada uma só faz sentido se a anterior passou.

**4.1 O site responde no endereço público, de fora do servidor:**

```powershell
Invoke-WebRequest https://notpaper.com.br/blog -UseBasicParsing | Select-Object StatusCode
```

**4.2 O post que sobrou está no ar**, e a home institucional também — abra as
duas no navegador. Se a home vier quebrada, o rollback é o `vdir`.

**4.3 O `PUT` com corpo *chunked* atravessa o proxy.** Faça isto **antes** de
integrar o módulo — é a seção 6.2 do guia, e é a armadilha que este projeto
apontou primeiro: o `HttpClient` do .NET serializa o JSON preguiçosamente, sem
`Content-Length`, e se o ARR bufferizar o sintoma é **post sem título com os dois
lados corretos**.

**4.4 A publicação de verdade, pelo painel:**

1. Suba a Api do módulo (ela já está apontando para `https://notpaper.com.br`).
2. Aprove um post de blog **com capa e categoria**.
3. Confira, no painel: estado **`Publicado`**, **1 tentativa**, e o endereço
   gravado começando com `https://notpaper.com.br/blog/`.
4. Abra esse endereço.

**4.5 O que provaria que deu errado sem parecer errado:** se o endereço gravado
vier com `blog.silodev.com.br`, o build do passo 2 saiu sem a variável — e aí o
post está no banco certo com o endereço errado. É o único defeito desta troca que
não se vê olhando o site.

---

## O que fica registrado como não resolvido

- **O `chunked` pelo ARR nunca foi exercitado em produção.** Foi no dev, e o
  guia diz que o ajuste, se precisar, é barato e do lado do módulo (bufferizar dá
  `Content-Length`) — e que não se faz preventivamente.
- **O token é o mesmo do dev**, por decisão do dev, contra a recomendação da
  seção 5.1 do guia.
- **A pasta estática antiga não é apagada** por este roteiro. Ela é o rollback;
  apague semanas depois, quando o site novo tiver provado que fica de pé.
