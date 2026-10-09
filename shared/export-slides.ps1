# Renders every slide of an episode deck to 4K PNG (3840x2160): live (no arrows) + reference (arrows).
# Usage (from an episode's export-slides.ps1):
#   & "$PSScriptRoot\..\shared\export-slides.ps1" -EpisodeDir $PSScriptRoot -Names @('01-name', '02-name')
param(
    [Parameter(Mandatory)] [string]   $EpisodeDir,
    [Parameter(Mandatory)] [string[]] $Names
)
$ErrorActionPreference = 'Stop'

$browser = @(
    "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
    "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
    "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
    "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $browser) { throw 'Chrome or Edge not found.' }

$deck = ([System.Uri](Join-Path $EpisodeDir 'deck.html')).AbsoluteUri
New-Item -ItemType Directory -Force -Path (Join-Path $EpisodeDir 'slides\live'), (Join-Path $EpisodeDir 'slides\reference') | Out-Null

$jobs = @(@{ s = 0; mode = 'live'; out = 'slides\frame-template.png' })
for ($i = 0; $i -lt $Names.Count; $i++) {
    $jobs += @{ s = $i + 1; mode = 'live'; out = "slides\live\$($Names[$i]).png" }
    $jobs += @{ s = $i + 1; mode = 'ref';  out = "slides\reference\$($Names[$i]).png" }
}

foreach ($j in $jobs) {
    $out = Join-Path $EpisodeDir $j.out
    # Chrome's screenshot writer cannot handle long Windows output paths.
    # Render to a short temporary path, then copy with a long-path-aware .NET call.
    $tempOut = Join-Path $env:TEMP ("jo-deck-{0}-{1}.png" -f $PID, [guid]::NewGuid().ToString('N'))
    $url = "${deck}?s=$($j.s)&mode=$($j.mode)&export=1"
    $argList = @(
        '--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files',
        '--force-device-scale-factor=2', '--window-size=1920,1080',
        '--virtual-time-budget=4000', "--screenshot=`"$tempOut`"", "`"$url`""
    )
    try {
        $process = Start-Process -FilePath $browser -ArgumentList $argList -Wait -PassThru -WindowStyle Hidden -RedirectStandardError (Join-Path $env:TEMP 'deck-export.log')
        if ($process.ExitCode -ne 0 -or -not (Test-Path -LiteralPath $tempOut)) {
            throw "Chrome failed to render $($j.out) (exit code $($process.ExitCode))."
        }
        $longOut = '\\?\' + [System.IO.Path]::GetFullPath($out)
        [System.IO.File]::Copy($tempOut, $longOut, $true)
        Write-Host "OK  $($j.out)"
    }
    finally {
        Remove-Item -LiteralPath $tempOut -Force -ErrorAction SilentlyContinue
    }
}
