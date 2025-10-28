// Analytics & Tracking Manager
class AnalyticsManager {
  constructor() {
    this.gaId = 'G-XXXXXXXXXX'; // Replace with actual GA4 ID
    this.sessions = [];
    this.events = [];
    this.userProperties = {};
    this.conversionGoals = new Set();
    
    this.init();
  }

  init() {
    this.loadGoogleAnalytics();
    this.setupCustomTracking();
    this.trackPageView();
    this.setupEventListeners();
    this.trackUserBehavior();
    this.monitorPerformance();
  }

  // Load Google Analytics 4
  loadGoogleAnalytics() {
    // Load gtag script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.gaId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    
    gtag('js', new Date());
    gtag('config', this.gaId, {
      page_title: document.title,
      page_location: window.location.href,
      custom_map: {
        'custom_dimension_1': 'user_type',
        'custom_dimension_2': 'session_duration',
        'custom_dimension_3': 'device_type'
      }
    });

    console.log('Google Analytics 4 initialized');
  }

  // Track page views
  trackPageView(page_path = window.location.pathname) {
    if (typeof gtag !== 'undefined') {
      gtag('config', this.gaId, {
        page_path: page_path,
        page_title: document.title
      });
    }

    // Custom page view tracking
    this.trackEvent('page_view', {
      page_path: page_path,
      page_title: document.title,
      referrer: document.referrer,
      timestamp: new Date().toISOString()
    });
  }

