# Atlas – Änderungen

## 2.12 (11.11.2026) – Morgendlicher Wissensimpuls
- Ablauf morgens (4–11 Uhr, einmal pro Person und Tag): Begrüßung → ein kurzer Wissensimpuls zu einem Supplement → wie gewohnt weiter zu dem, was heute ansteht (Claude übernimmt den Tagesplan).
- Auswahl: Mario oder Eva → aus der eigenen Liste (aktive Mittel, bei Eva auch „Status prüfen“); Person unklar (mehrere, Gast) → allgemeiner Eintrag. Abwechselnd: am längsten nicht genannte zuerst.
- Texte: vorab geschrieben und in der verschlüsselten Wissensbibliothek hinterlegt (39 Einträge, 1–2 Sätze, max. 37 Wörter ≈ 15 s), ehrlich zur Evidenz, bei Bioregulatoren klar „laut Hersteller … gute Humanstudien fehlen“. Keine Einnahmeempfehlung. Intimes (Libido-Mittel u. Ä.) und unklare Einträge sind ausgenommen. Ohne geladene Bibliothek kein Impuls.
- Überspringen: „Stopp“ oder „überspring das / gleich zum Tagesplan“ → ohne Diskussion zum Tagesplan.
- Rückfall: /alt/2.11/ (inkl. alter kb.enc).

## 2.11 (11.11.2026) – Aufwecken durch Bewegung, „Wer ist gerade im Raum?“
- Aus dem Schlaf weckt nur deutliche, anhaltende Bewegung (ca. 1,5 s, 3 Treffer in Folge statt 2). Lichtwechsel weiterhin ausgefiltert.
- Nach dem Aufwachen (Bewegung oder Antippen) genau eine Begrüßung: „Hallo, ich bin Atlas, deine persönliche Biohacking-Assistentin. Wer ist gerade im Raum?“
- Antwort wird lokal ausgewertet (kein Claude-Aufruf, keine Kamera-Erkennung): bekannte Person → „Hallo Mario. Was brauchst du?“ / „Hallo Eva. Was brauchst du?“; neuer Name → „Hallo Gerhard. Was darf ich für dich tun?“; mehrere → „Hallo Mario und Eva. Was braucht ihr?“; nicht verstanden → einmal „Hallo. Wie darf ich dich ansprechen, und womit kann ich dir helfen?“, danach normal weiter. Name plus Anliegen („Mario, wie viel Kreatin …“) → Anliegen wird direkt beantwortet.
- Während Zuhören, Denken, Sprechen oder laufendem Gespräch löst Bewegung keine Begrüßung aus. Sperrzeit 2 min nach dem Aufwachen.
- Ohne Kamerazugriff: Hinweis und Statuszeile „Kugel antippen“; Antippen aus dem Schlaf weckt und begrüßt.
- Ruhemodus nach „Gute Nacht“ bleibt wie bisher: nur „Atlas“ oder Antippen weckt.
- Kamera: nur nach Freigabe, nur 48×36-Helligkeitswerte im Arbeitsspeicher, nichts gespeichert, keine Gesichtserkennung.
- Rückfall: /alt/2.10/.

## 2.10 (11.11.2026) – Gesprächsfaden und Supplement-Runden
Ursachen:
- Die Regel „Supplements nie pauschal abhaken“ zwang Atlas, nach „Morgenroutine erledigt“ einzeln nachzufragen („Welche soll ich abhaken?“). Es gab kein Werkzeug für eine ganze Runde.
- Atlas bekam seine letzte Frage nicht ausdrücklich mitgegeben und konnte sie nach Marios Antwort wiederholen.
- Hineinreden wurde nur bei „Stopp“ erkannt; bei iOS, das ein Erkennungsergebnis fortschreibt, wurde auch das teilweise übersehen.
- Meldete iOS das Ende eines Erkennungs-Neustarts nicht, konnte das Zuhören hängen bleiben.
- Denkpause bei offenem Satzende war mit +2,5 s zu lang.
Änderungen:
- Neues Werkzeug runde_abhaken (morgens/mittags/abends): hakt alle aktiven Supplements dieser Runde aus der gespeicherten Liste ab, optional die Routine-Schritte; bewusst Ausgelassenes bleibt, Pausiertes wird übersprungen, Ausnahmen möglich. Nur Tagesstatus, Routine unverändert.
- Regeln GESPRÄCHSFADEN, RUNDEN, TAG ODER DAUERHAFT; letzte Frage von Atlas wird bei jeder Antwort mitgegeben. Wiederholt Atlas trotzdem die gerade beantwortete Frage, wird dieser Satz nicht vorgelesen.
- liste_aendern ändert die gespeicherte Routine nur mit dauerhaft=true (ausdrücklich „dauerhaft/ab jetzt/regelmäßig“) oder bestätigt im Listenmodus.
- Leere/nicht geladene Supplementliste: Atlas sagt das klar, erfindet nichts.
- Hineinreden: spricht Mario mindestens drei eigene Wörter, während Atlas redet, stoppt Atlas sofort, hört weiter zu und behält diese Wörter.
- Pausen: Grundpause 2 s (abends 2,5), offenes Satzende +1,5 s, kurze Bruchstücke +0,5 s. Neustart der Erkennung mit Sicherheitsnetz nach 1,2 s.
- Rückfall: /alt/2.9/.

