/**
 * Haptic Feedback System
 * Provides vibration feedback for mobile interactions
 * Follows iOS and Android patterns for native app feel
 */

class HapticFeedback {
  constructor() {
    this.enabled = true;
    this.supported = 'vibrate' in navigator;
    this.userPreference = this.getUserPreference();
    this.init();
  }

  init() {
    // Check if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.enabled = false;
      return;
    }

    // Get user preference from localStorage
    const savedPreference = localStorage.getItem('haptic-enabled');
    if (savedPreference !== null) {
      this.enabled = savedPreference === 'true';
    }

    // Auto-attach to common interactive elements
    this.attachToElements();
    
    // Listen for dynamic content
    this.observeDOMChanges();
  }

  getUserPreference() {
    const saved = localStorage.getItem('haptic-enabled');
    return saved !== null ? saved === 'true' : true;
  }

  setUserPreference(enabled) {
    this.enabled = enabled;
    localStorage.setItem('haptic-enabled', enabled.toString());
  }

  attachToElements() {
    // Buttons and CTAs
    document.querySelectorAll('button, .btn, .cta-button, .cta-primary, .cta-secondary').forEach(el => {
      el.addEventListener('click', () => this.light());
    });

    // Links
    document.querySelectorAll('a[href]').forEach(el => {
      el.addEventListener('click', () => this.light());
    });

    // Form inputs - feedback on focus
    document.querySelectorAll('input, textarea, select').forEach(el => {
      el.addEventListener('focus', () => this.selection());
    });

    // Submit buttons - stronger feedback
    document.querySelectorAll('button[type="submit"], .submit-btn').forEach(el => {
      el.addEventListener('click', () => this.medium());
    });

    // Toggle switches and checkboxes
    document.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(el => {
      el.addEventListener('change', () => this.selection());
    });

    // Navigation items
    document.querySelectorAll('.nav-item, .menu-item, .tab').forEach(el => {
      el.addEventListener('click', () => this.light());
    });

    // Cards and clickable sections
    document.querySelectorAll('.card[onclick], [role="button"]').forEach(el => {
      el.addEventListener('click', () => this.light());
    });
  }

  observeDOMChanges() {
    // Watch for dynamically added elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            if (node.matches('button, .btn, a[href]')) {
              node.addEventListener('click', () => this.light());
            }
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Light haptic - for subtle interactions (buttons, links)
   * Pattern: Single short vibration (10ms)
   */
  light() {
    if (!this.canVibrate()) return;
    navigator.vibrate(10);
  }

  /**
   * Medium haptic - for important actions (submit, confirm)
   * Pattern: Two short vibrations (20ms, pause 10ms, 20ms)
   */
  medium() {
    if (!this.canVibrate()) return;
    navigator.vibrate([20, 10, 20]);
  }

  /**
   * Heavy haptic - for critical actions (delete, error)
   * Pattern: Strong vibration (50ms)
   */
  heavy() {
    if (!this.canVibrate()) return;
    navigator.vibrate(50);
  }

  /**
   * Selection haptic - for toggle changes
   * Pattern: Light tap (15ms)
   */
  selection() {
    if (!this.canVibrate()) return;
    navigator.vibrate(15);
  }

  /**
   * Success haptic - for completed actions
   * Pattern: Three increasing vibrations
   */
  success() {
    if (!this.canVibrate()) return;
    navigator.vibrate([15, 30, 15, 30, 25]);
  }

  /**
   * Error haptic - for failed actions
   * Pattern: Three strong bursts
   */
  error() {
    if (!this.canVibrate()) return;
    navigator.vibrate([50, 50, 50, 50, 50]);
  }

  /**
   * Warning haptic - for caution situations
   * Pattern: Two medium vibrations
   */
  warning() {
    if (!this.canVibrate()) return;
    navigator.vibrate([30, 100, 30]);
  }

  /**
   * Notification haptic - for alerts
   * Pattern: Gentle buzz
   */
  notification() {
    if (!this.canVibrate()) return;
    navigator.vibrate([25, 50, 25]);
  }

  /**
   * Custom pattern
   * @param {number[]} pattern - Array of vibration durations in ms
   */
  custom(pattern) {
    if (!this.canVibrate()) return;
    navigator.vibrate(pattern);
  }

  /**
   * Stop all vibrations
   */
  stop() {
    if (this.supported) {
      navigator.vibrate(0);
    }
  }

  canVibrate() {
    return this.enabled && this.supported && !this.isReducedMotion();
  }

  isReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Enable haptics
   */
  enable() {
    this.setUserPreference(true);
  }

  /**
   * Disable haptics
   */
  disable() {
    this.setUserPreference(false);
    this.stop();
  }

  /**
   * Toggle haptics on/off
   */
  toggle() {
    if (this.enabled) {
      this.disable();
    } else {
      this.enable();
    }
    return this.enabled;
  }

  /**
   * Check if haptics are supported
   */
  isSupported() {
    return this.supported;
  }

  /**
   * Get current state
   */
  isEnabled() {
    return this.enabled;
  }
}

// Auto-initialize
const haptics = new HapticFeedback();

// Expose to window for manual control
window.haptics = haptics;

// Add settings toggle to page (if settings panel exists)
document.addEventListener('DOMContentLoaded', () => {
  const settingsPanel = document.querySelector('.settings-panel, #settings');
  
  if (settingsPanel) {
    const toggle = document.createElement('div');
    toggle.className = 'setting-item haptic-toggle';
    toggle.innerHTML = `
      <label class="toggle-label">
        <span class="toggle-text">
          <span class="toggle-icon">📳</span>
          Haptic Feedback
          <span class="toggle-description">Feel vibrations on interactions</span>
        </span>
        <input type="checkbox" ${haptics.isEnabled() ? 'checked' : ''} id="haptic-toggle-input">
        <span class="toggle-slider"></span>
      </label>
    `;
    
    settingsPanel.appendChild(toggle);
    
    // Handle toggle
    const input = toggle.querySelector('#haptic-toggle-input');
    input.addEventListener('change', (e) => {
      if (e.target.checked) {
        haptics.enable();
        haptics.selection(); // Give feedback
      } else {
        haptics.disable();
      }
    });
  }
});

// Add CSS for haptic toggle
const style = document.createElement('style');
style.textContent = `
  .haptic-toggle {
    padding: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .toggle-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    user-select: none;
  }

  .toggle-text {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .toggle-icon {
    font-size: 1.5rem;
    margin-right: 0.5rem;
  }

  .toggle-description {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.6);
  }

  .toggle-label input[type="checkbox"] {
    display: none;
  }

  .toggle-slider {
    position: relative;
    width: 50px;
    height: 26px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 13px;
    transition: background 0.3s ease;
  }

  .toggle-slider::before {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 22px;
    height: 22px;
    background: white;
    border-radius: 50%;
    transition: transform 0.3s ease;
  }

  .toggle-label input:checked + .toggle-slider {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .toggle-label input:checked + .toggle-slider::before {
    transform: translateX(24px);
  }

  /* Mobile specific */
  @media (max-width: 768px) {
    .haptic-toggle {
      padding: 1.25rem 1rem;
    }
    
    .toggle-text {
      font-size: 1rem;
    }
  }
`;
document.head.appendChild(style);

// Export for module usage
export default HapticFeedback;
