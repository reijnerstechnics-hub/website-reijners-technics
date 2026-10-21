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

Lukt het versturen niet, dan krijgt de bezoeker een link om de aanvraag via WhatsApp te sturen.

## Homepagina

- **Zoekbalk** bovenaan: zoekt in alle toestellen van de pagina *Toestellen*. Terwijl de bezoeker typt, verschijnen de vijf best passende toestellen (klik = detailpagina); Enter of *Zoeken* toont alle resultaten in de lijst op de pagina *Toestellen*. De voorbeelden onder de zoekbalk (`data-q`) pas je aan in `index.html`; de werking staat in het blok *HOME: ZOEKBALK* in `js/main.js`.
- **Wisselende foto's** rechts bovenaan: de `<img class="rot">` in het blok met `data-rotate="5000"` (elke 5 seconden een andere foto). Daar staan eigen foto's van de duurdere modellen (LG Artcool, LG Deluxe H-serie, Daikin Stylish). Met `style="object-position: ..."` kies je welk deel van een foto zichtbaar blijft.

## Toestellen

Op de pagina *Toestellen* kiest de bezoeker eerst een merk (of zoekt op naam), daarna in de linkerkolom het vermogen dat hij nodig heeft en/of een soort toestel. Elk toestel is één kaart (`<div class="device-card">`) in het blok van zijn merk in `index.html` (`#toestellen-daikin`, `#toestellen-lg`, ...). Uit diezelfde kaart maakt de site ook de detailpagina (`#toestel-<naam>`), dus een toestel staat maar op één plaats.

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

Alles staat in `js/prijzen.js` (exclusief btw):

- `wensen`: de knoppen bij "Wat vindt u het belangrijkst?" en per wens de drie toestellen (voordelig, kwaliteit, premium);
- `toestellen` en `multi`: de prijzen per model en vermogen, en de multi-split buitenunits. Per voorstel zoekt de calculator zelf de voordeligste opstelling (meerdere kamers op één buitenunit als het toestel dat kan);
- `installatie.standaardLeiding`: met zoveel meter leiding per kamer rekent de richtprijs;
- `btw.standaard`: het btw-tarief van de richtprijs (de klant ziet erbij wat het is voor een woning jonger dan 10 jaar).

Zolang daar `voorlopig: true` staat, ziet de klant de melding dat het om voorbeeldprijzen gaat. De werking zelf staat in `js/prijscalculator.js`. Foto en uitleg komen van de toestelkaarten; een toestel in `prijzen.js` hoort bij de kaart met dezelfde `data-model`.

## Online zetten

Upload de volledige map (behalve `.git`) naar de webhost, zodat `index.html` in de hoofdmap staat. Werkt ook met Netlify, Vercel, Cloudflare Pages of GitHub Pages zonder extra instellingen.

## AI-chat

De chatknop werkt alleen in de versie die bij Claude gepubliceerd is. Op een eigen host blijft hij automatisch verborgen.
