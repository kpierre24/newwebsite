/**
 * Pull-to-Refresh Component
 * Native app-style pull-to-refresh with visual indicator and haptic feedback
 */

class PullToRefresh {
  constructor(options = {}) {
    this.options = {
      threshold: 80, // Pixels to pull before triggering refresh
      maxPull: 120, // Maximum pull distance
      resistance: 2.5, // Pull resistance factor
      animationDuration: 300,
      onRefresh: options.onRefresh || (() => this.defaultRefresh()),
      container: options.container || document.body,
      ...options
    };

    this.pulling = false;
    this.startY = 0;
    this.currentY = 0;
    this.pullDistance = 0;
    this.isRefreshing = false;

    this.init();
  }

  init() {
    this.createRefreshIndicator();
    this.attachEventListeners();
  }

  createRefreshIndicator() {
    // Create refresh indicator element
    this.indicator = document.createElement('div');
    this.indicator.className = 'pull-to-refresh-indicator';
    this.indicator.innerHTML = `
      <div class="ptr-wrapper">
        <div class="ptr-icon">
          <svg class="ptr-spinner" viewBox="0 0 50 50">
            <circle class="ptr-path" cx="25" cy="25" r="20" fill="none" stroke-width="4"></circle>
          </svg>
          <span class="ptr-arrow">↓</span>
        </div>
        <div class="ptr-text">
          <span class="ptr-pull-text">Pull to refresh</span>
          <span class="ptr-release-text">Release to refresh</span>
          <span class="ptr-loading-text">Refreshing...</span>
        </div>
      </div>
    `;

    // Insert at the beginning of the container
    this.options.container.insertBefore(this.indicator, this.options.container.firstChild);
  }

  attachEventListeners() {
    // Touch events
    document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
    document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });

    // Mouse events for desktop testing
    if (this.options.enableMouseEvents) {
      document.addEventListener('mousedown', this.handleTouchStart.bind(this));
      document.addEventListener('mousemove', this.handleTouchMove.bind(this));
      document.addEventListener('mouseup', this.handleTouchEnd.bind(this));
    }
  }

  handleTouchStart(e) {
    // Only activate if at the top of the page
    if (window.scrollY > 0) return;
    
    // Don't activate if already refreshing
    if (this.isRefreshing) return;

    const touch = e.touches ? e.touches[0] : e;
    this.startY = touch.clientY;
    this.pulling = true;
  }

  handleTouchMove(e) {
    if (!this.pulling || this.isRefreshing) return;

    const touch = e.touches ? e.touches[0] : e;
    this.currentY = touch.clientY;
    
    const deltaY = this.currentY - this.startY;

    // Only pull down
    if (deltaY < 0) return;

    // Apply resistance to make it feel natural
    this.pullDistance = Math.min(
      deltaY / this.options.resistance,
      this.options.maxPull
    );

    // Prevent default scroll behavior when pulling
    if (this.pullDistance > 10) {
      e.preventDefault();
    }

    this.updateIndicator();

    // Haptic feedback when reaching threshold
    if (this.pullDistance >= this.options.threshold && !this.hasReachedThreshold) {
      this.hasReachedThreshold = true;
      if (window.haptics) {
        window.haptics.selection();
      }
    } else if (this.pullDistance < this.options.threshold) {
      this.hasReachedThreshold = false;
    }
  }

  handleTouchEnd() {
    if (!this.pulling || this.isRefreshing) return;

    this.pulling = false;

    // Trigger refresh if pulled far enough
    if (this.pullDistance >= this.options.threshold) {
      this.triggerRefresh();
    } else {
      this.resetIndicator();
    }
  }

  updateIndicator() {
    const progress = Math.min(this.pullDistance / this.options.threshold, 1);
    const rotation = progress * 180;

    this.indicator.style.transform = `translateY(${this.pullDistance}px)`;
    this.indicator.style.opacity = Math.min(progress * 2, 1);

    // Rotate arrow
    const arrow = this.indicator.querySelector('.ptr-arrow');
    if (arrow) {
      arrow.style.transform = `rotate(${rotation}deg)`;
    }

    // Update state classes
    if (progress >= 1) {
      this.indicator.classList.add('ready');
      this.indicator.classList.remove('pulling');
    } else {
      this.indicator.classList.add('pulling');
      this.indicator.classList.remove('ready');
    }
  }

  triggerRefresh() {
    this.isRefreshing = true;
    this.indicator.classList.add('refreshing');
    this.indicator.classList.remove('ready', 'pulling');

    // Lock position at threshold
    this.indicator.style.transform = `translateY(${this.options.threshold}px)`;

    // Haptic feedback
    if (window.haptics) {
      window.haptics.medium();
    }

    // Call refresh callback
    Promise.resolve(this.options.onRefresh())
      .then(() => {
        this.finishRefresh();
      })
      .catch((error) => {
        console.error('Refresh failed:', error);
        this.finishRefresh();
      });
  }

  finishRefresh() {
    // Show success state briefly
    this.indicator.classList.add('success');
    
    if (window.haptics) {
      window.haptics.success();
    }

    setTimeout(() => {
      this.resetIndicator();
    }, 500);
  }

  resetIndicator() {
    this.indicator.style.transition = `transform ${this.options.animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1), opacity ${this.options.animationDuration}ms ease`;
    this.indicator.style.transform = 'translateY(0)';
    this.indicator.style.opacity = '0';

    setTimeout(() => {
      this.indicator.style.transition = '';
      this.indicator.classList.remove('refreshing', 'ready', 'pulling', 'success');
      this.isRefreshing = false;
      this.pullDistance = 0;
      this.hasReachedThreshold = false;
    }, this.options.animationDuration);
  }

  defaultRefresh() {
    // Default refresh action - reload page
    return new Promise((resolve) => {
      setTimeout(() => {
        window.location.reload();
        resolve();
      }, 1000);
    });
  }

  destroy() {
    if (this.indicator && this.indicator.parentNode) {
      this.indicator.parentNode.removeChild(this.indicator);
    }
  }
}

