# Gera as imagens de previa de uma secao de arte (sem alterar o index.html).
# Uso: powershell -ExecutionPolicy Bypass -File _wip\build.ps1 -Item <hero|herobig|blob|pango|items|fx> [-Who worker|critic]
# Saida: _wip\out\<who>\<item>-frames.png, -anim.png, -track.png, -game<N>.png (abra com a ferramenta Read).
param(
  [Parameter(Mandatory = $true)][ValidateSet('hero', 'herobig', 'blob', 'pango', 'items', 'fx')][string]$Item,
  [ValidateSet('worker', 'critic', 'lead')][string]$Who = 'worker'
)
$ErrorActionPreference = 'Stop'
$wip = $PSScriptRoot
$root = Split-Path -Parent $wip
$enc = New-Object Text.UTF8Encoding($false)
$outDir = Join-Path $wip "out\$Who"
New-Item -ItemType Directory -Force $outDir | Out-Null

# 1) bloco de arte: o do index.html com a secao em teste trocada pela copia de trabalho
$idx = [IO.File]::ReadAllText((Join-Path $root 'index.html'), [Text.Encoding]::UTF8)
$a0 = $idx.IndexOf('/* ART-BEGIN */'); $a1 = $idx.IndexOf('/* ART-END */')
if ($a0 -lt 0 -or $a1 -lt 0) { throw 'Marcadores ART-BEGIN/ART-END nao encontrados no index.html' }
$a1 += '/* ART-END */'.Length
$art = $idx.Substring($a0, $a1 - $a0)
$secFile = Join-Path $wip "sec\$Item.js"
if (Test-Path $secFile) {
  $s0 = $art.IndexOf("/* SEC:$Item */"); $s1 = $art.IndexOf("/* END:$Item */")
  if ($s0 -lt 0 -or $s1 -lt 0) { throw "Marcadores da secao $Item nao encontrados" }
  $sec = [IO.File]::ReadAllText($secFile, [Text.Encoding]::UTF8).Trim()
  $art = $art.Substring(0, $s0) + "/* SEC:$Item */`n" + $sec + "`n" + $art.Substring($s1)
}
$onerr = "<script>window.__errs=[];window.onerror=function(m,s,l,c){window.__errs.push(m+' (linha '+l+':'+c+')');};</script>"

# 2) paginas: folha de quadros e jogo com o harness
$spec = [IO.File]::ReadAllText((Join-Path $wip "spec\$Item.js"), [Text.Encoding]::UTF8)
$viewer = [IO.File]::ReadAllText((Join-Path $wip 'viewer.js'), [Text.Encoding]::UTF8)
$sheet = "<!doctype html><html><head><meta charset=`"utf-8`"><style>html,body{margin:0;background:#1b1d24}</style>$onerr</head><body>`n<script>`n'use strict';`n$art`n</script>`n<script>`n$spec`n</script>`n<script>`n$viewer`n</script>`n</body></html>"
$sheetPath = Join-Path $outDir "$Item-sheet.html"
[IO.File]::WriteAllText($sheetPath, $sheet, $enc)
$harness = [IO.File]::ReadAllText((Join-Path $wip 'harness.js'), [Text.Encoding]::UTF8)
$game = $idx.Substring(0, $a0) + $art + $idx.Substring($a1)
$game = $game.Replace('<head>', "<head>`n$onerr").Replace('</body>', "<script>`n$harness`n</script>`n</body>")
$gamePath = Join-Path $outDir "$Item-game.html"
[IO.File]::WriteAllText($gamePath, $game, $enc)

# 3) captura com o Edge headless (grava no TEMP e copia, o Edge nao grava direto na pasta do projeto)
$edge = "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edge)) { $edge = "$env:ProgramFiles\Google\Chrome\Application\chrome.exe" }
$prof = Join-Path $env:TEMP "tico-edge-$Item-$Who"
$consoleLines = New-Object System.Collections.Generic.List[string]
function Shot([string]$page, [string]$hash, [string]$name) {
  $tmp = Join-Path $env:TEMP "tico-$Item-$Who-$name.png"
  $log = Join-Path $env:TEMP "tico-$Item-$Who-$name.log"
  $url = 'file:///' + ($page -replace '\\', '/') + '#' + $hash
  $argList = @('--headless', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check', '--enable-logging=stderr', '--v=0',
    "--user-data-dir=$prof", '--window-size=1360,1500', '--virtual-time-budget=6000', "--screenshot=$tmp", $url)
  $p = Start-Process -FilePath $edge -ArgumentList $argList -PassThru -NoNewWindow -RedirectStandardError $log -RedirectStandardOutput "$log.out"
  if (-not $p.WaitForExit(90000)) { try { $p.Kill() } catch {} }
  if (Test-Path $log) { Get-Content $log | Where-Object { $_ -match 'CONSOLE|Uncaught' -and $_ -notmatch 'chrome-extension://' } | ForEach-Object { $consoleLines.Add("[$name] $_") } }
  $dest = Join-Path $outDir "$Item-$name.png"
  if (Test-Path $tmp) { Copy-Item $tmp $dest -Force; return $dest }
  return $null
}
$shots = @()
foreach ($partName in @('frames', 'anim', 'track')) { $shots += Shot $sheetPath "part=$partName" $partName }
$gameParts = @{ hero = @(1, 3); herobig = @(1, 2); blob = @(1); pango = @(1); items = @(1); fx = @(1) }
foreach ($n in $gameParts[$Item]) { $shots += Shot $gamePath "item=$Item&part=$n" "game$n" }

# 4) corta o espaco vazio no fim de cada imagem
try {
  Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @"
using System; using System.Drawing; using System.Drawing.Imaging;
public static class TicoCrop {
  public static void Crop(string path) {
    Bitmap src; using (var tmp = new Bitmap(path)) { src = new Bitmap(tmp); }
    int w = src.Width, h = src.Height; int bg = src.GetPixel(w - 1, h - 1).ToArgb();
    var data = src.LockBits(new Rectangle(0, 0, w, h), ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
    int stride = data.Stride; var buf = new byte[stride * h];
    System.Runtime.InteropServices.Marshal.Copy(data.Scan0, buf, 0, buf.Length); src.UnlockBits(data);
    int last = -1;
    for (int y = h - 1; y >= 0 && last < 0; y--) for (int x = 0; x < w - 24; x++) { if (BitConverter.ToInt32(buf, y * stride + x * 4) != bg) { last = y; break; } }
    int nh = Math.Max(40, Math.Min(h, last + 14));
    using (var dst = src.Clone(new Rectangle(0, 0, w, nh), PixelFormat.Format32bppArgb)) { src.Dispose(); dst.Save(path, ImageFormat.Png); }
  }
}
"@ -ErrorAction SilentlyContinue
  foreach ($s in $shots) { if ($s) { [TicoCrop]::Crop($s) } }
} catch { "aviso: nao consegui cortar as imagens ($($_.Exception.Message))" }

"Secao: $Item  (copia de trabalho: $(if (Test-Path $secFile) { $secFile } else { 'nenhuma, usando o index.html' }))"
"Imagens geradas (abra com Read):"
foreach ($s in $shots) { if ($s) { "  $s" } else { '  FALHOU uma captura' } }
if ($consoleLines.Count) { 'Mensagens do console do navegador:'; $consoleLines | Select-Object -First 25 | ForEach-Object { "  $_" } } else { 'Console: sem erros.' }
