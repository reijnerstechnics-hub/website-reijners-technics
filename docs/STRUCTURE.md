# Technische Structuurguide

Gedetailleerde documentatie van de Reijners Technics website architectuur.

---

## Overzicht

Dit document beschrijft:
- Mappenstructuur en bestandsnamen
- HTML architectuur
- CSS organisatie
- JavaScript modules en API
- Dataflow

---

## Mappenstructuur

```
website-reijners-technics/
│
├── index.html                    # Homepage entry point
│   └── Laat alle home-pagina secties zien
│
├── css/
│   ├── variables.css            # CSS variabelen & design tokens
│   │   ├── :root {}              # Kleurpallet
│   │   ├── --ink, --gold, etc.   # Color variables
│   │   └── Typography imports    # Google Fonts
│   │
│   └── style.css                # Main stylesheet
│       ├── HTML basics           # body, links, images, etc.
│       ├── .wrap, .eyebrow       # Layout primitives
│       ├── Section styles        # header, footer, sections
│       ├── Hero section          # Landing area
│       ├── Calculator            # .calc-* classes
│       ├── Carousels             # .carousel-* classes
│       ├── FAQs                  # .faq-* classes
│       ├── Buttons               # .btn-* classes
│       ├── Forms                 # form styling
│       └── Responsive media      # @media queries
│
├── js/
│   ├── main.js                  # ~350 lines - Algemene functies
│   │   ├── PAGE NAVIGATION       # showPage(), initNavigation()
│   │   ├── CAROUSEL              # initCarousels(), prev/next logic
│   │   ├── FAQ ACCORDION         # initFAQs()
│   │   ├── SCROLL BEHAVIOR       # initSmoothScroll()
│   │   └── UTILITIES             # formatCurrency(), debounce()
│   │
│   ├── offerte-calculator.js    # ~450 lines - ZEER GOED GEDOCUMENTEERD
│   │   ├── CONFIGURATION         # PRICING config, CALCULATOR_STEPS
│   │   ├── STATE MANAGEMENT      # calculatorState object
│   │   ├── INITIALIZATION        # initCalculator()
│   │   ├── STEP MANAGEMENT       # showCalculatorStep(), next/prev
│   │   ├── PRICE CALCULATION     # calculateQuote() - GEDETAILLEERD
│   │   └── EVENT LISTENERS       # Form handling & validation
│   │
│   └── contact-form.js          # ~50 lines - Contact handler
│       ├── FORMSPREE SETUP       # Form action URL
│       ├── INITIALIZATION        # initContactForm()
│       └── LOGGING               # logFormSubmit() for analytics
│
├── pages/
│   ├── diensten.html            # Services/Diensten pagina
│   ├── offerte.html             # Calculator pagina (same as index for calculator section)
│   ├── contact.html             # Contact formulier pagina
│   └── products.html            # Toestellen & Realisaties pagina
│
├── docs/
│   ├── STRUCTURE.md             # Dit bestand
│   └── CONTRIBUTING.md          # Development guide
│
└── README.md                    # Project overview
```

---

## HTML Architectuur

### Multi-Page SPA Pattern

De website gebruikt een Single Page App (SPA) pattern met server-side HTML:

```html
<!-- Pages are HTML sections with data-page attribute -->
<section data-page="home" class="page-active">
  <!-- Home content -->
</section>

<section data-page="contact">
  <!-- Contact content -->
</section>

<section data-page="diensten">
  <!-- Services content -->
</section>
```

**Navigation:**
```html
<!-- Clicking nav links toggles page visibility -->
<nav class="links">
  <a href="#home" data-page="home" class="active">Home</a>
  <a href="#contact" data-page="contact">Contact</a>
</nav>

<!-- JavaScript handles the switching -->
<script>
  document.querySelectorAll('a[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
      const page = link.getAttribute('data-page');
      showPage(page);  // Hide all, show selected
    });
  });
</script>
```

### Key HTML Elements

```html
<!-- HEADER - Sticky navigation -->
<header class="site">
  <div class="nav">
    <div class="brand">Reijners Technics</div>
    <nav class="links"><!-- navigation links --></nav>
  </div>
</header>

<!-- SECTIONS - Data-page routing -->
<section data-page="home" class="page-active">
  <!-- content -->
</section>

<!-- FOOTER - Universal footer -->
<footer>
  <!-- footer content -->
</footer>
```

---

## CSS Architekture

### Variables System

