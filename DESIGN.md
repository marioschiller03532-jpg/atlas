# Atlas – feste visuelle Grundlage (seit 2.13, 11.11.2026)

Festgelegt von Mario: Diese Ring-und-Kern-Gestaltung ist Atlas' feste Grundgestalt. Künftige Änderungen verfeinern und erweitern sie, ersetzen sie aber nicht durch ein neues Avatar-Konzept. Nur auf ausdrücklichen Wunsch ändern.

## Grundform
- Dunkler Hintergrund (fast Schwarz mit Türkis-Schimmer), leuchtendes rundes Zentrum, klar erkennbarer äußerer Ring mit feiner innerer Spur.
- Ruhig, hochwertig, futuristisch, erwachsen und warm – nicht kindlich, grell oder hektisch.
- Umsetzung: Variante `ringkern` in `orb.js` (Canvas, keine Bibliotheken).

## Mitte / Erkennungszeichen
- Standard: dunkle Flamme (`EMBLEMS.flamme`, SVG-Pfad, Ansicht 100×100).
- Austauschbar ohne Umbau: weiteres Emblem in `EMBLEMS` eintragen und `vis.emblem = "<name>"` setzen, oder eigenes Bild über `vis.emblemImg` (Image-Objekt). `vis.emblem = "keins"` zeigt nur das Licht.
- Die Flamme nicht eigenmächtig ersetzen.

## Zustände
| Zustand | Ring | Zentrum |
|---|---|---|
| Bereit | schwach, atmet sehr langsam (~7 s); drei Lichtbögen und feine Skala kreisen langsam | schwach, atmet mit |
| Zuhören | heller, zwei dezente Lichtwellen nach außen | etwas heller |
| Denken | ruhig | weicher Lichtfleck wandert langsam |
| Sprechen | deutlich heller, pulsiert sanft mit der Stimme; K.I.T.T.-Lichtimpuls (türkis-weißer Punkt mit Schweif) läuft um den Ring; dahinter Supernova aus kleinen Lichtpunkten | etwas heller |
| Ruhemodus | deutlich dunkler, nahezu statisch | dunkel |

Reduzierte Bewegung (Geräteeinstellung): Bewegungen auf ca. 30 %, statt Lichtwellen ein ruhiger Lichtsaum.

## Farben
- Grundfarbe Türkis-Cyan (`tuerkis`). Weitere Farbstimmungen: `blau`, `violett`, `nordlicht` (mehrfarbig, wechselt sehr langsam und weich, Periode ca. 3 min, nie blitzend).
- Oberfläche (Knöpfe, Statuszeile) in Türkis auf dunklem Grund.
