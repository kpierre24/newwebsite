/**
 * Swipe Navigation System
 * Implements iOS-style swipe-to-go-back and swipe between pages
 */

class SwipeNavigation {
  constructor(options = {}) {
    this.options = {
      threshold: 100, // Minimum swipe distance to trigger navigation
      velocity: 0.3, // Minimum swipe velocity
      maxTime: 300, // Maximum time for swipe gesture
      edgeStart: 50, // Pixels from edge to start swipe (for back gesture)
      animationDuration: 300,
      enableBackSwipe: true,
      enablePageSwipe: true,
      showVisualFeedback: true,
      ...options
    };

    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchEndX = 0;
    this.touchEndY = 0;
    this.touchStartTime = 0;
    this.isSwiping = false;
    this.swipeDirection = null;

    // Page navigation order
    this.pages = [
      '/index.html',
      '/pages/about.html',
      '/pages/projects.html',
      '/pages/blog.html',
      '/pages/contact.html',
      '/pages/timeline.html'
    ];

    this.init();
  }

  init() {
    if (this.options.showVisualFeedback) {
      this.createSwipeIndicators();
    }

    this.attachEventListeners();
  }

  createSwipeIndicators() {
    // Create back swipe indicator
    this.backIndicator = document.createElement('div');
    this.backIndicator.className = 'swipe-back-indicator';
    this.backIndicator.innerHTML = `
      <div class="swipe-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </div>
    `;
    document.body.appendChild(this.backIndicator);

    // Create page swipe indicators
    this.leftIndicator = document.createElement('div');
    this.leftIndicator.className = 'swipe-page-indicator left';
    this.leftIndicator.innerHTML = '<span>←</span>';
    document.body.appendChild(this.leftIndicator);

    this.rightIndicator = document.createElement('div');
    this.rightIndicator.className = 'swipe-page-indicator right';
    this.rightIndicator.innerHTML = '<span>→</span>';
    document.body.appendChild(this.rightIndicator);
  }

  attachEventListeners() {
    // Touch events
    document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
    document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
  }

  handleTouchStart(e) {
    const touch = e.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
    this.touchStartTime = Date.now();
    this.isSwiping = false;

    // Check if starting from left edge (back gesture)
    if (this.options.enableBackSwipe && this.touchStartX < this.options.edgeStart) {
      this.isEdgeSwipe = true;
    } else {
      this.isEdgeSwipe = false;
    }
  }

