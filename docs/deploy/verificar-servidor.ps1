<#
    Verifica o que o servidor tem instalado, para a subida do site notPaper.

    Sem acento de proposito: PowerShell 5.1 le arquivo sem BOM como ANSI, e
    acento em comentario vira lixo na tela.

    Uso:
        .\verificar-servidor.ps1
        .\verificar-servidor.ps1 -SqlServer "SRVBANCO\MSSQLSERVER"

    Precisa de PowerShell ELEVADO: o modulo WebAdministration (checks 4 e 5)
    nao le a configuracao do IIS sem isso.

    Nao muda nada. Todos os comandos aqui sao de leitura.
#>

param(
    # Servidor\instancia do SQL Server da empresa. Sem ele, os checks 8 e 9
    # sao pulados - eles sao os unicos que falam com outra maquina.
    [string]$SqlServer = ""
)

function Titulo($texto) {
    Write-Host ""
    Write-Host "== $texto " -ForegroundColor Cyan -NoNewline
    Write-Host ("=" * [Math]::Max(0, 60 - $texto.Length)) -ForegroundColor Cyan
}

Titulo "1. Node e npm"
$node = Get-Command node -ErrorAction SilentlyContinue
if ($node) {
    Write-Host "  node $(node -v)  npm $(npm -v)"
    Write-Host "  em: $($node.Source)"
} else {
    Write-Host "  NAO INSTALADO - precisa do LTS 20 ou 22" -ForegroundColor Yellow
}

Titulo "2. Drivers ODBC de 64 bits"
Get-OdbcDriver -Platform 64-bit | Select-Object -ExpandProperty Name | ForEach-Object {
    if ($_ -like "*ODBC Driver 18*") {
        Write-Host "  $_   <-- o que db-config.cjs espera" -ForegroundColor Green
    } else {
        Write-Host "  $_"
    }
}

Titulo "3. URL Rewrite, ARR e ODBC na lista de programas"
$chaves = @(
    "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*",
    "HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*"
)
$achados = Get-ItemProperty $chaves -ErrorAction SilentlyContinue |
    Where-Object { $_.DisplayName -match "URL Rewrite|Application Request Routing|ODBC Driver" } |
    Select-Object DisplayName, DisplayVersion
if ($achados) {
    $achados | Format-Table -AutoSize | Out-String | Write-Host
} else {
    Write-Host "  nada encontrado" -ForegroundColor Yellow
}

