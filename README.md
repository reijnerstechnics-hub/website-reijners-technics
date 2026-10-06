# Reijners Technics Website

**Professional HVAC Installation & Service Website**

Dit is de refactored website voor [Reijners Technics](https://reijners-technics.be), een installateur van warmtepompen en airconditioning systemen in Dilsen, België.

---

## Overzicht

Deze website is refactored van een enkel 7MB HTML-bestand naar een professioneel georganiseerde projectstructuur met:

- **HTML-pagina's** - Gescheiden per functie (homepage, diensten, contact, calculator)
- **CSS-stylesheets** - Georganiseerd in variabelen en styles
- **JavaScript modules** - Speciaal ontworpen voor calculator, formulieren en navigatie
- **Documentatie** - Uitgebreide comments en development guide

### Features

✅ **Multi-pagina navigatie** - Vlotte pagina-overgangen met JavaScript SPA-gedrag  
✅ **Offerte Calculator** - Interactieve stap-voor-stap prijscalculator met Belgische BTW  
✅ **Contact Formulier** - Formspree integratie voor direct email contact  
✅ **Carousels** - Professionele afbeeldingssliders voor toestellen en realisaties  
✅ **FAQ Accordion** - Uitklapbare antwoorden op veelgestelde vragen  
✅ **Responsive Design** - Werkt perfect op mobiel, tablet en desktop  
✅ **Performance Optimized** - Minimalistische CSS en snelle JavaScript  

---

## Mappenstructuur

```
website-reijners-technics/
│
├── index.html                    # Homepage
├── css/
│   ├── variables.css            # CSS variabelen (kleuren, fonts)
│   └── style.css                # Main stylesheet
├── js/
│   ├── main.js                  # Algemene functies & navigatie
│   ├── offerte-calculator.js    # ZEER GOED GEDOCUMENTEERDE calculator
│   └── contact-form.js          # Formspree form handler
├── pages/
│   ├── diensten.html            # Services pagina
│   ├── offerte.html             # Calculator pagina
│   ├── contact.html             # Contact formulier
│   └── products.html            # Toestellen & Realisaties
├── docs/
│   ├── STRUCTURE.md             # Gedetailleerde technische structuur
│   └── CONTRIBUTING.md          # Hoe bij te dragen
│
└── README.md                    # Dit bestand
```

---

## Quick Start

### Lokaal runnen

1. **Clone of download het project**
   ```bash
   cd website-reijners-technics
   ```

2. **Open in een webserver** (belangrijk! Niet direct `index.html` openen)
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Daarna: http://localhost:8000
   ```

3. **Of gebruik Live Server extension in VS Code**
   - Install "Live Server" extension
   - Right-click op `index.html`
   - Select "Open with Live Server"

### Setup Formspree (voor contact formulier)

Het contact formulier moet geconfigureerd worden met Formspree:

1. Ga naar [formspree.io](https://formspree.io)
2. Maak een account aan met: `reijnerstechnics@gmail.com`
3. Maak een nieuw formulier aan
4. Kopieer de Form ID (format: `f/xxxxx`)
5. Vervang de form action URL in `pages/contact.html`:
   ```html
   <form action="https://formspree.io/f/YOUR_ID_HERE" method="POST">
   ```

---

## Componenten

### 🧮 Offerte Calculator (`js/offerte-calculator.js`)

De calculator is **zeer goed gedocumenteerd** met:
- Stap-voor-stap comments voor elke functie
- Uitleg van alle variabelen
- Detailledesprijsberekening met BTW

**Hoe het werkt:**
1. Gebruiker selecteert producttype (warmtepomp, airco, etc.)
2. Voert ruimtegrootte in (m²)
3. Selecteert installatie-complexiteit
4. Kiest onderhoudsopties
5. Calculator toont totale prijs met breakdown

**Prijs formule:**
```
Totaal = (Base_Price × Room_Size_Factor × Installation_Factor) + Installation_Cost + Maintenance_Price
Eindtotaal = Totaal + 21% BTW
```

### 📧 Contact Formulier (`js/contact-form.js`)

Integratie met Formspree voor directe email verzending.
- Validatie van invoervelden
- Feedback aan gebruiker
- Analytics tracking

### 🎠 Carousels (`js/main.js`)

Professionele afbeeldingssliders voor:
- Toestellen/producten showcase
- Realisaties gallery
- Brand/merk fotogalerie

Features:
- Vorige/Volgende navigatie
- Dot indicators
- Automatische wrapping
- Smooth transitions

### 📋 FAQ Accordion (`js/main.js`)

Uitklapbare vragen en antwoorden met smooth animaties.

---

## Styling

### CSS Variabelen

Alle kleuren en fonts zijn gedefinieerd als CSS variabelen in `css/variables.css`:

```css
:root {
  --ink: #16283d;           /* Donkerblauw - primaire tekst */
  --gold: #e3a63e;          /* Goud - accent & highlights */
  --sky: #3e7fb0;           /* Hemelsblauw - secondary color */
  --paper: #f6f9fb;         /* Lichte achtergrond */
  --surface: #ffffff;       /* Witte kaarten */
}
```

### Responsive Design

Website breakpoints:
- **Desktop**: 1120px max-width
- **Tablet**: tot 840px
- **Mobile**: tot 640px

---

## JavaScript Modules

### `main.js` - Algemene Functies

**Navigatie:**
- `showPage(pageName)` - Toon pagina
- `initNavigation()` - Setup nav links

**Carousels:**
- `initCarousels()` - Setup alle sliders
- Automatisch vorige/volgende navigatie

**FAQs:**
- `initFAQs()` - Setup accordion click handlers

**Utilities:**
- `formatCurrency(value)` - EUR formatting
- `formatDate(date)` - Dutch date formatting
- `debounce(func, delay)` - Event debouncing

### `offerte-calculator.js` - Calculator

**Configuratie:**
- `PRICING` - Alle prijzen en factoren
- `CALCULATOR_STEPS` - Vragenreeks

**Functies:**
- `initCalculator()` - Setup calculator
- `showCalculatorStep(index)` - Toon vraag
- `nextCalculatorStep()` - Volgende stap
- `calculateQuote()` - Bereken totaal
- `calculateAndShowQuote()` - Toon resultaat

### `contact-form.js` - Contact Handler

**Functies:**
- `initContactForm()` - Setup formulier
- `logFormSubmit(event)` - Log submission

---

## Development

### Adding New Pages

1. Maak een nieuw HTML bestand in `pages/`
2. Gebruik template uit bestaande pagina
3. Update navigatie in HTML header
4. Import JavaScript modules aan het eind

### Modifying Prices

Prijzen staan in `js/offerte-calculator.js`:

```javascript
const PRICING = {
  products: {
    'warmtepomp-lucht-lucht': {
      basePrice: 2500,  // Wijzig hier
      // ...
    }
  }
}
```

### Updating Colors

Kleuren staan in `css/variables.css`:

```css
:root {
  --gold: #e3a63e;        /* Wijzig naar andere kleur */
  --ink: #16283d;
  /* ... */
}
```

---

## Browser Support

✅ Chrome/Edge (latest)  
✅ Firefox (latest)  
✅ Safari (latest)  
✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## Performance

**Current optimizations:**
- Minimale CSS (~6KB)
- Modulair JavaScript (load on demand)
- Image lazy loading (native)
- No external dependencies
- ~500KB total page weight (including images)

---

## Deployment

### Static Hosting (Recommended)

Upload naar:
- Netlify
- Vercel
- GitHub Pages
- Any static host

### Self-hosted

```bash
# Via Python
python -m http.server 8000

# Via Node
npx http-server

# Via nginx
# Point root to website-reijners-technics/
```

---

## Support & Maintenance

### Regular Tasks

- ✅ Monitor Formspree submissions
- ✅ Update pricing in calculator as needed
- ✅ Add new project photos to gallery
- ✅ Update testimonials/reviews

### Issues & Questions

Raadpleeg:
- `docs/STRUCTURE.md` voor technische details
- `docs/CONTRIBUTING.md` voor development workflow
- JavaScript comments voor functie-uitleg

---

## License

Copyright © 2024 Reijners Technics. Alle rechten voorbehouden.

---

**Last updated:** October 2024  
**Version:** 2.0 (Refactored)  
**Author:** Claude (AI Assistant)  
**Repository:** Local development environment
