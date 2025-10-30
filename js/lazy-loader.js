/**
 * Lazy Script Loader
 * Loads non-critical/decorative scripts after page load
 * Improves initial page load performance by deferring decorative features
 */

(function() {
  'use strict';
  
  // Scripts to load lazily (after initial page render)
  const lazyScripts = [
    // Decorative/Enhancement Scripts (not critical for initial render)
    {
      src: 'https://cdn.jsdelivr.net/npm/vanilla-tilt@1.8.1/dist/vanilla-tilt.min.js',
      description: 'Vanilla Tilt - 3D card effects'
    },
    {
      src: 'https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js',
      description: 'Particles.js - Background particles'
    },
    {
      src: 'https://unpkg.com/splitting/dist/splitting.min.js',
      description: 'Splitting.js - Text animations',
      css: 'https://unpkg.com/splitting/dist/splitting.css'
    },
    {
      src: 'https://cdn.jsdelivr.net/npm/@barba/core@2.9.7/dist/barba.umd.js',
      description: 'Barba.js - Page transitions'
    }
  ];

  // Load a script dynamically
  function loadScript(scriptConfig) {
    return new Promise((resolve, reject) => {
      // Load CSS if specified
      if (scriptConfig.css) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = scriptConfig.css;
        document.head.appendChild(link);
      }

      // Load script
      const script = document.createElement('script');
      script.src = scriptConfig.src;
      script.async = true;
      script.onload = () => {
        if (window.debugLog) {
          debugLog(`✅ Lazy loaded: ${scriptConfig.description}`);
        }
        resolve(scriptConfig);
      };
      script.onerror = () => {
        if (window.debugWarn) {
          debugWarn(`⚠️ Failed to lazy load: ${scriptConfig.description}`);
        }
        reject(new Error(`Failed to load ${scriptConfig.src}`));
      };
      document.body.appendChild(script);
    });
  }

  // Start lazy loading after page is fully loaded
  function initLazyLoading() {
    const delay = window.APP_CONFIG?.PERFORMANCE?.lazyLoadDelay || 2000;
    
    setTimeout(() => {
      if (window.debugLog) {
        debugLog('🚀 Starting lazy script loading...');
      }
      
      // Load all scripts in parallel
      Promise.allSettled(lazyScripts.map(loadScript))
        .then(results => {
          const successful = results.filter(r => r.status === 'fulfilled').length;
          const failed = results.filter(r => r.status === 'rejected').length;
          
          if (window.debugLog) {
            debugLog(`✅ Lazy loading complete: ${successful} successful, ${failed} failed`);
          }
          
          // Dispatch custom event for scripts that depend on lazy-loaded libraries
          window.dispatchEvent(new CustomEvent('lazyScriptsLoaded', {
            detail: { successful, failed, results }
          }));
        });
    }, delay);
  }

  // Start when page is loaded
  if (document.readyState === 'complete') {
    initLazyLoading();
  } else {
    window.addEventListener('load', initLazyLoading);
  }
})();
