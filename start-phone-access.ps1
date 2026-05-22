$ErrorActionPreference = "Stop"

$AppDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$Cloudflared = "C:\Program Files (x86)\cloudflared\cloudflared.exe"
$LogFile = Join-Path $AppDir "cloudflared-tunnel.log"

if (-not (Test-Path $Cloudflared)) {
  throw "cloudflared.exe was not found at $Cloudflared"
}

Set-Location $AppDir

$server = Get-NetTCPConnection -LocalPort 8000 -State Listen -ErrorAction SilentlyContinue
if (-not $server) {
  Start-Process -WindowStyle Hidden -FilePath node -ArgumentList "server.js" -WorkingDirectory $AppDir
  Start-Sleep -Seconds 1
}

"Starting Cloudflare Tunnel for http://localhost:8000" | Out-File -FilePath $LogFile -Encoding utf8
& $Cloudflared tunnel --url http://localhost:8000 --no-autoupdate *>> $LogFile
