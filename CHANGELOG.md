# Atlas – Änderungen

## 2.38 (26.11.2026) – iPhone: „Du bist dran“ statt Fehlermeldung
- Meldung „iOS hat den automatischen Mikrofon-Start abgelehnt“: Seit 2.35 schließt Atlas auf dem iPhone das Mikrofon, bevor er spricht (sonst Ton nur aus der Hörmuschel). Danach öffnet er es wieder – aber iOS erlaubt das Öffnen des Mikrofons nur direkt nach einem Tipp. Atlas brach dann das Gespräch mit roter Meldung ab.
- Jetzt (nur iPhone): keine Fehlermeldung, Anzeige „Du bist dran – tippen“. Ein Tipp irgendwo auf den Bildschirm (nicht nur auf die Kugel) öffnet sofort das Mikrofon, das Gespräch läuft weiter. Knöpfe und Menüs bleiben unberührt.
- iPad unverändert: Dort bleibt das Mikrofon offen, Gespräch ganz ohne Tippen.
- Rückfall: /alt/2.37/.

## 2.37 (25.11.2026) – Atlas' Gesprächsweise zurück
- Geprüft: Persönlichkeit (DEF_PERSONA), Stil-/Wortschatz-Regeln, Gesprächsregeln, Modelle und Gesprächsverlauf sind seit 2.28 unverändert – dort lag es nicht.
- Ursache: Seit 2.32/2.33 funktioniert die Begrüßung per Bewegung wirklich. Damit beginnt jedes Gespräch mit festen Standardsätzen ohne Claude: „Hallo! Wer ist im Raum?“ (2.32 gekürzt, vorher „Hallo, ich bin Atlas. Wer ist gerade im Raum und wobei kann ich helfen?“) → „Hallo Mario. Was brauchst du?“. Keine Persönlichkeit, keine eigene Rückfrage, Gespräch klingt nach Formular.
- Jetzt: Begrüßung wieder warm und abwechselnd (Text aus 2.31 + Varianten). Meldet sich der Hauptnutzer oder ein Erwachsener, begrüßt ihn Claude mit der Persönlichkeit: locker, mit Schmäh, einer kleinen Spitze aus der Situation und einer eigenen persönlichen Rückfrage. Offline lockere Standardsätze statt „Was brauchst du?“. Morgenimpuls, Kinder, unbekannte Personen unverändert.
- Absicherung zu 2.36: Die Sicherung „Stimme startet nicht“ bricht keine laufende Antwort mehr ab, wenn iOS den Sprechbeginn nicht meldet, aber spricht (sonst konnten Schlusssätze und Rückfragen wegfallen).
- Funktionen, Daten, Persönlichkeitstext unverändert. Rückfall: /alt/2.36/.

## 2.36 (25.11.2026) – Hänger nach „Wer ist im Raum?“ behoben
- Ursache: iOS meldet nach dem letzten gesprochenen Wort oft weiter „spricht“. Atlas wartete darauf bis zu 2 Minuten (`whenAudioIdle`, 240 × 0,5 s), bevor er das Mikrofon öffnete – Kugel blieb auf „Spricht“, die Antwort des Nutzers ging ins Leere. Im Test mit nachgestellter iOS-Meldung reproduziert.
- Jetzt: Haben alle eigenen Sätze ihr Ende gemeldet, wird höchstens 1,5 s gewartet, die hängende Meldung zurückgesetzt und das Mikrofon geöffnet (Prüfmodus zeigt „iOS-Meldung hing, zurückgesetzt“).
- iPhone: nach dem Sprechen starteten zwei Spracherkenner gleichzeitig (Neustart + Zuhören). Jetzt höchstens ein Start gleichzeitig.
- Aufräum-Timer („90 s nichts gehört → Gespräch beenden“) beendete ein Gespräch, das Atlas per Begrüßung gerade selbst begonnen hatte. Jetzt zählt Atlas' eigene Ansprache als Aktivität.
- Rückfall: /alt/2.35/.

## 2.35 (24.11.2026) – iPhone: Atlas hört und spricht wieder + Prüfmodus
- Ursache 1 (Mikrofon startete nicht): Jeder Tipp auf die Kugel schickte zuerst eine stumme Ton-Freigabe an die Sprachausgabe. `listen()` wartete, bis diese „fertig“ war, und startete das Mikrofon erst danach – außerhalb des Tipps (iOS verlangt den Start direkt im Tipp) oder nie, wenn iOS die stumme Ausgabe hängen ließ. Jetzt: keine zusätzliche Freigabe pro Tipp; stumme Freigabe oder hängende Ausgabe ohne eigene Antwort wird abgebrochen, das Mikrofon startet sofort im Tipp.
- Ursache 2 (iPhone stumm): Das Mikrofon blieb offen, während Atlas dachte und sprach. Auf dem iPhone leitet iOS den Ton dann an die Hörmuschel (kaum hörbar); das iPad hat keine Hörmuschel. Jetzt auf dem iPhone: Mikrofon zu, bevor Atlas spricht, danach wieder auf. Zusätzlich (iOS 17+): Audio-Sitzung „playback“ für die Stimme, „auto“ fürs Mikrofon. Folge: „Stopp“ per Stimme wirkt auf dem iPhone nicht während Atlas spricht – Kugel antippen oder Stopp-Taste.
- Ursache 3 (stilles Hängen): Status „Hört zu/Denkt nach“ und Statuszeile sind im Design ausgeblendet; Fehler waren unsichtbar. Neuer, vorübergehender Prüfmodus oben am Bildschirm: Mikrofon bereit · Sprache erkannt · Person erkannt · Antwort wird erstellt · Sprache wird ausgegeben – je ✓/…/!/✗ mit Grund und Sekunden, Gerätezeile (iPhone/iPad, Safari-Tab oder Home-Bildschirm-App, Spracherkennung, Stimmen, Mikrofon-/Kamera-Recht, Ton freigeschaltet, Audio-Sitzung, Schlüssel, online), letzte Ereignisse, Knöpfe Ton-Test / Kopieren / einklappen / ausblenden.
- Zeitgrenzen: Mikrofon 6 s, Sprachausgabe 6 s, Antwort 40 s – danach rot mit konkretem Hinweis statt Warten.
- Konkrete iOS-Fehlertexte (not-allowed automatisch vs. nach Tipp, service-not-allowed, Home-Bildschirm-App, network, audio-capture, Sprache fehlt).
- Kamera wird auf iOS 2,5 s nach dem Tipp angefragt, nicht gleichzeitig mit dem Mikrofon.
- Design sonst unverändert. Rückfall: /alt/2.34/.

