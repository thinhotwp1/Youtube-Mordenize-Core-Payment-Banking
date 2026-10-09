# Renders EP07 slides to 4K PNG. Re-run after editing deck.html or adding ..\shared\background.png.
& "$PSScriptRoot\..\shared\export-slides.ps1" -EpisodeDir $PSScriptRoot -Names @(
    '01-drivers', '02-c4-context', '03-c4-containers', '04-runtime-view',
    '05-mainframe-decision', '06-adrs', '07-review-and-hand-over'
)
