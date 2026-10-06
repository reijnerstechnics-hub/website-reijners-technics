/**
 * =====================================================================
 *  MAIN JAVASCRIPT - Reijners Technics
 * =====================================================================
 *
 * Central utility functions for site navigation, page switching,
 * carousel management, and general interactions.
 *
 * MODULES:
 * - Page navigation (multi-page SPA behavior)
 * - Carousel/slider functionality
 * - FAQ accordion
 * - General utilities
 *
 * ===================================================================== */


// =====================================================================
//  PAGE NAVIGATION
// =====================================================================

/**
 * Show a specific page/section by data-page attribute.
 * Hides all other sections and shows the selected one.
 * Updates active nav link.
 *
 * @param {string} pageName - The data-page value to show (e.g., 'home', 'contact')
 */
function showPage(pageName) {
  // Hide all page sections
  document.querySelectorAll('section[data-page]').forEach(section => {
    section.classList.remove('page-active');
  });

  // Show selected page sections (may be multiple for same page)
  document.querySelectorAll(`section[data-page="${pageName}"]`).forEach(section => {
    section.classList.add('page-active');
  });

  // Update active navigation link
  document.querySelectorAll('nav.links a').forEach(link => {
    if (link.getAttribute('data-page') === pageName) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Scroll to top
  window.scrollTo(0, 0);

  console.log('Navigated to page:', pageName);
}


// =====================================================================
//  CAROUSEL / SLIDER
// =====================================================================

/**
 * Setup carousel/image slider functionality.
 * Handles prev/next navigation and dot indicators.
 */
function initCarousels() {
  document.querySelectorAll('.carousel-viewport').forEach(viewport => {
    const track = viewport.querySelector('.carousel-track');
    const slides = viewport.querySelectorAll('.carousel-slide');

    if (slides.length <= 1) return; // No carousel needed

    const slideCount = slides.length;
    let currentSlide = 0;

    // Add multi-slide indicator
    viewport.classList.add('has-multi');

    // Setup dot indicators
    const dots = viewport.querySelectorAll('.carousel-dot');
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => goToSlide(idx));
    });

    // Setup arrow buttons
    const prevBtn = viewport.querySelector('.carousel-prev');
    const nextBtn = viewport.querySelector('.carousel-next');

    if (prevBtn) {
      prevBtn.addEventListener('click', previousSlide);
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', nextSlide);
    }

    /**
     * Move to specific slide.
     * @param {number} slideIndex - The slide to show (0-based)
     */
    function goToSlide(slideIndex) {
      currentSlide = slideIndex % slideCount;
      const offset = -currentSlide * 100;
      track.style.transform = `translateX(${offset}%)`;

      // Update dot indicators
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentSlide);
      });
    }

    /**
     * Show previous slide (with wrap-around).
     */
    function previousSlide() {
      currentSlide = (currentSlide - 1 + slideCount) % slideCount;
      goToSlide(currentSlide);
    }

    /**
     * Show next slide (with wrap-around).
     */
    function nextSlide() {
      currentSlide = (currentSlide + 1) % slideCount;
      goToSlide(currentSlide);
    }
  });
}


// =====================================================================
//  FAQ ACCORDION
// =====================================================================

/**
 * Setup FAQ accordion functionality.
 * Clicking a question toggles the answer visibility.
 */
function initFAQs() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-q');

    question.addEventListener('click', () => {
      // Toggle this item
      item.classList.toggle('open');

      // Optionally close other FAQs (remove this for allow-multiple behavior)
      // const siblings = item.parentElement.querySelectorAll('.faq-item');
      // siblings.forEach(sibling => {
      //   if (sibling !== item) sibling.classList.remove('open');
      // });
    });
  });
}


// =====================================================================
//  NAVIGATION LINKS
// =====================================================================

/**
 * Setup page navigation from header links.
 */
function initNavigation() {
  document.querySelectorAll('nav.links a[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const pageName = link.getAttribute('data-page');
      showPage(pageName);
    });
  });

  // Setup mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('nav.links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });
  }
}


// =====================================================================
//  SCROLL BEHAVIOR
// =====================================================================

/**
 * Smooth scroll to element when using anchor links.
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}


// =====================================================================
//  GENERAL UTILITIES
// =====================================================================

/**
 * Format a number as EUR currency.
 *
 * @param {number} value - The numeric value to format
 * @returns {string} Formatted string like "€ 1.234,56"
 */
function formatCurrency(value) {
  return new Intl.NumberFormat('nl-BE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  }).format(value);
}

/**
 * Format a date in Dutch locale.
 *
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
  return new Intl.DateTimeFormat('nl-BE').format(date);
}

/**
 * Debounce a function to prevent rapid successive calls.
 * Useful for resize/scroll event handlers.
 *
 * @param {Function} func - The function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, delay = 300) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}


// =====================================================================
//  INITIALIZATION
// =====================================================================

/**
 * Initialize all interactive features when DOM is ready.
 * Called once on page load.
 */
function initializeWebsite() {
  console.log('Initializing Reijners Technics website...');

  initNavigation();
  initCarousels();
  initFAQs();
  initSmoothScroll();

  // Show home page by default
  showPage('home');

  console.log('Website initialized');
}

// Start initialization when document is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeWebsite);
} else {
  initializeWebsite();
}
