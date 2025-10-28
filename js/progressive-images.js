/**
 * Progressive Image Loading System
 * Handles lazy loading, blur-up effect, and performance optimization
 */

class ProgressiveImageLoader {
  constructor() {
    this.images = [];
    this.lazyImages = document.querySelectorAll('.lazy-load, [data-src]');
    this.observer = null;
    this.init();
  }

  init() {
    // Add native lazy loading to all images
    this.addLazyLoadingAttributes();
    
    // Setup Intersection Observer for advanced effects
    this.setupIntersectionObserver();
    
    // Handle blur-up effect for images with data-src
    this.setupBlurUpEffect();
    
    // Preload critical images
    this.preloadCriticalImages();
  }

  addLazyLoadingAttributes() {
    const allImages = document.querySelectorAll('img:not([loading])');
    
    allImages.forEach((img, index) => {
      // First 2 images should load eagerly (above the fold)
      if (index < 2) {
        img.setAttribute('loading', 'eager');
        img.setAttribute('fetchpriority', 'high');
      } else {
        img.setAttribute('loading', 'lazy');
        img.setAttribute('decoding', 'async');
      }
    });
  }

  setupIntersectionObserver() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: load all images immediately
      this.loadAllImages();
      return;
    }

    const options = {
      root: null,
      rootMargin: '50px', // Start loading 50px before entering viewport
      threshold: 0.01
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, options);

    this.lazyImages.forEach(img => {
      this.observer.observe(img);
    });
  }

  setupBlurUpEffect() {
    const imagesWithPlaceholder = document.querySelectorAll('[data-src]');
    
    imagesWithPlaceholder.forEach(img => {
      // Add blur-up class
      img.classList.add('blur-up');
      
      // Create placeholder if data-placeholder exists
      if (img.dataset.placeholder) {
        const placeholder = new Image();
        placeholder.src = img.dataset.placeholder;
        placeholder.className = 'placeholder-img';
        placeholder.setAttribute('aria-hidden', 'true');
        img.parentNode.insertBefore(placeholder, img);
      }
    });
  }

  loadImage(img) {
    const src = img.dataset.src || img.src;
    const srcset = img.dataset.srcset;
    
    if (!src) return;

    // Create a new image to preload
    const tempImg = new Image();
    
    tempImg.onload = () => {
      // Apply the source
      if (img.tagName === 'IMG') {
        img.src = src;
        if (srcset) img.srcset = srcset;
      } else {
        img.style.backgroundImage = `url('${src}')`;
      }
      
      // Remove blur and add loaded class
      img.classList.remove('blur-up');
      img.classList.add('loaded');
      
      // Remove placeholder if exists
      const placeholder = img.previousElementSibling;
      if (placeholder && placeholder.classList.contains('placeholder-img')) {
        setTimeout(() => {
          placeholder.style.opacity = '0';
          setTimeout(() => placeholder.remove(), 300);
        }, 100);
      }
      
      // Trigger animation
      this.triggerLoadAnimation(img);
    };

    tempImg.onerror = () => {
      img.classList.add('load-error');
      console.error('Failed to load image:', src);
    };

    tempImg.src = src;
    if (srcset) tempImg.srcset = srcset;
  }

  triggerLoadAnimation(img) {
    img.style.opacity = '0';
    img.style.transform = 'scale(0.95)';
    
    requestAnimationFrame(() => {
      img.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      img.style.opacity = '1';
      img.style.transform = 'scale(1)';
    });
  }

  preloadCriticalImages() {
    // Preload hero and above-the-fold images
    const criticalImages = document.querySelectorAll('.hero-image, [data-priority="high"]');
    
    criticalImages.forEach(img => {
      const src = img.dataset.src || img.src;
      if (src) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      }
    });
  }

  loadAllImages() {
    // Fallback for browsers without IntersectionObserver
    this.lazyImages.forEach(img => this.loadImage(img));
  }

  // Public method to manually load an image
  static loadNow(selector) {
    const img = document.querySelector(selector);
    if (img) {
      const loader = new ProgressiveImageLoader();
      loader.loadImage(img);
    }
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.progressiveImageLoader = new ProgressiveImageLoader();
  });
} else {
  window.progressiveImageLoader = new ProgressiveImageLoader();
}

// CSS for progressive loading effects
const style = document.createElement('style');
style.textContent = `
  /* Progressive Image Loading Styles */
  img.blur-up {
    filter: blur(5px);
    transform: scale(1.05);
    transition: filter 0.3s ease, transform 0.3s ease;
  }

  img.loaded {
    filter: blur(0);
    transform: scale(1);
  }

  img.load-error {
    opacity: 0.5;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .placeholder-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: blur(10px);
    transform: scale(1.1);
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  /* Skeleton loading for lazy images */
  .lazy-load:not(.loaded) {
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.1) 25%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0.1) 75%
    );
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s ease-in-out infinite;
  }

  @keyframes skeleton-loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* Reduce motion for accessibility */
  @media (prefers-reduced-motion: reduce) {
    img.blur-up,
    img.loaded,
    .placeholder-img {
      transition: none !important;
      animation: none !important;
    }
  }
`;
document.head.appendChild(style);

export default ProgressiveImageLoader;
