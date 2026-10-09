# Renders EP23 slides to 4K PNG. Re-run after editing deck.html or adding ..\shared\background.png.
& "$PSScriptRoot\..\shared\export-slides.ps1" -EpisodeDir $PSScriptRoot -Names @(
    '01-two-bills', '02-cost-per-payment', '03-make-cost-visible', '04-where-the-money-goes',
    '05-mips-and-the-peak', '06-budgets-anomalies-ci', '07-finops-rhythm'
)
