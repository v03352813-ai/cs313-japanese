param(
    [int]$Port = 5174,
    [string]$DistPath = ""
)

if ([string]::IsNullOrWhiteSpace($DistPath)) {
    $DistPath = Join-Path $PSScriptRoot "dist"
}

# 纯原生 Node.js 全网卡 (0.0.0.0) 双引擎服务器，支持手机同一 Wi-Fi 无感直接访问

$env:ELECTRON_RUN_AS_NODE = "1"
$env:PORT = "3002"
$env:WEB_PORT = "$Port"

$ideExe = "C:\Users\cheng\AppData\Local\Programs\Antigravity IDE\Antigravity IDE.exe"
if (-not (Test-Path $ideExe)) {
    $ideExe = "C:\Users\cheng\AppData\Local\Programs\Antigravity\Antigravity.exe"
}

$serverScript = Join-Path $PSScriptRoot "server\server.cjs"

$serverProcess = Start-Process -FilePath $ideExe -ArgumentList "`"$serverScript`"" -WorkingDirectory $PSScriptRoot -PassThru

Write-Host "==========================================================" -ForegroundColor Green
Write-Host "  CS313 Japanese Platform - Dual Engines Running (Node)!" -ForegroundColor Cyan
Write-Host "  [Frontend Web]: http://localhost:$Port/ (LAN: http://192.168.50.101:$Port/)" -ForegroundColor Yellow
Write-Host "  [Backend API ]: http://localhost:3002/api/health" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Green

while ($true) {
    if ($null -eq $serverProcess -or $serverProcess.HasExited) {
        $serverProcess = Start-Process -FilePath $ideExe -ArgumentList "`"$serverScript`"" -WorkingDirectory $PSScriptRoot -PassThru
    }
    Start-Sleep -Seconds 5
}