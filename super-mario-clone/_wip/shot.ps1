# Captura uma pagina local com o Edge headless e salva um PNG.
# Uso: powershell -ExecutionPolicy Bypass -File _wip\shot.ps1 -Page <arquivo.html> -Out <saida.png> [-Hash cena] [-W 1400] [-H 1800] [-Profile nome]
param(
  [Parameter(Mandatory = $true)][string]$Page,
  [Parameter(Mandatory = $true)][string]$Out,
  [string]$Hash = '',
  [int]$W = 1400,
  [int]$H = 1800,
  [string]$Profile = 'default'
)
$edge = "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edge)) { $edge = "$env:ProgramFiles\Google\Chrome\Application\chrome.exe" }
$pagePath = (Resolve-Path $Page).Path
$url = 'file:///' + ($pagePath -replace '\\', '/')
if ($Hash) { $url = $url + '#' + $Hash }
$outFull = [System.IO.Path]::GetFullPath($Out)
$prof = Join-Path $env:TEMP ('tico-edge-' + $Profile)
$argList = @('--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
  "--user-data-dir=$prof", "--window-size=$W,$H", '--virtual-time-budget=5000', "--screenshot=$outFull", $url)
$before = if (Test-Path $outFull) { (Get-Item $outFull).LastWriteTime } else { [datetime]::MinValue }
$p = Start-Process -FilePath $edge -ArgumentList $argList -PassThru -Wait -WindowStyle Hidden
$ok = (Test-Path $outFull) -and ((Get-Item $outFull).LastWriteTime -gt $before)
if ($ok) { "OK $outFull" } else { "FALHOU (exit $($p.ExitCode)) $outFull" }
