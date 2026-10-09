# Renders EP10 slides to 4K PNG. Re-run after editing deck.html or adding ..\shared\background.png.
& "$PSScriptRoot\..\shared\export-slides.ps1" -EpisodeDir $PSScriptRoot -Names @(
    '01-build-the-road-once', '02-landing-zone', '03-network', '04-payment-runtime',
    '05-everything-as-code', '06-laptop-stack', '07-golden-path'
)