## 2.34 (23.11.2026) – Drahtkugel 3D
- Neue Kugel „Drahtkugel 3D“ (Variante `drahtkugel` in `makeOrb`, Canvas, keine Bibliothek, kein Server): geodätisches Netz aus 480 gebogenen Linien und 162 Lichtpunkten, dreht sich wirklich räumlich (Perspektive, hintere Linien dunkler, vordere mit Schein). Wird einmalig als Kugel eingestellt; Ringkern und alle anderen Kugeln bleiben unter Einstellungen → Kugel wählbar.
- Gekoppelt an Atlas' echte Zustände (`vis.mode`): Bereit langsam · Zuhören langsam + sanfter Puls (~2,4 s) · Denkt nach etwas schneller · Spricht lebhafter + gleichmäßiger Puls · Ruhemodus fast still, dunkel, nur 12 Bilder/s.
- Antwortbeginn (Wechsel in „Spricht“ nach mind. 1,5 s Pause): Supernova im Inneren – heller Kern, 9 sanfte Lichtstrahlen, 18 Partikel, klingt nach ~1,9 s ab.
- Sprachausgabe: keine Lautstärke-Reaktion (die Sprachausgabe liefert keinen Pegel), sondern gleichmäßiger Puls; zusätzlich kurzer Lichtimpuls je Wort nur dann, wenn iOS Wortgrenzen meldet (`vis.beat`, neu in beiden `onboundary`). Kein Mikrofonzugriff.
- Farben aus der gewählten Farbstimmung; „Supernova (bunt)“ ergibt den Verlauf Türkis → Blau → Violett → Magenta → Gold.
- Akku: Bildrate begrenzt (30/s, beim Sprechen und während der Supernova 60/s, Ruhemodus 12/s); Linien und Punkte gebündelt gezeichnet.
- Bewegung reduzieren: Drehung ~35 %, kein Funkeln, kein Wort-Impuls, Supernova nur als weiches Aufleuchten.
- Sonst nichts verändert. Rückfall: /alt/2.33/.

## 2.33 (23.11.2026) – Bewegung → Begrüßung: Ursachen behoben + Diagnose
- Ursache 1 (Kamerabilder): Das Kamera-Video war unsichtbar (2×2 px, Deckkraft 0, verdeckt). iOS/WebKit liefert an ein unsichtbares oder verdecktes Video keine neuen Bilder (WebKit-Bug 206843) – Atlas verglich ein stehendes Bild und sah nie Bewegung. Jetzt: 8×6 px, Deckkraft 0,02, oberste Ebene (praktisch unsichtbar, aber für iOS „sichtbar“); pausiert iOS das Video, läuft es sofort weiter.
- Ursache 2 (Sprachausgabe): iOS spricht erst nach einem Tipp in der Seite. Begrüßung durch Bewegung ohne vorherigen Tipp blieb stumm, der Hinweis stand in einer ausgeblendeten Zeile. Jetzt: Stimme wird beim ersten Tipp irgendwo freigeschaltet; bleibt sie gesperrt, zeigt die Leiste „bitte einmal auf die Kugel tippen“ und die Frage wird danach nachgeholt.
- Ursache 3 (unsichtbare Sperren): gleiche Raum-Sitzung (erst nach 20 min ohne Bewegung neu) und Begrüßungs-Pause blockierten ohne Anzeige. Jetzt sichtbar mit Grund.
- Diagnose (Entwicklung) in Einstellungen → Raum & Protokoll: 1 Kamera · 2 Videobilder (läuft/steht, Bilder/s) · 3 Bewegung (Stärke/Schwelle, Treffer) · 4 Begrüßung (ausgelöst/blockiert + Grund) · 5 Sprachausgabe (gestartet/fehlgeschlagen + Grund) · 6 Mikrofon danach; dazu Zustände und Ereignisliste.
- Rückfall: /alt/2.32/.

