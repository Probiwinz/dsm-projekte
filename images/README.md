# Website Bilder – DSM Projektwebsite
## Codex-Implementierungsanleitung

Dieses Verzeichnis enthält alle Bilder für die Index-Seite der
Deutschen Stiftung Meeresschutz (DSM). Jedes Unterverzeichnis
entspricht einem Projektkarten-Abschnitt in `index.html`.

---

## Ordnerstruktur

```
Website Bilder/
├── kvarner/          → Projekt #kvarner  (5 Bilder)
├── manaia/           → Projekt #manaia   (4 Bilder)
├── boa-vista/        → Projekt #boa-vista (3 Bilder)
├── israel/           → Projekt #israel   (6 Bilder)
├── bandasee/         → Projekt #banda    (6 Bilder)
├── fidschi/          → Projekt #fidschi  (7 Bilder)
├── untertitel.txt    → Bilduntertitel + Copyright-Angaben
└── README.md         → Diese Datei
```

---

## HTML-Einfügelogik

### Einfügepunkt in jeder Projektkarte

In `index.html` hat jede Projektkarte folgende Struktur:

```html
<div class="project-card has-embedded-video" id="[projekt-id]">
  <div class="project-visual pv-[1-6]"> ... </div>
  <div class="project-content">
    <div class="project-infobox"> ... </div>
    <!-- ↓ HIER die .project-gallery einfügen ↓ -->
  </div>
</div>
```

### Galerie-HTML-Snippet (für jede Karte anpassen)

```html
<div class="project-gallery">
  <figure>
    <img src="Website Bilder/kvarner/schnorchler-kvarner-luftbild.jpg"
         alt="Schnorchler in der Kvarner Bucht – Luftbild" loading="lazy">
    <figcaption>Schnorchler in der Kvarner Bucht. © Helmut Wipplinger</figcaption>
  </figure>
  <figure>
    <img src="Website Bilder/kvarner/drache-zeus-faber.jpg"
         alt="Petersfisch (Zeus faber) in der Kvarner Bucht" loading="lazy">
    <figcaption>Petersfisch in der Kvarner Bucht. © Nikolas Linke</figcaption>
  </figure>
  <!-- weitere <figure>-Elemente nach Bedarf -->
</div>
```

### CSS (einmalig in `<style>` oder externe CSS-Datei hinzufügen)

```css
.project-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 0.6rem;
  margin-top: 1.4rem;
}
.project-gallery figure {
  margin: 0;
  overflow: hidden;
  border-radius: 6px;
}
.project-gallery figure img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}
.project-gallery figure img:hover {
  transform: scale(1.05);
}
.project-gallery figcaption {
  font-size: 0.72rem;
  color: var(--ocean-deep);
  padding: 0.25rem 0.3rem;
  line-height: 1.3;
}
```

---

## Bildzuordnung pro Projekt

### #kvarner – Meeresschutzgebiet Kvarner Bucht (Kroatien)
| Datei | Beschreibung |
|---|---|
| `besiedlungsstrukturen-kvarner-bucht.jpg` | Stakeholder-Meeting, Planung MPA |
| `drache-zeus-faber.jpg` | Petersfisch (Zeus faber) © Nikolas Linke |
| `grosse-tuemmler-mutter-kalb.jpg` | Großer Tümmler „Veseljak" |
| `schnorchler-kvarner-luftbild.jpg` | Schnorchler Luftbild © H. Wipplinger |
| `vermessung-posidonia-seegraswiesen.jpg` | Posidonia-Seegraswiese |

### #manaia – Project Manaia (Mittelmeer / Seegras)
| Datei | Beschreibung |
|---|---|
| `sy-waya-waya-taucher.jpg` | Taucher an Bord der SY Waya Waya |
| `meeresgaertner-seegras.jpg` | Meeresgärtner mit Seegras-Büschel |
| `posidonia-renaturierung-malta.jpg` | Posidonia-Seegraswiese Stoupa |
| `strandreinigungsaktion.jpg` | Strandreinigungsaktion Kap Verde |

