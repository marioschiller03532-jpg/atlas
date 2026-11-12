# Atlas – feste visuelle Grundlage (seit 2.13, 11.11.2026)

Festgelegt von Mario: Diese Ring-und-Kern-Gestaltung ist Atlas' feste Grundgestalt. Künftige Änderungen verfeinern und erweitern sie, ersetzen sie aber nicht durch ein neues Avatar-Konzept. Nur auf ausdrücklichen Wunsch ändern.

## Grundform
- Dunkler Hintergrund (fast Schwarz mit Türkis-Schimmer), leuchtendes rundes Zentrum mit neutralem Kreis, klar erkennbarer äußerer Ring mit feiner innerer Spur.
- Ruhig, hochwertig, futuristisch, erwachsen und warm – nicht kindlich, grell oder hektisch.
- Umsetzung: Variante `ringkern` in `orb.js` (Canvas, keine Bibliotheken).

## Mitte / Erkennungszeichen
- Standard (seit 2.18): schlichter, neutraler Kreis – drei Bogensegmente und ein gegenläufiger Innenbogen; Ruhe dreht langsam (~40 s/Runde), Sprechen hell, pulsiert, dreht schneller. Die frühere Flamme ist entfernt (gehörte zu einer Kaffeemaschine, kein Atlas-Zeichen).
- Austauschbar ohne Umbau: weiteres Emblem in `EMBLEMS` eintragen und `vis.emblem = "<name>"` setzen, oder eigenes Bild über `vis.emblemImg` (Image-Objekt). `vis.emblem = "keins"` zeigt nur das Licht.
- Kein eigenes Logo erfinden; ein Zeichen kommt nur auf Marios ausdrücklichen Wunsch.

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
- Grundfarbe Türkis-Cyan (`tuerkis`). Weitere Farbstimmungen: `blau`, `violett`, `smaragd`, `bernstein`, `rose`, `eis`, `nordlicht` (mehrfarbig, wechselt sehr langsam und weich, Periode ca. 3 min, nie blitzend) `supernova` (bunt: Blau, Türkis, Violett, Magenta, Gold – weich verlaufend, Ring als Farbverlauf, beim Denken einzelne bunte Lichtpunkte) und `eigen` (freie Farbe aus dem Farbwähler; hellere und dunklere Töne werden daraus abgeleitet).
- Das Farbschema färbt Ring, Zentrum, Lichtimpuls, Hintergrund-Schimmer und Akzente (`applyTheme`), nie Aufbau oder Positionen.
- Oberfläche (Knöpfe, Statuszeile) in Türkis auf dunklem Grund.

## Supplement-Karte
- Kleine Karte (Bild/Platzhalter, Name, Herkunft), nur während Atlas über ein konkretes Supplement spricht.
- Quer: links neben der Kugel, vertikal zentriert, Breite passt sich dem freien Platz an. Hochkant/Handy: oben mittig, kompakt. Nie über Kugel, Ring oder Knöpfen.
- Bilder: feste Zuordnung `produktbilder/zuordnung.json` (exakte Schlüssel) oder das Hauptbild genau des Katalogprodukts, über das Atlas spricht; sonst neutrale Kapsel-Grafik. Nie geraten.
