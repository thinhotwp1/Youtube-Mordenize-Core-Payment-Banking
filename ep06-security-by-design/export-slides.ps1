# Renders EP06 slides to 4K PNG. Re-run after editing deck.html or adding ..\shared\background.png.
& "$PSScriptRoot\..\shared\export-slides.ps1" -EpisodeDir $PSScriptRoot -Names @(
    '01-built-in-not-bolted-on', '02-threat-model', '03-identity', '04-protect-the-data',
    '05-compliance-as-code', '06-stop-fraud-in-10-seconds', '07-operate-and-sign-off'
)
