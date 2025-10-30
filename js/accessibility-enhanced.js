/**
 * Enhanced Accessibility JavaScript
 * Keyboard navigation, focus management, ARIA updates
 */

class AccessibilityEnhancer {
  constructor() {
    this.isKeyboardNav = false;
    this.isMouseNav = false;
    this.focusableElements = [];
    this.init();
  }

  init() {
    this.detectNavigationMethod();
    this.initKeyboardShortcuts();
    this.initFontSizeControls();
    this.initAccessibilityToolbar();
    this.enhanceFocusManagement();
    this.announcePageChanges();
    this.initSkipLinks();
  }

  /**
   * Detect if user is navigating with keyboard or mouse
   */
  detectNavigationMethod() {
    document.body.addEventListener('mousedown', () => {
      this.isMouseNav = true;
      this.isKeyboardNav = false;
      document.body.classList.add('mouse-nav-active');
      document.body.classList.remove('keyboard-nav-active');
    });

    document.body.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        this.isKeyboardNav = true;
        this.isMouseNav = false;
        document.body.classList.add('keyboard-nav-active');
        document.body.classList.remove('mouse-nav-active');
      }
    });
  }

  /**
   * Keyboard Shortcuts
   */
  initKeyboardShortcuts() {
    const shortcuts = {
      '?': () => this.showKeyboardShortcuts(),
      'h': () => this.goToHome(),
      'b': () => this.goToBlog(),
      'c': () => this.goToContact(),
      'p': () => this.goToProjects(),
      't': () => this.scrollToTop(),
      '/': () => this.focusSearch(),
      'Escape': () => this.closeModals(),
      'Alt+t': () => this.toggleTheme(),
      'Alt+1': () => this.setFontSize('small'),
      'Alt+2': () => this.setFontSize('medium'),
      'Alt+3': () => this.setFontSize('large'),
      'Alt+4': () => this.setFontSize('xlarge'),
    };

    document.addEventListener('keydown', (e) => {
      const key = e.altKey ? `Alt+${e.key}` : e.key;
      
      if (shortcuts[key]) {
        // Don't trigger shortcuts when typing in inputs
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
          if (key !== 'Escape') return;
        }
        
        e.preventDefault();
        shortcuts[key]();
      }
    });
  }

  showKeyboardShortcuts() {
    const modal = document.createElement('div');
    modal.className = 'keyboard-shortcuts-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-labelledby', 'shortcuts-title');
    modal.innerHTML = `
      <h2 id="shortcuts-title">Keyboard Shortcuts</h2>
      <ul class="shortcut-list">
        <li class="shortcut-item">
          <span>Show this help</span>
          <kbd class="shortcut-key">?</kbd>
        </li>
        <li class="shortcut-item">
          <span>Go to Home</span>
          <kbd class="shortcut-key">H</kbd>
        </li>
        <li class="shortcut-item">
          <span>Go to Blog</span>
          <kbd class="shortcut-key">B</kbd>
        </li>
        <li class="shortcut-item">
          <span>Go to Contact</span>
          <kbd class="shortcut-key">C</kbd>
        </li>
        <li class="shortcut-item">
          <span>Go to Projects</span>
          <kbd class="shortcut-key">P</kbd>
        </li>
        <li class="shortcut-item">
          <span>Scroll to top</span>
          <kbd class="shortcut-key">T</kbd>
        </li>
        <li class="shortcut-item">
          <span>Focus search</span>
          <kbd class="shortcut-key">/</kbd>
        </li>
        <li class="shortcut-item">
          <span>Close modals</span>
          <kbd class="shortcut-key">ESC</kbd>
        </li>
        <li class="shortcut-item">
          <span>Toggle theme</span>
          <kbd class="shortcut-key">Alt+T</kbd>
        </li>
        <li class="shortcut-item">
          <span>Font size small</span>
          <kbd class="shortcut-key">Alt+1</kbd>
        </li>
        <li class="shortcut-item">
          <span>Font size medium</span>
          <kbd class="shortcut-key">Alt+2</kbd>
        </li>
        <li class="shortcut-item">
          <span>Font size large</span>
          <kbd class="shortcut-key">Alt+3</kbd>
        </li>
        <li class="shortcut-item">
          <span>Font size extra large</span>
          <kbd class="shortcut-key">Alt+4</kbd>
        </li>
      </ul>
      <button class="close-shortcuts" aria-label="Close shortcuts">Close</button>
    `;

    document.body.appendChild(modal);
    
    const closeBtn = modal.querySelector('.close-shortcuts');
    closeBtn.addEventListener('click', () => modal.remove());
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });

    // Focus first element
    setTimeout(() => closeBtn.focus(), 100);
    
    this.announce('Keyboard shortcuts dialog opened');
  }

  goToHome() {
    window.location.href = '../index.html';
  }

  goToBlog() {
    window.location.href = 'blog.html';
  }

  goToContact() {
    window.location.href = 'contact.html';
  }

  goToProjects() {
    window.location.href = 'projects.html';
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.announce('Scrolled to top of page');
  }

  focusSearch() {
    const searchInput = document.querySelector('input[type="search"], input[placeholder*="search" i]');
    if (searchInput) {
      searchInput.focus();
      this.announce('Search field focused');
    }
  }

  closeModals() {
    const modals = document.querySelectorAll('.modal, .qr-modal, .keyboard-shortcuts-modal');
    modals.forEach(modal => modal.remove());
    this.announce('Modal closed');
  }

  toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    this.announce(`Switched to ${isDark ? 'dark' : 'light'} mode`);
  }

  /**
   * Font Size Controls
   */
  initFontSizeControls() {
    // Create font size controls if they don't exist
    if (document.querySelector('.font-size-controls')) return;

    const controls = document.createElement('div');
    controls.className = 'font-size-controls';
    controls.setAttribute('role', 'group');
    controls.setAttribute('aria-label', 'Font size controls');
    controls.innerHTML = `
      <button class="font-size-btn" data-size="small" aria-label="Small font size" title="Small (Alt+1)">
        <i class="fas fa-font" style="font-size: 0.75rem;"></i>
      </button>
      <button class="font-size-btn active" data-size="medium" aria-label="Medium font size" title="Medium (Alt+2)">
        <i class="fas fa-font" style="font-size: 1rem;"></i>
      </button>
      <button class="font-size-btn" data-size="large" aria-label="Large font size" title="Large (Alt+3)">
        <i class="fas fa-font" style="font-size: 1.25rem;"></i>
      </button>
      <button class="font-size-btn" data-size="xlarge" aria-label="Extra large font size" title="Extra Large (Alt+4)">
        <i class="fas fa-font" style="font-size: 1.5rem;"></i>
      </button>
    `;

    document.body.appendChild(controls);

    // Load saved font size
    const savedSize = localStorage.getItem('fontSize') || 'medium';
    this.setFontSize(savedSize);

    // Add click handlers
    controls.querySelectorAll('.font-size-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const size = btn.getAttribute('data-size');
        this.setFontSize(size);
      });
    });
  }

  setFontSize(size) {
    document.body.className = document.body.className.replace(/font-size-\w+/g, '');
    document.body.classList.add(`font-size-${size}`);
    localStorage.setItem('fontSize', size);

    // Update active state
    document.querySelectorAll('.font-size-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-size') === size) {
        btn.classList.add('active');
      }
    });

    this.announce(`Font size changed to ${size}`);
  }

  /**
   * Accessibility Toolbar
   */
  initAccessibilityToolbar() {
    // Create toggle button
    const toggle = document.createElement('button');
    toggle.className = 'a11y-toggle';
    toggle.setAttribute('aria-label', 'Toggle accessibility options');
    toggle.innerHTML = '<i class="fas fa-universal-access"></i>';

    // Create toolbar
    const toolbar = document.createElement('div');
    toolbar.className = 'a11y-toolbar';
    toolbar.setAttribute('role', 'region');
    toolbar.setAttribute('aria-label', 'Accessibility options');
    toolbar.innerHTML = `
      <button onclick="accessibilityEnhancer.toggleHighContrast()">
        <i class="fas fa-adjust"></i> High Contrast
      </button>
      <button onclick="accessibilityEnhancer.toggleReadingGuide()">
        <i class="fas fa-ruler-horizontal"></i> Reading Guide
      </button>
      <button onclick="accessibilityEnhancer.toggleLinkHighlight()">
        <i class="fas fa-link"></i> Highlight Links
      </button>
      <button onclick="accessibilityEnhancer.showKeyboardShortcuts()">
        <i class="fas fa-keyboard"></i> Keyboard Shortcuts
      </button>
    `;

    document.body.appendChild(toggle);
    document.body.appendChild(toolbar);

    toggle.addEventListener('click', () => {
      toolbar.classList.toggle('show');
      const isShown = toolbar.classList.contains('show');
      toggle.setAttribute('aria-expanded', isShown);
      this.announce(`Accessibility toolbar ${isShown ? 'opened' : 'closed'}`);
    });
  }

  toggleHighContrast() {
    document.body.classList.toggle('high-contrast');
    const isActive = document.body.classList.contains('high-contrast');
    this.announce(`High contrast ${isActive ? 'enabled' : 'disabled'}`);
  }

  toggleReadingGuide() {
    document.body.classList.toggle('reading-guide');
    const isActive = document.body.classList.contains('reading-guide');
    
    if (isActive) {
      this.initReadingGuide();
    } else {
      const guide = document.querySelector('.reading-guide-line');
      if (guide) guide.remove();
    }
    
    this.announce(`Reading guide ${isActive ? 'enabled' : 'disabled'}`);
  }

  initReadingGuide() {
    const guide = document.createElement('div');
    guide.className = 'reading-guide-line';
    guide.style.cssText = `
      position: fixed;
      left: 0;
      width: 100%;
      height: 2px;
      background: #6366f1;
      pointer-events: none;
      z-index: 10000;
      box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
    `;
    document.body.appendChild(guide);

    document.addEventListener('mousemove', (e) => {
      if (document.body.classList.contains('reading-guide')) {
        guide.style.top = e.clientY + 'px';
      }
    });
  }

  toggleLinkHighlight() {
    document.body.classList.toggle('highlight-links');
    const isActive = document.body.classList.contains('highlight-links');
    
    if (isActive) {
      document.querySelectorAll('a').forEach(link => {
        link.style.background = 'rgba(99, 102, 241, 0.2)';
        link.style.outline = '2px solid #6366f1';
      });
    } else {
      document.querySelectorAll('a').forEach(link => {
        link.style.background = '';
        link.style.outline = '';
      });
    }
    
    this.announce(`Link highlighting ${isActive ? 'enabled' : 'disabled'}`);
  }

  /**
   * Focus Management
   */
  enhanceFocusManagement() {
    // Store all focusable elements
    this.updateFocusableElements();

    // Trap focus in modals
    document.addEventListener('focus', (e) => {
      const modal = e.target.closest('.modal, .qr-modal, .keyboard-shortcuts-modal');
      if (modal && !modal.contains(e.target)) {
        const firstFocusable = modal.querySelector('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
          firstFocusable.focus();
        }
      }
    }, true);

    // Add focus indicator for custom elements
    document.querySelectorAll('[onclick], [role="button"]').forEach(el => {
      if (!el.hasAttribute('tabindex')) {
        el.setAttribute('tabindex', '0');
      }

      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          el.click();
        }
      });
    });
  }

  updateFocusableElements() {
    this.focusableElements = Array.from(document.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ));
  }

  /**
   * ARIA Live Announcements
   */
  announce(message, priority = 'polite') {
    let liveRegion = document.getElementById('aria-live-region');
    
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'aria-live-region';
      liveRegion.className = 'aria-live-region';
      liveRegion.setAttribute('aria-live', priority);
      liveRegion.setAttribute('aria-atomic', 'true');
      document.body.appendChild(liveRegion);
    }

    // Clear and announce
    liveRegion.textContent = '';
    setTimeout(() => {
      liveRegion.textContent = message;
    }, 100);
  }

  /**
   * Announce Page Changes
   */
  announcePageChanges() {
    // Announce when new content is loaded
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          const hasHeading = Array.from(mutation.addedNodes).some(node => 
            node.nodeType === 1 && node.matches('h1, h2, h3, h4, h5, h6')
          );
          
          if (hasHeading) {
            const heading = Array.from(mutation.addedNodes).find(node => 
              node.nodeType === 1 && node.matches('h1, h2, h3, h4, h5, h6')
            );
            if (heading) {
              this.announce(`New section: ${heading.textContent}`);
            }
          }
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Skip Links
   */
  initSkipLinks() {
    // Ensure skip link is functional
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(skipLink.getAttribute('href'));
        if (target) {
          target.setAttribute('tabindex', '-1');
          target.focus();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }
}

// Initialize
let accessibilityEnhancer;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    accessibilityEnhancer = new AccessibilityEnhancer();
  });
} else {
  accessibilityEnhancer = new AccessibilityEnhancer();
}

// Export for global access
window.accessibilityEnhancer = accessibilityEnhancer;
