# Renders EP12 slides to 4K PNG. Re-run after editing deck.html or adding ..\shared\background.png.
& "$PSScriptRoot\..\shared\export-slides.ps1" -EpisodeDir $PSScriptRoot -Names @(
    '01-what-it-does', '02-state-machine', '03-in-the-code', '04-timers',
    '05-undo-and-pivot', '06-test-every-cell', '07-run-and-hand-over'
)