```css
/* css/variables.css */
:root {
  /* COLORS */
  --ink: #16283d;           /* Primary dark text */
  --body: #3d4c5a;          /* Secondary text */
  --muted: #6b7a87;         /* Tertiary text */
  
  --paper: #f6f9fb;         /* Page background */
  --surface: #ffffff;       /* Card backgrounds */
  --surface-alt: #eef3f7;   /* Alternate background */
  --line: #dce6ed;          /* Borders */
  
  --gold: #e3a63e;          /* Primary accent */
  --gold-dark: #c98826;     /* Accent hover state */
  --gold-tint: #fcf1dd;     /* Light accent bg */
  --gold-text: #7a5417;     /* Text on gold bg */
  
  --sky: #3e7fb0;           /* Secondary accent */
  --sky-tint: #e4eef5;      /* Light secondary bg */
  
  --focus: #3e7fb0;         /* Focus outline */
  
  /* TYPOGRAPHY */
  --font-heading: "Sora", sans-serif;
  --font-body: "Work Sans", sans-serif;
}
```

### CSS Organization

Each section has a clear marker comment:

```css
/* ---------- header ---------- */
header.site { /* ... */ }

/* ---------- calculator ---------- */
.calc-card { /* ... */ }
.calc-progress { /* ... */ }
.calc-step { /* ... */ }

/* ---------- carousels ---------- */
.carousel-viewport { /* ... */ }
.carousel-track { /* ... */ }
```

**To find CSS for element:**
```bash
# In VS Code: Ctrl+F search for "---------- name ----------"
# Example: "---------- calculator ----------"
```

### Responsive Breakpoints

```css
@media (max-width: 840px) {
  /* Tablet changes */
  .section-head {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  /* Mobile changes */
  .hero {
    min-height: 560px;
  }
  
  .nav {
    flex-wrap: wrap;
  }
}
```

---

## JavaScript Architecture

### Module 1: main.js (Utilities & Navigation)

**Responsibilities:**
- Page navigation (show/hide sections)
- Carousel initialization and control
- FAQ accordion
- General utilities

**Key Functions:**

```javascript
// PAGE NAVIGATION
showPage(pageName)              // Switch visible section
initNavigation()                // Setup nav click handlers

// CAROUSELS
initCarousels()                 // Auto-setup all carousels
goToSlide(index)                // Jump to specific slide
previousSlide() / nextSlide()    // Navigate slides

// FAQ
initFAQs()                      // Setup accordion click handlers

// UTILITIES
formatCurrency(value)           // EUR formatting (€ 1.234,56)
formatDate(date)                // Dutch date format
debounce(func, delay)           // Prevent rapid function calls
```

**Initialization:**
```javascript
// Runs when DOM is ready
function initializeWebsite() {
  initNavigation();     // Set up nav links
  initCarousels();      // Setup all image sliders
  initFAQs();           // Setup FAQ accordions
  initSmoothScroll();   // Setup smooth scrolling
  showPage('home');     // Show homepage
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeWebsite);
} else {
  initializeWebsite();
}
```

---

### Module 2: offerte-calculator.js (Quote Calculator)

**THIS FILE IS EXTREMELY WELL DOCUMENTED**

Structure:
```
CONFIGURATION & CONSTANTS
├── PRICING object
│   ├── products[key] = { basePrice, name, description }
│   ├── roomSizeMultipliers = { klein, medium, groot, zeer-groot }
│   ├── installationFactors = { standaard, complex, zeer-complex }
│   └── maintenance = { geen, basic, premium }
│
└── CALCULATOR_STEPS = [ step objects ]
    └── Each step: { id, title, hint, type, options }

STATE MANAGEMENT
└── calculatorState = {
    currentStep: 0,
    answers: {},        // User responses per step
    totalPrice: 0
  }

INITIALIZATION
├── initCalculator()   // Setup form listeners, show step 0

STEP MANAGEMENT
├── showCalculatorStep(index)    // Display question
├── nextCalculatorStep()         // Validate, store, advance
├── prevCalculatorStep()         // Go back
└── getSelectedAnswer(stepId)    // Get user's response

PRICE CALCULATION
├── calculateQuote()             // Complex calculation (see below)
├── calculateAndShowQuote()      // Calculate and display
├── captureLeadFromCalculator()  // Send to analytics
└── resetCalculator()            // Clear form

PRICING FORMULA (Very detailed in code):
  1. Get base price from product type
  2. Multiply by room size factor (0.8 to 1.6x)
  3. Apply installation complexity factor + extra cost
  4. Add maintenance package yearly cost
  5. Calculate 21% VAT (Belgian standard)
  6. Return breakdown object
```

