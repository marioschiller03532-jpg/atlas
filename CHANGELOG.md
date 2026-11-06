# Atlas – Änderungen

## 2.3 (06.11.2026) – Orbit-Glaskugel
- Neue Sprechkugel nach der ORBIT-Vorlage: dunkler Glaskörper, Rand von Mint über Cyan nach Blau/Violett, weicher Schein.
- Fünf Zustände, sanft ineinander übergeblendet: Bereit (Innenkugel oben links, schwebt leicht) · Hört zu (Linsenkugel mit Rillen, atmet mit der Eingabe) · Denkt nach (zwei Kugeln kreisen langsam) · Spricht (Innenkugel in der Mitte, pulsiert mit der Stimme, feine Wellen) · Schläft/Ruhemodus (wie Bereit, gedimmt in Nachtblau).
- Wird beim ersten Start einmalig als Kugel gesetzt; die anderen Kugeln bleiben in den Einstellungen wählbar. Farbe und Effekt gelten für die Orbit-Kugel nicht.
- Rückfall: Version 2.2 unter /alt/2.2/.

## 2.2 (06.11.2026) – Gesprächsregeln, Spitzname, Pausen
- Abends (19–4 Uhr) wartet Atlas 0,5 s länger auf das Satzende und spricht etwas ruhiger (Tempo −7 %).
- Klingt ein Satz unfertig und die Pause wird lang: „Möchtest du noch etwas ergänzen?“ – das Bisherige bleibt erhalten; „Nein“/„Passt“ schickt sofort ab.
- Echo-Schutz verbessert: Was während Atlas’ eigener Sprache erkannt wird, fließt nie in die nächste Frage ein.
- Spitzname (Einstellungen): Atlas reagiert auf beide Namen, auch zum Aufwecken aus dem Ruhemodus.
- Supplements und Bioregulatoren können pausiert werden (⏸, z. B. Kurpause); pausierte werden nicht abgefragt.
- Rückfall: Version 2.1 unter /alt/2.1/.

## 2.1 (05.11.2026) – Supplement-Tagebuch
- Drei Zustände je Supplement: genommen, nicht genommen, offen. Änderung nur nach eindeutiger Aussage, jedes Supplement einzeln, nie pauschal.
- Lokal (sofort): eindeutige Sätze wie „Glycin genommen, L-Tyrosin nicht“ oder „doch kein Glycin“ (mit Korrektur-Bestätigung). „Bisglycinat“ wird nicht als „Glycin“ gezählt.
- Über Claude: kontextabhängige Antworten („Ja“, „Nur Glycin“, „Alles außer …“, „Ich hab mich versprochen“), mehrdeutige Namen („Magnesium“) und unbekannte Supplements. Mehrdeutiges wird abgelehnt und nachgefragt.
- Neue Supplements: nur für heute erfassen (einmalig) oder dauerhaft aufnehmen, dann erst nach Erklärung zu Nutzen, Evidenz und Risiken sowie Dosis und Zeitpunkt.
- Tagebuch mit Änderungsverlauf; das Tagesprotokoll übernimmt den gespeicherten Stand.
- Heute-Ansicht: Antippen wechselt offen → ✓ genommen → ✕ nicht genommen.
- Rückfall: Version 2.0 unter /alt/2.0/.

## 2.0 (05.11.2026)
- Gesprächsführung: Denkpausen nach „und“, „weil“, „äh“, Komma u. Ä. verlängern die Wartezeit um 1,2 s; Echo-Schutz (Atlas reagiert nicht auf die eigene Stimme); Schleifenschutz (mehr als 4 Durchgänge in 20 s hält an).
- Ruhemodus: „Tschüss“, „Bis später“, „Gute Nacht“, „Atlas, Ruhemodus“ → genau eine Verabschiedung, dann still (Nachtblau). Bewegung und Licht wecken nicht. Aufwecken: Kugel antippen oder „Atlas“ sagen. Nach einstellbaren Stunden (Standard 6) wird daraus normaler Schlaf.
- Menschlichere Gespräche: Absicht erkennen (reden, lösen, entspannen), beim Thema bleiben, gezielt nachfragen, abwechslungsreiche Formulierungen; lokale Antworten wiederholen sich nicht direkt.
- Biohacking-Alltag: Schlaf, Training, Stress, Supplements und Arbeitsrhythmus zusammen betrachten; Evidenz in vier Stufen; persönliche Erfahrung ≠ Beweis.
- Gedächtnis: neue Kategorie „Beobachtungen“ (Training, Schlaf, Stress, Ziele, Supplement-Reaktionen) – nur wenn in den Einstellungen erlaubt; verschlüsselt im Tresor, einsehbar, änderbar, löschbar.
- Rückfall: Version 1.9 bleibt unter /alt/1.9/ erreichbar.

## 1.9 (03.11.2026)
- Vollständiges Zuhören (1,6 s Sprechpause, Fertig-Knopf), Zustände Bereit/Zuhören/Denken/Sprechen/Schlafen, Schlafmodus mit Licht-Filter, Hybrid-Antworten, Antwort-Cache, persönlicher Speicher, Schnell-/Expertenmodus.