// CSS Styles
const style = document.createElement('style');
style.textContent = `
  .pull-to-refresh-indicator {
    position: fixed;
    top: -120px;
    left: 0;
    right: 0;
    height: 120px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding-bottom: 1rem;
    z-index: 9999;
    opacity: 0;
    will-change: transform, opacity;
  }

  .ptr-wrapper {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1.5rem;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 50px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }

  .ptr-icon {
    position: relative;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ptr-arrow {
    font-size: 1.5rem;
    color: #667eea;
    transition: transform 0.3s ease;
  }

  .ptr-spinner {
    position: absolute;
    width: 32px;
    height: 32px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .ptr-path {
    stroke: #667eea;
    stroke-linecap: round;
    stroke-dasharray: 126;
    stroke-dashoffset: 126;
    animation: ptr-dash 1.5s ease-in-out infinite;
  }

  @keyframes ptr-dash {
    0% {
      stroke-dashoffset: 126;
    }
    50% {
      stroke-dashoffset: 0;
    }
    100% {
      stroke-dashoffset: -126;
    }
  }

  .ptr-text {
    font-size: 0.875rem;
    font-weight: 600;
    color: #333;
    white-space: nowrap;
  }

  .ptr-text span {
    display: none;
  }

  /* State-based text visibility */
  .pull-to-refresh-indicator.pulling .ptr-pull-text,
  .pull-to-refresh-indicator.ready .ptr-release-text,
  .pull-to-refresh-indicator.refreshing .ptr-loading-text {
    display: block;
  }

  /* Refreshing state */
  .pull-to-refresh-indicator.refreshing .ptr-arrow {
    opacity: 0;
  }

  .pull-to-refresh-indicator.refreshing .ptr-spinner {
    opacity: 1;
  }

  /* Success state */
  .pull-to-refresh-indicator.success .ptr-icon::after {
    content: '✓';
    position: absolute;
    font-size: 1.5rem;
    color: #10b981;
    animation: ptr-success 0.5s ease;
  }

  @keyframes ptr-success {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  .pull-to-refresh-indicator.success .ptr-arrow,
  .pull-to-refresh-indicator.success .ptr-spinner {
    opacity: 0;
  }

  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    .ptr-wrapper {
      background: rgba(30, 30, 30, 0.95);
    }

    .ptr-text {
      color: #fff;
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .ptr-spinner,
    .ptr-arrow,
    .pull-to-refresh-indicator {
      animation: none !important;
      transition: none !important;
    }
  }
`;
document.head.appendChild(style);

// Auto-initialize with custom refresh handler
document.addEventListener('DOMContentLoaded', () => {
  window.pullToRefresh = new PullToRefresh({
    onRefresh: async () => {
      // Custom refresh logic - fetch new content
      console.log('Refreshing content...');
      
      // Simulate data fetch
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reload the page or update content dynamically
      window.location.reload();
    }
  });
});

export default PullToRefresh;
