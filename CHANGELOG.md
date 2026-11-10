# Atlas – Änderungen

## 2.7.1 (10.11.2026) – Produktkatalog fertiggestellt
- Zählweise eindeutig: „gefunden“ = alle Produktseiten im offiziellen Verzeichnis (inkl. Zubehör, Sets, Tests, Lebensmittel, Medizinprodukte). „Nahrungsergänzungen“ = davon als NEM gekennzeichnet. „Vollständig“ = NEM mit Mengen pro Portion (Tabelle), Zutaten, Verzehrempfehlung und Packungsgröße.
- Produkttyp jetzt nach Pflichtkennzeichnung (Biogena) bzw. Nährstofftabelle (MoleQlar) statt Raten. Die 7 früher „teilweisen“ Biogena-Produkte sind keine NEM (2 Wässer, Snack, 2 Speiseöle = Lebensmittel; 2× Zeolith = Medizinprodukt), Hinweise wie Wechselwirkungen/Nebenwirkungen beim Zeolith übernommen.
- MoleQlar: Nährstofftabelle der Produktseite (Portion, %NRV) wird jetzt gelesen; Packungsgröße aus Shop-Varianten. Keine Werte aus Bildern, nichts geschätzt.
- Stand 10.11.2026 06:51 UTC: Biogena 298 gefunden, 253 NEM, 253 vollständig, 0 offen. MoleQlar 104 gefunden, 74 NEM, 63 vollständig, 11 teilweise (meist nur Packungsgröße). Katalog bleibt als unvollständig gekennzeichnet.
- App: Katalog-Status zeigt gefunden / NEM / vollständig / teilweise / andere Produkttypen und „katalog_vollstaendig“. Grundaufbau, Hauptprompt und Design unverändert.
- Rückfall: Version 2.7 unter /alt/2.7/.

## 2.7 (10.11.2026) – Produktkatalog Biogena + MoleQlar
- Katalog-Datei katalog/supplement_catalog.json liegt bei der App (allgemeine Herstellerdaten, getrennt von persönlichen Angaben). Erstellt von tools/katalog-run.mjs über GitHub Actions aus den offiziellen Shops (Sitemap bzw. Shop-Schnittstelle, robots.txt beachtet, 1 Anfrage/Sekunde). Prüfbericht in katalog/report.json mit Änderungen gegenüber dem letzten Lauf.
- Stand 10.11.2026: Biogena 298 Seiten (271 Nahrungsergänzungen, davon 264 vollständig; 27 Zubehör/Bundles/Tests), MoleQlar 104 Produkte (97 Nahrungsergänzungen bzw. Pulver, 14 vollständig – MoleQlar veröffentlicht keine Mengentabelle als Text). Katalog als unvollständig gekennzeichnet.
- Atlas lädt den Katalog beim Start und behält eine Kopie im Gerät (getestet: nach Neustart ohne Netz weiter verfügbar). Werkzeuge katalog_suchen und katalog_status; keine Websuche im normalen Betrieb.
- Aktualisierung nur auf Wunsch: neuer Lauf des Katalog-Werkzeugs; Bericht zeigt neue, geänderte und entfernte Produkte.
- Backup im Tresor enthält alle persönlichen Daten; die Katalog-Kopie wird nicht mitgesichert (kommt mit der App).
- Rückfall: Version 2.6 unter /alt/2.6/.

