# Reijners Technics – website

Website van [Reijners Technics](mailto:reijnerstechnics@gmail.com): airco's en lucht/lucht-warmtepompen in Dilsen-Stokkem en omgeving.

Het is een statische website (HTML, CSS en JavaScript) zonder build-stap: elke webhost die gewone bestanden kan tonen, werkt.
wat is dit?? gekke shittt man
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

## Online zetten

Upload de volledige map (behalve `.git`) naar de webhost, zodat `index.html` in de hoofdmap staat. Werkt ook met Netlify, Vercel, Cloudflare Pages of GitHub Pages zonder extra instellingen.

## AI-chat

De chatknop werkt alleen in de versie die bij Claude gepubliceerd is. Op een eigen host blijft hij automatisch verborgen.
