# Renders EP24 slides to 4K PNG. Re-run after editing deck.html or adding ..\shared\background.png.
& "$PSScriptRoot\..\shared\export-slides.ps1" -EpisodeDir $PSScriptRoot -Names @(
    '01-modern-today-legacy-tomorrow', '02-change-calendar', '03-change-pipeline',
    '04-small-and-often', '05-ai-guardrails-current', '06-audit-evidence', '07-full-circle'
)
