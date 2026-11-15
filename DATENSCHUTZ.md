# Atlas – Sicherheit & Datenschutz (Stand 2.27, 15.11.2026)

Ermittelt aus dem Programmcode (jede Netzverbindung, jeder Speicherort) und mit einem automatischen Test, der jede Verbindung mitschreibt.
Getestet im Browser mit nachgestelltem iPad/iPhone – nicht auf echter iOS-Hardware.

## 1. Was läuft lokal auf dem iPad
| Funktion | Wo | Speicherort |
|---|---|---|
| App-Oberfläche (eine Datei, Schriften eingebettet) | lokal, Offline-Kopie im Service Worker | Cache „atlas-app-<Version>“ |
| Produktkatalog (öffentliche Herstellerdaten) | lokal | Cache „atlas-daten-v1“, unverschlüsselt (öffentlich) |
| Produktbilder + Nährwerttabellen (691) | lokal | Cache „atlas-bilder-v1“, AES-GCM verschlüsselt |
| Wissensbibliothek | lokal | `kb.enc` (verschlüsselt) + entschlüsselte Kopie im verschlüsselten Gerätespeicher |
| Einstellungen, API-Schlüssel, Personen, Routinen, Supplements, Tagesstatus, Verlauf, Diagnose | lokal | localStorage, **AES-256-GCM verschlüsselt** (ab 2.26), Schlüssel nicht exportierbar in IndexedDB „atlas-schutz“ |
| Gesprächsprotokolle, Notizen, Kalender-Verbindung | lokal | zusätzlich im **Tresor** (RSA/AES, nur mit Mario's Code lesbar) |
| Raum-Sitzungen + Tagesprotokoll (ab 2.27) | lokal | verschlüsselter Gerätespeicher: Datum, Eintritt, Austritt, Dauer, Modus, Name nur bei eingewilligter Person – keine Bilder, kein Ton; Löschfrist 7/30/90 Tage |
| Kamera-Bewegungserkennung | lokal | 48×36 Graustufen-Pixel pro Bild im Arbeitsspeicher, nichts wird gespeichert oder gesendet |
| Sprachausgabe | lokal (iOS-Stimme) | – (Status zeigt, ob die gewählte Stimme lokal ist) |
| Produktkarten, Detailkarten, „Inhaltsstoffe erklärt“, Offline-Antworten mit Katalogtreffern | lokal | – |

## 2. Was das iPad verlässt (vollständige Liste aus dem Code)
| Funktion | Daten | Anbieter | Speicherung dort | Im Privatmodus |
|---|---|---|---|---|
| Gespräch/Antworten (`api.anthropic.com`) | Text der Frage, letzte Gesprächsrunden, Profil-/Routine-/Listeninfos aus dem Systemtext, Suchtreffer aus Katalog/Bibliothek, ggf. Nährwerttabellen-Bild, Kalender/Mails beim Briefing | Anthropic (Claude API) | API-Ein-/Ausgaben werden laut Anthropic innerhalb von 30 Tagen gelöscht; länger bei Richtlinienverstößen (bis 2 Jahre), gesetzlichen Pflichten | gesperrt |
| Websuche (Studien-Update) | Suchbegriffe | Anthropic (Server-Werkzeug web_search) | wie oben | gesperrt |
| Spracherkennung (Safari Web Speech) | Sprache als Ton | Apple (Siri/Diktat) – lokal nur, wenn iOS ein Sprachpaket anbietet (Atlas nutzt dann `processLocally`) | laut Apple ohne „Siri & Diktat verbessern“ keine Audio-Speicherung; Anfrageverlauf bis 2 Jahre mit wechselnder Zufallskennung | Mikrofon aus |
| Kalender/Mails (Briefing) | Geheimwort hin, Termine/Mails zurück | Google (Marios Apps-Script) | in Marios Google-Konto | gesperrt |
| Benachrichtigung (Abwesenheit) | Meldetext | Google (Marios Apps-Script → Mail) | in Marios Google-Konto | gesperrt |
| App-Dateien, Katalog, Bilder, Update-Prüfung | nur Dateiabruf (IP-Adresse), keine persönlichen Inhalte | GitHub Pages (Microsoft) | Server-Protokolle | gesperrt (nur iOS prüft beim Öffnen evtl. die Datei `sw.js`) |
| Herstellerbild als Ersatz (nur wenn nicht im Gerät) | Bildabruf | Biogena, MoleQlar, Norsan, edubily | Server-Protokolle | gesperrt |
| Schriften | **entfällt ab 2.26** (vorher Google Fonts bei jedem Start) | – | – | – |

Kamera-, Bild-, Personen- und Protokolldaten verlassen das Gerät nie (Test 2.27: keine Verbindung nach außen während Sitzungen, Urlaubsmodus und Protokoll). Einzige Ausnahme auf Wunsch: Export des Protokolls als Textdatei, die du selbst speicherst.

Nicht vorhanden (im Code geprüft): Tracker, Werbung, Analyse-Werkzeuge, Fernzugriff, eigener Server, offene Netzwerkdienste, Audio-Aufnahme (kein MediaRecorder), Video-/Bildaufnahme, Versand von Kamerabildern.

Test 2.26 (mitgeschriebene Verbindungen): Normalbetrieb → nur `api.anthropic.com` bei einer Frage. Cloud-KI aus → keine Verbindung nach außen. Privatmodus inkl. Neustart, Katalogsuche, Detailkarte, Sprech- und Kameraversuch → **keine Verbindung nach außen**, einzig der Abruf `sw.js` durch den Browser selbst.

## 3. Schalter in Atlas (ab 2.26)
- Leiste oben: Kamera · Mikrofon · Internet · Cloud-KI · Privatmodus (rot pulsierend = Kamera/Mikrofon gerade aktiv).
- 🛡 öffnet „Datenschutzstatus“ (erscheint auch beim Start; abschaltbar).
- Privatmodus: Kamera aus, Mikrofon aus, keine Cloud, keine Updates/Downloads; App kommt aus dem Gerätespeicher.
- Mikrofon nur während aktivem Zuhören (nach Antippen oder Begrüßung). Dauerhaftes Hören auf „Atlas“ nur, wenn ausdrücklich eingeschaltet.
- „Spracherkennung nur lokal“, „Updates nur nach Bestätigung“.
- „Alle Atlas-Daten löschen“ (zweimal tippen): löscht nur Atlas-Daten, andere Apps bleiben.

## 4. Offene Punkte / Grenzen (ehrlich)
1. **Gleiche Web-Adresse wie Marios andere Apps** (`marioschiller03532-jpg.github.io`): Alle dort laufenden Apps teilen sich den Browser-Speicher. Verschlüsselung schützt vor Auslesen außerhalb des Browsers, aber eine andere eigene App auf derselben Adresse könnte den Geräteschlüssel benutzen. Lösung: Atlas auf eine eigene Adresse legen (eigene Domain/Subdomain oder eigenes GitHub-Konto nur für Atlas) – braucht Marios Entscheidung.
2. **Apps-Script (Kalender/Mails)** ist eine von außen erreichbare Adresse, geschützt nur durch das Geheimwort. Wenn nicht gebraucht: im Google-Konto deaktivieren.
3. **Automatische Updates** kommen von GitHub. Wer Marios GitHub-Konto kontrolliert, kann Code ausliefern → Zwei-Faktor-Anmeldung bei GitHub, für das Büro-iPad „Updates nur nach Bestätigung“.
4. **API-Schlüssel** liegt (verschlüsselt) im Gerät und wird direkt an Anthropic gesendet – eigenes Ausgabenlimit in der Anthropic-Konsole setzen.
5. **iCloud:** Atlas synchronisiert nichts mit iCloud. Ob iOS den Browser-Speicher in ein iCloud-Geräte-Backup aufnimmt, lässt sich aus einer Web-App nicht steuern – für das Büro-iPad iCloud-Backup ausschalten, wenn das ausgeschlossen sein soll.
6. **Spracherkennung:** Ob Safari lokal erkennt, entscheidet iOS. Atlas zeigt es an, wenn iOS es verrät; sonst „nicht prüfbar“.
7. **iOS-Zugriffsschutz:** Web-App-Daten liegen im Safari-Bereich des iPads, andere Apps (außerhalb von Safari) kommen nicht heran; die iPad-Gerätesperre (Code) verschlüsselt zusätzlich.

## 5. Empfehlungen für das Büro-iPad
- Gerätecode + Auto-Sperre; „Geführter Zugriff“ (Bedienungshilfen), damit nur Atlas läuft.
- Siri → „Siri & Diktat verbessern“ aus; Einstellungen → Allgemein → Tastatur: prüfen, ob Diktat lokal verarbeitet wird.
- iCloud-Backup für dieses iPad aus (optional, siehe 4.5).
- In Atlas: „Updates nur nach Bestätigung“ an; „Auf Zuruf hören“ aus.

Quellen: https://privacy.claude.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data · https://www.apple.com/legal/privacy/data/en/ask-siri-dictation/ · https://developer.mozilla.org/docs/Web/API/SpeechRecognition/processLocally
