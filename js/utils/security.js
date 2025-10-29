// Security Manager
class SecurityManager {
  constructor() {
    this.cspViolations = [];
    this.securityPolicies = new Map();
    this.trustedDomains = new Set([
      'fonts.googleapis.com',
      'fonts.gstatic.com',
      'cdnjs.cloudflare.com',
      'www.googletagmanager.com',
      'cdn.emailjs.com',
      'api.emailjs.com',
      'api.allorigins.win'
    ]);
    
    this.init();
  }

  init() {
    this.setupCSP();
    this.sanitizeInputs();
    this.preventXSS();
    this.setupSecureHeaders();
    this.monitorSecurityViolations();
    this.validateExternalResources();
  }

  // Content Security Policy setup
  setupCSP() {
    // Report CSP violations
    document.addEventListener('securitypolicyviolation', (e) => {
      this.handleCSPViolation(e);
    });

    // Add CSP meta tag if not present
    if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
      const cspMeta = document.createElement('meta');
      cspMeta.httpEquiv = 'Content-Security-Policy';
      cspMeta.content = this.generateCSPPolicy();
      document.head.appendChild(cspMeta);
    }
  }

  generateCSPPolicy() {
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://cdn.emailjs.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net",
      "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://api.emailjs.com https://www.google-analytics.com https://api.allorigins.win",
      "base-uri 'self'",
      "form-action 'self' https://api.emailjs.com"
    ].join('; ');
  }

  handleCSPViolation(violation) {
    const violationData = {
      directive: violation.violatedDirective,
      blockedURI: violation.blockedURI,
      lineNumber: violation.lineNumber,
      sourceFile: violation.sourceFile,
      timestamp: new Date().toISOString()
    };

    this.cspViolations.push(violationData);
    console.warn('CSP Violation:', violationData);

    // Send violation report to analytics
    if (window.analytics) {
      window.analytics.trackEvent('security_violation', {
        type: 'csp',
        directive: violation.violatedDirective,
        blocked_uri: violation.blockedURI
      });
    }

    // Store violations for review
    this.storeViolation(violationData);
  }

  // Input sanitization
  sanitizeInputs() {
    // Sanitize all form inputs
    document.addEventListener('input', (e) => {
      if (e.target.type === 'text' || e.target.type === 'email' || e.target.tagName === 'TEXTAREA') {
        e.target.value = this.sanitizeHTML(e.target.value);
      }
    });

    // Sanitize on form submission
    document.addEventListener('submit', (e) => {
      const form = e.target;
      if (form.tagName === 'FORM') {
        this.sanitizeFormData(form);
      }
    });
  }

  sanitizeHTML(input) {
    if (typeof input !== 'string') return input;
    
    // Remove potential XSS vectors
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/eval\s*\(/gi, '')
      .replace(/expression\s*\(/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');
  }

  sanitizeFormData(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      if (input.type !== 'password' && input.type !== 'file') {
        input.value = this.sanitizeHTML(input.value);
      }
    });
  }

  // XSS Prevention
  preventXSS() {
    // Override innerHTML to sanitize content
    const originalInnerHTMLDescriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
    Object.defineProperty(Element.prototype, 'innerHTML', {
      set: function(value) {
        if (typeof value === 'string') {
          value = window.securityManager.sanitizeHTML(value);
        }
        originalInnerHTMLDescriptor.set.call(this, value);
      },
      get: function() {
        return originalInnerHTMLDescriptor.get.call(this);
      }
    });

    // Monitor for potential XSS attempts
    this.detectXSSAttempts();
  }

  detectXSSAttempts() {
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /eval\s*\(/i,
      /expression\s*\(/i,
      /vbscript:/i,
      /data:text\/html/i
    ];

    document.addEventListener('input', (e) => {
      const value = e.target.value;
      if (typeof value === 'string') {
        suspiciousPatterns.forEach(pattern => {
          if (pattern.test(value)) {
            this.logSecurityEvent('xss_attempt', {
              pattern: pattern.source,
              value: value.substring(0, 100),
              element: e.target.tagName,
              timestamp: new Date().toISOString()
            });
          }
        });
      }
    });
  }

  // Setup secure headers via JavaScript (when server headers aren't available)
  setupSecureHeaders() {
    // Add security-related meta tags
    this.addMetaTag('X-Content-Type-Options', 'nosniff');
    this.addMetaTag('X-Frame-Options', 'DENY');
    this.addMetaTag('X-XSS-Protection', '1; mode=block');
    this.addMetaTag('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Secure all external links
    this.secureExternalLinks();
  }

  addMetaTag(name, content) {
    if (!document.querySelector(`meta[http-equiv="${name}"]`)) {
      const meta = document.createElement('meta');
      meta.httpEquiv = name;
      meta.content = content;
      document.head.appendChild(meta);
    }
  }

  secureExternalLinks() {
    const externalLinks = document.querySelectorAll('a[href^="http"]');
    externalLinks.forEach(link => {
      const url = new URL(link.href);
      if (!this.trustedDomains.has(url.hostname) && url.hostname !== window.location.hostname) {
        link.rel = 'noopener noreferrer';
        link.target = '_blank';
        
        // Add warning for external links
        link.addEventListener('click', (e) => {
          if (!confirm(`You are about to visit an external site: ${url.hostname}. Continue?`)) {
            e.preventDefault();
          }
        });
      }
    });
  }

  // Validate external resources
  validateExternalResources() {
    // Check all scripts
    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach(script => {
      if (!this.isValidResourceURL(script.src)) {
        console.warn('Suspicious script source:', script.src);
        this.logSecurityEvent('suspicious_resource', {
          type: 'script',
          src: script.src
        });
      }
    });

    // Check all stylesheets
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    stylesheets.forEach(link => {
      if (!this.isValidResourceURL(link.href)) {
        console.warn('Suspicious stylesheet source:', link.href);
        this.logSecurityEvent('suspicious_resource', {
          type: 'stylesheet',
          href: link.href
        });
      }
    });
  }

  isValidResourceURL(url) {
    try {
      const urlObj = new URL(url);
      
      // Allow same origin
      if (urlObj.origin === window.location.origin) return true;
      
      // Allow trusted domains
      if (this.trustedDomains.has(urlObj.hostname)) return true;
      
      // Allow data URLs for small resources
      if (urlObj.protocol === 'data:') return true;
      
      return false;
    } catch (e) {
      return false;
    }
  }

  // Monitor security violations
  monitorSecurityViolations() {
    // Monitor for suspicious behavior
    let rapidRequests = 0;
    const requestLimit = 100;
    const timeWindow = 60000; // 1 minute

    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const url = args[0];
      
      // Check if URL is from a trusted domain
      if (typeof url === 'string') {
        try {
          const urlObj = new URL(url);
          const hostname = urlObj.hostname;
          
          // Allow trusted domains
          const isTrusted = Array.from(this.trustedDomains).some(domain => 
            hostname === domain || hostname.endsWith('.' + domain)
          );
          
          if (!isTrusted) {
            console.warn('Blocked fetch to untrusted domain:', hostname);
            throw new TypeError('Failed to fetch. Refused to connect because it violates the document\'s Content Security Policy.');
          }
        } catch (e) {
          // If URL parsing fails, it might be a relative URL (which is safe)
          if (!url.startsWith('/') && !url.startsWith('.')) {
            throw e;
          }
        }
      }
      
      rapidRequests++;
      
      if (rapidRequests > requestLimit) {
        this.logSecurityEvent('rate_limit_exceeded', {
          requests: rapidRequests,
          timeWindow: timeWindow
        });
      }

      setTimeout(() => rapidRequests--, timeWindow);
      
      return originalFetch(...args);
    };

    // Monitor for DOM manipulation attempts
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.validateNewElement(node);
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  validateNewElement(element) {
    // Check for suspicious script injections
    if (element.tagName === 'SCRIPT' && !element.src) {
      const content = element.textContent || element.innerHTML;
      if (this.containsMaliciousCode(content)) {
        this.logSecurityEvent('malicious_script_injection', {
          content: content.substring(0, 200)
        });
        element.remove();
      }
    }

    // Check for suspicious iframes
    if (element.tagName === 'IFRAME') {
      const src = element.src || element.getAttribute('src');
      if (src && !this.isValidResourceURL(src)) {
        this.logSecurityEvent('suspicious_iframe', { src });
        element.remove();
      }
    }
  }

  containsMaliciousCode(code) {
    const maliciousPatterns = [
      /eval\s*\(/i,
      /Function\s*\(/i,
      /setTimeout\s*\(\s*['"`][^'"`]*['"`]/i,
      /setInterval\s*\(\s*['"`][^'"`]*['"`]/i,
      /document\.cookie/i,
      /localStorage\./i,
      /sessionStorage\./i
    ];

    return maliciousPatterns.some(pattern => pattern.test(code));
  }

  // Secure local storage operations
  secureStorage() {
    const originalSetItem = Storage.prototype.setItem;
    const originalGetItem = Storage.prototype.getItem;

    Storage.prototype.setItem = function(key, value) {
      // Encrypt sensitive data before storage
      if (window.securityManager.isSensitiveKey(key)) {
        value = window.securityManager.encrypt(value);
      }
      return originalSetItem.call(this, key, value);
    };

    Storage.prototype.getItem = function(key) {
      const value = originalGetItem.call(this, key);
      // Decrypt sensitive data after retrieval
      if (value && window.securityManager.isSensitiveKey(key)) {
        return window.securityManager.decrypt(value);
      }
      return value;
    };
  }

  isSensitiveKey(key) {
    const sensitiveKeys = ['user_id', 'session_token', 'auth_token', 'api_key'];
    return sensitiveKeys.some(sensitive => key.includes(sensitive));
  }

  // Simple encryption for demo (use proper encryption in production)
  encrypt(data) {
    try {
      return btoa(encodeURIComponent(data));
    } catch (e) {
      console.warn('Encryption failed:', e);
      return data;
    }
  }

  decrypt(data) {
    try {
      return decodeURIComponent(atob(data));
    } catch (e) {
      console.warn('Decryption failed:', e);
      return data;
    }
  }

  // Log security events
  logSecurityEvent(eventType, details) {
    const event = {
      type: eventType,
      details: details,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Store locally for review
    this.storeViolation(event);

    // Send to analytics if available
    if (window.analytics) {
      window.analytics.trackEvent('security_event', {
        event_type: eventType,
        details: JSON.stringify(details)
      });
    }

    console.warn('Security Event:', event);
  }

  storeViolation(violation) {
    try {
      const violations = JSON.parse(localStorage.getItem('security_violations') || '[]');
      violations.push(violation);
      
      // Keep only last 100 violations
      if (violations.length > 100) {
        violations.splice(0, violations.length - 100);
      }
      
      localStorage.setItem('security_violations', JSON.stringify(violations));
    } catch (e) {
      console.warn('Could not store security violation:', e);
    }
  }

  // Get security report
  getSecurityReport() {
    const violations = JSON.parse(localStorage.getItem('security_violations') || '[]');
    
    return {
      totalViolations: violations.length,
      cspViolations: violations.filter(v => v.type === 'csp').length,
      xssAttempts: violations.filter(v => v.type === 'xss_attempt').length,
      suspiciousResources: violations.filter(v => v.type === 'suspicious_resource').length,
      recentViolations: violations.slice(-10),
      timestamp: new Date().toISOString()
    };
  }

  // Clear security logs
  clearSecurityLogs() {
    localStorage.removeItem('security_violations');
    this.cspViolations = [];
    console.log('Security logs cleared');
  }

  // Validate form submissions
  validateFormSubmission(form) {
    const formData = new FormData(form);
    let isValid = true;
    
    for (const [key, value] of formData.entries()) {
      // Check for SQL injection patterns
      if (this.containsSQLInjection(value)) {
        this.logSecurityEvent('sql_injection_attempt', {
          field: key,
          value: value.substring(0, 100)
        });
        isValid = false;
      }
      
      // Check for script injection
      if (this.containsScriptInjection(value)) {
        this.logSecurityEvent('script_injection_attempt', {
          field: key,
          value: value.substring(0, 100)
        });
        isValid = false;
      }
    }
    
    return isValid;
  }

  containsSQLInjection(input) {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
      /(\b(OR|AND)\s+\w+\s*=\s*\w+)/i,
      /('|(\\')|(;)|(--)|(\|)|(\*)|(%27)|(\%22))/i
    ];
    
    return sqlPatterns.some(pattern => pattern.test(input));
  }

  containsScriptInjection(input) {
    const scriptPatterns = [
      /<script/i,
      /javascript:/i,
      /vbscript:/i,
      /on\w+\s*=/i,
      /eval\s*\(/i
    ];
    
    return scriptPatterns.some(pattern => pattern.test(input));
  }
}

// Initialize security manager
window.securityManager = new SecurityManager();

// Add form validation
document.addEventListener('submit', (e) => {
  const form = e.target;
  if (form.tagName === 'FORM') {
    if (!window.securityManager.validateFormSubmission(form)) {
      e.preventDefault();
      alert('Form submission blocked due to security concerns. Please review your input.');
    }
  }
});

console.log('Security Manager initialized');