# Renders EP22 slides to 4K PNG. Re-run after editing deck.html or adding ..\shared\background.png.
& "$PSScriptRoot\..\shared\export-slides.ps1" -EpisodeDir $PSScriptRoot -Names @(
    '01-five-steps', '02-detect-fast', '03-incident-stuck-payments', '04-safe-switches',
    '05-game-day-region', '06-learn-without-blame', '07-better-every-quarter'
)
