/**
 * Print Handler
 * Manages print preparation and cleanup with proper error handling
 */

(function() {
  'use strict';
  
  // Configuration
  const CONFIG = {
    PRINT_PREP_DELAY: 180, // milliseconds
    CARD_BG_SRC: "images/bg-card.svg",
    CARD_ACCENT_BG_SRC: "images/bg-card-accent.svg",
    SELECTORS: [
      '.kpi-card',
      '.panel',
      '.chart-card',
      '.property-card',
      '.compare-card',
      '.mcard',
      '.metric',
      '.opt-mini',
      '.callout',
      '.runway'
    ]
  };
  
  /**
   * Create and insert background overlay image
   * @param {HTMLElement} element - Target element
   */
  function createOverlay(element) {
    // Skip if overlay already exists
    if (element.querySelector(':scope > img.print-card-bg')) {
      return;
    }
    
    const img = document.createElement('img');
    img.className = 'print-card-bg';
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    img.setAttribute('role', 'presentation');
    
    // Use accent background for accent cards
    img.src = element.classList.contains('accent') 
      ? CONFIG.CARD_ACCENT_BG_SRC 
      : CONFIG.CARD_BG_SRC;
    
    // Insert as first child
    element.insertBefore(img, element.firstChild);
  }
  
  /**
   * Add overlay images to all card elements
   */
  function ensureOverlays() {
    CONFIG.SELECTORS.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(createOverlay);
    });
  }
  
  /**
   * Remove all overlay images
   */
  function removeOverlays() {
    const overlays = document.querySelectorAll('img.print-card-bg');
    overlays.forEach(overlay => overlay.remove());
  }
  
  /**
   * Prepare document for printing
   */
  function beforePrint() {
    try {
      ensureOverlays();
      document.documentElement.classList.add('printing');
    } catch (error) {
      console.error('Error preparing for print:', error);
    }
  }
  
  /**
   * Clean up after printing
   */
  function afterPrint() {
    try {
      document.documentElement.classList.remove('printing');
      removeOverlays();
    } catch (error) {
      console.error('Error cleaning up after print:', error);
    }
  }
  
  /**
   * Handle print button click
   * @param {Event} event - Click event
   */
  function handlePrintClick(event) {
    event.preventDefault();
    
    try {
      beforePrint();
      
      // Delay allows browser to render overlays before print dialog
      setTimeout(() => {
        try {
          window.print();
        } catch (printError) {
          console.error('Print dialog error:', printError);
          alert('Unable to open print dialog. Please try using Ctrl+P or Cmd+P.');
          afterPrint(); // Clean up if print fails
        }
      }, CONFIG.PRINT_PREP_DELAY);
      
    } catch (error) {
      console.error('Print preparation error:', error);
      alert('An error occurred while preparing to print. Please try again.');
      afterPrint(); // Clean up if preparation fails
    }
  }
  
  /**
   * Initialize print handlers
   */
  function init() {
    // Browser print events
    window.addEventListener('beforeprint', beforePrint);
    window.addEventListener('afterprint', afterPrint);
    
    // Print button click handler
    const printBtn = document.getElementById('printBtn');
    if (printBtn) {
      printBtn.addEventListener('click', handlePrintClick);
    } else {
      console.warn('Print button not found');
    }
    
    // Log initialization in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('Print handler initialized');
    }
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
})();