/**
 * Advanced Touch Interactions
 * Long-press, double-tap, and contextual touch actions
 */

class AdvancedTouchInteractions {
  constructor(options = {}) {
    this.options = {
      longPressDuration: 500, // ms for long press
      doubleTapDelay: 300, // ms between taps for double-tap
      tapThreshold: 10, // px movement allowed for tap
      enableLongPress: true,
      enableDoubleTap: true,
      enableContextMenu: true,
      ...options
    };

    this.touchStartTime = 0;
    this.touchStartPos = { x: 0, y: 0 };
    this.lastTap = 0;
    this.longPressTimer = null;
    this.tapCount = 0;
    this.currentTarget = null;

    this.init();
  }

  init() {
    this.createContextMenu();
    this.attachEventListeners();
    this.registerTouchActions();
  }

  createContextMenu() {
    this.contextMenu = document.createElement('div');
    this.contextMenu.className = 'touch-context-menu';
    this.contextMenu.style.display = 'none';
    document.body.appendChild(this.contextMenu);
  }

  attachEventListeners() {
    document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
    document.addEventListener('touchcancel', this.handleTouchCancel.bind(this), { passive: true });

    // Click outside to close context menu
    document.addEventListener('click', (e) => {
      if (!this.contextMenu.contains(e.target)) {
        this.hideContextMenu();
      }
    });
  }

  registerTouchActions() {
    // Register elements with long-press actions
    this.registerLongPressActions();
    
    // Register elements with double-tap actions
    this.registerDoubleTapActions();
  }

  registerLongPressActions() {
    // Cards - long press to preview/quick actions
    document.querySelectorAll('.card, .project-card, .sample-card').forEach(el => {
      el.dataset.longPressAction = 'card-preview';
    });

    // Links - long press to show options
    document.querySelectorAll('a[href]').forEach(el => {
      el.dataset.longPressAction = 'link-options';
    });

    // Images - long press to show image options
    document.querySelectorAll('img').forEach(el => {
      el.dataset.longPressAction = 'image-options';
    });

    // Navigation items - long press for quick nav
    document.querySelectorAll('.nav-item, .menu-item').forEach(el => {
      el.dataset.longPressAction = 'nav-options';
    });
  }

  registerDoubleTapActions() {
    // Sections - double tap to scroll to top
    document.querySelectorAll('section').forEach(el => {
      el.dataset.doubleTapAction = 'scroll-to-top';
    });

    // Code blocks - double tap to copy
    document.querySelectorAll('pre, code').forEach(el => {
      el.dataset.doubleTapAction = 'copy-code';
    });
  }

  handleTouchStart(e) {
    const touch = e.touches[0];
    this.touchStartTime = Date.now();
    this.touchStartPos = { x: touch.clientX, y: touch.clientY };
    this.currentTarget = e.target;

    // Start long press timer
    if (this.options.enableLongPress) {
      this.startLongPressTimer(e);
    }
  }

  handleTouchMove(e) {
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - this.touchStartPos.x);
    const deltaY = Math.abs(touch.clientY - this.touchStartPos.y);

