# Renders the single EP00 diagram to 4K PNG. Re-run after editing deck.html.
& "$PSScriptRoot\..\shared\export-slides.ps1" -EpisodeDir $PSScriptRoot -Names @(
    '01-why-this-series'
)
