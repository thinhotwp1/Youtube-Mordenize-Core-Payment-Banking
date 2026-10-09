# Renders EP04 slides to 4K PNG. Re-run after editing deck.html or adding ..\shared\background.png.
& "$PSScriptRoot\..\shared\export-slides.ps1" -EpisodeDir $PSScriptRoot -Names @(
    '01-rules-to-requirements', '02-what-the-law-asks', '03-requirements-pipeline',
    '04-story-map', '05-anatomy-of-a-story', '06-traceability', '07-approve-and-hand-over'
)
