# Reijners Technics – website

Website van [Reijners Technics](mailto:reijnerstechnics@gmail.com): airco's en lucht/lucht-warmtepompen in Dilsen-Stokkem en omgeving.

Het is een statische website (HTML, CSS en JavaScript) zonder build-stap: elke webhost die gewone bestanden kan tonen, werkt.

## Mappen

```
index.html        alle pagina's (home, diensten, toestellen, realisaties, contact)
css/style.css     de volledige opmaak; kleuren en lettertypes staan bovenaan in :root
js/main.js        navigatie, formulieren, carrousels, filters, fotoviewer, animaties
assets/img/       alle foto's, het logo en de merklogo's (logo-<merk>.svg)
```

De pagina's staan allemaal in `index.html`. Het menu toont of verbergt ze (`#diensten`, `#contact`, ...), zodat links en de terugknop gewoon werken.

Sinds 28-10-2026 (Rims keuze) zijn *Over ons* en *Contact* één pagina, *Contact* (`#contact`). Van boven naar onder: de kop, Rim bij zijn werkbus met de vier knoppen (`.ct-top`: Bel Rim, WhatsApp, E-mail, Offerte aanvragen), het verhaal met de quote "Elke plaatsing moet zelf overtuigen." (`.ct-verhaal`, `id="over-ons"`), het team met de kaartjes van Rim en Fabio (`.ct-team`), "Zo gaat het verder" in drie stappen (`.ct-steps`) en de gegevenskaart naast "Waarvoor mag Rim langskomen?" (`.ct-grid`). Er is geen menu-item *Over ons* meer. Oude links naar `#over-ons` werken nog: ze openen de pagina Contact bij het verhaal. De opmaak staat achteraan in `css/style.css` onder "contact: het verhaal en het team".

## Lokaal bekijken

Open de map in een lokale webserver, bijvoorbeeld met de extensie *Live Server* in VS Code (rechtsklik op `index.html` → *Open with Live Server*). Of met Python:

```bash
python -m http.server 8000
```

en ga naar http://localhost:8000.

## Formulieren

