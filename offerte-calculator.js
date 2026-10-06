/**
 * =====================================================================
 *  OFFERTE CALCULATOR - Reijners Technics
 * =====================================================================
 *
 * This module handles the interactive offerte (quote) calculator.
 * It manages step-by-step questions, calculates pricing based on
 * product type, room size, installation complexity, and maintenance.
 *
 * KEY FEATURES:
 * - Multi-step form with progress tracking
 * - Real-time price calculation
 * - Form validation and data persistence
 * - Integration with lead capture system
 *
 * ===================================================================== */


// =====================================================================
//  CONFIGURATION & CONSTANTS
// =====================================================================

/**
 * Pricing configuration for the calculator.
 * All prices are in EUR.
 *
 * Structure:
 * - Base prices per product type
 * - Installation factors (varies by room size and complexity)
 * - Maintenance options
 */
const PRICING = {
  // Product base prices (starting price per unit)
  products: {
    'warmtepomp-lucht-lucht': {
      name: 'Warmtepomp (Lucht-Lucht)',
      basePrice: 2500,
      description: 'Effectieve verwarming en koeling'
    },
    'airco-split': {
      name: 'Airco Split System',
      basePrice: 1800,
      description: 'Compact cooling solution'
    },
    'airco-kanaal': {
      name: 'Airco Kanaaluitvoering',
      basePrice: 3200,
      description: 'Centraal luchtbehandelingssysteem'
    },
    'warmtepomp-grond': {
      name: 'Warmtepomp (Bodem)',
      basePrice: 6500,
      description: 'Zeer efficiënt, maar complexe installatie'
    }
  },

  // Room size multipliers
  roomSizeMultipliers: {
    'klein': { min: 20, max: 50, factor: 0.8, label: 'Klein (20-50 m²)' },
    'medium': { min: 50, max: 100, factor: 1.0, label: 'Medium (50-100 m²)' },
    'groot': { min: 100, max: 200, factor: 1.3, label: 'Groot (100-200 m²)' },
    'zeer-groot': { min: 200, max: 500, factor: 1.6, label: 'Zeer groot (200+ m²)' }
  },

  // Installation complexity factors
  installationFactors: {
    'standaard': { factor: 1.0, cost: 0, label: 'Standaard' },
    'complex': { factor: 1.3, cost: 500, label: 'Complex (veel buiswerk, etc.)' },
    'zeer-complex': { factor: 1.5, cost: 1200, label: 'Zeer complex (renovatie, etc.)' }
  },

  // Maintenance packages
  maintenance: {
    'geen': { price: 0, label: 'Geen' },
    'basic': { price: 150, label: 'Basis (jaarlijks controlepakket)' },
    'premium': { price: 300, label: 'Premium (4x per jaar onderhoud)' }
  }
};

/**
 * Question sequence for the calculator.
 * Each step asks one focused question and stores the answer.
 */
const CALCULATOR_STEPS = [
  {
    id: 'product',
    title: 'Welk systeem interesseert u?',
    hint: 'Dit bepaalt de basisprijs van uw installatie',
    type: 'radio',
    options: Object.entries(PRICING.products).map(([key, val]) => ({
      value: key,
      label: val.name,
      desc: val.description
    }))
  },
  {
    id: 'roomSize',
    title: 'Wat is de grootte van uw ruimte?',
    hint: 'In vierkante meters (m²). Dit beïnvloedt de systeemgrootte.',
    type: 'custom'
  },
  {
    id: 'installationComplexity',
    title: 'Hoe complex is de installatie?',
    hint: 'Afhankelijk van uw huissituatie',
    type: 'radio',
    options: Object.entries(PRICING.installationFactors).map(([key, val]) => ({
      value: key,
      label: val.label
    }))
  },
  {
    id: 'maintenance',
    title: 'Wilt u een onderhoudscontract?',
    hint: 'Helpt uw systeem lang mee te gaan',
    type: 'radio',
    options: Object.entries(PRICING.maintenance).map(([key, val]) => ({
      value: key,
      label: val.label
    }))
  }
];


// =====================================================================
//  STATE MANAGEMENT
// =====================================================================

/**
 * Stores the current calculator state.
 *
 * Properties:
 * - currentStep: Index in CALCULATOR_STEPS
 * - answers: Object with user's responses per step ID
 * - totalPrice: Calculated total price in EUR
 */
