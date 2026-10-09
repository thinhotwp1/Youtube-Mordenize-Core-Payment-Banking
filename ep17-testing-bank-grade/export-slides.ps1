# Renders EP17 slides to 4K PNG. Re-run after editing deck.html or adding ..\shared\background.png.
& "$PSScriptRoot\..\shared\export-slides.ps1" -EpisodeDir $PSScriptRoot -Names @(
    '01-many-layers-one-goal', '02-laptop-to-production', '03-test-data',
    '04-ai-writes-tests', '05-money-never-lost', '06-no-green-no-go', '07-ready-for-pilot'
)
