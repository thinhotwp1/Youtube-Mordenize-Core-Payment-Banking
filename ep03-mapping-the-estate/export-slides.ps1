# Renders EP03 slides to 4K PNG. Re-run after editing deck.html or adding ..\shared\background.png.
& "$PSScriptRoot\..\shared\export-slides.ps1" -EpisodeDir $PSScriptRoot -Names @(
    '01-map-before-you-move', '02-sources-graph-views', '03-current-state-map',
    '04-follow-the-money', '05-the-night', '06-value-vs-risk', '07-slice-1-decision'
)
