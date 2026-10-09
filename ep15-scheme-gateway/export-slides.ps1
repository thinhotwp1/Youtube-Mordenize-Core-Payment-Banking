# Renders EP15 slides to 4K PNG. Re-run after editing deck.html or adding ..\shared\background.png.
& "$PSScriptRoot\..\shared\export-slides.ps1" -EpisodeDir $PSScriptRoot -Names @(
    '01-door-to-the-scheme', '02-five-messages', '03-mapping-to-pacs008',
    '04-inside-the-gateway', '05-late-or-wrong-answers', '06-fake-scheme-testing', '07-ready-for-real-money'
)