    // Cancel long press if moved too much
    if (deltaX > this.options.tapThreshold || deltaY > this.options.tapThreshold) {
      this.cancelLongPress();
    }
  }

  handleTouchEnd(e) {
    const touchDuration = Date.now() - this.touchStartTime;
    const touch = e.changedTouches[0];
    const deltaX = Math.abs(touch.clientX - this.touchStartPos.x);
    const deltaY = Math.abs(touch.clientY - this.touchStartPos.y);

    // Check if it's a tap (short duration, minimal movement)
    const isTap = touchDuration < this.options.longPressDuration &&
                   deltaX < this.options.tapThreshold &&
                   deltaY < this.options.tapThreshold;

    if (isTap && this.options.enableDoubleTap) {
      this.handleTap(e);
    }

    this.cancelLongPress();
  }

  handleTouchCancel() {
    this.cancelLongPress();
  }

  startLongPressTimer(e) {
    this.cancelLongPress();

    this.longPressTimer = setTimeout(() => {
      this.handleLongPress(e);
    }, this.options.longPressDuration);
  }

  cancelLongPress() {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
  }

  handleLongPress(e) {
    e.preventDefault();

    // Haptic feedback
    if (window.haptics) {
      window.haptics.medium();
    }

    const target = this.currentTarget;
    const action = this.getLongPressAction(target);

    if (action) {
      this.executeLongPressAction(action, target, e);
    }

    // Emit custom event
    const event = new CustomEvent('longpress', {
      detail: { target, action },
      bubbles: true
    });
    target.dispatchEvent(event);
  }

  handleTap(e) {
    const currentTime = Date.now();
    const timeSinceLastTap = currentTime - this.lastTap;

    if (timeSinceLastTap < this.options.doubleTapDelay) {
      // Double tap detected
      this.handleDoubleTap(e);
      this.lastTap = 0;
    } else {
      // First tap
      this.lastTap = currentTime;
    }
  }

  handleDoubleTap(e) {
    e.preventDefault();

    // Haptic feedback
    if (window.haptics) {
      window.haptics.selection();
    }

    const target = this.currentTarget;
    const action = this.getDoubleTapAction(target);

    if (action) {
      this.executeDoubleTapAction(action, target);
    }

    // Emit custom event
    const event = new CustomEvent('doubletap', {
      detail: { target, action },
      bubbles: true
    });
    target.dispatchEvent(event);
  }

  getLongPressAction(element) {
    // Check element and parents for long-press action
    let el = element;
    while (el && el !== document.body) {
      if (el.dataset && el.dataset.longPressAction) {
        return el.dataset.longPressAction;
      }
      el = el.parentElement;
    }
    return null;
  }

  getDoubleTapAction(element) {
    // Check element and parents for double-tap action
    let el = element;
    while (el && el !== document.body) {
      if (el.dataset && el.dataset.doubleTapAction) {
        return el.dataset.doubleTapAction;
      }
      el = el.parentElement;
    }
    return null;
  }

  executeLongPressAction(action, target, event) {
    const touch = event.touches[0];
    const x = touch.clientX;
    const y = touch.clientY;

    switch (action) {
      case 'card-preview':
        this.showCardPreview(target);
        break;
      case 'link-options':
        this.showLinkOptions(target, x, y);
        break;
      case 'image-options':
        this.showImageOptions(target, x, y);
        break;
      case 'nav-options':
        this.showNavOptions(target, x, y);
        break;
      default:
        console.log('Long press action:', action);
    }
  }

  executeDoubleTapAction(action, target) {
    switch (action) {
      case 'scroll-to-top':
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.showToast('Scrolling to top');
        break;
      case 'copy-code':
        this.copyCodeBlock(target);
        break;
      default:
        console.log('Double tap action:', action);
    }
  }

  showCardPreview(card) {
    card.classList.add('preview-mode');
    
    setTimeout(() => {
      card.classList.remove('preview-mode');
    }, 2000);
  }

  showLinkOptions(link, x, y) {
    const href = link.href;
    const text = link.textContent;

    this.showContextMenu([
      { label: '🔗 Open', action: () => window.location.href = href },
      { label: '📋 Copy Link', action: () => this.copyToClipboard(href) },
      { label: '🪟 Open in New Tab', action: () => window.open(href, '_blank') }
    ], x, y);
  }

  showImageOptions(img, x, y) {
    this.showContextMenu([
      { label: '🔍 View Full Size', action: () => window.open(img.src, '_blank') },
      { label: '📋 Copy Image URL', action: () => this.copyToClipboard(img.src) },
      { label: '💾 Download', action: () => this.downloadImage(img.src) }
    ], x, y);
  }

  showNavOptions(navItem, x, y) {
    this.showContextMenu([
      { label: '🏠 Go to Home', action: () => window.location.href = '/' },
      { label: '⬅️ Go Back', action: () => window.history.back() },
      { label: '🔄 Refresh', action: () => window.location.reload() }
    ], x, y);
  }

  showContextMenu(items, x, y) {
    this.contextMenu.innerHTML = items.map(item => `
      <button class="context-menu-item" data-action="${item.label}">
        ${item.label}
      </button>
    `).join('');

    // Position menu
    this.contextMenu.style.left = `${x}px`;
    this.contextMenu.style.top = `${y}px`;
    this.contextMenu.style.display = 'block';

    // Adjust if off-screen
    const rect = this.contextMenu.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      this.contextMenu.style.left = `${x - rect.width}px`;
    }
    if (rect.bottom > window.innerHeight) {
      this.contextMenu.style.top = `${y - rect.height}px`;
    }

    // Add click handlers
    items.forEach((item, index) => {
      const button = this.contextMenu.children[index];
      button.addEventListener('click', () => {
        item.action();
        this.hideContextMenu();
        if (window.haptics) window.haptics.light();
      });
    });

    requestAnimationFrame(() => {
      this.contextMenu.classList.add('visible');
    });
  }

  hideContextMenu() {
    this.contextMenu.classList.remove('visible');
    setTimeout(() => {
      this.contextMenu.style.display = 'none';
    }, 200);
  }

  copyCodeBlock(codeElement) {
    const code = codeElement.textContent;
    this.copyToClipboard(code);
    this.showToast('Code copied!');
  }

  copyToClipboard(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        this.showToast('Copied to clipboard');
        if (window.haptics) window.haptics.success();
      });
    }
  }

  downloadImage(url) {
    const a = document.createElement('a');
    a.href = url;
    a.download = url.split('/').pop();
    a.click();
    this.showToast('Downloading...');
  }

  showToast(message) {
    // Use existing toast system if available
    if (window.showToast) {
      window.showToast(message);
    } else {
      const toast = document.createElement('div');
      toast.className = 'touch-toast';
      toast.textContent = message;
      document.body.appendChild(toast);

      requestAnimationFrame(() => {
        toast.classList.add('visible');
      });

      setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 300);
      }, 2000);
    }
  }
}

