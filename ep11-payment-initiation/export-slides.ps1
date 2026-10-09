# Renders EP11 slides to 4K PNG. Re-run after editing deck.html or adding ..\shared\background.png.
& "$PSScriptRoot\..\shared\export-slides.ps1" -EpisodeDir $PSScriptRoot -Names @(
    '01-front-door', '02-inside-the-service', '03-two-kinds-of-duplicate',
    '04-idempotency-in-code', '05-outbox-in-practice', '06-built-with-ai', '07-demo-same-payment-twice'
)
