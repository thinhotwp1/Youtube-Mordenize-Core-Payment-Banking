# Renders EP02 slides to 4K PNG. Re-run after editing deck.html or adding ..\shared\background.png.
& "$PSScriptRoot\..\shared\export-slides.ps1" -EpisodeDir $PSScriptRoot -Names @(
    '01-below-the-waterline', '02-six-step-pipeline', '03-intake-and-inventory',
    '04-ai-extraction', '05-expert-sign-off', '06-golden-tests', '07-risks-and-handoff'
)
