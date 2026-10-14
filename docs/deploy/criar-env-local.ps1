<#
    Cria o .env.local na pasta do site, com um token de ingestao GERADO aqui.

    Sem acento de proposito: PowerShell 5.1 le arquivo sem BOM como ANSI.

    O token nunca viaja: ele nasce nesta maquina, nesta execucao. E por isso que
    nao existe um .env.local pronto na pasta de deploy - mandar um seria mandar
    um segredo, e ainda com os valores da maquina errada.

    Uso no servidor de DEV (instancia default, porta 3000):
        .\criar-env-local.ps1

    Instancia nomeada e outra porta:
        .\criar-env-local.ps1 -SqlServer "localhost\SQLEXPRESS" -Port 3001

    Rode ANTES de `npm run build`: NEXT_PUBLIC_SITE_URL e inlinada no build.
#>

param(
    # Instancia que passou na checagem de versao (passo 2 do roteiro).
    [string]$SqlServer = "localhost",

    [string]$Database = "notpaperBlog",

    # Tem que ser o TEXTO EXATO do driver instalado. No dev, os checks
    # confirmaram o 18. Se so houver o 17, troque aqui - o codigo nao se importa
    # com qual, se importa que o nome bata.
    [string]$OdbcDriver = "ODBC Driver 18 for SQL Server",

    [int]$Port = 3000,

    # A URL que a INGESTAO DEVOLVE ao modulo, e que ele GRAVA como endereco
    # publicado. No dev tem que ser o proprio localhost: pondo o dominio de
    # producao aqui, um teste no dev registraria um endereco que nao existe la.
    [string]$SiteUrl = "",

    # Sobrescreve um .env.local existente. Sem isto, o script se recusa - o
    # arquivo pode ter um token que o modulo do outro lado ja conhece.
    [switch]$Force
)

$ErrorActionPreference = "Stop"

$destino = Join-Path (Get-Location) ".env.local"

if ((Test-Path $destino) -and (-not $Force)) {
    Write-Host ""
    Write-Host "  JA EXISTE: $destino" -ForegroundColor Yellow
    Write-Host "  Nao vou sobrescrever. O token dele pode ja estar configurado no"
    Write-Host "  modulo de marketing, e trocar um lado sem o outro da 401."
    Write-Host ""
    Write-Host "  Para ver o que ele tem:   Get-Content .env.local"
    Write-Host "  Para substituir mesmo:    .\criar-env-local.ps1 -Force"
    Write-Host ""
    exit 1
}

if (-not (Test-Path (Join-Path (Get-Location) "package.json"))) {
    Write-Host ""
    Write-Host "  Nao achei package.json aqui." -ForegroundColor Yellow
    Write-Host "  Rode na RAIZ da pasta do site - e de la que o Next e o"
    Write-Host "  db:migrate leem o .env.local."
    Write-Host ""
    exit 1
}

if (-not $SiteUrl) { $SiteUrl = "http://localhost:$Port" }

# 64 caracteres hexadecimais. Get-Random e suficiente para um token de dev; para
# producao, gere um novo (e outro) do mesmo jeito.
$token = -join ((1..32) | ForEach-Object { '{0:x2}' -f (Get-Random -Maximum 256) })

$conteudo = @"
# Gerado por criar-env-local.ps1 em $(Get-Date -Format 'dd/MM/yyyy HH:mm').
# NAO versionar: .gitignore tem .env*.local.

SQLSERVER_SERVER=$SqlServer
SQLSERVER_DATABASE=$Database
SQLSERVER_ODBC_DRIVER=$OdbcDriver

# O MESMO valor tem que ir em Blog:Token do modulo de marketing.
# Token de 48 de um lado e 64 do outro foi um defeito real deste projeto,
# e o sintoma e 401.
BLOG_INGESTAO_TOKEN=$token

# Inlinada no build: mudar depois exige rodar npm run build de novo.
NEXT_PUBLIC_SITE_URL=$SiteUrl
"@

# UTF-8 SEM BOM, e isto nao e preciosismo: `Out-File -Encoding utf8` no
# PowerShell 5.1 escreve BOM, e o parser nativo de --env-file do Node nao o
# remove - a primeira chave viraria "﻿SQLSERVER_SERVER" e o db:migrate
# reclamaria de configuracao ausente com o arquivo na frente dele.
[System.IO.File]::WriteAllText($destino, $conteudo, (New-Object System.Text.UTF8Encoding($false)))

Write-Host ""
Write-Host "  criado: $destino" -ForegroundColor Green
Write-Host ""
Write-Host "  SQLSERVER_SERVER      $SqlServer"
Write-Host "  SQLSERVER_DATABASE    $Database"
Write-Host "  SQLSERVER_ODBC_DRIVER $OdbcDriver"
Write-Host "  NEXT_PUBLIC_SITE_URL  $SiteUrl"
Write-Host "  BLOG_INGESTAO_TOKEN   $token" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Guarde o token acima: ele vai em Blog:Token do modulo." -ForegroundColor Cyan
Write-Host ""
Write-Host "  Proximo passo:  npm run db:migrate"
Write-Host ""
