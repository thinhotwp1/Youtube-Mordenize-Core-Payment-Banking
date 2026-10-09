# Renders EP21 slides to 4K PNG. Re-run after editing deck.html or adding ..\shared\background.png.
& "$PSScriptRoot\..\shared\export-slides.ps1" -EpisodeDir $PSScriptRoot -Names @(
    '01-the-3am-question', '02-four-signals-one-key', '03-follow-one-payment',
    '04-slos-error-budgets', '05-alerts', '06-runbooks-on-call', '07-dashboards'
)
