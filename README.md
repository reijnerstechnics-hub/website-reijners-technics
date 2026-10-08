# Reijners Technics – website

Website van [Reijners Technics](mailto:reijnerstechnics@gmail.com): airco's en lucht/lucht-warmtepompen in Dilsen-Stokkem en omgeving.

Het is een statische website (HTML, CSS en JavaScript) zonder build-stap: elke webhost die gewone bestanden kan tonen, werkt.

## Mappen

```
index.html        alle pagina's (home, diensten, toestellen, realisaties, over ons, contact)
css/style.css     de volledige opmaak; kleuren staan bovenaan in :root
js/main.js        navigatie, formulieren, carrousels, filters, fotoviewer, animaties
assets/img/       alle foto's en het logo (.webp)
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

## Prijsadvies

Bovenaan de pagina *Toestellen* (`#prijs`) beantwoordt de klant een paar eenvoudige vragen: hoeveel ruimtes, hoe groot, welke verdieping, hoe ver van de buitenunit, wat hij belangrijk vindt en hoe oud de woning is. Daarna kiest de calculator zelf het toestel en de voordeligste opstelling (maximaal 5 binnenunits per buitenunit, en een tweede buitenunit aan de andere kant van het huis als dat goedkoper is). Onder de vragen staat de lijst met alle toestellen.

Alle prijzen staan in `js/prijzen.js` (exclusief btw), net als welk toestel bij welke wens wordt aangeraden (`pakketten`). Zolang daar `voorlopig: true` staat, ziet de klant de melding dat het om voorbeeldprijzen gaat. De werking zelf staat in `js/prijscalculator.js`. Foto's en specificaties komen van de toestelkaarten; een toestel in `prijzen.js` hoort bij de kaart met dezelfde `data-model`.

## Online zetten

Upload de volledige map (behalve `.git`) naar de webhost, zodat `index.html` in de hoofdmap staat. Werkt ook met Netlify, Vercel, Cloudflare Pages of GitHub Pages zonder extra instellingen.

## AI-chat

De chatknop werkt alleen in de versie die bij Claude gepubliceerd is. Op een eigen host blijft hij automatisch verborgen.
