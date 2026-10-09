# Renders EP08 slides to 4K PNG. Re-run after editing deck.html or adding ..\shared\background.png.
& "$PSScriptRoot\..\shared\export-slides.ps1" -EpisodeDir $PSScriptRoot -Names @(
    '01-why-contracts-first', '02-contract-map', '03-payment-api-anatomy',
    '04-event-contracts', '05-speaking-iso-20022', '06-contract-tests-governance', '07-version-approve-hand-over'
)
