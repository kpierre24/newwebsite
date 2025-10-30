/**
 * Application Configuration
 * Environment settings and feature flags
 */

const APP_CONFIG = {
  // Environment
  ENVIRONMENT: 'production', // 'development' or 'production'
  DEBUG: false, // Enable debug logging
  
  // Feature Flags
  FEATURES: {
    serviceWorker: true,
    offlineMode: true,
    blogFeed: true,
    analytics: false, // Disabled - privacy-first approach
    animations: true,
    mobileEnhancements: true
  },
  
  // Performance
  PERFORMANCE: {
    lazyLoadDelay: 2000, // ms delay before lazy-loading decorative scripts
    cacheVersion: '1.0.1',
    maxCacheAge: 7 * 24 * 60 * 60 * 1000 // 7 days in ms
  },
  
  // CORS Proxies (in order of preference)
  CORS_PROXIES: [
    'https://api.allorigins.win/raw?url=',
    'https://api.codetabs.com/v1/proxy?quest=',
    'https://corsproxy.io/?',
    'https://cors-anywhere.herokuapp.com/'
  ]
};

// Console logging wrapper - only logs in debug mode
const debugLog = (...args) => {
  if (APP_CONFIG.DEBUG) {
    console.log(...args);
  }
};

const debugWarn = (...args) => {
  if (APP_CONFIG.DEBUG) {
    console.warn(...args);
  }
};

const debugError = (...args) => {
  // Always log errors
  console.error(...args);
};

// Export for use in other scripts
if (typeof window !== 'undefined') {
  window.APP_CONFIG = APP_CONFIG;
  window.debugLog = debugLog;
  window.debugWarn = debugWarn;
  window.debugError = debugError;
}
