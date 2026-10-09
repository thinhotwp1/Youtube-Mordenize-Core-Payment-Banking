# Renders EP20 slides to 4K PNG. Re-run after editing deck.html or adding ..\shared\background.png.
& "$PSScriptRoot\..\shared\export-slides.ps1" -EpisodeDir $PSScriptRoot -Names @(
    '01-what-the-flip-means', '02-go-no-go', '03-wave-plan', '04-cutover-runbook',
    '05-fallback-window', '06-hypercare-switch-off', '07-lessons-handover'
)