let calculatorState = {
  currentStep: 0,
  answers: {},
  totalPrice: 0,
  selectedProduct: null
};


// =====================================================================
//  INITIALIZATION
// =====================================================================

/**
 * Initialize the calculator when DOM is ready.
 * Sets up event listeners and displays the first question.
 */
function initCalculator() {
  const form = document.getElementById('calc-form');
  if (!form) {
    console.warn('Calculator form not found');
    return;
  }

  // Show first question
  showCalculatorStep(0);

  // Reset calculator when page loads
  calculatorState.currentStep = 0;
  calculatorState.answers = {};
  calculatorState.totalPrice = 0;
}


// =====================================================================
//  STEP MANAGEMENT
// =====================================================================

/**
 * Display a specific calculator step/question.
 * Updates the progress bar and shows the appropriate question form.
 *
 * @param {number} stepIndex - The step to display (0-based)
 */
function showCalculatorStep(stepIndex) {
  const totalSteps = CALCULATOR_STEPS.length;
  const step = CALCULATOR_STEPS[stepIndex];

  if (!step) {
    console.error('Invalid step index:', stepIndex);
    return;
  }

  // Update state
  calculatorState.currentStep = stepIndex;

  // Update progress bar
  const progressPercent = ((stepIndex + 1) / totalSteps) * 100;
  const progressBar = document.querySelector('.calc-progress-fill');
  if (progressBar) {
    progressBar.style.width = progressPercent + '%';
  }

  const progressLabel = document.querySelector('.calc-progress-label');
  if (progressLabel) {
    progressLabel.textContent = `STAP ${stepIndex + 1} VAN ${totalSteps}`;
  }

  // Hide all steps
  document.querySelectorAll('.calc-step').forEach(el => {
    el.classList.remove('active');
  });

  // Show current step
  const currentStepEl = document.getElementById('calc-step-' + stepIndex);
  if (currentStepEl) {
    currentStepEl.classList.add('active');
  }
}

/**
 * Move to next calculator step.
 * Validates current answer before proceeding.
 *
 * @returns {boolean} True if successfully moved, false if validation failed
 */
function nextCalculatorStep() {
  const currentStep = CALCULATOR_STEPS[calculatorState.currentStep];

  // Get the selected answer for validation
  const selectedValue = getSelectedAnswer(currentStep.id);

  if (!selectedValue && currentStep.id !== 'roomSize') {
    alert('Selecteer een optie om verder te gaan');
    return false;
  }

  // Store answer
  calculatorState.answers[currentStep.id] = selectedValue;

  // Move to next step
  const nextIndex = calculatorState.currentStep + 1;
  if (nextIndex < CALCULATOR_STEPS.length) {
    showCalculatorStep(nextIndex);
    return true;
  } else {
    // All steps completed - calculate and show result
    calculateAndShowQuote();
    return true;
  }
}

/**
 * Move to previous calculator step.
 */
function prevCalculatorStep() {
  if (calculatorState.currentStep > 0) {
    showCalculatorStep(calculatorState.currentStep - 1);
  }
}

/**
 * Get the currently selected answer for a given step ID.
 *
 * @param {string} stepId - The step identifier
 * @returns {string|null} The selected value or null if nothing selected
 */
function getSelectedAnswer(stepId) {
  const form = document.getElementById('calc-form');
  if (!form) return null;

  // Check for radio button selections
  const selected = form.querySelector('input[name="calc-' + stepId + '"]:checked');
  if (selected) {
    return selected.value;
  }

  // Check for text input (room size)
  const input = form.querySelector('input[data-step="' + stepId + '"]');
  if (input && input.value) {
    return input.value;
  }

  return null;
}


// =====================================================================
//  PRICE CALCULATION
// =====================================================================

/**
 * Calculate the total quote based on all user answers.
 *
 * Calculation formula:
 * 1. Base price from product type
 * 2. Multiply by room size factor
 * 3. Apply installation complexity factor + additional cost
 * 4. Add maintenance package price
 * 5. Add 21% VAT (Austrian/Belgian standard)
 *
 * @returns {object} Breakdown with basePrice, adjustments, total, and VAT
 */