## 2.9 (10.11.2026) – Neues Erscheinungsbild „Atemkern“
- Neuer Avatar: runde, fein gerasterte Pixelhülle um einen weichen, warmen Kern, dezenter Pixelring. Farben: Mitternachtsblau, Türkis/Salbeigrün, warmes Kernlicht.
- Zustände (bestehende Modi sleep/idle/listen/think/speak): Ruhe fast unbewegt und gedimmt · Zuhören: Kern und Ring heller · Denken: Kernlicht wandert langsam zwischen warm und Salbei · Sprechen: Kugel schwingt räumlich vor und zurück, folgt der Stimm-Energie (Wortgrenzen der Sprachausgabe), höchstens drei leise Pixel-Echos.
- Reduzierte Bewegung (iPad-Einstellung): langsamere, kleinere Bewegung, keine Echos.
- Hintergrund und Bedienfarben auf Mitternachtsblau/Salbei umgestellt. Atemkern ist einmalig als Kugel aktiviert; Orbit-Glaskugel und die anderen Kugeln bleiben in den Einstellungen wählbar.
- Keine Funktionen geändert. Rückfall: /alt/2.8/.

## 2.8 (10.11.2026) – Zuhören, Stopp, Sprache, Katalog-Aufträge
Gefundene Ursachen (im Code, nicht im Prompt):
- „Stopp“ wurde während Atlas sprach oder nachdachte komplett verworfen: Alles Gehörte in dieser Zeit wurde ignoriert. Nur Antippen half.
- „Stopp“ als eigener Satz beendete das Gespräch, statt sofort wieder zuzuhören.
- Unterbrechen: Bei Sätzen, die auf „und“, „weil“ usw. endeten, sprach Atlas nach 2,8 s die Zwischenfrage „Möchtest du noch etwas ergänzen?“ – genau dann, wenn man weiterdenkt. Standardpause war 1,6 s.
- Haken: Fiel die Spracherkennung mit Fehler aus (Netz, Mikrofon), startete sie sofort neu – Dauerschleife ohne Pause. Schlug ein Neustart fehl, endete das Gespräch kommentarlos.
- Nach einer Antwort lief dieselbe Erkennungs-Sitzung weiter; je nach Gerät konnten Reste der eigenen Stimme oder ein „verbrauchter“ Erkennungsstand das nächste Zuhören stören.
- Katalog-Auftrag: Es gab kein Werkzeug, um etwas in den Katalog einzutragen – Atlas konnte den Auftrag gar nicht ausführen.
Änderungen:
- Stopp-Erkennung läuft während Sprechen und Denken: „Stopp“, „hör auf“, „sei still“ bricht Sprachausgabe und Claude-Anfrage sofort ab, keine Antwort, direkt „Hört zu“. Echo-Schutz: sagt Atlas selbst „Stopp“, zählt es nicht.
- Keine gesprochene Zwischenfrage mehr. Mindestpause 2,0 s (Einstellung 2–3,5 s), abends +0,5 s, unfertiger Satz +2,5 s, kurze Bruchstücke +0,7 s, Ja/Nein ohne Extrawarten. „Fertig“-Knopf bleibt.
- Nach jeder Antwort frische Erkennungs-Sitzung. Fehler: Neustart mit wachsender Pause, bis zu 4 Startversuche, Wächter startet die Erkennung neu, wenn sie im Gespräch ausfällt. Bewegung/Licht löst während eines Gesprächs keine Begrüßung aus.
- Diagnose-Protokoll (nur Ereignisse und Fehlercodes, keine Inhalte) in den Einstellungen unter den Antwortzeiten.
- Fachbegriffe: typische Fehlhörungen werden korrigiert (z. B. „Magnesium bis glyzinat“ → Magnesium-Bisglycinat, „el Theanin“, „N M N“, „Vitamin D drei“, „Molekular“ → MoleQlar). Vorlesen: Einheiten und Abkürzungen ausgeschrieben (mg → Milligramm, z. B. → zum Beispiel, D3 → D drei), Bisglycinat in zwei Teilen.
- Antwortbeginn ohne Floskeln („Gute Frage“, „Natürlich“, „Absolut“ werden nicht vorgelesen); Stil-Anker im Prompt um Schmäh, Varianz und Sprechsprache ergänzt. Mario’s Persönlichkeitstext unverändert.
- Neues Werkzeug katalog_eintragen: eigene Katalog-Einträge hinzufügen, ändern, entfernen; Herstellerdaten werden nie geändert, Doppelte und Hersteller-Produkte werden erkannt. Eigene Einträge lokal gespeichert und im Backup. Regel KATALOG-AUFTRÄGE: bei unsicherem Namen einmal nachfragen, dann knapp bestätigen; Katalog und Einnahmeliste getrennt.
- Rückfall: Version 2.7.2 unter /alt/2.7.2/.

## 2.7.2 (10.11.2026) – Katalog-Status je Hersteller und Produktgruppe
- Kein pauschales „Katalog vollständig/unvollständig“ mehr. Status getrennt: alle gefundenen Produkte, Nahrungsergänzungen, davon vollständig, davon teilweise, andere Produktarten (nach Art).
- Fehlende Angaben je Produkt und Feld, Wortlaut „nicht auf der Produktseite gefunden“ (Biogena: „nicht auf Produktseite und Etikett-PDF gefunden“). Nichts geschätzt oder ergänzt.
- Produktbilder ausdrücklich „nicht geprüft“; keine Werte daraus übernommen.
- Einstellungen zeigen, ob der Katalog vom Server oder aus der Offline-Kopie im Gerät geladen wurde.
- Stand 10.11.2026 10:28: Biogena 298 / 253 NEM / 253 vollständig / 0 teilweise / 45 andere. MoleQlar 104 / 74 NEM / 63 vollständig / 11 teilweise / 30 andere.
- Rückfall: Version 2.7.1 unter /alt/2.7.1/.

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
