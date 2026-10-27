# Reijners Technics – website

Website van [Reijners Technics](mailto:reijnerstechnics@gmail.com): airco's en lucht/lucht-warmtepompen in Dilsen-Stokkem en omgeving.

Het is een statische website (HTML, CSS en JavaScript) zonder build-stap: elke webhost die gewone bestanden kan tonen, werkt.

## Mappen

```
index.html        alle pagina's (home, diensten, toestellen, realisaties, over ons, contact)
css/style.css     de volledige opmaak; kleuren en lettertypes staan bovenaan in :root
js/main.js        navigatie, formulieren, carrousels, filters, fotoviewer, animaties
assets/img/       alle foto's, het logo en de merklogo's (logo-<merk>.svg)
```

De pagina's staan allemaal in `index.html`. Het menu toont of verbergt ze (`#diensten`, `#contact`, ...), zodat links en de terugknop gewoon werken.

## Lokaal bekijken

Open de map in een lokale webserver, bijvoorbeeld met de extensie *Live Server* in VS Code (rechtsklik op `index.html` → *Open with Live Server*). Of met Python:

```bash
python -m http.server 8000
```

en ga naar http://localhost:8000.

## Formulieren

Het aanvraagformulier op de startpagina en het contactformulier versturen hun gegevens via [Formspree](https://formspree.io) naar het e-mailadres dat aan het Formspree-formulier gekoppeld is. Het adres van het formulier staat bovenaan het blok *AANVRAGEN VERSTUREN* in `js/main.js`:

```js
var FORMSPREE_URL = "https://formspree.io/f/mdeakpaq";
```

Lukt het versturen niet, dan krijgt de bezoeker een link om de aanvraag via WhatsApp te sturen. Een foutmelding is rood (`--err`) en lege verplichte velden krijgen de klasse `is-leeg` (rode rand) tot de bezoeker typt.

## Homepagina

- **Zoekbalk** bovenaan: zoekt in alle toestellen van de pagina *Toestellen*. Terwijl de bezoeker typt, verschijnen de vijf best passende toestellen (klik = detailpagina); Enter of *Zoeken* toont alle resultaten in de lijst op de pagina *Toestellen*, vanaf het zoekveld. Een vermogen ("3,5" of "3,5 kW") zoekt in de maten uit `data-kw`, niet in de tekst. Sinds 27-10-2026 staat de zoekbalk klein onder de drie keuzeknoppen (Rims keuze "optie 1"), zonder voorbeeldlinks; de werking staat in het blok *HOME: ZOEKBALK* in `js/main.js`. Diensten heeft sindsdien per dienst één blok (`.svc-blok`, id `dienst-...`) met een inklapbaar "Meer over ..." dat het FAQ-script gebruikt.
- **Wisselende foto's** rechts bovenaan: de `<img class="rot">` in het blok met `data-rotate="5000"` (elke 5 seconden een andere foto; enkel als het vak in beeld is, anders laadt en wisselt er niets). Daar staan eigen foto's van de duurdere modellen (LG Artcool, LG Deluxe H-serie, Daikin Stylish). Met `style="object-position: ..."` kies je welk deel van een foto zichtbaar blijft.
  - Het kleine fotootje ernaast (`#v3-sub-rot`) wisselt mee via `data-rotate-koppel="#v3-sub-rot"`: bij elke binnenunit hoort een buitenunit van hetzelfde merk. Zet er daarom altijd **evenveel** foto's in als in het grote vak, **in dezelfde volgorde**. Anders blijft het kleine fotootje op een verkeerd merk hangen.
  - Het kleine fotootje gebruikt kleine versies van 400 × 300 (`k-<naam>.webp`). Die maak je met `maakKlein([...])` in `voorbeeld/ronde-1/fotos-verwerken.html`.
  - Twee reeksen per seizoen, met `data-seizoen` op elke foto (beide vakken):
    - `warm` geldt van oktober tot april: hout, baksteen en de open haard;
    - `cool` geldt van mei tot september: licht en fris, geen blauwe muren tegen de blauwe achtergrond.
    - De site kiest de reeks volgens de maand, net zoals de tekst "Koelen/Verwarmen". Klikt de bezoeker op Koelen of Verwarmen, dan wisselen de foto's mee (event `rt-seizoen` in `js/main.js`).
    - Elke reeks heeft in beide vakken evenveel foto's, in dezelfde volgorde. De eerste `warm`-foto staat in de HTML met `src` en `class="rot on"`.

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

## Prijsadvies

Bovenaan de pagina *Toestellen* (`#prijs`) beantwoordt de klant drie vragen: hoeveel kamers, hoe groot elke kamer is en wat hij het belangrijkst vindt. Daarna krijgt hij drie voorstellen naast elkaar: **Voordelig**, **Beste prijs-kwaliteit** en **Premium**, elk met merk, model, foto en een richtprijs ("tussen € x en € y"). Het voorstel dat bij zijn wens past, krijgt het label "Past bij uw wens". De klant kiest een voorstel en laat zijn naam en telefoonnummer achter.

Alles staat in `js/prijzen.js` (exclusief btw). Dat bestand wordt sinds 27-10-2026 gemaakt door `voorbeeld/prijslijst/maak-prijzen.ps1` uit Rims prijslijst bij Nova Air (buiten git; de toestelprijzen in `prijzen.js` zijn inkoop × 1,15, de inkoopprijzen zelf staan nergens online; Daikin: comfycool.be × 1,15). Nieuwe prijzen: de lijst opnieuw uitlezen (Rim logt zelf in) en het script draaien, niet met de hand in `prijzen.js` werken.

- `wensen`: de knoppen bij "Wat vindt u het belangrijkst?" en per wens de drie toestellen (voordelig, kwaliteit, premium);
- `toestellen` en `multi`: de prijzen per model en vermogen, en de multi-split buitenunits. Per voorstel zoekt de calculator zelf de voordeligste opstelling (meerdere kamers op één buitenunit als het toestel dat kan);
- `werk`: Rims werk per aantal binnenunits (1.000 / 1.500 / 2.000 euro bij 1 / 2 / 3, excl. btw, 5 m leiding inbegrepen) en `maxBinnenunits`: meer binnenunits geeft "op maat" zonder bedrag;
- `btw.standaard`: het btw-tarief van de richtprijs (de klant ziet erbij wat het is voor een woning jonger dan 10 jaar).

Zolang daar `voorlopig: true` staat, ziet de klant de melding dat het om voorbeeldprijzen gaat. De werking zelf staat in `js/prijscalculator.js`. Foto en uitleg komen van de toestelkaarten; een toestel in `prijzen.js` hoort bij de kaart met dezelfde `data-model`.

### Richtprijs per toestel

Heeft een toestel in `prijzen.js` een prijs voor een set (binnen- en buitenunit), dan toont zijn detailpagina (`#toestel-...`):

- een blok "Richtprijs vanaf € ..." voor het kleinste vermogen, net boven de knoppen;
- een kolom "Richtprijs" in de tabel "Welk vermogen heb ik nodig?" ("op aanvraag" als er voor dat vermogen geen setprijs is).

Ook de kaart in de lijst toont dan "Richtprijs vanaf € ..." (`kaartPrijs` in `js/main.js`). Staat de filter *Vermogen* aan, dan staat er de prijs voor de donkere maat. De uitleg (plaatsing, btw, offerte) staat één keer bovenaan de lijst (`.lijst-noot` in `index.html`), en enkel als er een kaart met een prijs te zien is.

De berekening is dezelfde als in het prijsadvies voor één kamer met een eigen buitenunit: set (inkoop × 1,15) + `werk[1]`, plus btw, afgerond op 10 euro: één richtprijs, geen vork (`richtprijs` in het blok *TOESTELLEN* van `js/main.js`). Pas je die berekening in `js/prijscalculator.js` aan, pas ze dan ook daar aan. Toestellen zonder prijs in `prijzen.js` tonen geen richtprijs, en met `voorlopig: true` verdwijnen de richtprijzen van de toestelpagina's. Daarom laadt `index.html` `js/prijzen.js` vóór `js/main.js`.

### Vermogen kiezen op de toestelpagina

Bestaat een toestel in meer dan één maat, dan zijn de maten in het kW-blok van de detailpagina knoppen (`kwBlok` en `kiesKw` in `js/main.js`). Kiest de bezoeker een maat, dan:

- toont het richtprijsblok de prijs voor die maat ("Op aanvraag" als er geen setprijs is);
- staat onder de knoppen voor hoe groot een kamer die maat ongeveer is;
- licht die rij op in de tabel "Welk vermogen heb ik nodig?";
- gaat het vermogen mee in de offerte ("Gekozen toestel: Daikin Perfera (3,5 kW)"), in de WhatsApp-tekst en in de e-mail.

Nog eens op dezelfde maat tikken zet de keuze af. Een tik op een maat op een kaart in de lijst opent het toestel met die maat al gekozen. Staat de filter *Vermogen* aan, dan staat op de kaarten de passende maat donker en kiest de detailpagina die maat zelf (`rtKwVoorKeuze`). De keuze per toestel blijft bewaard tot de pagina herladen wordt, ook na de terugknop.

### Toestel bekijken: foto's, inzoomen en video

Elke toestelfoto op de detailpagina opent een viewer (`zoomViewer` in `js/main.js`): inzoomen met het muiswiel, knijpen of een dubbeltik, slepen om te verschuiven, knoppen + en −, pijltjes voor de volgende foto. Extra foto's per toestel staan in `js/toestel-media.js` (`RT_MEDIA`, sleutel = `data-model`): `fotos` (webp 1000 × 1000, `assets/img/t-<slug>-<n>.webp`, met een kort label zoals "Klep open" of "Buitenunit") en `video` (de officiële merkvideo op YouTube: `youtube`-id, titel, kanaal). De miniaturen wisselen de hoofdfoto; de video laadt pas als de bezoeker op afspelen tikt (youtube-nocookie). De bronnen per foto staan in `voorbeeld/media/` (buiten git).

Tikt de bezoeker een kleur aan, dan gaat die ook mee, bv. "Daikin Emura (zwart, 3,5 kW)". Op een toestelpagina vragen ook de knop *Offerte aanvragen* bovenaan en de balk onderaan op de gsm een offerte voor dat toestel. Elders beginnen die knoppen een gewone aanvraag, zonder toestel.

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
