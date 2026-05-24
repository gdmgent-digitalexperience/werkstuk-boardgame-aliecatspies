# Gezelschapspel

## Doel van het project
Deze website is een eenvoudige spelomgeving met een homepage die klikbare vakjes toont. Elk vakje moet duidelijk zichtbaar en vierkant zijn, en moet naar een andere HTML-pagina leiden.

## Pagina's
- `index.html`: homepage met grote klikbare vakjes.
- `spelregels.html`: pagina met de spelregels en een afbeelding uit `assets/spelregels.png`.
- `makers.html`: pagina met informatie over de makers.
- `roulette.html`: pagina voor "Artefact stelen" met keuze-opties en een roulette.

## Functionaliteit voor "Artefact stelen"
Wanneer de speler op het vakje `Artefact stelen` klikt, volgt een flow:
1. Startscherm: "Ben je klaar om het artefact te stelen?" (knop om verder te gaan)
2. Keuze scherm: Kies moeilijkheidsgraad (Makkelijk, Iets moeilijker, Gevorderd)
3. Spel scherm: Roulette draait, stoppen met spatie toets
4. Resultaten scherm: Toont tekst, video en audio, met "Try Again" en "Terug naar homepage"

## Resultaat van de roulette
- Stop bij groen:
  - Tekst: "Proficiat! U mag het artefact in je rugzak leggen."
  - Speel `42.mp4`
  - Speel `happycat.wav`
- Stop bij rood:
  - Tekst: "Jammer! U hebt het artefact niet gestolen."
  - Speel `fireball_1_2kres.mp4`
  - Speel `sadcat.wav`

## Verschillen per moeilijkheid
- `Makkelijk`: 70% groen, langzaam draaien.
- `Iets moeilijker`: 50% groen, iets sneller draaien.
- `Gevorderd`: 30% groen, nog sneller draaien.

## Huidige status
- `index.html`: homepage met klikbare vakjes.
- `spelregels.html`: bestaande pagina met afbeelding en terug-link.
- `makers.html`: bestaande pagina met makerinformatie.
- `roulette.html`: bestaande pagina voor de artefact-roulette.

## Toekomstige taken
1. Maak `artefact.html` met de drie moeilijkheidskeuzes.
2. Bouw de roulette-animatie met rood/groen kleurverdeling.
3. Voeg afspeelfunctie toe voor `42.mp4` + `happycat.wav` en `fireball_1_2kres.mp4` + `sadcat.wav`.
4. Zorg dat alle vakjes vierkant blijven en consistent stijlen.