## 2.6 (10.11.2026) – Wissensbibliothek, Wörterbuch, getrennte Profile
- Wissensbibliothek mit 44 Supplementen, Peptiden und Bioregulatoren (Inhaltsstoffe, Einsatz, Evidenzstufe, Risiken, Quellen mit Datum, Art der Angabe). Verschlüsselt im Repo (kb.enc), Schlüssel nur im Einrichtungs-Code; nach dem Laden lokal gespeichert, im Gespräch kein Internet nötig. Passende Einträge werden automatisch mitgegeben; Werkzeug „wissen_nachschlagen“.
- Wörterbuch für die Spracherkennung: bekannte Fehlhörungen werden korrigiert („el Carnitin“ → L-Carnitin), Ähnliches nur als Rückfrage-Hinweis („Meinst du Sigumir?“); bei Unsicherheit wird nichts lokal abgehakt.
- Profile: dauerhafter Plan-Status (aktiv, pausiert, Status prüfen, erwogen, früher verwendet), Hinweise (z. B. Threonat-Reaktion), Tagesstatus mit „später geplant“; Werkzeug „plan_status_setzen“; einmaliger Einrichtungs-Check für „Status prüfen“.
- Identität: Beim Aktivieren nach 20 Minuten Ruhe fragt Atlas „Mit wem spreche ich?“, bis dahin keine persönlichen Daten; „Ich bin Eva“, „Wechsle zu Mario“ wechseln das Profil.
- Studien-Updates werden mit Datum verschlüsselt archiviert („studien_abrufen“).
- Korrektur: Namen mit vier Wörtern (z. B. „Omega-3 Norsan vegan“) wurden bisher nie erkannt.
- Rückfall: Version 2.5 unter /alt/2.5/.

## 2.5 (09.11.2026) – Fehlerbehebung Persönlichkeit, Zuhören, Ruhemodus
- Ruhemodus: zählte bisher nur Kamera-Bewegung als Aktivität. Lag das Gerät still oder stand man ruhig davor, schlief Atlas direkt nach einer Gesprächspause ein. Jetzt zählen auch Sprache, Zuhören, Denken, Sprechen und Antippen; Schlaf erst nach 20 Minuten echter Ruhe und nie während Aufnahme, Erkennung oder Antwort.
- „Tschüss“, „Bis dann“ usw. lösen den Ruhemodus nur noch als kurze, eigenständige Aussage aus (höchstens 6 Wörter), nicht mitten in einem Satz.
- Gespräch endet erst nach 90 s Stille (vorher 60 s).
- Verbindungsfehler: Atlas verstummte bisher kommentarlos. Jetzt: ein stiller Neuversuch, Wächter gegen hängende Anfragen (30 s), danach sagt Atlas, dass die Verbindung fehlt, und hört weiter zu. Zustand unter der Kugel sichtbar (Bereit, Hört zu, Denkt nach, Spricht, Ruhemodus, Keine Verbindung, Mikrofon/Spracherkennung-Fehler).
- Persönlichkeit: Stil-Anker am Ende jeder Anfrage, damit die vielen Technik-Regeln den Ton nicht verdrängen. Begrüßung, „Wie geht’s“ und „Okay“ laufen wieder über Claude statt über Standardsätze.
- Einstellungen: Ein leeres Persönlichkeitsfeld löscht nichts mehr; automatische Sicherung der Persönlichkeit mit Wiederherstellung; unlesbare Einstellungen werden nie überschrieben; Anzeige, welche Persönlichkeit geladen ist; Zurücksetzen nur per Knopf mit Rückfrage.
- Rückfall: Version 2.4 unter /alt/2.4/.

## 2.4 (06.11.2026) – Supplementlisten-Modus
- „Atlas, zeig mir meine Supplementierungsliste“ / „… Evas Supplementierungsliste“ öffnet die Liste groß (Tablet quer: rechts neben der Kugel, Handy: unten), gruppiert nach morgens, mittags, abends, ohne feste Zeit, mit Tagesstatus ✓ ✕ ○ ⏸.
- Liste bleibt offen, während Atlas zuhört, denkt oder spricht und auch nach Gesprächsende; „Fertig mit der Liste“ oder ✕ schließt sie.
- Im Listenmodus wird nichts automatisch geändert oder abgehakt: Die App lässt Änderungen erst zu, nachdem Atlas sie genau wiederholt und Mario bestätigt hat.
- Unbekannte Person → Rückfrage statt Raten. Entfernen von Listeneinträgen nur noch bei eindeutigem Namen.
- Orbit-Glaskugel aus 2.3 unverändert übernommen.
- Rückfall: Version 2.3 unter /alt/2.3/.

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