function calculateQuote() {
  const answers = calculatorState.answers;

  // Start with base price
  const productKey = answers.product;
  const productConfig = PRICING.products[productKey];
  if (!productConfig) {
    console.error('Invalid product:', productKey);
    return null;
  }

  let total = productConfig.basePrice;
  const breakdown = {
    basePrice: productConfig.basePrice,
    productName: productConfig.name,
    adjustments: []
  };

  // Apply room size factor
  const roomSizeValue = parseInt(answers.roomSize);
  if (roomSizeValue && !isNaN(roomSizeValue)) {
    // Find the appropriate multiplier based on size
    let multiplier = 1.0;
    for (const [key, config] of Object.entries(PRICING.roomSizeMultipliers)) {
      if (roomSizeValue >= config.min && roomSizeValue <= config.max) {
        multiplier = config.factor;
        break;
      }
    }

    if (multiplier !== 1.0) {
      const adjustment = (total * (multiplier - 1)).toFixed(2);
      breakdown.adjustments.push({
        type: 'ruimtegrootte',
        amount: adjustment,
        description: `${roomSizeValue}m² (factor: ${multiplier}x)`
      });
      total = (total * multiplier).toFixed(2);
    }
  }

  // Apply installation complexity
  const complexityKey = answers.installationComplexity;
  const complexityConfig = PRICING.installationFactors[complexityKey];
  if (complexityConfig && complexityConfig.factor !== 1.0) {
    const adjustment = (total * (complexityConfig.factor - 1)).toFixed(2);
    breakdown.adjustments.push({
      type: 'installatie',
      amount: adjustment,
      description: complexityConfig.label
    });
    if (complexityConfig.cost > 0) {
      breakdown.adjustments.push({
        type: 'extra_kosten',
        amount: complexityConfig.cost,
        description: 'Extra installatie kosten'
      });
    }
    total = (parseFloat(total) * complexityConfig.factor + complexityConfig.cost).toFixed(2);
  }

  // Add maintenance
  const maintenanceKey = answers.maintenance;
  const maintenanceConfig = PRICING.maintenance[maintenanceKey];
  if (maintenanceConfig && maintenanceConfig.price > 0) {
    breakdown.adjustments.push({
      type: 'onderhoud',
      amount: maintenanceConfig.price,
      description: maintenanceConfig.label + ' (jaarlijks)'
    });
    total = (parseFloat(total) + maintenanceConfig.price).toFixed(2);
  }

  // Calculate VAT (21% voor België)
  const vatRate = 0.21;
  const vat = (parseFloat(total) * vatRate).toFixed(2);
  const totalWithVat = (parseFloat(total) + parseFloat(vat)).toFixed(2);

  breakdown.subtotal = total;
  breakdown.vat = vat;
  breakdown.totalWithVat = totalWithVat;

  return breakdown;
}

/**
 * Calculate quote and display result to user.
 * Shows the quote and prompts user to contact for details.
 */
function calculateAndShowQuote() {
  const quote = calculateQuote();
  if (!quote) {
    alert('Er is een fout opgetreden bij de berekening');
    return;
  }

  // Store in state
  calculatorState.totalPrice = quote.totalWithVat;

  // Display result (you'll need to implement the UI for this)
  console.log('Quote calculated:', quote);

  // Trigger lead capture
  captureLeadFromCalculator(quote);
}

/**
 * Send the calculator results to lead tracking system.
 * Called when user completes the calculator.
 *
 * @param {object} quoteData - The calculated quote breakdown
 */
function captureLeadFromCalculator(quoteData) {
  // This would typically send data to your backend or lead service
  console.log('Capturing lead:', {
    timestamp: new Date().toISOString(),
    answers: calculatorState.answers,
    quote: quoteData
  });

  // TODO: Implement actual lead capture
  // e.g., call analytics tracking, CRM API, etc.
}

/**
 * Reset the calculator to the beginning.
 * Clears all answers and shows the first question.
 */
function resetCalculator() {
  calculatorState = {
    currentStep: 0,
    answers: {},
    totalPrice: 0,
    selectedProduct: null
  };
  showCalculatorStep(0);
}


// =====================================================================
//  EVENT LISTENERS
// =====================================================================

// Initialize when document is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCalculator);
} else {
  initCalculator();
}