## 2.32 (23.11.2026) – Bewegung erkennen und begrüßen: repariert
- Ursache: iPad/iPhone beenden die Kamera einer Web-App, sobald Atlas im Hintergrund ist oder der Bildschirm sperrt. Atlas hielt den Stream trotzdem für „an“ und verglich danach nur noch stehende Bilder – Bewegung wurde nie mehr erkannt, bis Atlas neu geladen wurde. Außerdem startete die Kamera beim Öffnen nur, wenn iOS „erlaubt“ meldete (meist meldet iOS „fragen“).
- Kamera-Zustand wird überwacht (Spur beendet/unterbrochen, Bild steht still > 8 s) und beim Zurückkehren in den Vordergrund automatisch neu gestartet; im dunklen Raum kein Neustart-Karussell.
- Autostart beim Öffnen, außer die Kamera wurde von Hand ausgeschaltet oder verweigert.
- Begrüßung durch Bewegung: 1,2 s Verzögerung, dann „Hallo! Wer ist im Raum?“ – nur wenn Atlas vorne, frei und nicht im Ruhe-/Urlaubs-/Privatmodus ist. Keine Antwort → nach der Stille-Grenze zurück in Bereitschaft, Frage verfällt.
- Mindestdauer der Bewegung einstellbar (1 / 1,5 / 2 / 3 s, Standard 1,5 s) – die Bewegung muss die ganze Dauer abdecken.
- Hauptbildschirm: schmale Leiste nur, während Atlas zuhört („● Atlas hört zu“) oder wenn die Kamera fehlt/angehalten ist (antippen → Hilfe).
- Einstellungen → Raum & Protokoll: Live-Status (Kamera, Bewegung mit Stärke-Balken, letzte Begrüßung, Pause), Knöpfe „Kamera ein/aus“ und „Begrüßung testen“, Hinweis zu Hintergrund/Bildschirmsperre und Lösung.
- Rückfall: /alt/2.31/.

## 2.31 (19.11.2026) – Paarzeit in der Morgenroutine (lokal)
- Kleiner lokaler Dialog in der Morgenroutine einer bestimmten Person: höchstens einmal pro Kalendertag, in der ersten Gesprächspause nach ihrer eigenen Aussage zur Routine (4–12 Uhr), nie durch Bewegung oder Begrüßung.
- Ja → eine Karte aus der lokalen Liste, dann weiter an derselben Stelle der Routine (offene Routinefrage wird wiederholt). Nein/Heute nicht → kurze Quittung, weiter. Stopp → sofort aus. Schweigen oder unklare Antwort → weiter ohne Karte und ohne Nachfrage.
- Person, Frage und Karten liegen nur verschlüsselt in kb.enc. Im Gerät gemerkt (verschlüsselt): Datum der letzten Frage, zuletzt verwendete Karten. Keine Cloud, kein Internet, nichts im Gesprächsverlauf.
- Sonst nichts verändert. Rückfall: /alt/2.30/.

## 2.30 (17.11.2026) – Spracheingabe Stufe 1 + Sprachprotokoll
- Sprachprotokoll pro Eingabe (nur Zeiten/Zähler, keine Worte): Aufnahmestart, erstes und letztes erkanntes Wort, Ende + Grund (Sprechpause, iOS-Satzende, Stille-Grenze, Höchstdauer, Fertig-Taste, Kugel, nichts gesagt …), Antwortbeginn, iOS-Korrekturen, Wiederholungen, Neustarts, Nachzügler, online/offline. Einstellungen → Stimme → „Sprachprotokoll“: Kopieren / Senden … / Löschen.
- iOS-Korrekturen zählen nicht mehr als Sprechen: nur wenn mehr Wörter dazukommen.
- Pro Eingabe ein frischer Erkenner; verspätete Ergebnisse alter Aufnahmen (Echo) werden ignoriert.
- Meldet iOS ein Satzende, antwortet Atlas 0,7 s früher (nie unter 0,9 s; nicht bei unfertigem Satz).
- Nachweis „Spracherkennung auf dem Gerät“: einmal ohne Internet gesprochen → belegt (bis zum nächsten iOS-Update).
- Sonst nichts verändert. Rückfall: /alt/2.29/.

## 2.29 (16.11.2026) – Gesprächsende-Erkennung
- Ursache des langen Zuhörens: Nach einer Antwort blieb das Mikrofon bis zu 90 s offen; jedes Ergebnis der Spracherkennung – auch wiederholt gemeldeter gleicher Text oder Geräusche – setzte die Pausen-Uhr zurück; beim Gesprächsende wurde die Erkennung nicht aktiv geschlossen.
- Stille-Erkennung auf Wortebene: Als Sprache zählen nur neue echte Wörter. Rauschen, „äh/hm“ und Wiederholungen verlängern nichts. Spätestens nach der eingestellten Stille (Standard 5,5 s, 4–8 s) endet die Aufnahme: mit Text antwortet Atlas, ohne Text endet das Zuhören sichtbar und das Mikrofon geht zu.
- Bisherige Sprechpause (deine Einstellung 2,2 s) bleibt; sie kann durch „unfertige“ Satzenden nie mehr über die Stille-Grenze hinaus verlängert werden.
- Höchstdauer pro Eingabe (Standard 1 Minute, 30 s–2 min); 10 s vorher „Noch 10 Sekunden“ und Countdown unter der Kugel.
- Sprachbefehle: „Stopp“ unterbricht die Antwort sofort (wie bisher); neu „Atlas, hör zu“ – während einer Antwort: abbrechen und zuhören; beim Zuhören: neu anfangen; mit „Auf Zuruf hören“: Zuhören öffnen.
- Atlas wechselt erst in „Hört zu“, wenn die Sprachausgabe wirklich fertig ist.
- Einstellungen → Stimme: zwei neue Regler (Stille, Längste Eingabe). Sonst nichts verändert. Rückfall: /alt/2.28/.

