/**
 * =====================================================================
 *  CONTACT FORM HANDLER - Reijners Technics
 * =====================================================================
 *
 * Handles the contact form submission and integrates with Formspree
 * for email delivery. Provides validation and user feedback.
 *
 * FORMSPREE INTEGRATION:
 * This form submits to: https://formspree.io/f/mdeakpaq
 *
 * Setup:
 * 1. Visit https://formspree.io
 * 2. Sign up with your email
 * 3. Create a new form endpoint
 * 4. Replace the form action URL with your endpoint
 *
 * ===================================================================== */


/**
 * Initialize contact form when the form page loads.
 * Sets up event listeners for form submission.
 */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) {
    console.warn('Contact form not found');
    return;
  }

  // Log when form is submitted (for debugging)
  contactForm.addEventListener('submit', function(e) {
    console.log('Contact form submitted', {
      email: this.querySelector('input[name="email"]')?.value,
      name: this.querySelector('input[name="name"]')?.value,
      timestamp: new Date().toISOString()
    });
  });
}

/**
 * Log form submission for analytics/debugging.
 * Called when the contact form is submitted.
 *
 * @param {Event} event - The form submission event
 */
function logFormSubmit(event) {
  console.log('Form submitted via Formspree', {
    formData: new FormData(event.target),
    timestamp: new Date().toISOString()
  });
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContactForm);
} else {
  initContactForm();
}