  handleTouchMove(e) {
    if (!this.touchStartX) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - this.touchStartX;
    const deltaY = touch.clientY - this.touchStartY;

    // Determine if this is a horizontal swipe
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      this.isSwiping = true;
      this.swipeDirection = deltaX > 0 ? 'right' : 'left';

      // Prevent default scroll if swiping
      e.preventDefault();

      // Update visual feedback
      this.updateSwipeFeedback(deltaX);
    }
  }

  handleTouchEnd(e) {
    if (!this.isSwiping) {
      this.resetSwipeFeedback();
      return;
    }

    const touch = e.changedTouches[0];
    this.touchEndX = touch.clientX;
    this.touchEndY = touch.clientY;

    const deltaX = this.touchEndX - this.touchStartX;
    const deltaY = this.touchEndY - this.touchStartY;
    const deltaTime = Date.now() - this.touchStartTime;
    const velocity = Math.abs(deltaX) / deltaTime;

    // Calculate if swipe is valid
    const isValidSwipe = 
      Math.abs(deltaX) > this.options.threshold &&
      Math.abs(deltaX) > Math.abs(deltaY) &&
      (velocity > this.options.velocity || Math.abs(deltaX) > this.options.threshold * 1.5);

    if (isValidSwipe) {
      this.executeSwipe(deltaX);
    } else {
      this.resetSwipeFeedback();
    }

    // Reset state
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.isSwiping = false;
    this.isEdgeSwipe = false;
  }

  updateSwipeFeedback(deltaX) {
    const progress = Math.min(Math.abs(deltaX) / this.options.threshold, 1);
    const opacity = progress * 0.8;

    if (this.isEdgeSwipe && deltaX > 0) {
      // Back swipe from edge
      if (this.backIndicator) {
        this.backIndicator.style.opacity = opacity;
        this.backIndicator.style.transform = `translateX(${Math.min(deltaX * 0.5, 50)}px)`;
      }
    } else if (this.options.enablePageSwipe) {
      // Page swipe
      if (deltaX > 0 && this.leftIndicator) {
        this.leftIndicator.style.opacity = opacity;
        this.leftIndicator.style.transform = `translateX(${Math.min(deltaX * 0.3, 30)}px)`;
      } else if (deltaX < 0 && this.rightIndicator) {
        this.rightIndicator.style.opacity = opacity;
        this.rightIndicator.style.transform = `translateX(${Math.max(deltaX * 0.3, -30)}px)`;
      }
    }

    // Haptic feedback when threshold reached
    if (Math.abs(deltaX) >= this.options.threshold && !this.hasReachedThreshold) {
      this.hasReachedThreshold = true;
      if (window.haptics) {
        window.haptics.selection();
      }
    }
  }

  resetSwipeFeedback() {
    if (this.backIndicator) {
      this.backIndicator.style.opacity = '0';
      this.backIndicator.style.transform = 'translateX(0)';
    }
    if (this.leftIndicator) {
      this.leftIndicator.style.opacity = '0';
      this.leftIndicator.style.transform = 'translateX(0)';
    }
    if (this.rightIndicator) {
      this.rightIndicator.style.opacity = '0';
      this.rightIndicator.style.transform = 'translateX(0)';
    }
    this.hasReachedThreshold = false;
  }

  executeSwipe(deltaX) {
    // Haptic feedback
    if (window.haptics) {
      window.haptics.medium();
    }

    if (this.isEdgeSwipe && deltaX > 0) {
      // Back navigation
      this.goBack();
    } else if (this.options.enablePageSwipe) {
      // Page navigation
      if (deltaX > 0) {
        this.goToPreviousPage();
      } else {
        this.goToNextPage();
      }
    }

    this.resetSwipeFeedback();
  }

  goBack() {
    if (window.history.length > 1) {
      this.animatePageTransition('right');
      setTimeout(() => {
        window.history.back();
      }, this.options.animationDuration / 2);
    } else {
      // No history, go to home
      this.navigateWithAnimation('/', 'right');
    }
  }

  goToPreviousPage() {
    const currentPath = window.location.pathname;
    const currentIndex = this.pages.findIndex(page => currentPath.includes(page.split('/').pop()));
    
    if (currentIndex > 0) {
      const previousPage = this.pages[currentIndex - 1];
      this.navigateWithAnimation(previousPage, 'right');
    }
  }

  goToNextPage() {
    const currentPath = window.location.pathname;
    const currentIndex = this.pages.findIndex(page => currentPath.includes(page.split('/').pop()));
    
    if (currentIndex >= 0 && currentIndex < this.pages.length - 1) {
      const nextPage = this.pages[currentIndex + 1];
      this.navigateWithAnimation(nextPage, 'left');
    }
  }

  navigateWithAnimation(url, direction) {
    this.animatePageTransition(direction);
    
    setTimeout(() => {
      window.location.href = url;
    }, this.options.animationDuration);
  }

  animatePageTransition(direction) {
    const overlay = document.createElement('div');
    overlay.className = `page-transition ${direction}`;
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.classList.add('active');
    });

    setTimeout(() => {
      overlay.remove();
    }, this.options.animationDuration);
  }

  destroy() {
    if (this.backIndicator) this.backIndicator.remove();
    if (this.leftIndicator) this.leftIndicator.remove();
    if (this.rightIndicator) this.rightIndicator.remove();
  }
}

// CSS Styles
const style = document.createElement('style');
style.textContent = `
  /* Swipe Indicators */
  .swipe-back-indicator,
  .swipe-page-indicator {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: rgba(102, 126, 234, 0.9);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.5rem;
    opacity: 0;
    transition: opacity 0.2s ease, transform 0.2s ease;
    pointer-events: none;
    z-index: 10000;
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  }

  .swipe-back-indicator {
    left: 20px;
  }

  .swipe-page-indicator.left {
    left: 20px;
  }

  .swipe-page-indicator.right {
    right: 20px;
  }

  .swipe-icon svg {
    width: 24px;
    height: 24px;
  }

  /* Page Transition Overlay */
  .page-transition {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    z-index: 9999;
    pointer-events: none;
    transition: transform ${300}ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .page-transition.left {
    left: 100%;
    transform: translateX(0);
  }

  .page-transition.right {
    right: 100%;
    transform: translateX(0);
  }

  .page-transition.active.left {
    transform: translateX(-100%);
  }

  .page-transition.active.right {
    transform: translateX(100%);
  }

  /* Mobile only */
  @media (min-width: 769px) {
    .swipe-back-indicator,
    .swipe-page-indicator {
      display: none;
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .swipe-back-indicator,
    .swipe-page-indicator,
    .page-transition {
      transition: none !important;
    }
  }

  /* Dark mode */
  @media (prefers-color-scheme: dark) {
    .swipe-back-indicator,
    .swipe-page-indicator {
      background: rgba(118, 75, 162, 0.9);
      box-shadow: 0 4px 20px rgba(118, 75, 162, 0.3);
    }
  }
`;
document.head.appendChild(style);

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
  window.swipeNavigation = new SwipeNavigation({
    enableBackSwipe: true,
    enablePageSwipe: true,
    showVisualFeedback: true
  });
});

export default SwipeNavigation;