## 2.28 (15.11.2026) – Wissensquellen: Podcast „Die Biohacking-Praxis“
- Neue lokale, durchsuchbare Wissenssammlung, modular aufgebaut (`wissen/quellen.json` + je Quelle eine Datei; weitere Quellen ohne Code-Änderung ergänzbar).
- Erste Quelle: Podcast „Die Biohacking-Praxis“ (Andreas Breitfeld, Stefan Wagner; Red Bull Media House). 276 Folgen (#000–#275), je Folge: Nummer, Titel, Datum, Format, Themen, eigene Kurzfassung, wichtige Aussagen, Unsicherheiten, kommerzieller Bezug, Studienlinks, Link, ggf. Transkript-Link. Grundlage nur die öffentlichen Folgenbeschreibungen → alle als „unvollständig“ markiert; kein Audio, keine Transkripte ausgewertet.
- Themenindex: Schlaf, Müdigkeit/Energie, NAD+, Infusionen, Supplements, Training, Ernährung, Fokus, Stress, Hormone, Regeneration (+ Licht, Kälte/Wärme, Langlebigkeit, Messen/Tracking).
- Werkzeug `wissensquellen_suchen` für Claude; Regel WISSENSQUELLEN: vage Aussagen erst nachfragen, max. 1–2 Folgen, Podcast/Studie/Erfahrung trennen, Kommerzielles kennzeichnen, keine Behandlungsempfehlung wegen des Podcasts, Warnzeichen zuerst ärztlich, „keine passende Folge“ offen sagen.
- Folgenkarte ({{w-bhp-NNN}}) mit Mikrofon-Symbol, antippbar: Detail mit Kurzfassung, Aussagen, Unsicherheiten, kommerziellem Bezug, Studienhinweisen, Grundlage. Links nur mit Internet und nie im Privatmodus.
- Offline/Cloud aus/Privatmodus: Atlas zeigt passende Folgen aus dem lokalen Index.
- Service Worker speichert `wissen/*.json` geprüft im Offline-Speicher. Wöchentliche Aktualisierung über GitHub-Workflow `wissen` (neue Folgen als „noch nicht aufbereitet“). Sonst nichts verändert. Rückfall: /alt/2.27.3/.

## 2.27.3 (15.11.2026) – schwarzer Hintergrund zurück
- Hintergrund wieder exakt wie bis 2.27 (dunkler Verlauf, Browser-Leiste #050c12). Weißer Hintergrund verworfen; Statusleiste bleibt ausgeblendet. Rückfall: /alt/2.27.2/.

## 2.27.2 (15.11.2026) – Statusleiste ausgeblendet
- Die Pillen Kamera/Mikrofon/Internet/Cloud-KI/Privatmodus sind auf dem Hauptbildschirm unsichtbar; Logik, Schalter (🛡 Datenschutzstatus, Einstellungen) und Datenschutzverhalten unverändert. Rückfall: /alt/2.27.1/.

## 2.27.1 (15.11.2026) – Hintergrund weiß
- Nur die Hintergrundfarbe der Oberfläche von Schwarz auf Weiß (Seitenhintergrund und Browser-Leistenfarbe). Sonst unverändert. Rückfall: /alt/2.27/.

## 2.27 (15.11.2026) – Raum-Sitzungen, Tagesprotokoll, Urlaubsmodus
- Ursache wiederholter Begrüßungen: Bisher begrüßte Atlas nach jeder Ruhephase von 3 Minuten („jemand kommt“) und nach jedem Aufwachen aus dem Bildschirm-Schlaf neu. Jetzt gibt es Raum-Sitzungen: Beginn bei anhaltender Bewegung, Ende erst nach 10/20/30 Minuten ohne Bewegung (einstellbar). Begrüßt wird nur zu Beginn einer neuen Sitzung und nur, wenn die Begrüßungs-Pause (10/20/30/60 Minuten, gespeichert über Neustarts) vorbei ist. Weitere Bewegung, Aufwachen aus dem Schlaf oder kurzes Hinausgehen lösen nichts aus; laufende Sprache wird nie durch Bewegung unterbrochen.
- Tagesprotokoll (lokal, verschlüsselt): je Sitzung Datum, Eintritt, Austritt, Dauer, Modus und – nur bei eingewilligten, angelegten Personen, die sich selbst nennen – der Name; sonst „Unbekannte Anwesenheit“. Ansehen, als Textdatei exportieren, vollständig löschen; Löschfrist 7/30/90 Tage.
- Urlaubsmodus: keine Begrüßung, keine Sprache, Mikrofon aus, keine Antworten, keine Benachrichtigung; nur stilles Protokoll; Hinweis „Urlaubsmodus aktiv“ (abschaltbar).
- Einstellungen „Raum & Protokoll“: Bewegungserkennung, Kamera, Begrüßungs-Pause, Sitzungsende, Erkennungsintervall (0,5/1/2 s), Empfindlichkeit, Bildschirm-Schlaf, Tagesprotokoll, Urlaubsmodus, Aufbewahrung, Einwilligung je Person, Protokoll löschen. Erkennung pausiert, wenn Atlas nicht im Vordergrund ist. Rückfall: /alt/2.26/.

## 2.26 (15.11.2026) – Sicherheit & Datenschutz
- Persönliche Daten im Gerät verschlüsselt (AES-256-GCM, nicht exportierbarer Geräteschlüssel in IndexedDB); bestehende Klartextdaten werden beim ersten Start umgestellt. Öffentliche Katalogdaten bleiben unverschlüsselt.
- Schalterleiste oben: Kamera · Mikrofon · Internet · Cloud-KI · Privatmodus; rot pulsierend, wenn Kamera/Mikrofon gerade aktiv. 🛡 „Datenschutzstatus“ beim Start (abschaltbar) mit Datenfluss-Tabelle (Daten, Anbieter, Speicherung) aus dem laufenden Zustand.
- Privatmodus: Kamera aus, Mikrofon aus, keine Verbindung nach außen (Claude, Websuche, Google-Apps-Script, Updates, Downloads, Herstellerbilder); Service Worker liefert dann nur aus dem Gerätespeicher. Offline-/Privat-Antworten mit Katalogtreffern.
- Mikrofon nur noch während aktivem Zuhören. Bisher lief die Spracherkennung im Raum-Modus dauerhaft (für den Zuruf „Atlas“) – das ist jetzt ein eigener Schalter, Standard aus. Spracherkennung nutzt „lokal auf dem Gerät“, wenn iOS das anbietet; optional „nur lokal“.
- Schriften selbst eingebettet: keine Verbindung mehr zu Google Fonts beim Start.
- „Updates nur nach Bestätigung“ (optional). „Alle Atlas-Daten löschen“ (zweimal tippen) – löscht nur Atlas, andere Apps auf derselben Adresse bleiben.
- Neue Doku DATENSCHUTZ.md. Rückfall: /alt/2.25/.

## 2.25 (14.11.2026) – Offline-Start
- Neu: Service Worker (sw.js). Nach einem vollständigen ersten Laden mit Internet startet Atlas auch im Flugmodus. Offline verfügbar: App-Oberfläche, Produktkatalog, Wissensbibliothek (verschlüsselt), Produktbilder und Nährwerttabellen (691, verschlüsselt), Produkt- und Detailkarten, „Inhaltsstoffe erklärt“.
- Speicher: „atlas-app-<Version>“ (nur die App-Datei der aktuellen Version), „atlas-daten-v1“ (je eine Kopie von Katalog, Bild-Verzeichnis, Wissensbibliothek, Bild-Zuordnung), „atlas-bilder-v1“ (Bilder mit Schlüssel-Kennung). Die bisherige zweite Katalogkopie im Gerätespeicher (localStorage) entfällt, wenn der Service Worker aktiv ist.
- Sichere Aktualisierung: Neue App-Version wird erst komplett geladen und geprüft (richtige Version, vollständige Datei), dann umgeschaltet und die alte gelöscht; bricht der Download ab, bleibt die alte Offline-Version. Katalog/Bibliothek/Bild-Verzeichnis werden nur gespeichert, wenn sie vollständig lesbar sind. Neue Bilder werden erst übernommen und Veraltetes erst gelöscht, wenn alle Bilder geladen sind.
- Anzeige oben beim Start: online/offline, Fortschritt beim ersten Download („… von 691 Bildern“), Abschluss „Offline-Daten vollständig ✓“, Hinweis bei fehlenden oder von iOS freigegebenen Daten mit Knopf „Neu laden“ (nur mit Internet). In den Einstellungen: Zeile „Offline-Start“ mit Details und Knopf „Offline-Daten neu laden“. Atlas bittet iOS, den Speicher dauerhaft zu behalten.
- Offline gesprochen oder getippt: Atlas fragt nicht Claude, sondern sagt ehrlich, dass er offline ist, und zeigt bei Produktfragen passende Produkte aus dem lokalen Katalog (antippbar).
- Online bleiben: Gespräche mit Claude, Nährwerttabelle vorlesen lassen, Bestellseiten, Update-Prüfung, Katalog-/Bild-Aktualisierung, Spracherkennung (je nach iOS über Apple-Server). Rückfall: /alt/2.24/.

## 2.24 (14.11.2026) – Karte antippbar nach der Antwort, Inhaltsstoffe erklärt, Nährwerttabellen offline
- Ursache „Antippen geht nicht“: Die Produktkarte verschwand 1,2 s nach dem Ende der Antwort – zum Antippen blieb keine Zeit. Jetzt bleibt sie 30 s stehen (neue Frage räumt sie nach 4 s weg, offene Detailkarte hält sie).
- Ursache „kein Bild“ bei deinen eigenen Mitteln: Karten aus deiner Liste/Wissensbibliothek hatten kein Katalogprodukt, daher Platzhalter und nicht antippbar. Jetzt öffnet auch diese Karte eine Detailkarte (Inhalt, Wofür, Studienlage, Risiken, Quellen). Mit Katalogprodukt verknüpft ist bisher nur Omega-3 (Norsan Vegan EPA Kapseln).
- Detailkarte: neuer Abschnitt „Inhaltsstoffe erklärt“ (z. B. Omega-3, EPA, DPA, DHA, Algenöl, Kapselhülle, Antioxidationsmittel) mit der Menge aus dem Herstellertext; allgemeine Erklärung, keine Dosierempfehlung. Bei verknüpften Produkten zusätzlich „Aus deiner Wissensbibliothek“.
- Nährwerttabellen von Norsan (26) und edubily (110) – beim Hersteller nur als Bild – werden jetzt verschlüsselt offline gespeichert und in der Detailkarte gezeigt (antippen = groß).
- Neues Werkzeug naehrwerttabelle_lesen: Atlas kann die Tabelle bei Fragen nach Inhaltsstoffen selbst ablesen (über den bestehenden Claude-Zugang, kein neuer Dienst) und nennt die Werte „laut Nährwerttabelle des Herstellers“.
- iPhone: Detailkarte einspaltig. Getestet im Browser mit Touch-Bedienung auf iPad hoch/quer und iPhone hoch. Rückfall: /alt/2.23.1/.

## 2.23.1 (14.11.2026) – dein Omega-3 fest verknüpft
- Listeneintrag Omega-3 ist jetzt fest mit dem Katalogprodukt Norsan Omega-3 Vegan EPA Kapseln verknüpft (verschlüsselte Wissensbibliothek). Die Karte zeigt dazu Bild, Name und Marke; Antippen öffnet die Detailkarte.
- Wissensbibliothek nennt die Herstellerangabe (4 Kapseln = 1.700 mg Omega-3, davon 920 mg EPA, 628 mg DHA). Deine gespeicherte Routine/Einnahme bleibt unverändert. Rückfall: /alt/2.23/.

## 2.23 (14.11.2026) – Norsan und edubily im Katalog, Produktauswahl über alle Marken, Detailkarte
- Katalog um Norsan (inkl. NÀDARRA-Vitamin-D über den Norsan-Shop) und edubily erweitert, gleiches Datenformat. Quellen: norsan.de Shop-Schnittstelle (wc/store/v1), edubily.de products.json + Produktseiten (Fragen & Antworten). Neu: tools/katalog-marken.mjs.
- Stand des Laufs: Biogena 299 (254 Nahrungsergänzungen, alle vollständig), MoleQlar 104 (74 Nahrungsergänzungen, 64 vollständig, 10 teilweise), Norsan 117 Einträge → 33 aufgenommen (19 Nahrungsergänzungen, alle teilweise erfasst), edubily 133 → 119 aufgenommen (68 Nahrungsergänzungen, alle teilweise erfasst). Biogena: 24 Produkte nicht mehr im Shop-Verzeichnis (Hunde-Produkte, Minis, Gutscheine) und daher entfernt.
- Nicht aufgenommen (keine Doppelten): Norsan-Abos, 3er-Packs, Info-/Fachmaterial, Bücher, Kurs, Gratisartikel; edubily-Proben, E-Books/Kurse, Gutscheine.
- Varianten mit anderer Zusammensetzung als eigene Produkte: Norsan Omega-3 Arktis mit/ohne Vitamin D3, Omega-3 Total Öl Zitrone/Naturell, edubily Das Multi mit/ohne Iod, Vitamin A Kapseln/Tropfen. Packungsgrößen/Geschmäcker bleiben ein Produkt (Varianten mit Preis aufgelistet).
- Nichts geschätzt: Die Nährwerttabelle steht bei Norsan und edubily nur als Bild – Feld bleibt „unbekannt“ mit Grund. edubily zeigt auch die Zutaten nur als Bild. Mengen nur, wo sie wörtlich im Text stehen (z. B. „Eine Tagesdosis enthält 1.700 mg Omega-3 …“).
- Jedes Produkt hat eine feste ID im Katalog (b-/m-/n-/d-); Bilder der neuen Marken verschlüsselt offline wie bisher.
- Produktauswahl: Ohne Markenwunsch liefert die Suche die besten Treffer jeder Marke; Atlas ordnet nach Eignung für die Frage anhand der gespeicherten Daten (Menge pro Tagesdosis, Form, Zutaten, Packung, Preis), nennt fehlende Angaben und behauptet nie „die beste Marke“.
- Mehrere Produkte erscheinen als Liste in der bestehenden Karte (Bild, Name, Marke; max. 4). Karte bzw. Zeile antippen → Detailkarte des lokalen Katalogeintrags (Bild, Name, Marke, alle gespeicherten Angaben, „unbekannt – Grund“), auch offline. „Zur Bestellseite“ nur mit gültigem Link und Internet.
- Spracherkennung: „Nor San“ → Norsan, „Edu Billy“ → edubily. Sonst unverändert (Oberfläche, Ring, Farben, Sprachausgabe, Bewegungserkennung). Rückfall: /alt/2.22/.

## 2.21 / 2.22 (13.11.2026) – Produktbilder offline, Selbsttest, eigene Liste
- Produktbilder offline: GitHub lädt das Hauptbild jedes Katalogprodukts (derzeit 427/427, 9,5 MB) und legt es verschlüsselt unter katalog/bilder/ ab (AES-256-GCM, Schlüssel mit RSA-OAEP verpackt; öffentlicher Teil tools/bilder-public.pem). Der private Schlüssel steckt in der verschlüsselten Wissensbibliothek (kb.enc) – kein neuer Einrichtungscode nötig. Läuft bei jedem Katalog-Lauf mit (nur neue/geänderte Bilder).
- Atlas holt alle Bilder einmal (mit Internet) in den Gerätespeicher und zeigt sie danach ohne Netz; Hersteller-Server werden dafür nicht mehr gebraucht. Einstellungen: „Produktbilder offline gespeichert: X von Y“.
- Selbsttest: „Teste die Produktkarte“ zeigt ohne Claude nacheinander Biogena Omega 3 forte 700 und MoleQlar Omega 3 Kapseln Vegan.
- Produkte aus deiner Liste/Wissensbibliothek bekommen ebenfalls eine Karte (ID l-…, ausgewählt über wissen_nachschlagen; Platzhalter, solange kein eindeutiges Bild).
- Diagnose zeigt jetzt genau: „karte: bild aus Gerätespeicher“, „… online“, „platzhalter (kein Bild hinterlegt)“, „bild laden fehlgeschlagen“.
- Rückfall: /alt/2.20/ (inkl. alter kb.enc).

## 2.20 (13.11.2026) – Produktkarte folgt dem ausgewählten Katalogprodukt
Ursache: Die Karte war nicht mit der Produktauswahl verbunden. Sie versuchte, das Produkt aus dem gesprochenen Text zu erraten, und fand nur etwas, wenn der vollständige Katalogname wörtlich fiel („Omega 3 forte 700 von Biogena“). Natürliche Formulierungen („das Forte 700“, „die veganen Kapseln von MoleQlar“, „das MoleQlar Omega 3 mit EPAX“) ergaben keine Karte – im Projekt nachgeprüft.
Änderungen:
- Jedes Katalogprodukt hat eine feste ID aus seiner Produktseite (b-… Biogena, m-… MoleQlar, e-… eigener Eintrag); katalog_suchen liefert sie mit.
- Atlas setzt im Antworttext vor das erklärte Produkt die Marke {{id}} (bei Wechsel die nächste, {{ende}} beim Themenwechsel). Die Marke wird aus Sprache und Protokoll entfernt und an genau den Satz gehängt, der sie enthält; beim Sprechen dieses Satzes erscheint die Karte dieses Produkts (Bild, Name, Hersteller).
- Rückfall ohne Marke: hat die Katalogsuche dieser Antwort genau ein Produkt eindeutig getroffen, gilt dieses.
- Kein Raten mehr aus dem Text: ohne ausgewähltes Katalogprodukt keine Karte; erfundene IDs werden ignoriert (Diagnose „karte: unbekannte id“).
- Bild nur vom Hauptbild genau dieses Produkts, sonst Platzhalter; Laden im Hintergrund, offline aus dem Gerätespeicher.
- Rückfall: /alt/2.19/.

## 2.19 (13.11.2026) – Produktkarte verfeinert
- Firma im Satz zählt: „… von Biogena“ / „… von MoleQlar“ + Supplement → genau ein passendes Produkt dieser Firma, sonst keine Karte (nie raten, nie das eigene Produkt einer anderen Firma einsetzen). Wechsel zu einem Produkt einer anderen Firma aktualisiert die Karte.
- Themenwechsel: zwei Sätze ohne Produkt → Karte verschwindet, auch wenn Atlas weiterspricht.
- Karte erscheint sofort mit Name und Firma; das Bild wird im Hintergrund geladen und eingesetzt (Sprachausgabe startet ohne Wartezeit).
- Eigene Liste: Titel ist dein Produktname (z. B. „Omega-3 Norsan vegan“, „aus deiner Liste“). Eigene Katalog-Einträge werden ebenfalls erkannt.
- Sonst unverändert (Farben, Animationen, Sprachausgabe, Bewegungserkennung). Rückfall: /alt/2.18/.

## 2.18 (12.11.2026) – Kreis statt Flamme, Supplement-Karte fest am Katalog
- Mitte: Flamme vollständig entfernt (gehörte zu einer Kaffeemaschine). Stattdessen ein schlichter Kreis mit drei Bogensegmenten und gegenläufigem Innenbogen: Ruhe dreht langsam (ca. 40 s/Runde), Zuhören etwas zügiger, Sprechen hell, pulsiert mit der Stimme und dreht schneller, Ruhemodus fast still. Farben/Supernova unverändert.
- Katalog: für alle 403 Produkte die Adresse des Hauptbilds der jeweiligen Produktseite (nur Adresse, keine Bilddatei im Repo).
- Karte: hat Atlas im Katalog gesucht, gilt genau das gefundene Produkt (z. B. „Omega 3 forte 700“, Biogena) – auch wenn er danach nur „Omega-3“ sagt. Mehrere passende Treffer → keine Karte statt Raten. Ohne Katalogsuche: Eintrag aus deiner Liste/Bibliothek (z. B. dein Norsan Omega-3) mit Platzhalter.
- Bild: 1) feste Zuordnung produktbilder/zuordnung.json, 2) Hauptbild genau dieser Katalog-Produktseite. Beim ersten Anzeigen auf dem Gerät gespeichert, danach offline verfügbar (wenn der Bildserver das erlaubt). Diagnose: „karte:bild“ / „karte:platzhalter“.
- Rückfall: /alt/2.17.1/.

