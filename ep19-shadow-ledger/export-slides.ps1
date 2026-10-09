# Renders EP19 slides to 4K PNG. Re-run after editing deck.html or adding ..\shared\background.png.
& "$PSScriptRoot\..\shared\export-slides.ps1" -EpisodeDir $PSScriptRoot -Names @(
    '01-why-a-shadow-ledger', '02-parallel-run', '03-three-levels',
    '04-breaks', '05-hard-days', '06-reads-and-mips', '07-ready-to-flip'
)