Titulo "4. O proxy do ARR esta ligado?"
# Interruptor GLOBAL do applicationHost.config - vale para o servidor inteiro.
try {
    $proxy = Get-WebConfigurationProperty -PSPath 'MACHINE/WEBROOT/APPHOST' `
        -Filter 'system.webServer/proxy' -Name 'enabled' -ErrorAction Stop
    Write-Host "  enabled = $($proxy.Value)"
} catch {
    Write-Host "  secao 'proxy' ausente - o ARR nao esta instalado" -ForegroundColor Yellow
}

Titulo "5. Sites do IIS"
try {
    Import-Module WebAdministration -ErrorAction Stop
    Get-Website |
        Select-Object Name, State, PhysicalPath,
            @{ n = 'Bindings'; e = { ($_.bindings.Collection.bindingInformation) -join ', ' } } |
        Format-Table -AutoSize | Out-String -Width 220 | Write-Host
} catch {
    Write-Host "  falhou: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "  duas causas possiveis, e a mensagem acima distingue:" -ForegroundColor Yellow
    Write-Host "    'modulo nao foi carregado'  -> o IIS nao esta instalado nesta maquina"
    Write-Host "    acesso negado / vazio       -> rode o PowerShell como administrador"
}

Titulo "6. Instancias de SQL Server NESTA maquina"
$servicos = Get-Service | Where-Object { $_.Name -like "MSSQL*" }
if ($servicos) {
    $servicos | Select-Object Name, Status | Format-Table -AutoSize | Out-String | Write-Host
} else {
    Write-Host "  nenhuma - correto, o banco fica no SQL Server da empresa"
}

Titulo "6b. Versao e modo de login das instancias - SEM CONECTAR"
# Le do registro. Vale muito quando o login falha: da a VERSAO (que e o
# bloqueador da migracao 001) sem depender de ter acesso ao banco, e diz se
# autenticacao SQL e possivel. Precisa apenas de administrador local.
$setup = Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\MSSQL*\Setup" `
    -Name Version, Edition -ErrorAction SilentlyContinue
if ($setup) {
    $setup | Select-Object `
        @{ n = 'Instancia'; e = { Split-Path (Split-Path $_.PSPath -Parent) -Leaf } }, Version, Edition |
        Format-Table -AutoSize | Out-String | Write-Host

    Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\MSSQL*\MSSQLServer" `
        -Name LoginMode -ErrorAction SilentlyContinue |
        Select-Object `
            @{ n = 'Instancia'; e = { Split-Path (Split-Path $_.PSPath -Parent) -Leaf } },
            @{ n = 'LoginMode'; e = { "$($_.LoginMode) = $(if ($_.LoginMode -eq 2) { 'MISTO - sa possivel' } else { 'Windows somente' })" } } |
        Format-Table -AutoSize | Out-String | Write-Host

    Write-Host "  Version 17.x = SQL Server 2025 -> o tipo json da migracao 001 funciona"
    Write-Host "  LOCALDB nao serve: e instancia sob demanda, por usuario."
} else {
    Write-Host "  nada no registro - nenhum SQL Server instalado nesta maquina"
}

Titulo "7. Porta 3000"
$porta = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($porta) {
    Write-Host "  OCUPADA:" -ForegroundColor Yellow
    $porta | Select-Object LocalAddress, LocalPort, State, OwningProcess |
        Format-Table -AutoSize | Out-String | Write-Host
} else {
    Write-Host "  livre" -ForegroundColor Green
}

if (-not $SqlServer) {
    Titulo "8 e 9. SQL Server da empresa - PULADOS"
    Write-Host "  rode de novo com -SqlServer ""SERVIDOR\INSTANCIA"" para conferir"
    Write-Host "  a versao. E ela que decide se a migracao 001 roda como esta."
    Write-Host ""
    exit 0
}

Titulo "8. O SQL Server da empresa responde na rede?"
# Instancia nomeada pode nao estar na 1433; se der falha aqui e o SQL estiver de
# pe, o proximo suspeito e o SQL Browser (UDP 1434) ou porta estatica propria.
$host_sql = $SqlServer.Split('\')[0]
Test-NetConnection $host_sql -Port 1433 -InformationLevel Detailed |
    Select-Object ComputerName, RemotePort, TcpTestSucceeded |
    Format-Table -AutoSize | Out-String | Write-Host

Titulo "9. A VERSAO do SQL Server - o bloqueador"
if (-not (Get-Command sqlcmd -ErrorAction SilentlyContinue)) {
    Write-Host "  sqlcmd nao esta instalado aqui." -ForegroundColor Yellow
    Write-Host "  Rode esta query pelo SSMS de qualquer maquina que alcance o banco:"
    Write-Host "    SELECT SERVERPROPERTY('ProductMajorVersion'), @@VERSION"
} else {
    # -E = conexao confiavel (autenticacao Windows), o unico modo que a
    # instancia aceita. NAO redirecionar 2>&1: em 5.1 isso faz executavel
    # nativo parecer que falhou mesmo retornando 0.
    sqlcmd -S $SqlServer -E -Q "SELECT SERVERPROPERTY('ProductMajorVersion') AS versao_maior, SERVERPROPERTY('ProductLevel') AS nivel"
}

Write-Host ""
Write-Host "  17 = SQL Server 2025 -> a migracao 001 roda como esta" -ForegroundColor Green
Write-Host "  16 = 2022 | 15 = 2019 | 14 = 2017 | 13 = 2016" -ForegroundColor Yellow
Write-Host "       -> trocar as 3 colunas json por nvarchar(max) + CHECK(ISJSON)"
Write-Host "          na propria 001. Ver secao 10 de docs/backend-e-banco-de-dados.md"
Write-Host ""