## 2.17.1 (12.11.2026) – Einstellungen werden wieder vollständig gespeichert
- Fehler seit 2.5: In der Speichern-Funktion stand ein Kommentar so, dass der Rest der Zeile nicht ausgeführt wurde. Dadurch wurden Kugel, Effekt, Farbstimmung, Stimme, Sprechtempo, Begrüßungsabstand, Empfindlichkeit und Sperrzeit beim Speichern nicht übernommen (die Auswahl wirkte nur bis zum Neustart).
- Behoben; geprüft: Farbstimmung (auch Supernova und eigene Farbe), Kugel, Tempo, Empfindlichkeit bleiben nach Neustart erhalten.
- Rückfall: /alt/2.17/.

## 2.17 (12.11.2026) – Farbmodus „Supernova (bunt)“, Supplement-Karte
- Neuer Farbmodus „Supernova (bunt)“: Blau, Türkis, Violett, Magenta und Gold gehen weich ineinander über (Farbverlauf rund um den Ring, wandert langsam; Zentrum wechselt ca. alle 80 s den Ton). Bereit: ruhig · Zuhören: klarer, heller · Denken: einzelne bunte Lichtpunkte tauchen sanft auf · Sprechen: Ring pulsiert, Lichtimpuls, bunte Supernova. Alle bisherigen Farbmodi bleiben wählbar.
- Supplement-Karte: Erwähnt Atlas beim Sprechen ein konkretes Supplement, erscheint eine kleine Karte mit Name, Herkunft (Hersteller, „aus deiner Liste“ oder Wissensbibliothek) und Bild bzw. neutraler Platzhaltergrafik. Wechselt mit dem Thema (mind. 2,5 s Anzeige), verschwindet ca. 1 s nach dem Sprechen. Quer: links neben der Kugel; hochkant/Handy: oben mittig. Verdeckt weder Kugel noch Knöpfe.
- Erkennung pro Satz: exakter Produktname aus dem Herstellerkatalog (eindeutig, mind. zwei Wörter) oder genau ein Eintrag der Wissensbibliothek; Aufzählungen mehrerer Supplements lösen keine Karte aus.
- Bilder: nur über produktbilder/zuordnung.json mit exaktem Schlüssel (kat:<Produkt-URL> oder kb:<Bibliotheks-ID>); werden auf dem Gerät zwischengespeichert (offline verfügbar). Derzeit noch keine Bilder hinterlegt → Platzhalter.
- Rückfall: /alt/2.16/.

