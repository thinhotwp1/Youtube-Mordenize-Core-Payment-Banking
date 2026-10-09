# Renders EP16 slides to 4K PNG. Re-run after editing deck.html or adding ..\shared\background.png.
& "$PSScriptRoot\..\shared\export-slides.ps1" -EpisodeDir $PSScriptRoot -Names @(
    '01-catch-fraud-keep-friction-low', '02-where-each-check-sits', '03-sanctions-customers-not-payments',
    '04-fraud-decision-150ms', '05-when-fraud-is-down', '06-alert-to-decision', '07-build-prove-hand-over'
)
