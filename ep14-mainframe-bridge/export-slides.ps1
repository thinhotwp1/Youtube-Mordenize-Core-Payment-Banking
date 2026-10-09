# Renders EP14 slides to 4K PNG. Re-run after editing deck.html or adding ..\shared\background.png.
& "$PSScriptRoot\..\shared\export-slides.ps1" -EpisodeDir $PSScriptRoot -Names @(
    '01-two-bridges', '02-translate-dont-leak', '03-calling-safely', '04-cdc-data-in',
    '05-one-truth-two-worlds', '06-mainframe-on-a-laptop', '07-run-and-hand-over'
)