## 2.16 (12.11.2026) – Begrüßungstext, ausreden lassen, Farbschemata
- Begrüßung bei Bewegung: „Hallo, ich bin Atlas. Wer ist gerade im Raum und wobei kann ich helfen?“ (Ablauf, Sperrzeit und Erkennung unverändert).
- Ausreden lassen – Ursachen: (1) Die Spracherkennung wurde während der Sprachausgabe neu gestartet; iOS schaltet dabei die Audio-Sitzung um und schneidet die Stimme ab. (2) Eine Notbremse nach geschätzter Dauer beendete langsame Ausgaben vorzeitig. (3) Seit 2.10 konnten drei „fremde“ Wörter (oft falsch erkanntes Echo der eigenen Stimme) die Ausgabe abbrechen.
- Jetzt: kein Erkennungs-Neustart während Atlas spricht (wird danach nachgeholt); „fertig“ erst, wenn die Audioausgabe wirklich still ist; von außen abgebrochene Sätze werden einmal neu gesprochen; Unterbrechen nur noch mit „Stopp“/„hör auf“/„sei still“ oder einer neuen Ansprache mit Namen („Atlas, …“). Danach kurze Bestätigung („Okay, ich hör zu.“ bzw. „Ja?“) und Zuhören.
- Farben: neue Schemata Smaragd, Bernstein, Rosé, Eisweiß und „Eigene Farbe“ mit Farbwähler (Einstellungen → Farbstimmung). Wirkt auf Ring, Zentrum, Lichtimpuls, Hintergrund-Schimmer, Knöpfe und Statuszeile; gespeichert in den Einstellungen.
- Rückfall: /alt/2.15/.

