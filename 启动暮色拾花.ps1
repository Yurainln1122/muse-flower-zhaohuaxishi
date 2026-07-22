$ErrorActionPreference = "Stop"

$gameDirectory = "C:\Users\25748\Documents\ZHEN\game-adaptations\zhaohuaxishi\build\app"
$gameUrl = "http://localhost:3001/"
$bundledNode = "C:\Users\25748\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
$vinextCli = Join-Path $gameDirectory "node_modules\vinext\dist\cli.js"

if (-not (Test-Path -LiteralPath $vinextCli)) {
    $popupShell = New-Object -ComObject WScript.Shell
    $popupShell.Popup(
        "Game dependencies are missing. Run pnpm install in the project directory first.",
        0,
        "Muse Flower",
        48
    ) | Out-Null
    exit 1
}

if (Test-Path -LiteralPath $bundledNode) {
    $nodeExecutable = $bundledNode
} else {
    $nodeExecutable = (Get-Command node.exe -ErrorAction Stop).Source
}

$isListening = Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue
if (-not $isListening) {
    Start-Process `
        -FilePath $nodeExecutable `
        -ArgumentList @($vinextCli, "dev", "--port", "3001") `
        -WorkingDirectory $gameDirectory `
        -WindowStyle Hidden | Out-Null
}

for ($attempt = 0; $attempt -lt 20; $attempt++) {
    try {
        $response = Invoke-WebRequest -Uri $gameUrl -UseBasicParsing -TimeoutSec 1
        if ($response.StatusCode -eq 200) { break }
    } catch {
        Start-Sleep -Milliseconds 500
    }
}

Start-Process $gameUrl
