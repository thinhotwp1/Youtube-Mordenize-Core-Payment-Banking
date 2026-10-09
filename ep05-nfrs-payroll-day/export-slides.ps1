# Renders EP05 slides to 4K PNG. Re-run after editing deck.html or adding ..\shared\background.png.
& "$PSScriptRoot\..\shared\export-slides.ps1" -EpisodeDir $PSScriptRoot -Names @(
    '01-vague-to-measurable', '02-sizing-for-payroll-day', '03-ten-second-budget',
    '04-availability-24-7', '05-plan-every-failure', '06-every-nfr-a-test', '07-agree-and-sign'
)