## 2.15 (12.11.2026) – Gespräch beginnt von selbst bei Bewegung, mehr Wortschatz
Ursachen:
- Die Kamera startete erst nach dem ersten Antippen bzw. „Raum-Modus“ – nach jedem Öffnen war Atlas „blind“.
- Begrüßt wurde nur beim Aufwachen aus dem Schlaf (nach 20 min) oder bei der allerersten Bewegung; kam jemand nach kürzerer Pause wieder in den Raum, passierte nichts.
- Bildrauschen, Lampenflimmern und Belichtungsnachregelung konnten Treffer erzeugen.
Änderungen:
- Kamera startet beim Öffnen automatisch, wenn sie schon freigegeben ist (keine Nachfrage). Bewusst ausgeschalteter Raum-Modus bleibt aus.
- Gespräch beginnt von selbst, wenn jemand nach mind. 3 min ohne Bewegung und ohne Aktivität den Raum betritt (ca. 1,5 s deutliche Bewegung), sowie beim Aufwachen. Danach 2 min Sperrzeit; während Gespräch, Zuhören, Denken, Sprechen nie.
- Erkennung robuster: Helligkeit pro Bildzeile ausgeglichen (Flimmern, Nachregeln), nur zusammenhängende Veränderungen zählen (Rauschen fällt weg), Lichtsprünge wie bisher verworfen.
- Kamera-Hinweise je Ursache (nicht freigegeben / keine Kamera / belegt / kein https) mit Begründung und Freigabe-Weg für iPad und Laptop; Atlas bleibt per Antippen und „Atlas“ bedienbar.
- Browser erlaubt Ton erst nach einem Tipp: Statuszeile bittet darum, der nächste Tipp holt die Begrüßung hörbar nach.
- Wortschatz: mehr Varianten für Begrüßung, Dank, Bestätigung, Abschied; Hinweis auf situativen Humor; Atlas bekommt seine letzten Antwort-Einstiege mit, um nicht gleich anzufangen.
- Oberfläche unverändert. Rückfall: /alt/2.14/.