// CSS Styles
const style = document.createElement('style');
style.textContent = `
  /* Context Menu */
  .touch-context-menu {
    position: fixed;
    background: rgba(30, 30, 30, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 12px;
    padding: 0.5rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    z-index: 10001;
    min-width: 200px;
    opacity: 0;
    transform: scale(0.9);
    transition: opacity 0.2s ease, transform 0.2s ease;
  }

  .touch-context-menu.visible {
    opacity: 1;
    transform: scale(1);
  }

  .context-menu-item {
    width: 100%;
    padding: 0.75rem 1rem;
    background: transparent;
    border: none;
    color: white;
    font-size: 0.938rem;
    text-align: left;
    cursor: pointer;
    border-radius: 8px;
    transition: background 0.2s ease;
    display: block;
  }

  .context-menu-item:hover,
  .context-menu-item:active {
    background: rgba(255, 255, 255, 0.1);
  }

  /* Card Preview Mode */
  .card.preview-mode {
    transform: scale(1.05);
    box-shadow: 0 20px 60px rgba(102, 126, 234, 0.4);
    z-index: 100;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  /* Toast Notifications */
  .touch-toast {
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: rgba(30, 30, 30, 0.95);
    backdrop-filter: blur(10px);
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 50px;
    font-size: 0.875rem;
    font-weight: 600;
    opacity: 0;
    transition: opacity 0.3s ease, transform 0.3s ease;
    z-index: 10002;
    pointer-events: none;
  }

  .touch-toast.visible {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  /* Long Press Ripple Effect */
  @keyframes longpress-ripple {
    0% {
      box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.4);
    }
    100% {
      box-shadow: 0 0 0 20px rgba(102, 126, 234, 0);
    }
  }

  [data-long-press-action]:active {
    animation: longpress-ripple 0.5s ease-out;
  }

  /* Reduced Motion */
  @media (prefers-reduced-motion: reduce) {
    .touch-context-menu,
    .touch-toast,
    .card.preview-mode {
      transition: none !important;
      animation: none !important;
    }
  }

  /* Mobile Only */
  @media (min-width: 769px) {
    .touch-context-menu {
      display: none;
    }
  }
`;
document.head.appendChild(style);

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
  window.advancedTouch = new AdvancedTouchInteractions({
    enableLongPress: true,
    enableDoubleTap: true,
    enableContextMenu: true
  });
});

// Make available globally if needed
if (typeof window !== 'undefined') {
  window.AdvancedTouchInteractions = AdvancedTouchInteractions;
}
