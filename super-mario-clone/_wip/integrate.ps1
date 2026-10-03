# Leva as secoes aprovadas de _wip\sec para o index.html e copia o bloco de arte para o painel.
# Uso: powershell -ExecutionPolicy Bypass -File _wip\integrate.ps1 -Items hero,blob,...
param([Parameter(Mandatory = $true)][string[]]$Items)
$ErrorActionPreference = 'Stop'
$wip = $PSScriptRoot
$root = Split-Path -Parent $wip
$enc = New-Object Text.UTF8Encoding($false)
$idxPath = Join-Path $root 'index.html'
$idx = [IO.File]::ReadAllText($idxPath, [Text.Encoding]::UTF8)
foreach ($it in $Items) {
  $s0 = $idx.IndexOf("/* SEC:$it */"); $s1 = $idx.IndexOf("/* END:$it */")
  if ($s0 -lt 0 -or $s1 -lt 0) { throw "secao $it nao encontrada no index.html" }
  $sec = [IO.File]::ReadAllText((Join-Path $wip "sec\$it.js"), [Text.Encoding]::UTF8).Trim()
  $idx = $idx.Substring(0, $s0) + "/* SEC:$it */`n" + $sec + "`n" + $idx.Substring($s1)
  "integrada: $it"
}
[IO.File]::WriteAllText($idxPath, $idx, $enc)
# painel: troca o bloco ART inteiro pelo do jogo
$demoPath = Join-Path $root 'sprite-demo.html'
$demo = [IO.File]::ReadAllText($demoPath, [Text.Encoding]::UTF8)
$a0 = $idx.IndexOf('/* ART-BEGIN */'); $a1 = $idx.IndexOf('/* ART-END */') + '/* ART-END */'.Length
$d0 = $demo.IndexOf('/* ART-BEGIN */'); $d1 = $demo.IndexOf('/* ART-END */') + '/* ART-END */'.Length
$demo = $demo.Substring(0, $d0) + $idx.Substring($a0, $a1 - $a0) + $demo.Substring($d1)
[IO.File]::WriteAllText($demoPath, $demo, $enc)
'painel sincronizado'
