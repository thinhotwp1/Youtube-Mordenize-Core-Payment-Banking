# Renders every slide in deck.html to 4K PNG (3840x2160).
# Re-run after editing deck.html or after adding assets\background.png.
$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot

$browser = @(
    "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
    "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
    "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
    "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $browser) { throw 'Chrome or Edge not found.' }

# File names in video order; position N = slide N in deck.html
$names = @('01-challenge', '02-requirements', '03-hld', '04-phase2-shadow-ledger',
           '05-phase3-flip', '06-lld', '07-ai-sdlc', '08-tradeoffs')

$deck = ([System.Uri](Join-Path $root 'deck.html')).AbsoluteUri
New-Item -ItemType Directory -Force -Path (Join-Path $root 'slides\live'), (Join-Path $root 'slides\reference') | Out-Null

$jobs = @(@{ s = 0; mode = 'live'; out = 'slides\frame-template.png' })
for ($i = 0; $i -lt $names.Count; $i++) {
    $jobs += @{ s = $i + 1; mode = 'live'; out = "slides\live\$($names[$i]).png" }
    $jobs += @{ s = $i + 1; mode = 'ref';  out = "slides\reference\$($names[$i]).png" }
}

foreach ($j in $jobs) {
    $out = Join-Path $root $j.out
    $url = "${deck}?s=$($j.s)&mode=$($j.mode)&export=1"
    $argList = @(
        '--headless=new', '--disable-gpu', '--hide-scrollbars',
        '--force-device-scale-factor=2', '--window-size=1920,1080',
        '--virtual-time-budget=4000', "--screenshot=`"$out`"", "`"$url`""
    )
    Start-Process -FilePath $browser -ArgumentList $argList -Wait -NoNewWindow -RedirectStandardError (Join-Path $env:TEMP 'deck-export.log')
    Write-Host "OK  $($j.out)"
}