  // Track custom events
  trackEvent(eventName, parameters = {}) {
    // Google Analytics event
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, parameters);
    }

    // Custom event storage
    const event = {
      name: eventName,
      parameters: parameters,
      timestamp: new Date().toISOString(),
      session_id: this.getSessionId()
    };

    this.events.push(event);
    this.saveToLocalStorage('analytics_events', this.events);

    console.log('Event tracked:', eventName, parameters);
  }

  // Track user engagement
  trackUserBehavior() {
    let startTime = Date.now();
    let isActive = true;
    let scrollDepth = 0;
    let maxScrollDepth = 0;

    // Time on page
    const trackTimeOnPage = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      this.trackEvent('time_on_page', {
        duration_seconds: timeSpent,
        page_path: window.location.pathname
      });
    };

    // Page visibility
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        isActive = false;
        trackTimeOnPage();
      } else {
        isActive = true;
        startTime = Date.now();
      }
    });

    // Scroll tracking
    const trackScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollTop = window.pageYOffset;
      scrollDepth = Math.round((scrollTop / scrollHeight) * 100);
      
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
        
        // Track milestone scroll depths
        if (maxScrollDepth >= 25 && maxScrollDepth < 50) {
          this.trackEvent('scroll_depth', { depth: '25%' });
        } else if (maxScrollDepth >= 50 && maxScrollDepth < 75) {
          this.trackEvent('scroll_depth', { depth: '50%' });
        } else if (maxScrollDepth >= 75 && maxScrollDepth < 90) {
          this.trackEvent('scroll_depth', { depth: '75%' });
        } else if (maxScrollDepth >= 90) {
          this.trackEvent('scroll_depth', { depth: '90%' });
        }
      }
    };

    window.addEventListener('scroll', this.throttle(trackScroll, 250));

    // Track page exit
    window.addEventListener('beforeunload', () => {
      trackTimeOnPage();
      this.trackEvent('page_exit', {
        max_scroll_depth: maxScrollDepth,
        time_spent: Math.round((Date.now() - startTime) / 1000)
      });
    });
  }

  // Setup event listeners for interactions
  setupEventListeners() {
    // Click tracking
    document.addEventListener('click', (e) => {
      const element = e.target;
      const tagName = element.tagName.toLowerCase();
      
      // Track button clicks
      if (tagName === 'button' || element.classList.contains('cta-button')) {
        this.trackEvent('button_click', {
          button_text: element.textContent.trim(),
          button_id: element.id || 'no_id',
          page_path: window.location.pathname
        });
      }

      // Track link clicks
      if (tagName === 'a') {
        const href = element.href;
        const isExternal = href && !href.includes(window.location.hostname);
        
        this.trackEvent('link_click', {
          link_text: element.textContent.trim(),
          link_url: href,
          is_external: isExternal,
          page_path: window.location.pathname
        });

        if (isExternal) {
          this.trackEvent('external_link_click', {
            destination: href,
            link_text: element.textContent.trim()
          });
        }
      }

      // Track navigation clicks
      if (element.closest('.nav-links')) {
        this.trackEvent('navigation_click', {
          nav_item: element.textContent.trim(),
          current_page: window.location.pathname
        });
      }
    });

    // Form tracking
    document.addEventListener('submit', (e) => {
      const form = e.target;
      if (form.tagName.toLowerCase() === 'form') {
        this.trackEvent('form_submit', {
          form_id: form.id || 'no_id',
          form_action: form.action || 'no_action',
          page_path: window.location.pathname
        });
      }
    });

    // Form field focus tracking
    document.addEventListener('focus', (e) => {
      if (e.target.tagName.toLowerCase() === 'input' || e.target.tagName.toLowerCase() === 'textarea') {
        this.trackEvent('form_field_focus', {
          field_name: e.target.name || e.target.id || 'unnamed',
          field_type: e.target.type || 'text',
          page_path: window.location.pathname
        });
      }
    }, true);

    // Search tracking
    const searchInputs = document.querySelectorAll('input[type="search"], .search-input, .timeline-search');
    searchInputs.forEach(input => {
      input.addEventListener('input', this.throttle((e) => {
        const query = e.target.value;
        if (query.length > 2) {
          this.trackEvent('search', {
            search_term: query,
            page_path: window.location.pathname
          });
        }
      }, 1000));
    });

    // Filter/sort tracking
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('filter-btn') || e.target.classList.contains('sort-btn')) {
        this.trackEvent('filter_use', {
          filter_type: e.target.dataset.filter || e.target.dataset.sort,
          filter_value: e.target.textContent.trim(),
          page_path: window.location.pathname
        });
      }
    });
  }

  // Track conversion goals
  trackConversion(goalName, value = null) {
    this.trackEvent('conversion', {
      goal_name: goalName,
      goal_value: value,
      page_path: window.location.pathname
    });

    if (typeof gtag !== 'undefined') {
      gtag('event', 'conversion', {
        send_to: this.gaId,
        value: value,
        currency: 'USD'
      });
    }

    this.conversionGoals.add(goalName);
    console.log('Conversion tracked:', goalName, value);
  }

  // Monitor performance metrics
  monitorPerformance() {
    // Track page load performance
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
          this.trackEvent('page_performance', {
            load_time: Math.round(navigation.loadEventEnd - navigation.fetchStart),
            dom_content_loaded: Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart),
            first_paint: this.getFirstPaint(),
            page_path: window.location.pathname
          });
        }
      }, 1000);
    });

    // Track Core Web Vitals
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint (LCP)
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.trackEvent('core_web_vitals', {
          metric: 'LCP',
          value: Math.round(lastEntry.startTime),
          rating: this.getPerformanceRating('LCP', lastEntry.startTime)
        });
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay (FID)
      new PerformanceObserver((entryList) => {
        const firstInput = entryList.getEntries()[0];
        const fid = firstInput.processingStart - firstInput.startTime;
        this.trackEvent('core_web_vitals', {
          metric: 'FID',
          value: Math.round(fid),
          rating: this.getPerformanceRating('FID', fid)
        });
      }).observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        this.trackEvent('core_web_vitals', {
          metric: 'CLS',
          value: Math.round(clsValue * 1000) / 1000,
          rating: this.getPerformanceRating('CLS', clsValue)
        });
      }).observe({ entryTypes: ['layout-shift'] });
    }
  }

  // Get performance rating
  getPerformanceRating(metric, value) {
    const thresholds = {
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 }
    };

    const threshold = thresholds[metric];
    if (!threshold) return 'unknown';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  // Get first paint timing
  getFirstPaint() {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint ? Math.round(firstPaint.startTime) : null;
  }

  // Session management
  getSessionId() {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  // User identification
  identifyUser(userId, properties = {}) {
    this.userProperties = { ...this.userProperties, ...properties };
    
    if (typeof gtag !== 'undefined') {
      gtag('config', this.gaId, {
        user_id: userId,
        custom_map: this.userProperties
      });
    }

    this.trackEvent('user_identification', {
      user_id: userId,
      properties: properties
    });
  }

  // Track custom dimensions
  setCustomDimension(index, value) {
    if (typeof gtag !== 'undefined') {
      gtag('config', this.gaId, {
        [`custom_dimension_${index}`]: value
      });
    }
  }

  // E-commerce tracking (for future use)
  trackPurchase(transactionId, items, value, currency = 'USD') {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'purchase', {
        transaction_id: transactionId,
        value: value,
        currency: currency,
        items: items
      });
    }

    this.trackEvent('purchase', {
      transaction_id: transactionId,
      value: value,
      currency: currency,
      items: items
    });
  }

  // Heat map data collection
  collectHeatmapData() {
    const clicks = [];
    let startTime = Date.now();

    document.addEventListener('click', (e) => {
      const rect = document.documentElement.getBoundingClientRect();
      const click = {
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now() - startTime,
        element: e.target.tagName.toLowerCase(),
        page: window.location.pathname
      };
      
      clicks.push(click);
      
      // Send batch when we have enough data
      if (clicks.length >= 50) {
        this.sendHeatmapData(clicks.splice(0, 50));
      }
    });

    // Send remaining data on page unload
    window.addEventListener('beforeunload', () => {
      if (clicks.length > 0) {
        this.sendHeatmapData(clicks);
      }
    });
  }

  sendHeatmapData(clickData) {
    // Store locally for now (could send to analytics service)
    const existingData = JSON.parse(localStorage.getItem('heatmap_data') || '[]');
    localStorage.setItem('heatmap_data', JSON.stringify([...existingData, ...clickData]));
  }

  // Generate analytics report
  generateReport() {
    const report = {
      session_id: this.getSessionId(),
      page_views: this.events.filter(e => e.name === 'page_view').length,
      events: this.events.length,
      conversions: Array.from(this.conversionGoals),
      user_properties: this.userProperties,
      timestamp: new Date().toISOString()
    };

    return report;
  }

  // Setup custom tracking
  setupCustomTracking() {
    // Track device info
    this.setCustomDimension(3, this.getDeviceType());
    
    // Track user type (new vs returning)
    const isReturning = localStorage.getItem('user_returning') === 'true';
    this.setCustomDimension(1, isReturning ? 'returning' : 'new');
    localStorage.setItem('user_returning', 'true');

    // Start collecting heatmap data
    this.collectHeatmapData();
  }

  getDeviceType() {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  // Utility functions
  throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    return function (...args) {
      const currentTime = Date.now();
      
      if (currentTime - lastExecTime > delay) {
        func.apply(this, args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  }

  saveToLocalStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  }

  getFromLocalStorage(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch (e) {
      console.warn('Could not read from localStorage:', e);
      return [];
    }
  }
}

// A/B Testing Framework
class ABTestManager {
  constructor() {
    this.tests = new Map();
    this.userGroup = this.getUserGroup();
    this.init();
  }

  init() {
    this.loadActiveTests();
    this.applyTests();
  }

  // Define A/B tests
  loadActiveTests() {
    // Example test: CTA button colors
    this.addTest('cta_button_color', {
      variants: {
        'A': { color: '#4e54c8', name: 'Blue' },
        'B': { color: '#f5576c', name: 'Red' },
        'C': { color: '#43e97b', name: 'Green' }
      },
      allocation: { 'A': 34, 'B': 33, 'C': 33 }, // Percentage allocation
      goal: 'contact_form_submit',
      active: true
    });

    // Example test: Hero section text
    this.addTest('hero_headline', {
      variants: {
        'A': 'Building interactive web experiences',
        'B': 'Creating amazing digital solutions',
        'C': 'Crafting beautiful user experiences'
      },
      allocation: { 'A': 50, 'B': 25, 'C': 25 },
      goal: 'navigation_click',
      active: true
    });
  }

  addTest(testName, config) {
    this.tests.set(testName, {
      ...config,
      userVariant: this.assignVariant(testName, config.allocation)
    });
  }

  assignVariant(testName, allocation) {
    // Get stored variant or assign new one
    const storedVariant = localStorage.getItem(`ab_test_${testName}`);
    if (storedVariant && allocation[storedVariant]) {
      return storedVariant;
    }

    // Assign based on user group and allocation percentages
    let cumulative = 0;
    const random = (this.hashCode(this.userGroup + testName) % 100);
    
    for (const [variant, percentage] of Object.entries(allocation)) {
      cumulative += percentage;
      if (random < cumulative) {
        localStorage.setItem(`ab_test_${testName}`, variant);
        return variant;
      }
    }

    // Fallback to first variant
    const firstVariant = Object.keys(allocation)[0];
    localStorage.setItem(`ab_test_${testName}`, firstVariant);
    return firstVariant;
  }

  applyTests() {
    for (const [testName, test] of this.tests) {
      if (!test.active) continue;

      const variant = test.userVariant;
      const variantData = test.variants[variant];

      // Apply test based on test name
      switch (testName) {
        case 'cta_button_color':
          this.applyCTAColorTest(variantData);
          break;
        case 'hero_headline':
          this.applyHeroHeadlineTest(variantData);
          break;
      }

      // Track test exposure
      if (window.analytics) {
        window.analytics.trackEvent('ab_test_exposure', {
          test_name: testName,
          variant: variant,
          variant_name: variantData.name || variant
        });
      }
    }
  }

  applyCTAColorTest(variantData) {
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
      button.style.backgroundColor = variantData.color;
    });
  }

  applyHeroHeadlineTest(variantText) {
    const heroText = document.getElementById('typingText');
    if (heroText) {
      heroText.textContent = variantText;
    }
  }

  // Track conversion for test
  trackConversion(goalName) {
    for (const [testName, test] of this.tests) {
      if (test.goal === goalName && test.active) {
        if (window.analytics) {
          window.analytics.trackEvent('ab_test_conversion', {
            test_name: testName,
            variant: test.userVariant,
            goal: goalName
          });
        }
      }
    }
  }

  getUserGroup() {
    let userGroup = localStorage.getItem('ab_user_group');
    if (!userGroup) {
      userGroup = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('ab_user_group', userGroup);
    }
    return userGroup;
  }

  hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  getTestResults() {
    const results = {};
    for (const [testName, test] of this.tests) {
      results[testName] = {
        variant: test.userVariant,
        active: test.active,
        goal: test.goal
      };
    }
    return results;
  }
}

// Initialize analytics and A/B testing
window.analytics = new AnalyticsManager();
window.abTesting = new ABTestManager();

// Track common conversions
document.addEventListener('DOMContentLoaded', () => {
  // Track contact form submissions
  const contactForms = document.querySelectorAll('form');
  contactForms.forEach(form => {
    form.addEventListener('submit', () => {
      window.analytics.trackConversion('contact_form_submit');
      window.abTesting.trackConversion('contact_form_submit');
    });
  });

  // Track project views
  const projectLinks = document.querySelectorAll('.project-card a, .project-link');
  projectLinks.forEach(link => {
    link.addEventListener('click', () => {
      window.analytics.trackConversion('project_view');
    });
  });

  // Track download actions
  const downloadButtons = document.querySelectorAll('#download-resume, .download-btn');
  downloadButtons.forEach(button => {
    button.addEventListener('click', () => {
      window.analytics.trackConversion('resume_download');
    });
  });
});

console.log('Analytics and A/B Testing initialized');