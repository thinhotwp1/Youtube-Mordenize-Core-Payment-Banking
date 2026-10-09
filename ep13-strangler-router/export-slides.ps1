# Renders EP13 slides to 4K PNG. Re-run after editing deck.html or adding ..\shared\background.png.
& "$PSScriptRoot\..\shared\export-slides.ps1" -EpisodeDir $PSScriptRoot -Names @(
    '01-one-front-door', '02-how-the-router-decides', '03-flags-as-code',
    '04-a-pure-decision', '05-dangerous-edges', '06-ramp-up-roll-back', '07-demo-done-next'
)