Het aanvraagformulier (op de startpagina en in het prijsadvies; de pagina Contact heeft sinds 28-10-2026 geen apart contactformulier meer, maar vier grote knoppen en links naar hetzelfde korte formulier) verstuurt zijn gegevens via [Formspree](https://formspree.io) naar het e-mailadres dat aan het Formspree-formulier gekoppeld is. Het adres van het formulier staat bovenaan het blok *AANVRAGEN VERSTUREN* in `js/main.js`:

```js
var FORMSPREE_URL = "https://formspree.io/f/mdeakpaq";
```

Lukt het versturen niet, dan krijgt de bezoeker een link om de aanvraag via WhatsApp te sturen. Een foutmelding is rood (`--err`) en lege verplichte velden krijgen de klasse `is-leeg` (rode rand) tot de bezoeker typt.

## Homepagina

- **Zoekbalk** bovenaan: zoekt in alle toestellen van de pagina *Toestellen*. Terwijl de bezoeker typt, verschijnen de vijf best passende toestellen (klik = detailpagina); Enter of *Zoeken* toont alle resultaten in de lijst op de pagina *Toestellen*, vanaf het zoekveld. Een vermogen ("3,5" of "3,5 kW") zoekt in de maten uit `data-kw`, niet in de tekst. Sinds 27-10-2026 staat de zoekbalk klein onder de drie keuzeknoppen (Rims keuze "optie 1"), zonder voorbeeldlinks; de werking staat in het blok *HOME: ZOEKBALK* in `js/main.js`. Diensten heeft sinds 28-10-2026 (Rims keuze) drie tegels naast elkaar in het raster `.dn-tegels` (`.dn-tegel`, ids `dienst-nieuw`, `dienst-onderhoud`, `dienst-herstelling`; op gsm onder elkaar), elk met een eigen foto, één zin en één gouden knop. De uitleg per dienst zit achter "Meer over ..." (`.faq-item.dn-meer`, zelfde open- en dichtklappen als de veelgestelde vragen); dat paneel (`.dn-paneel`) klapt op computer en tablet over de volle breedte onder de drie tegels open. De opmaak staat achteraan in `css/style.css` onder "diensten: drie tegels naast elkaar".
- **Wisselende foto's** rechts bovenaan: de `<img class="rot">` in het blok met `data-rotate="5000"` (elke 5 seconden een andere foto; enkel als het vak in beeld is, anders laadt en wisselt er niets). Daar staan eigen foto's van de duurdere modellen (LG Artcool, LG Deluxe H-serie, Daikin Stylish). Met `style="object-position: ..."` kies je welk deel van een foto zichtbaar blijft.
  - Het kleine fotootje ernaast (`#v3-sub-rot`) wisselt mee via `data-rotate-koppel="#v3-sub-rot"`: bij elke binnenunit hoort een buitenunit van hetzelfde merk. Zet er daarom altijd **evenveel** foto's in als in het grote vak, **in dezelfde volgorde**. Anders blijft het kleine fotootje op een verkeerd merk hangen.
  - Het kleine fotootje gebruikt kleine versies van 400 × 300 (`k-<naam>.webp`). Die maak je met `maakKlein([...])` in `voorbeeld/ronde-1/fotos-verwerken.html`.
  - Twee reeksen per seizoen, met `data-seizoen` op elke foto (beide vakken):
    - `warm` geldt van oktober tot april: hout, baksteen en de open haard;
    - `cool` geldt van mei tot september: licht en fris, geen blauwe muren tegen de blauwe achtergrond.
    - De site kiest de reeks volgens de maand, net zoals de tekst "Koelen/Verwarmen". Klikt de bezoeker op Koelen of Verwarmen, dan wisselen de foto's mee (event `rt-seizoen` in `js/main.js`).
    - Elke reeks heeft in beide vakken evenveel foto's, in dezelfde volgorde. De eerste `warm`-foto staat in de HTML met `src` en `class="rot on"`.

## Realisaties

Sinds 9-11-2026 (Rims keuze 114, voorstel C uit `voorbeeld/layouts-2026-11-08/paginas/`) staan de foto's **per plek**, in zes groepen (`div.rl-groep` met een eigen `ul.rl-raster`): hoog aan de muur (`#plek-wand`), laag bij de vloer (`#plek-vloer`), buiten tegen de gevel (`#plek-gevel`), op een plat dak (`#plek-dak`), op het terras of de grond (`#plek-grond`) en achter de kap (`#aansluitingen`). Bovenaan staan springknoppen (`.rl-spring`) naar elke groep. Geen "In de kijker" en geen merkknoppen meer. Elke foto staat er één keer in (74, gelijk met de teller op Home).

- **Tegels**: de uitsnede `rm-...webp` met het toestel in het midden; onder de foto `p.rl-onder` met het merk klein (`.rl-mk`) en de korte beschrijving. Een tik opent de foto groot in de viewer van de toestelpagina's (`window.rtZoomViewer`), met vorige/volgende binnen de groep, de uitleg en "Zo'n toestel bij mij? Offerte aanvragen".
- **Toon alle**: per groep eerst 4 foto's (tablet 6), daaronder "Toon alle N foto's" / "Toon minder". De link "Zo sluiten we aan" op Home (`#aansluitingen`) zet de groep "Achter de kap" open.
- De werking staat in het blok *REALISATIES: FOTO'S PER PLEK* in `js/main.js`, de opmaak achteraan in `css/style.css` onder "REALISATIES PER PLEK".

**Een nieuwe foto toevoegen**

1. Zet de foto als webp in `assets/img/`, liefst liggend 4:3 (bv. `g-n94.webp`, 1200 × 900). Geen foto's met Gree of Olimpia Splendid, geen foto van Rim en Fabio samen (zie `CLAUDE.md`).
2. Voor een grote foto (meer dan ± 40 kB) maak je een kleine versie voor de tegel, `r-<naam>.webp` van 600 × 450, bijvoorbeeld met ffmpeg:
   `ffmpeg -i g-n94.webp -vf scale=600:450:flags=lanczos -c:v libwebp -quality 75 -compression_level 6 r-g-n94.webp`
3. Voeg in `index.html`, in de `<ul class="rl-raster">` van de juiste groep (plek), één regel toe op de plaats waar de foto moet komen (kijk naar een bestaande tegel voor de vorm, met `p.rl-onder`):

```html
<li class="rl-tegel" data-merk="daikin"><button type="button" class="rl-open" data-groot="assets/img/g-n94.webp" data-uitleg="Daikin-wandmodel boven de deur, met de leiding in een wit kanaal."><img src="assets/img/r-g-n94.webp" alt="Daikin-wandmodel boven de deur" width="600" height="450" loading="lazy" decoding="async"><span class="rl-merk" aria-hidden="true">Daikin</span></button></li>
```

   - `data-merk`: `daikin`, `lg`, `me` (Mitsubishi Electric), `mhi`, `nuova` of `toshiba`; leeg (`data-merk=""`, en dan zonder merk in `p.rl-onder`) als er geen merk te zien is;
   - `data-uitleg`: wat er op de foto te zien is, enkel wat echt klopt (geen gemeente of toestelnaam die je niet zeker weet);
   - `alt`: een korte beschrijving van de foto;
   - `data-groot` enkel als de tegel de kleine versie `r-...` toont; zonder kleine versie zet je de foto zelf in `src`, met haar eigen `width` en `height`;
   - `data-toestel="#toestel-..."` (mag): dan staat in de grote weergave "Bekijk dit toestel".
4. Pas op Home de teller aan (`data-count`, "foto's van eigen plaatsingen"): het aantal tegels, nu 74.

## Toestellen

Op de pagina *Toestellen* kiest de bezoeker eerst een merk (of zoekt op naam), daarna in de linkerkolom het vermogen dat hij nodig heeft en/of een soort toestel. Tijdens een zoekopdracht staat boven de lijst wat hij zocht, met de knop *Alle toestellen tonen*, en tonen de merktegels het aantal gevonden per merk; een merk kiezen wist de zoekterm. De filter *Vermogen* heeft aaneensluitende maten ("tot 2,5 kW · tot 28 m²", "3,5 kW · 28-39 m²", ...), zodat ook een kleine kamer ergens past. De hulpkaart "Twijfelt u tussen modellen?" staat één keer, in het laatste zichtbare merkblok. Elk toestel is één kaart (`<div class="device-card">`) in het blok van zijn merk in `index.html` (`#toestellen-daikin`, `#toestellen-lg`, ...). Uit diezelfde kaart maakt de site ook de detailpagina (`#toestel-<naam>`), dus een toestel staat maar op één plaats.

Een kaart heeft vier kenmerken:

- `data-brand`: `daikin`, `lg`, `me` (Mitsubishi Electric), `mhi` (Mitsubishi Heavy Industries), `nuova` of `toshiba`;
- `data-type`: de soort toestel
  - split-airco (binnen- én buitenunit): `wand`, `vloer`, `cassette`, `kanaal`, `plafond`, `zuil`
  - zonder buitenunit: `monoblock`, `mobiel`
  - losse buitenunit voor multi-split: `buiten`
- `data-category`: `single` (één kamer met een eigen buitenunit), `multi` (binnenunit voor een multi-split), `single multi` (allebei) of leeg;
- `data-kw`: de vermogens in kW waarin het toestel bestaat, gescheiden door een spatie (bv. `2,0 2,5 3,5 5,0`), of een bereik als er geen vaste maten zijn (bv. `2,5-14,0`). Daaruit maakt de site het kW-blok op de kaart en de detailpagina ("tot 7,1 kW" met elke maat als knopje) en de filter *Vermogen* in de linkerkolom (2,5 / 3,5 / 5 / 7 kW of meer dan 7,5 kW).

Een nieuwe kaart mag overal in het merkblok staan: `js/main.js` zet de kaarten zelf per soort onder elkaar (lijst `RT_SOORTEN`) en voegt het label ("Binnen- + buitenunit", "Zonder buitenunit" of "Buitenunit") en de zin "Voor 1 kamer, ..." toe. Losse buitenunits staan niet bij "Alle toestellen" maar in hun eigen categorie; bij het zoeken komen ze wel mee.

De naam van de detailpagina komt uit `data-model` van de knop *Offerte voor dit model*. De rijen van `device-specs` verschijnen op de detailpagina; de kaart in de lijst toont er zelf de kerngegevens uit (het label uit *Energielabel*, het geluid uit *Geluidsniveau binnen*).

Een nieuw merk: een merkblok met kaarten, een tegel in `.merk-keuze` met het logo in `assets/img/logo-<merk>.svg`, een link in het menu onder *Toestellen*, en de naam en het logo in `RT_MERKEN` en `RT_LOGOS` bovenaan het blok *TOESTELLEN: MERK, CATEGORIE EN ZOEKEN* in `js/main.js`.

## Keuzehulp (vroeger prijsadvies)

**Sinds 6-11-2026 staan er geen prijzen voor toestellen of plaatsingen op de site** (Rim: "de prijs wordt besproken na het plaatsbezoek"; later komt er misschien een eigen groothandel met een prijslijst voor bedrijven). Zet nergens opnieuw een bedrag. Enkel onderhoud (€ 100 tot € 150 excl. btw) staat er nog (Rims keuze, vraag 100).

Bovenaan de pagina *Toestellen* (`#prijs`) beantwoordt de klant drie vragen: hoeveel kamers, hoe groot elke kamer is en wat hij het belangrijkst vindt. Daarna krijgt hij drie voorstellen naast elkaar: **Voordelig**, **Beste prijs-kwaliteit** en **Premium**, elk met merk, model, foto, opstelling en vermogen, zonder bedrag. Het voorstel dat bij zijn wens past, krijgt het label "Past bij uw wens". De klant kiest een voorstel en laat zijn naam, telefoonnummer en gemeente achter.

`js/prijzen.js` (de naam is gebleven) bevat geen bedragen meer:

- `wensen`: de knoppen bij "Wat vindt u het belangrijkst?" en per wens de drie toestellen (voordelig, kwaliteit, premium);
- `toestellen`: per model de bestaande maten (`maten`: per vermogen `[set, losse binnenunit]`, 1 = bestaat, null = niet);
- `multi`: de multi-split buitenunits (poorten en vermogen). Per voorstel kiest de keuzehulp zelf de opstelling (meerdere kamers op één buitenunit als het toestel dat kan, de kleinste buitenunit die past).

Het oude script `voorbeeld/prijslijst/maak-prijzen.ps1` **niet meer gebruiken**: dat zet de prijzen terug. De werking staat in `js/prijscalculator.js`. Foto en uitleg komen van de toestelkaarten; een toestel in `prijzen.js` hoort bij de kaart met dezelfde `data-model`. De toestelpagina's, de kaarten in de lijst en de tabel "Welk vermogen heb ik nodig?" tonen geen richtprijs meer.

### Vermogen kiezen op de toestelpagina

Bestaat een toestel in meer dan één maat, dan zijn de maten in het kW-blok van de detailpagina knoppen (`kwBlok` en `kiesKw` in `js/main.js`). Kiest de bezoeker een maat, dan:

- staat onder de knoppen voor hoe groot een kamer die maat ongeveer is;
- licht die rij op in de tabel "Welk vermogen heb ik nodig?";
- gaat het vermogen mee in de offerte ("Gekozen toestel: Daikin Perfera (3,5 kW)"), in de WhatsApp-tekst en in de e-mail.

Nog eens op dezelfde maat tikken zet de keuze af. Een tik op een maat op een kaart in de lijst opent het toestel met die maat al gekozen. Staat de filter *Vermogen* aan, dan staat op de kaarten de passende maat donker en kiest de detailpagina die maat zelf (`rtKwVoorKeuze`). De keuze per toestel blijft bewaard tot de pagina herladen wordt, ook na de terugknop.

### Toestel bekijken: foto's, inzoomen en video

Elke toestelfoto op de detailpagina opent een viewer (`zoomViewer` in `js/main.js`): inzoomen met het muiswiel, knijpen of een dubbeltik, slepen om te verschuiven, knoppen + en −, pijltjes voor de volgende foto. Extra foto's per toestel staan in `js/toestel-media.js` (`RT_MEDIA`, sleutel = `data-model`): `fotos` (webp 1000 × 1000, `assets/img/t-<slug>-<n>.webp`, met een kort label zoals "Klep open" of "Buitenunit") en `video` (de officiële merkvideo op YouTube: `youtube`-id, titel, kanaal). De miniaturen wisselen de hoofdfoto; de video laadt pas als de bezoeker op afspelen tikt (youtube-nocookie). De bronnen per foto staan in `voorbeeld/media/` (buiten git).

Tikt de bezoeker een kleur aan, dan gaat die ook mee, bv. "Daikin Emura (zwart, 3,5 kW)". Op een toestelpagina vragen ook de knop *Offerte aanvragen* bovenaan en de balk onderaan op de gsm een offerte voor dat toestel. Elders beginnen die knoppen een gewone aanvraag, zonder toestel.

### Zie dit toestel in een woonkamer (js/woonkamer.js)

Op de toestelpagina van elk wandmodel opent de kaart "Zie dit toestel in een woonkamer" (`.td-kamer` in `js/main.js`) een venster met de binnenunit op ware grootte aan de muur van een woonkamer in zes stijlen: Licht, Modern, Zand, Groen, Warm en Donker (`assets/img/kamer-<stijl>.webp`, 2336 × 1752). De kamers zijn met Higgsfield gemaakt (gpt_image_2_5): licht, donker en warm op 3-11-2026 (daarna op 4-11-2026 met de upscaler van Higgsfield 4× vergroot), modern, zand en groen op 4-11-2026 rechtstreeks op 2K, met de lichte kamer als voorbeeld zodat de zetel overal op dezelfde plek staat. De bronnen staan in `voorbeeld/woonkamer-2026-11-03/` en `-04/` (buiten git).

- **Scherpe binnenunits (Rim, 4-11-2026: "zo scherp als in de boekjes", en later die dag: "die witte rand moet weg en veel scherper").** Voor elk wandmodel en elke kleur is de beste rechte productfoto (zelfde keuze als `besteFoto`: "In <kleur>", "Vooraanzicht", "Klep dicht", "Binnenunit", anders de kleur- of kaartfoto) met Higgsfield vergroot naar 4096 px (2 credits per foto, 52 foto's) en bewaard op 2000 px in `voorbeeld/woonkamer-2026-11-04/bron-2000/<slug>.png` (buiten git). Het programma `voorbeeld/woonkamer-2026-11-04/knip.py` (Python, enkel Pillow) knipt ze uit: de achtergrond is alles wat bijna wit is en aan de rand vastzit, het bovenste grote stuk is de binnenunit, en de lichte zweem die de AI-vergroting rond het toestel laat (6 tot 10 px) wordt echt doorzichtig (per pixel: hoeveel lichter dan het binnenste van het toestel, en het wit wordt uit de kleur gehaald); losse stipjes gaan weg, de rand wordt een tikje zacht, een licht onscherp-masker, dan verkleinen naar 1600 px. Resultaat: `assets/img/wk-<slug>.webp` (1600 px breed, doorzichtige achtergrond). De tabel `KNIP` in `js/woonkamer.js` koppelt "model|kleur" (de kleur zoals op het bolletje) aan het bestand. Ontbreekt een bestand, dan knipt de site de gewone productfoto zelf (minder scherp, met de oude methode uit `js/zicht.js`). Nieuw toestel of nieuwe kleur: de foto vergroten, als 2000 px PNG in `bron-2000/` zetten, de slug in `knip-lijst.json` zetten, `python -I knip.py <slug>` draaien en de regel aan `KNIP` toevoegen. (De oude hulppagina `knip.html` werkte met de methode van de site en liet de zweem staan.)
- **Echte foto per toestel en kamer (Rims keuze van 4-11-2026 's avonds: "fotorealistisch per kamer").** Voor elk wandmodel en elke kleur (52) en elke kamer (6) staat een fotorealistisch beeld in `assets/img/wkf-<slug>-<kamer>.webp` (1600 x 1200, 312 stuks, 44 MB): het toestel hangt op dezelfde plek als in de geplakte versie, maar met echt licht, schaduw en spiegeling, gemaakt met Higgsfield (Nano Banana 2.1, 2K, 2 credits per beeld, 624 credits in totaal; het toestel met de geplakte uitsnede als beeld 1 en de productfoto als beeld 2). De site toont die foto als ze bestaat (`laadFoto` in `js/woonkamer.js`); slepen kan dan niet (de plek staat vast), de uitleg zegt "Zo hangt hij in deze kamer, op ware grootte." Bestaat ze niet (nieuw toestel), dan tekent de site de uitsnede zoals hieronder en kan de klant wel slepen. Nieuw toestel: `voorbeeld/woonkamer-2026-11-04/foto/maak-invoer.py` maakt de invoerbeelden en prompts, daarna uploaden en genereren via de Higgsfield-MCP (zie `jobs.py`, `maak-batch.py`) en `maak-webp.py` zet de uitkomst om. De 312 bronbeelden (PNG, 2400 x 1792) staan in `voorbeeld/woonkamer-2026-11-04/foto/uit/` (buiten git).
- **Rechte vooraanzichten voor toestellen zonder rechte merkfoto (4-11-2026).** Tien toestellen (Toshiba Haori en Shorai Edge, MHI ZSP, ZS Premium en ZSX Diamond Hyper in alle kleuren, LG DualCool WZ) bestaan alleen schuin gefotografeerd. Met Higgsfield (Nano Banana 2.1, 2K, prompt "orthographic front elevation", 2 credits) is uit de schuine foto een recht vooraanzicht gemaakt: `voorbeeld/woonkamer-2026-11-04/foto/recht.py haal <slug>=<url>` bewaart het in `foto/recht/` en als `bron-2000/<slug>.png` (vierkant 2000 px), waarna `knip.py <slug>` de uitsnede en `maak-invoer.py` de invoerbeelden vernieuwt. Nieuw toestel zonder rechte foto: dezelfde weg.
- **Scherp op het scherm.** De canvas krijgt precies zoveel pixels als ze op het scherm inneemt, maal de pixeldichtheid (tot 3x), en de uitsnede wordt in stappen gehalveerd tot ze hoogstens dubbel zo groot is als nodig (`knipVoor` in `js/woonkamer.js`). Vroeger tekende de site op 2336 px en verkleinde de browser dat via CSS, wat wazig en korrelig oogde.
- **Slepen.** De klant sleept het toestel met de vinger of de muis naar de plek die hij wil (ook met de pijltjestoetsen: 2 cm per tik, 10 cm met Shift). De grootte blijft de ware grootte (Rims keuze: niet verkleinen of vergroten). De plek blijft dezelfde bij het wisselen van kamer of kleur. "Zet terug in het midden" zet het toestel op de vaste plek (`PLEK`: x, y als deel van de foto; schaal `m` = deel van de fotobreedte per meter, gemeten aan de zetel van ± 2,2 m; 0,9 m als breedte van het toestel, de Artcool Gallery 0,6 m in `BREEDTE_PER_MODEL`).
- Heeft het toestel kleurbolletjes, dan kan de klant in het venster van kleur wisselen. Knop "Offerte voor dit model" gaat naar het formulier met het toestel, de kleur en het vermogen ingevuld. Geen bewaar- of deelknop en geen tweede binnenunit (Rims keuzes van 4-11-2026; later uit te breiden).

### Plan uw plaatsing (js/zicht.js, geparkeerd tot december 2026)

Op elke toestelpagina opent de kaart "Plan uw plaatsing bij u thuis" (`.td-kamer`, gebouwd in `js/main.js`) een venster waarin de klant in vier stappen zijn eigen plaatsingsplan maakt (Rims keuzes van 3-11-2026), met twee tabbladen: **Met eigen foto's** en **In een 3D-huis**.

1. **Binnenunit(s).** Per kamer (tot 3, voor een multi-split; "+ Kamer", nog eens tikken op de kamer wisselt de naam). Op een foto van de muur sleept de klant de binnenunit (uit de productfoto geknipt: alles wat wit is en aan de rand vastzit wordt doorzichtig; de meeste kaartfoto's tonen een set, het bovenste grote stuk is de binnenunit). In het 3D-huis sleept hij een schim van de binnenunit op de muur waar ze aan de binnenkant komt. Een cassette, kanaal- of plafondunit en een losse buitenunit krijgen enkel de kamernamen.
2. **Buitenunit.** Op een foto van de gevel: slepen, en kiezen hoe hij staat (muurbeugel, balk op de grond, plat dak, anders; de beugel of balk wordt mee getekend). In het 3D-huis volgt de montage uit de plek: tegen een muur = muurbeugel, op de grond = balk, op het platte dak van de aanbouw = balk. Voor de buitenunit gebruikt de site de foto met label "Buitenunit" uit `js/toestel-media.js`, anders het onderste stuk van de kaartfoto, anders de losse buitenunit van het merk (`MERK_BUITEN`).
3. **Leiding en goot.** Op de foto tikt de klant per kamer de doorvoer en de hoekpunten aan; het laatste stuk loopt naar de buitenunit. In het 3D-huis tekent de site de goot zelf: van de doorvoer verticaal naar de hoogte van de buitenunit, dan langs de muren (met hoekpunten) ernaartoe, bij een plat dak ook over het dak. Kleur: wit, bruin, zwart, antraciet. Geschatte lengte (op de foto geschaald op de breedte van de buitenunit, 0,85 m) met de zin "5 m leiding zit in de richtprijs; meer rekenen we na het plaatsbezoek". Per kamer kan "Geen goot zichtbaar" (leiding binnenin).
4. **Overzicht.** Het lijstje plus één beeld met alle foto's (of het 3D-beeld) onder elkaar. "Stuur naar Rim" opent op een gsm het deelmenu (WhatsApp) met dat beeld; op een computer wordt het bewaard en opent WhatsApp met de tekst. "Neem op in mijn offerteaanvraag" zet het lijstje in `window.rtPlan`: het formulier toont het onder het gekozen toestel (`#calc-plan`), stuurt het mee als veld `plaatsingsplan` (ook in de aanvulling) en in de WhatsApp-tekst van de aanvraag.

De foto's blijven in de browser: niets gaat naar een server tot de klant zelf deelt. three.js (r128, cdnjs) laadt pas als de klant het 3D-huis opent; het huis (voorgevel, zijgevel, aanbouw met plat dak), de texturen en de buitenunit zijn in code getekend. Zodra het 3D-model van de buitenunit uit Higgsfield klaar is: het GLB-bestand in `assets/3d/` zetten en de naam in `MODEL_3D` bovenaan `js/zicht.js` invullen (`laadModel` vervangt dan de getekende unit).

## Voor Google

- `robots.txt` en `sitemap.xml` (enkel het echte adres: de #-adressen zijn voor Google geen pagina's), `site.webmanifest` en de iconen in `assets/img/` (`favicon-32.png`, `icoon-192.png`, `icoon-512.png`, `apple-touch-icon.png`) plus `favicon.ico`.
- In de `<head>` van `index.html`: de canonical, Open Graph en Twitter-cards (deelfoto `assets/img/deelfoto-reijners-technics.jpg`, 1200 × 630) en de structured data (JSON-LD, HVACBusiness + WebSite) met enkel gegevens uit `CLAUDE.md`. Nakijken na het online zetten: https://search.google.com/test/rich-results.
- `404.html` toont Vercel zelf bij een onbestaand adres. `vercel.json` zet drie veilige headers.
- **Eigen domein:** vervang `https://website-reijners-technics.vercel.app` in `index.html` (head, commentaar EIGEN DOMEIN), `sitemap.xml` en `robots.txt`.

## Online zetten

Upload de volledige map naar de webhost, zodat `index.html` in de hoofdmap staat. Laat weg wat enkel voor het werken aan de site dient: `.git`, `.claude`, `CLAUDE.md` en `voorbeeld`. Werkt ook met Netlify, Vercel, Cloudflare Pages of GitHub Pages zonder extra instellingen.

## Team van agents (Claude Code)

`CLAUDE.md` is het projectgeheugen: wat het bedrijf doet, de huisstijl, de toon en de vaste werkwijze (eerst een voorbeeld, pas online na akkoord). In `.claude/agents/` staat het team dat aan de site werkt: de `projectleider` (hoofdagent die de anderen aanstuurt), `ux-adviseur`, `ui-ontwerper`, `seo-specialist`, `toestellenbeheerder`, `tekstschrijver` en `tester`. Open een nieuwe Claude Code-sessie in deze map om ze te gebruiken; vraag gewoon wat je wilt veranderen, of noem een agent bij naam.

## AI-chat

De chatknop werkt alleen in de versie die bij Claude gepubliceerd is. Op een eigen host blijft hij automatisch verborgen.
