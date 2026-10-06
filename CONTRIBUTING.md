# Contributing Guide

Handleiding voor bijdragen aan de Reijners Technics website.

---

## Git Workflow

### 1. Branch Naamgeving

Gebruik duidelijke branch namen:

```bash
# Nieuwe feature
git checkout -b feature/calculator-update

# Bug fix
git checkout -b bugfix/contact-form-validation

# Kleine improvements
git checkout -b chore/update-styling

# Documentation
git checkout -b docs/add-deployment-guide
```

### 2. Commit Message Format

Schrijf duidelijke commit messages:

```bash
# Feature commit
git commit -m "feat: add price breakdown display to calculator"

# Bug fix
git commit -m "fix: correct VAT calculation in quote"

# Styling
git commit -m "style: improve mobile responsiveness"

# Documentation
git commit -m "docs: explain calculator pricing formula"

# Refactoring
git commit -m "refactor: organize calculator into separate functions"
```

**Commit message template:**
```
<type>: <subject>

<body - optional, explain why this change>

<footer - optional, reference issues>
```

**Types:**
- `feat` - Nieuwe feature
- `fix` - Bug fix
- `style` - CSS/styling changes
- `refactor` - Code reorganization
- `docs` - Documentation updates
- `chore` - Dependency updates, config changes

### 3. Creating a Pull Request

```bash
# Push your branch
git push origin feature/your-feature-name

# Create PR on GitHub/GitLab
# Title: Short descriptive title
# Description:
# - What does this change?
# - Why is this change needed?
# - How was this tested?
```

---

## Code Style

### HTML Guidelines

```html
<!-- ✅ DO: Clear, semantic markup -->
<form id="contactForm" class="contact-form" novalidate>
  <input type="email" name="email" required>
  <button type="submit">Verzenden</button>
</form>

<!-- ❌ DON'T: Inline styles, unclear class names -->
<form style="display: flex; gap: 10px;">
  <input style="padding: 10px">
</form>
```

### CSS Guidelines

```css
/* ✅ DO: Use variables, comment sections */
.button {
  background: var(--gold);
  padding: var(--spacing-md);
  border-radius: 999px;
}

/* ❌ DON'T: Hardcoded values, no organization */
.button {
  background: #e3a63e;
  padding: 12px 22px;
}
```

**CSS sections should be clearly marked:**

```css
/* ---------- header ---------- */
header.site {
  /* styles */
}

/* ---------- calculator ---------- */
.calc-card {
  /* styles */
}
```

### JavaScript Guidelines

```javascript
// ✅ DO: Excellent comments, clear function names
/**
 * Calculate quote based on user selections.
 * Applies room size multiplier and installation complexity factors.
 * 
 * @param {object} answers - User's calculator responses
 * @returns {object} Quote breakdown with total and VAT
 */
function calculateQuote(answers) {
  // Calculate base price
  const basePrice = PRICING.products[answers.product].basePrice;
  
  // Apply multipliers
  const total = basePrice * getRoomFactor(answers.roomSize);
  
  return total;
}

// ❌ DON'T: Minimal comments, unclear names
function calc(a) {
  let p = 2500;
  p = p * (a / 50);
  return p;
}
```

**Function documentation template:**

```javascript
/**
 * Brief description of what function does.
 * 
 * More detailed explanation if needed.
 * Can span multiple lines.
 * 
 * @param {type} paramName - Description
 * @param {type} optionalParam - Description (optional)
 * @returns {type} Description of return value
 * 
 * @example
 * const result = myFunction(value, options);
 */
function myFunction(paramName, optionalParam) {
  // Implementation with inline comments for complex logic
}
```

---

## Making Changes

### Adding a New Feature

Example: Adding a new discount type to calculator

1. **Update PRICING configuration**
   ```javascript
   // js/offerte-calculator.js
   const PRICING = {
     discounts: {
       'seasonal': { percentage: 0.1, label: 'Winter 10% korting' }
     }
   }
   ```

2. **Add question step**
   ```javascript
   const CALCULATOR_STEPS = [
     // ... existing steps
     {
       id: 'discount',
       title: 'Geldt er een speciale korting?',
       type: 'radio',
       options: [/* discount options */]
     }
   ]
   ```

3. **Update calculation logic**
   ```javascript
   function calculateQuote() {
     // ... existing logic
     
     // Apply discount
     if (answers.discount) {
       const discountAmount = total * PRICING.discounts[answers.discount].percentage;
       total -= discountAmount;
     }
     
     return total;
   }
   ```

4. **Test thoroughly**
   - Test with different inputs
   - Verify calculations are correct
   - Check mobile responsiveness

5. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: add seasonal discount to calculator"
   git push origin feature/seasonal-discount
   ```

### Fixing a Bug

Example: Fixing contact form validation

1. **Identify the issue**
   - Locate problematic code
   - Write down expected vs actual behavior

2. **Create fix branch**
   ```bash
   git checkout -b bugfix/contact-validation
   ```

3. **Make the fix**
   ```javascript
   // js/contact-form.js
   function validateEmail(email) {
     // Fix: Proper email validation
     const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
     return emailRegex.test(email);
   }
   ```

4. **Test the fix**
   - Test with edge cases
   - Verify no other bugs introduced
   - Check both desktop and mobile

5. **Commit**
   ```bash
   git commit -m "fix: improve email validation in contact form"
   ```

### Updating Styling

Example: Changing button colors

1. **Update CSS variables** (preferred)
   ```css
   /* css/variables.css */
   :root {
     --gold: #d4a834;  /* Updated gold */
   }
   ```

2. **Test across pages**
   - Homepage
   - Contact form
   - Calculator
   - Mobile

3. **Commit**
   ```bash
   git commit -m "style: update primary button color to match new branding"
   ```

---

## Testing

### Manual Testing Checklist

Before committing:

- [ ] Feature works on desktop (Chrome, Firefox, Safari)
- [ ] Feature works on mobile (iOS Safari, Chrome Mobile)
- [ ] Links navigate correctly
- [ ] Forms validate input
- [ ] Calculator calculations are correct
- [ ] Images load
- [ ] No console errors
- [ ] Styling looks good

### Testing the Calculator

```javascript
// Open browser console and test:
calculateQuote({
  product: 'warmtepomp-lucht-lucht',
  roomSize: '75',
  installationComplexity: 'complex',
  maintenance: 'basic'
});
// Should return proper quote with breakdown
```

### Testing Forms

1. Open contact form
2. Test with valid email
3. Test with invalid email
4. Test submit (should send to Formspree)
5. Verify email received

---

## Code Review

### What Reviewers Look For

- ✅ Code follows style guidelines
- ✅ Comments explain complex logic
- ✅ No console errors
- ✅ Mobile responsive
- ✅ Proper git commit messages
- ✅ No hardcoded values
- ✅ Accessibility considered

### Requesting Review

Share your branch:
```bash
git push origin feature/your-feature
# Create PR with clear description
```

---

## Common Tasks

### Update Pricing

```javascript
// js/offerte-calculator.js
const PRICING = {
  products: {
    'warmtepomp-lucht-lucht': {
      basePrice: 2800  // Changed from 2500
    }
  }
}
```

### Add New Service

1. Create section in HTML
2. Add styling in CSS
3. Add interactivity in JavaScript if needed
4. Test responsiveness

### Update Contact Info

Look for contact details in:
- `pages/contact.html` - Contact form
- `js/contact-form.js` - Formspree ID
- Footer in HTML files

### Add New FAQ Item

```html
<div class="faq-item">
  <button class="faq-q">
    <div>Vraag hier?</div>
    <div class="faq-icon">+</div>
  </button>
  <div class="faq-a-wrap">
    <div class="faq-a">
      <p>Antwoord hier...</p>
    </div>
  </div>
</div>
```

---

## Documentation

### Updating README

If you change project structure or add features:

```bash
# Edit README.md
# Update:
# - Features list (if adding feature)
# - Project structure (if reorganizing)
# - Setup instructions (if changing)
# - Commit with: docs: update README
```

### Documenting Code

Every function should have JSDoc comment:

```javascript
/**
 * Calculate discount based on user type.
 * 
 * @param {string} userType - Type of customer
 * @returns {number} Discount percentage as decimal (0-1)
 */
function getDiscountPercent(userType) {
  // ...
}
```

---

## Questions?

### Before You Ask

1. Check README.md for common questions
2. Review existing code for examples
3. Check browser console for errors
4. Test with different browsers

### Getting Help

- Check code comments in relevant file
- Review git history: `git log --oneline`
- Check STRUCTURE.md for technical details

---

## Release Checklist

Before deploying to production:

- [ ] All tests pass
- [ ] No console errors
- [ ] Responsive design verified
- [ ] Formspree configured correctly
- [ ] Pricing is current
- [ ] Contact info is accurate
- [ ] All links work
- [ ] Images optimized
- [ ] Browser compatibility checked
- [ ] SEO meta tags updated

---

## Version History

```
v2.0 - Refactored from monolithic to modular (Oct 2024)
  - Split CSS into variables and styles
  - Organized JavaScript into 3 modules
  - Created separate HTML pages
  - Added comprehensive documentation

v1.0 - Original single-file version (2024)
  - Monolithic HTML/CSS/JS
  - All features working
  - 7MB file size
```

---

**Happy contributing!**
