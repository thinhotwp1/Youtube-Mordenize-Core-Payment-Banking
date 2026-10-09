# Renders EP18 slides to 4K PNG. Re-run after editing deck.html or adding ..\shared\background.png.
& "$PSScriptRoot\..\shared\export-slides.ps1" -EpisodeDir $PSScriptRoot -Names @(
    '01-fast-and-safe', '02-pipeline-end-to-end', '03-scan-every-change',
    '04-supply-chain', '05-approval-by-risk', '06-canary-release', '07-evidence-and-handover'
)