### #boa-vista – Turtle Foundation, Boa Vista (Kap Verde)
| Datei | Beschreibung |
|---|---|
| `nistende-karettschildkroete.jpg` | Nistende Karettschildkröte am Strand |
| `drohnen-training-nachteinsatz.jpg` | Drohnen-Training (Nachtsicht) |
| `dog-drone-team.png` | Dog-and-Drone-Team Training |

### #israel – Mittelmeer-Mönchsrobbe (Israel)
| Datei | Beschreibung |
|---|---|
| `inspektion-der-rosh-hanikra-hoeh.png` | Rosh-Hanikra-Höhlen, Israel |
| `mittelmeer-moenchsrobbe-julia-in.png` | Mönchsrobbe Julia (Benutzer-Upload) |
| `mittelmeer-moenchsrobbe-schaut-a.png` | Mönchsrobbe schaut heraus (Benutzer-Upload) |
| `moenchsrobbe-julia-israel.jpg` | Julia – Nahaufnahme (DSM) |
| `moenchsrobbe-schaut-aus-wasser.jpg` | Mönchsrobbe schaut neugierig (DSM) |
| `moenchsrobbe-schwimmt.jpg` | Mönchsrobbe beim Schwimmen (DSM) |

### #banda – Korallenrestauration, Bandasee (Indonesien)
| Datei | Beschreibung |
|---|---|
| `drei-taucher-befestigen-netz-aus.png` | 3 Taucher mit Organza-Netz |
| `gametenfalle-aus-trichter-und-pe.png` | Gametenfalle aus PET-Flasche |
| `korallenrekrut-steiniger-untergrund.jpg` | Korallenrekrut, 1 Jahr alt |
| `mit-netzen-abgedeckte-testfelder.png` | Testfelder mit Netzen |
| `rifaldi-farista-larvenaufzucht.jpg` | Rifaldi & Farista mit Larventanks |
| `taucher-befestigen-fischernetz-m.png` | Taucher befestigen Netz |

### #fidschi – Rochen-Forschung, Fidschi-Inseln
| Datei | Beschreibung |
|---|---|
| `blaupunkt-maskenrochen-neu.jpg` | Neue Rochenart: Blaupunkt-Maskenrochen |
| `geigenrochen-wedgefish-natadola.png` | Geigenrochen, Natadola Bay |
| `igelrochen-rotes-meer-von-patric.png` | Igelrochen, Rotes Meer |
| `kerstin-glaus-labor.jpg` | Dr. Glaus untersucht Rochen im Labor |
| `kerstin-glaus-untersucht-einen-r.png` | Dr. Glaus, Feldforschung Fidschi |
| `neue-rochenart-blaupunkt-maskenr.png` | Blaupunkt-Maskenrochen Exemplar |
| `rosa-peitschenrochen-pink-whipra.png` | Rosa Peitschenrochen (Pateobatis fai) |

---

## Implementierungs-Hinweise für Codex

1. **Pfade** sind relativ zur `index.html` anzugeben:
   `src="Website Bilder/kvarner/dateiname.jpg"`

2. **Einfügepunkt**: Immer **nach** `</div><!-- .project-infobox -->`,
   noch **innerhalb** von `<div class="project-content">`.

3. **Lazy Loading**: Alle `<img>`-Tags mit `loading="lazy"` versehen.

4. **Alt-Texte**: Aus `untertitel.txt` entnehmen (erste Zeile pro Eintrag).

5. **Copyright**: Am Ende der Galerie oder als kleines `<p class="gallery-credit">`
   den Hinweis `© DSM` bzw. den jeweiligen Fotografen aus `untertitel.txt` einfügen.

6. **Projekt-IDs** in index.html:
   - Kvarner → `id="kvarner"`
   - Manaia  → `id="manaia"`
   - Boa Vista → `id="boa-vista"`
   - Israel  → `id="israel"`
   - Bandasee → `id="banda"`
   - Fidschi → `id="fidschi"`