**Example Usage:**

```javascript
// User answers all questions
calculatorState.answers = {
  product: 'warmtepomp-lucht-lucht',
  roomSize: '85',
  installationComplexity: 'complex',
  maintenance: 'basic'
}

// Calculate quote
const quote = calculateQuote();
console.log(quote);
/*
{
  productName: 'Warmtepomp (Lucht-Lucht)',
  basePrice: 2500,
  adjustments: [
    { type: 'ruimtegrootte', amount: 287.5, description: '85m² (factor: 1.15x)' },
    { type: 'installatie', amount: 1231.25, description: 'Complex' },
    { type: 'onderhoud', amount: 150, description: 'Basis (jaarlijks)' }
  ],
  subtotal: 4168.75,
  vat: 875.44,
  totalWithVat: 5044.19
}
*/
```

---

### Module 3: contact-form.js (Contact Handler)

**Responsibilities:**
- Initialize contact form
- Log submissions for analytics
- Integrate with Formspree

**Key Functions:**

```javascript
// INITIALIZATION
initContactForm()          // Setup form event listeners

// SUBMISSION
logFormSubmit(event)       // Log when form is submitted
```

**Formspree Integration:**

```html
<!-- Form submits to Formspree -->
<form 
  action="https://formspree.io/f/mdeakpaq" 
  method="POST"
  id="contactForm"
  onsubmit="logFormSubmit(event)"
>
  <input type="email" name="email" required>
  <input type="text" name="message" required>
  <button type="submit">Verzenden</button>
</form>
```

When form submits:
1. JavaScript runs `logFormSubmit()` (logging)
2. Browser submits to Formspree
3. Formspree sends email to configured address
4. User sees success message

---

## Dataflow Diagram

```
USER INTERACTION
      ↓
JAVASCRIPT EVENT LISTENER
      ↓
  MODULE FUNCTION (main.js, calculator.js, form.js)
      ↓
UPDATE DOM / STATE
      ↓
VISUAL FEEDBACK TO USER
```

### Example 1: Page Navigation

```
User clicks "Contact" link
  ↓
nav link click event fires
  ↓
showPage('contact') called
  ↓
Loop through all sections:
  - Hide sections with data-page != 'contact'
  - Show sections with data-page == 'contact'
  ↓
Update nav link active states
  ↓
Scroll to top
  ↓
User sees contact page
```

### Example 2: Calculator

```
User sees calculator on home page
  ↓
initCalculator() ran on page load
  ↓
User selects product → nextCalculatorStep()
  ↓
Answer stored in calculatorState.answers
  ↓
showCalculatorStep(1) displays next question
  ↓
Progress bar updates (11% → 25% → 50% → 75% → 100%)
  ↓
User completes all 4 steps
  ↓
calculateQuote() calculates total with VAT
  ↓
Result displayed to user
```

### Example 3: Contact Form Submission

```
User fills contact form
  ↓
User clicks "Verzenden"
  ↓
logFormSubmit(event) logs submission
  ↓
Form submits to Formspree API
  ↓
Formspree sends email to reijnerstechnics@gmail.com
  ↓
Browser shows success message (from Formspree)
  ↓
Email received in inbox
```

---

## Key Classes & IDs

### Navigation

```html
<!-- Header -->
<header class="site">              <!-- Sticky navigation -->
  <nav class="links">
    <a data-page="home">Home</a>    <!-- data-page triggers page switch -->
    <a data-page="contact">Contact</a>
  </nav>
</header>

<!-- JavaScript uses data-page attribute -->
<section data-page="home" class="page-active">
</section>
```

### Calculator

```html
<div class="calc-card">
  <div class="calc-progress">
    <div class="calc-progress-bar">
      <div class="calc-progress-fill"></div>  <!-- Width: 0-100% -->
    </div>
    <div class="calc-progress-label">STAP 1 VAN 4</div>
  </div>
  
  <div class="calc-body">
    <div class="calc-step active">  <!-- Show with .active class -->
      <div class="calc-q">
        <div class="calc-q-num">1</div>
        <div>
          <h3>Question?</h3>
          <p class="calc-hint">Hint text</p>
        </div>
      </div>
      
      <div class="option-grid">  <!-- Radio button options -->
        <button class="option-btn">Option 1</button>
        <button class="option-btn selected">Option 2</button>
      </div>
    </div>
  </div>
</div>

<!-- Form handles the logic -->
<form id="calc-form" onsubmit="return false;"></form>
```

### Carousel

