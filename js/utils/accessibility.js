// Accessibility Manager
class AccessibilityManager {
  constructor() {
    this.focusableElements = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ];
    
    this.init();
  }

  init() {
    this.setupKeyboardNavigation();
    this.enhanceScreenReaderSupport();
    this.improveColorContrast();
    this.addSkipLinks();
    this.setupFocusManagement();
    this.addLiveRegions();
    this.enhanceFormAccessibility();
    this.setupReducedMotion();
    this.addAccessibilityToolbar();
  }

  // Keyboard Navigation
  setupKeyboardNavigation() {
    // Escape key handler
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.handleEscapeKey();
      }
    });

    // Tab navigation improvement
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        this.highlightFocusableElements();
      }
    });

    // Arrow key navigation for components
    document.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        this.handleArrowNavigation(e);
      }
    });

    // Enter/Space for custom interactive elements
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        this.handleActivation(e);
      }
    });
  }

  handleEscapeKey() {
    // Close modals
    const openModals = document.querySelectorAll('.modal.active, .project-modal.active');
    openModals.forEach(modal => {
      modal.classList.remove('active');
      this.returnFocus();
    });

    // Close dropdowns
    const openDropdowns = document.querySelectorAll('.dropdown.open');
    openDropdowns.forEach(dropdown => {
      dropdown.classList.remove('open');
    });

    // Clear search filters
    const filterInputs = document.querySelectorAll('.search-input, .timeline-search');
    filterInputs.forEach(input => {
      if (input.value) {
        input.value = '';
        input.dispatchEvent(new Event('input'));
      }
    });
  }

  handleArrowNavigation(e) {
    const activeElement = document.activeElement;
    
    // Navigate within filter buttons
    if (activeElement.classList.contains('filter-btn')) {
      const filterContainer = activeElement.parentElement;
      const buttons = Array.from(filterContainer.querySelectorAll('.filter-btn'));
      const currentIndex = buttons.indexOf(activeElement);
      
      let newIndex;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        newIndex = currentIndex > 0 ? currentIndex - 1 : buttons.length - 1;
      } else {
        newIndex = currentIndex < buttons.length - 1 ? currentIndex + 1 : 0;
      }
      
      buttons[newIndex].focus();
      e.preventDefault();
    }

    // Navigate within project cards
    if (activeElement.closest('.project-card')) {
      this.navigateProjectCards(e);
    }
  }

  navigateProjectCards(e) {
    const projects = Array.from(document.querySelectorAll('.project-card'));
    const currentProject = e.target.closest('.project-card');
    const currentIndex = projects.indexOf(currentProject);
    
    let newIndex;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : projects.length - 1;
    } else {
      newIndex = currentIndex < projects.length - 1 ? currentIndex + 1 : 0;
    }
    
    const nextProject = projects[newIndex];
    const focusableElement = nextProject.querySelector('a, button, [tabindex]');
    if (focusableElement) {
      focusableElement.focus();
      e.preventDefault();
    }
  }

  handleActivation(e) {
    const element = e.target;
    
    // Handle custom clickable elements
    if (element.classList.contains('project-card') && !element.closest('button, a')) {
      const button = element.querySelector('.view-project-btn');
      if (button) {
        button.click();
        e.preventDefault();
      }
    }

    // Handle filter buttons
    if (element.classList.contains('filter-btn')) {
      element.click();
      e.preventDefault();
    }
  }

  // Screen Reader Support
  enhanceScreenReaderSupport() {
    // Add ARIA labels to interactive elements
    this.addAriaLabels();
    
    // Setup live regions for dynamic content
    this.setupLiveRegions();
    
    // Add role attributes
    this.addRoleAttributes();
    
    // Enhance navigation landmarks
    this.enhanceNavigationLandmarks();
  }

  addAriaLabels() {
    // Navigation toggle
    const navToggle = document.getElementById('navToggle');
    if (navToggle && !navToggle.getAttribute('aria-label')) {
      navToggle.setAttribute('aria-label', 'Toggle navigation menu');
      navToggle.setAttribute('aria-expanded', 'false');
    }

    // Project cards
    document.querySelectorAll('.project-card').forEach((card, index) => {
      if (!card.getAttribute('role')) {
        card.setAttribute('role', 'article');
        card.setAttribute('aria-label', `Project ${index + 1}`);
      }
    });

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(button => {
      const text = button.textContent.trim();
      button.setAttribute('aria-label', `Filter by ${text}`);
    });

    // Timeline items
    document.querySelectorAll('.timeline-item').forEach((item, index) => {
      const title = item.querySelector('h3')?.textContent || `Timeline event ${index + 1}`;
      item.setAttribute('aria-label', title);
      item.setAttribute('role', 'article');
    });

    // Loading elements
    document.querySelectorAll('.loading-spinner').forEach(spinner => {
      spinner.setAttribute('aria-label', 'Loading');
      spinner.setAttribute('role', 'status');
    });
  }

  addRoleAttributes() {
    // Main navigation
    const mainNav = document.querySelector('.main-nav');
    if (mainNav) {
      mainNav.setAttribute('role', 'navigation');
      mainNav.setAttribute('aria-label', 'Main navigation');
    }

    // Search forms
    document.querySelectorAll('.search-input, .timeline-search').forEach(input => {
      input.setAttribute('role', 'searchbox');
      input.setAttribute('aria-label', 'Search');
    });

    // Status indicators
    document.querySelectorAll('.status-badge, .status-indicator').forEach(status => {
      status.setAttribute('role', 'status');
    });
  }

  enhanceNavigationLandmarks() {
    // Add skip to content link
    if (!document.querySelector('.skip-link')) {
      const skipLink = document.createElement('a');
      skipLink.href = '#main-content';
      skipLink.className = 'skip-link';
      skipLink.textContent = 'Skip to main content';
      document.body.insertBefore(skipLink, document.body.firstChild);
    }

    // Ensure main content is properly labeled
    const mainContent = document.getElementById('main-content') || document.querySelector('main');
    if (mainContent) {
      mainContent.setAttribute('role', 'main');
      if (!mainContent.id) {
        mainContent.id = 'main-content';
      }
    }
  }

  // Live Regions
  addLiveRegions() {
    // Create announcement region
    if (!document.getElementById('announcements')) {
      const announcements = document.createElement('div');
      announcements.id = 'announcements';
      announcements.setAttribute('aria-live', 'polite');
      announcements.setAttribute('aria-atomic', 'true');
      announcements.className = 'sr-only';
      document.body.appendChild(announcements);
    }

    // Create status region
    if (!document.getElementById('status')) {
      const status = document.createElement('div');
      status.id = 'status';
      status.setAttribute('aria-live', 'assertive');
      status.setAttribute('aria-atomic', 'true');
      status.className = 'sr-only';
      document.body.appendChild(status);
    }
  }

  announce(message, priority = 'polite') {
    const regionId = priority === 'assertive' ? 'status' : 'announcements';
    const region = document.getElementById(regionId);
    if (region) {
      region.textContent = message;
      setTimeout(() => {
        region.textContent = '';
      }, 1000);
    }
  }

  setupLiveRegions() {
    // Announce filter changes
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('filter-btn')) {
        const filterType = e.target.textContent.trim();
        setTimeout(() => {
          const visibleItems = document.querySelectorAll('.timeline-item:not([style*="display: none"]), .project-card:not([style*="display: none"])').length;
          this.announce(`Filtered to ${filterType}. ${visibleItems} items shown.`);
        }, 100);
      }
    });

    // Announce search results
    document.addEventListener('input', (e) => {
      if (e.target.classList.contains('search-input') || e.target.classList.contains('timeline-search')) {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
          const query = e.target.value;
          if (query.length > 2) {
            const results = document.querySelectorAll('.search-result, .filtered-item').length;
            this.announce(`${results} search results for "${query}"`);
          }
        }, 500);
      }
    });

    // Announce form submission results
    document.addEventListener('submit', (e) => {
      const form = e.target;
      if (form.tagName === 'FORM') {
        // This will be handled by the form submission logic
        setTimeout(() => {
          this.announce('Form submitted successfully', 'assertive');
        }, 1000);
      }
    });
  }

  // Color Contrast Improvements
  improveColorContrast() {
    // Check contrast ratios (simplified check)
    this.checkColorContrast();
    
    // Add high contrast mode toggle
    this.addHighContrastMode();
  }

  checkColorContrast() {
    // Disable overly aggressive contrast warnings in development
    // Only check critical interactive elements
    const elementsToCheck = document.querySelectorAll('button.cta-primary, a.nav-cta');
    
    elementsToCheck.forEach(element => {
      const styles = getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      
      // Only warn for severe contrast issues
      if (this.hasSevereContrastIssue(color, backgroundColor)) {
        console.warn('Severe contrast issue:', element, { color, backgroundColor });
      }
    });
  }

  hasSevereContrastIssue(foreground, background) {
    // Only flag truly problematic contrasts
    const fgLightness = this.getLightness(foreground);
    const bgLightness = this.getLightness(background);
    
    // Flag only if difference is less than 20% (very poor contrast)
    return Math.abs(fgLightness - bgLightness) < 20;
  }

  hasContrastIssue(foreground, background) {
    // Simplified contrast check
    // Returns true if both colors are similar lightness
    const fgLightness = this.getLightness(foreground);
    const bgLightness = this.getLightness(background);
    
    return Math.abs(fgLightness - bgLightness) < 0.3;
  }

  getLightness(color) {
    // Very simplified lightness calculation
    if (color.includes('rgb')) {
      const values = color.match(/\d+/g);
      if (values && values.length >= 3) {
        const r = parseInt(values[0]);
        const g = parseInt(values[1]);
        const b = parseInt(values[2]);
        return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      }
    }
    return 0.5; // Default middle value
  }

  addHighContrastMode() {
    // Add high contrast toggle
    const contrastToggle = document.createElement('button');
    contrastToggle.id = 'contrast-toggle';
    contrastToggle.textContent = 'High Contrast';
    contrastToggle.setAttribute('aria-label', 'Toggle high contrast mode');
    contrastToggle.className = 'accessibility-control';
    
    contrastToggle.addEventListener('click', () => {
      document.body.classList.toggle('high-contrast');
      const isActive = document.body.classList.contains('high-contrast');
      contrastToggle.setAttribute('aria-pressed', isActive.toString());
      this.announce(`High contrast mode ${isActive ? 'enabled' : 'disabled'}`);
    });
    
    // Add to accessibility toolbar
    this.addToAccessibilityToolbar(contrastToggle);
  }

  // Focus Management
  setupFocusManagement() {
    // Store focus for modals
    this.lastFocusedElement = null;
    
    // Setup focus trapping for modals
    document.addEventListener('focusin', (e) => {
      const modal = document.querySelector('.modal.active, .project-modal.active');
      if (modal && !modal.contains(e.target)) {
        this.trapFocus(modal);
      }
    });

    // Highlight focused elements
    document.addEventListener('focusin', (e) => {
      e.target.classList.add('keyboard-focused');
    });

    document.addEventListener('focusout', (e) => {
      e.target.classList.remove('keyboard-focused');
    });

    // Mouse users shouldn't see focus outlines
    document.addEventListener('mousedown', () => {
      document.body.classList.add('mouse-user');
    });

    document.addEventListener('keydown', () => {
      document.body.classList.remove('mouse-user');
    });
  }

  trapFocus(container) {
    const focusableElements = container.querySelectorAll(this.focusableElements.join(', '));
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (firstElement) {
      firstElement.focus();
    }
  }

  storeFocus() {
    this.lastFocusedElement = document.activeElement;
  }

  returnFocus() {
    if (this.lastFocusedElement) {
      this.lastFocusedElement.focus();
      this.lastFocusedElement = null;
    }
  }

  highlightFocusableElements() {
    // Add temporary highlighting for all focusable elements
    const focusableElements = document.querySelectorAll(this.focusableElements.join(', '));
    focusableElements.forEach(element => {
      element.classList.add('focusable-highlight');
    });
    
    setTimeout(() => {
      focusableElements.forEach(element => {
        element.classList.remove('focusable-highlight');
      });
    }, 3000);
  }

  // Form Accessibility
  enhanceFormAccessibility() {
    // Associate labels with form controls
    document.querySelectorAll('input, textarea, select').forEach(input => {
      if (!input.getAttribute('aria-label') && !input.id) {
        // Create unique ID
        input.id = 'form-control-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      }

      // Add required aria attributes
      if (input.required && !input.getAttribute('aria-required')) {
        input.setAttribute('aria-required', 'true');
      }

      // Add error handling
      input.addEventListener('invalid', (e) => {
        this.handleFormError(e.target);
      });

      input.addEventListener('input', (e) => {
        this.clearFormError(e.target);
      });
    });

    // Enhance fieldsets
    document.querySelectorAll('fieldset').forEach(fieldset => {
      const legend = fieldset.querySelector('legend');
      if (legend) {
        fieldset.setAttribute('aria-labelledby', legend.id || 'legend-' + Date.now());
      }
    });
  }

  handleFormError(input) {
    const errorId = input.id + '-error';
    let errorElement = document.getElementById(errorId);
    
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.id = errorId;
      errorElement.className = 'form-error';
      errorElement.setAttribute('role', 'alert');
      input.parentNode.insertBefore(errorElement, input.nextSibling);
    }
    
    errorElement.textContent = input.validationMessage;
    input.setAttribute('aria-describedby', errorId);
    input.setAttribute('aria-invalid', 'true');
    
    this.announce(`Error in ${input.name || input.id}: ${input.validationMessage}`, 'assertive');
  }

  clearFormError(input) {
    const errorId = input.id + '-error';
    const errorElement = document.getElementById(errorId);
    
    if (errorElement) {
      errorElement.remove();
    }
    
    input.removeAttribute('aria-describedby');
    input.removeAttribute('aria-invalid');
  }

  // Reduced Motion
  setupReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleReducedMotion = (e) => {
      if (e.matches) {
        document.body.classList.add('reduced-motion');
        this.disableAnimations();
      } else {
        document.body.classList.remove('reduced-motion');
        this.enableAnimations();
      }
    };
    
    prefersReducedMotion.addListener(handleReducedMotion);
    handleReducedMotion(prefersReducedMotion);

    // Add manual toggle
    const motionToggle = document.createElement('button');
    motionToggle.id = 'motion-toggle';
    motionToggle.textContent = 'Reduce Motion';
    motionToggle.setAttribute('aria-label', 'Toggle reduced motion');
    motionToggle.className = 'accessibility-control';
    
    motionToggle.addEventListener('click', () => {
      const isReduced = document.body.classList.toggle('reduced-motion');
      motionToggle.setAttribute('aria-pressed', isReduced.toString());
      if (isReduced) {
        this.disableAnimations();
      } else {
        this.enableAnimations();
      }
      this.announce(`Motion ${isReduced ? 'reduced' : 'enabled'}`);
    });
    
    this.addToAccessibilityToolbar(motionToggle);
  }

  disableAnimations() {
    const style = document.createElement('style');
    style.id = 'reduced-motion-styles';
    style.textContent = `
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    `;
    document.head.appendChild(style);
  }

  enableAnimations() {
    const style = document.getElementById('reduced-motion-styles');
    if (style) {
      style.remove();
    }
  }

  // Accessibility Toolbar
  addAccessibilityToolbar() {
    if (document.getElementById('accessibility-toolbar')) return;
    
    const toolbar = document.createElement('div');
    toolbar.id = 'accessibility-toolbar';
    toolbar.className = 'accessibility-toolbar';
    toolbar.setAttribute('role', 'toolbar');
    toolbar.setAttribute('aria-label', 'Accessibility options');
    
    // Add toolbar toggle
    const toolbarToggle = document.createElement('button');
    toolbarToggle.id = 'accessibility-toggle';
    toolbarToggle.textContent = '♿';
    toolbarToggle.setAttribute('aria-label', 'Open accessibility options');
    toolbarToggle.className = 'accessibility-toggle';
    
    toolbarToggle.addEventListener('click', () => {
      const isOpen = toolbar.classList.toggle('open');
      toolbarToggle.setAttribute('aria-expanded', isOpen.toString());
      this.announce(`Accessibility toolbar ${isOpen ? 'opened' : 'closed'}`);
    });
    
    toolbar.appendChild(toolbarToggle);
    
    // Add text size controls
    const textSizeControls = this.createTextSizeControls();
    toolbar.appendChild(textSizeControls);
    
    document.body.appendChild(toolbar);
  }

  addToAccessibilityToolbar(element) {
    const toolbar = document.getElementById('accessibility-toolbar');
    if (toolbar) {
      toolbar.appendChild(element);
    }
  }

  createTextSizeControls() {
    const container = document.createElement('div');
    container.className = 'text-size-controls';
    
    const decreaseBtn = document.createElement('button');
    decreaseBtn.textContent = 'A-';
    decreaseBtn.setAttribute('aria-label', 'Decrease text size');
    decreaseBtn.className = 'accessibility-control';
    
    const increaseBtn = document.createElement('button');
    increaseBtn.textContent = 'A+';
    increaseBtn.setAttribute('aria-label', 'Increase text size');
    increaseBtn.className = 'accessibility-control';
    
    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reset';
    resetBtn.setAttribute('aria-label', 'Reset text size');
    resetBtn.className = 'accessibility-control';
    
    let currentSize = 100; // percentage
    
    decreaseBtn.addEventListener('click', () => {
      currentSize = Math.max(75, currentSize - 10);
      this.setTextSize(currentSize);
    });
    
    increaseBtn.addEventListener('click', () => {
      currentSize = Math.min(150, currentSize + 10);
      this.setTextSize(currentSize);
    });
    
    resetBtn.addEventListener('click', () => {
      currentSize = 100;
      this.setTextSize(currentSize);
    });
    
    container.appendChild(decreaseBtn);
    container.appendChild(resetBtn);
    container.appendChild(increaseBtn);
    
    return container;
  }

  setTextSize(percentage) {
    document.documentElement.style.fontSize = percentage + '%';
    this.announce(`Text size set to ${percentage}%`);
  }

  // Skip Links
  addSkipLinks() {
    const skipLinks = document.createElement('div');
    skipLinks.className = 'skip-links';
    
    const skipToMain = document.createElement('a');
    skipToMain.href = '#main-content';
    skipToMain.textContent = 'Skip to main content';
    skipToMain.className = 'skip-link';
    
    const skipToNav = document.createElement('a');
    skipToNav.href = '#mainNav';
    skipToNav.textContent = 'Skip to navigation';
    skipToNav.className = 'skip-link';
    
    skipLinks.appendChild(skipToMain);
    skipLinks.appendChild(skipToNav);
    
    document.body.insertBefore(skipLinks, document.body.firstChild);
  }
}

// Initialize accessibility manager
window.accessibilityManager = new AccessibilityManager();

console.log('Accessibility Manager initialized');