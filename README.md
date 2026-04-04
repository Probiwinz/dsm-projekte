# 🌊 Projekte der Deutschen Stiftung Meeresschutz

Eine interaktive Website, die sechs weltweite Meeresschutzprojekte der [Deutschen Stiftung Meeresschutz (DSM)](https://www.stiftung-meeresschutz.org) vorstellt.

> **Hinweis:** Dies ist ein Schulprojekt. Alle Informationen basieren auf der offiziellen Website der Deutschen Stiftung Meeresschutz.

## Inhalt

- [Überblick](#überblick)
- [Vorgestellte Projekte](#vorgestellte-projekte)
- [Funktionen](#funktionen)
- [Technologien](#technologien)
- [Projektstruktur](#projektstruktur)
- [Lokale Entwicklung](#lokale-entwicklung)
- [Quellen](#quellen)
- [Lizenz](#lizenz)

## Überblick

Die Deutsche Stiftung Meeresschutz (DSM) wurde 2007 als gemeinnützige Stiftung gegründet und fördert weltweit Projekte zum Schutz der Meere und ihrer Bewohner. Diese Website stellt sechs aktuelle Projekte übersichtlich vor – inklusive interaktiver Weltkarte, eingebetteten Videos und einem Zeitstrahl der Projektstarts.

## Vorgestellte Projekte

| # | Projekt | Standort | Partner | Seit |
|---|---------|----------|---------|------|
| 01 | Meeresschutzgebiet Kvarner Bucht | Nordadria, Kroatien | MareMundi | 2024 |
| 02 | Meeresschutz im Mittelmeer (Project Manaia) | Mittelmeer (IT, GR, MT) | Project Manaia | 2022 |
| 03 | Schildkrötenschutz auf Boa Vista | Kapverden | Turtle Foundation | Sept. 2022 |
| 04 | Rückkehr der Mittelmeer-Mönchsrobben | Israel, Mittelmeerküste | Delphis (Ashdod) | Aug. 2023 |
| 05 | Korallenrestauration in der Bandasee | Banda-Inseln, Indonesien | BandaSEA & Luminocean | 2022–2025 |
| 06 | Seltene Rochen der Fidschi-Inseln | Fidschi (Viti Levu, Drawaqa) | Dr. Kerstin Glaus | 2024 |

## Funktionen

- **Interaktive Weltkarte** – Leaflet.js-Karte mit animierten Markern für jeden Projektstandort
- **Projektkarten** – Detaillierte Beschreibungen mit Steckbriefen und eingebetteten YouTube-Videos
- **Querschnittsanalyse** – Visualisierung des gemeinsamen Dreischritts aller Projekte (Daten → Schutz → Einbindung)
- **Zeitstrahl** – Chronologischer Überblick der Projektstarts (2022–2024)
- **Responsive Design** – Optimiert für Desktop und mobile Geräte
- **Animationen** – Scroll-Animationen, Partikel-Effekte und sanfte Übergänge
- **Quellenverzeichnis** – Vollständige Quellenangaben mit Links zur offiziellen DSM-Website

## Technologien

| Technologie | Einsatz |
|-------------|---------|
| HTML5 | Seitenstruktur und Semantik |
| CSS3 | Styling, Animationen, Responsive Layout |
| JavaScript (Vanilla) | Interaktivität, Kartensteuerung, Scroll-Effekte |
| [Leaflet.js](https://leafletjs.com/) (v1.9.4) | Interaktive Weltkarte mit OpenStreetMap-Kacheln |
| [Google Fonts](https://fonts.google.com/) | Schriftarten (DM Serif Display, Outfit) |

## Projektstruktur

```
dsm-projekte/
├── index.html   # Hauptseite mit allen Inhalten und Sektionen
├── styles.css   # Komplettes Stylesheet (Layout, Animationen, Responsive)
├── main.js      # JavaScript (Karte, Animationen, Interaktionen)
└── README.md    # Diese Datei
```

## Lokale Entwicklung

Da es sich um eine rein statische Website ohne Build-Prozess handelt, kann die Seite direkt im Browser geöffnet werden:

1. Repository klonen:
   ```bash
   git clone https://github.com/Probiwinz/dsm-projekte.git
   cd dsm-projekte
   ```

2. `index.html` im Browser öffnen – oder einen lokalen Server starten:
   ```bash
   # Mit Python
   python3 -m http.server 8000

   # Mit Node.js (npx)
   npx serve .
   ```

3. Im Browser aufrufen: [http://localhost:8000](http://localhost:8000)

> **Hinweis:** Für die interaktive Karte wird eine Internetverbindung benötigt (Leaflet.js und OpenStreetMap-Kacheln werden extern geladen).

## Quellen

Alle Projektinformationen stammen von der offiziellen Website der Deutschen Stiftung Meeresschutz:

- [Meeresschutzgebiet Kvarner Bucht](https://www.stiftung-meeresschutz.org/foerderung/adria-mittelmeer/fuer-ein-meeresschutzgebiet-in-der-kvarner-bucht/)
- [Project Manaia (Mittelmeer)](https://www.stiftung-meeresschutz.org/foerderung/adria-mittelmeer/seegraswiesen-ocean-cleanup-citizen-science-mit-project-manaia/)
- [Schildkrötenschutz auf Boa Vista](https://www.stiftung-meeresschutz.org/projekte/meeresschildkroeten/meeresschildkroeten-schutzprojekt-auf-boa-vista/)
- [Mönchsrobben in Israel](https://www.stiftung-meeresschutz.org/projekte/meeressaeuger/projekt-fuer-moenchsrobben-in-israel/)
- [Korallenrestauration in der Bandasee](https://www.stiftung-meeresschutz.org/projekte/korallenriffe/korallenrestauration-in-der-bandasee/)
- [Rochen der Fidschi-Inseln](https://www.stiftung-meeresschutz.org/projekte/rochen/seltene-und-unbekannte-rochen-der-fidschi-inseln/)
- [DSM Leitbild](https://www.stiftung-meeresschutz.org/leitbild/)
- [Jahresrückblick 2024 (PDF)](https://www.stiftung-meeresschutz.org/wp-content/uploads/pdf/jahresrueckblick-2024-deutsche-stiftung-meeresschutz_doppelseitig.pdf)

## Lizenz

© 2025 – Schulprojekt – Made with ❤️ by [Probiwinz](https://github.com/Probiwinz)