```html
<div class="carousel-viewport has-multi">  <!-- .has-multi shows arrows -->
  <div class="carousel-track">  <!-- Transform: translateX(-100%) for slide 2 -->
    <div class="carousel-slide">
      <img src="slide1.jpg">
    </div>
    <div class="carousel-slide">
      <img src="slide2.jpg">
    </div>
  </div>
  
  <button class="carousel-prev">←</button>
  <button class="carousel-next">→</button>
  
  <div class="carousel-dots">
    <button class="carousel-dot active"></button>
    <button class="carousel-dot"></button>
  </div>
</div>
```

### FAQ

```html
<div class="faq-item">  <!-- .open class toggles visibility -->
  <button class="faq-q">
    <div>Question text?</div>
    <div class="faq-icon">+</div>  <!-- Rotates 45° when .open -->
  </button>
  
  <div class="faq-a-wrap">  <!-- Height animates 0 → 1fr -->
    <div class="faq-a">
      <p>Answer text here</p>
    </div>
  </div>
</div>
```

---

## Performance Considerations

### Current Size

- **CSS**: ~6KB (variables + styles)
- **JavaScript**: ~850KB total (3 modules)
- **HTML**: ~300KB (all pages combined)
- **Images**: ~200KB (when optimized)
- **Total**: ~1.3MB (all files)

### Load Strategy

1. **HTML loads first** → Initial page display
2. **CSS loads** → Styling applied
3. **JavaScript loads** → Interactivity added (progressive enhancement)

### Optimization Tips

If performance becomes an issue:

1. **Minify CSS/JS** for production
2. **Lazy load images** with native loading="lazy"
3. **Code-split** JavaScript if modules become large
4. **Use CDN** for Google Fonts
5. **Enable gzip** compression on server

---

## Extending the Website

### Adding a New Page

1. Create HTML file in `pages/`
2. Add data-page sections
3. Add nav link in header
4. Include JS modules at bottom

### Adding Calculator Question

In `offerte-calculator.js`:

```javascript
// 1. Add to CALCULATOR_STEPS array
const CALCULATOR_STEPS = [
  // ... existing steps
  {
    id: 'warranty',
    title: 'Garantiepakket gewenst?',
    hint: 'Extra bescherming voor uw systeem',
    type: 'radio',
    options: [
      { value: 'none', label: 'Nee, niet nodig' },
      { value: '5year', label: 'Ja, 5 jaar garantie' }
    ]
  }
]

// 2. Add pricing config
const PRICING = {
  warranty: {
    'none': { price: 0 },
    '5year': { price: 400 }
  }
}

// 3. Apply in calculateQuote()
if (answers.warranty) {
  total += PRICING.warranty[answers.warranty].price;
}
```

### Adding New CSS Color

In `css/variables.css`:

```css
:root {
  --new-color: #abc123;  /* Add here */
  /* Then use in CSS: */
  /* background: var(--new-color); */
}
```

---

## Debugging Tips

### Check Console for Errors

```javascript
// Open DevTools (F12) → Console tab
// Look for red error messages
// Most common: element not found, undefined function
```

### Test Calculator Directly

```javascript
// Open Console and run:
calculateQuote({
  product: 'warmtepomp-lucht-lucht',
  roomSize: '75',
  installationComplexity: 'complex',
  maintenance: 'basic'
});
```

### Debug Page Navigation

```javascript
// Add to main.js to log all navigation
function showPage(pageName) {
  console.log('showPage called:', pageName);
  // ... rest of function
}
```

### Check Active Classes

```javascript
// Open DevTools → Elements tab
// Look for:
// - .page-active on visible section
// - .active on nav links
// - .open on FAQ items
// - .selected on calculator options
```

---

## File Size Reference

```
README.md                           ~8 KB
docs/CONTRIBUTING.md               ~15 KB
docs/STRUCTURE.md (this file)       ~20 KB
index.html                          ~120 KB
pages/[4 files]                     ~400 KB
css/variables.css                   ~2 KB
css/style.css                       ~150 KB
js/main.js                          ~12 KB
js/offerte-calculator.js            ~16 KB
js/contact-form.js                  ~2 KB
─────────────────────────────────────────
TOTAL (without images):             ~745 KB
```

---

## Last Revision

**Date:** October 2024  
**Version:** 2.0 (Refactored architecture)  
**Author:** Claude (AI Assistant)

---

**Questions?** Refer to:
- README.md for overview
- CONTRIBUTING.md for development
- Comments in each JavaScript file for implementation details