## 2.14 (12.11.2026) – Ringkern: Ruhebewegung, Lichtimpuls, Supernova
- Ruhezustand: drei sanfte Lichtbögen und eine feine Skala kreisen langsam gegeneinander (ca. 90 bzw. 140 s pro Runde), dazu das langsame Atmen. Im Ruhemodus (Schlaf) steht alles nahezu still.
- Sprechen: äußerer Ring deutlich heller; ein türkis-weißer Lichtpunkt mit kurzem Schweif gleitet um den Ring (ca. 1,8 s pro Runde, bei lauter Stimme etwas schneller); dahinter Supernova: kleine Lichtpunkte erscheinen, strahlen nach außen und vergehen (max. 48, Türkis/Weiß).
- Einsetzen sofort und weich; nach dem Sprechen verschwindet der Impuls in ca. 0,3 s, Punkte verglimmen in ≤1,5 s. Beim Zuhören kein Impuls, keine Supernova.
- Bewegung reduzieren: statt Impuls ein ruhig leuchtender Ring, keine Supernova, Kreisbewegung auf ca. 30 %.
- Grundgestalt (DESIGN.md) unverändert. Rückfall: /alt/2.13/.

## 2.13 (11.11.2026) – Feste Grundgestalt „Ringkern“
- Neue, ab jetzt feste visuelle Grundlage (siehe DESIGN.md): dunkler Hintergrund, leuchtendes rundes Zentrum mit dunkler Flamme, klar erkennbarer äußerer Ring. Türkis-Cyan als Grundfarbe.
- Zustände: Bereit (schwach, atmet langsam) · Zuhören (Ring heller, zwei dezente Lichtwellen) · Denken (Licht wandert langsam im Zentrum, Ring ruhig) · Sprechen (Ring pulsiert sanft mit geglätteter Stimm-Energie) · Ruhe (deutlich dunkler, nahezu statisch). Reduzierte Bewegung berücksichtigt.
- Emblem in der Mitte austauschbar (EMBLEMS / vis.emblem / vis.emblemImg), ohne die Oberfläche umzubauen.
- Farbstimmungen: Türkis (Standard), Blau, Violett, Nordlicht (weich mehrfarbig). Oberfläche in Türkis.
- Ringkern einmalig aktiviert; frühere Kugeln bleiben in den Einstellungen wählbar. Keine Funktionen geändert.
- Rückfall: /alt/2.12/.

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
