# Renders EP09 slides to 4K PNG. Re-run after editing deck.html or adding ..\shared\background.png.
& "$PSScriptRoot\..\shared\export-slides.ps1" -EpisodeDir $PSScriptRoot -Names @(
    '01-design-to-plan', '02-roadmap', '03-team', '04-money',
    '05-ai-guardrails', '06-gates-done-metrics', '07-risks-first-90-days'
)
