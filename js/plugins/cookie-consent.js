// Cookie Consent Management
class CookieConsent {
  constructor() {
    this.cookieName = 'user-cookie-consent';
    this.cookieExpiry = 365; // days
    this.init();
  }

  init() {
    // Check if user has already made a choice
    const consent = this.getConsent();
    
    if (!consent) {
      // Show banner after a short delay
      setTimeout(() => {
        this.showBanner();
      }, 1000);
    } else {
      // Apply saved preferences
      this.applyConsent(consent);
    }

    // Setup event listeners
    this.setupEventListeners();
  }

  setupEventListeners() {
    const acceptBtn = document.getElementById('acceptCookies');
    const declineBtn = document.getElementById('declineCookies');
    const customizeBtn = document.getElementById('customizeCookies');
    const savePrefsBtn = document.getElementById('savePreferences');
    const closeModalBtn = document.getElementById('closeModal');

    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => this.acceptAll());
    }

    if (declineBtn) {
      declineBtn.addEventListener('click', () => this.declineAll());
    }

    if (customizeBtn) {
      customizeBtn.addEventListener('click', () => this.showModal());
    }

    if (savePrefsBtn) {
      savePrefsBtn.addEventListener('click', () => this.savePreferences());
    }

    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => this.hideModal());
    }

    // Newsletter form
    const newsletterForm = document.getElementById('footerNewsletter');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleNewsletterSubmit(newsletterForm);
      });
    }
  }

  showBanner() {
    const banner = document.getElementById('cookieConsent');
    if (banner) {
      banner.classList.add('show');
    }
  }

  hideBanner() {
    const banner = document.getElementById('cookieConsent');
    if (banner) {
      banner.classList.remove('show');
    }
  }

  showModal() {
    const modal = document.getElementById('cookieModal');
    if (modal) {
      modal.classList.add('show');
    }
  }

  hideModal() {
    const modal = document.getElementById('cookieModal');
    if (modal) {
      modal.classList.remove('show');
    }
  }

  acceptAll() {
    const consent = {
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    };
    
    this.saveConsent(consent);
    this.applyConsent(consent);
    this.hideBanner();
    
    this.showNotification('✅ Cookie preferences saved!', 'success');
  }

  declineAll() {
    const consent = {
      essential: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    };
    
    this.saveConsent(consent);
    this.applyConsent(consent);
    this.hideBanner();
    
    this.showNotification('Preferences saved. Only essential cookies will be used.', 'info');
  }

  savePreferences() {
    const analyticsChecked = document.getElementById('analyticsCookies')?.checked || false;
    const marketingChecked = document.getElementById('marketingCookies')?.checked || false;
    
    const consent = {
      essential: true,
      analytics: analyticsChecked,
      marketing: marketingChecked,
      timestamp: new Date().toISOString()
    };
    
    this.saveConsent(consent);
    this.applyConsent(consent);
    this.hideModal();
    this.hideBanner();
    
    this.showNotification('✅ Your preferences have been saved!', 'success');
  }

  saveConsent(consent) {
    const consentString = JSON.stringify(consent);
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + this.cookieExpiry);
    
    document.cookie = `${this.cookieName}=${consentString}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;
  }

  getConsent() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === this.cookieName) {
        try {
          return JSON.parse(decodeURIComponent(value));
        } catch (e) {
          console.error('Error parsing cookie consent:', e);
          return null;
        }
      }
    }
    return null;
  }

  applyConsent(consent) {
    console.log('📊 Applying cookie consent:', consent);
    
    // Analytics cookies
    if (consent.analytics) {
      this.enableAnalytics();
    } else {
      this.disableAnalytics();
    }
    
    // Marketing cookies
    if (consent.marketing) {
      this.enableMarketing();
    } else {
      this.disableMarketing();
    }
  }

  enableAnalytics() {
    console.log('✅ Analytics enabled');
    // Update Google Analytics consent
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
      
      // Track consent acceptance
      gtag('event', 'consent_update', {
        event_category: 'Privacy',
        event_label: 'Analytics Enabled'
      });
    }
  }

  disableAnalytics() {
    console.log('❌ Analytics disabled');
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        'analytics_storage': 'denied'
      });
    }
  }

  enableMarketing() {
    console.log('✅ Marketing cookies enabled');
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        'ad_storage': 'granted',
        'ad_user_data': 'granted',
        'ad_personalization': 'granted'
      });
    }
  }

  disableMarketing() {
    console.log('❌ Marketing cookies disabled');
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied'
      });
    }
  }

  handleNewsletterSubmit(form) {
    const emailInput = form.querySelector('input[type="email"]');
    const email = emailInput?.value;
    
    if (!email) return;
    
    // Show success message
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        title: '🎉 Subscribed!',
        html: `Thank you for subscribing with <strong>${email}</strong>.<br>You'll receive our next newsletter soon!`,
        icon: 'success',
        confirmButtonColor: '#6366f1',
        timer: 5000,
        timerProgressBar: true
      });
    } else {
      this.showNotification(`Thank you for subscribing with ${email}!`, 'success');
    }
    
    // Reset form
    form.reset();
    
    // Track newsletter signup (if analytics enabled)
    const consent = this.getConsent();
    if (consent?.analytics && window.gtag) {
      window.gtag('event', 'newsletter_signup', {
        'event_category': 'engagement',
        'event_label': 'footer_newsletter'
      });
    }
  }

  showNotification(message, type = 'info') {
    // If SweetAlert2 is not available, use basic alert
    if (typeof Swal === 'undefined') {
      alert(message);
      return;
    }
    
    const config = {
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      icon: type,
      title: message
    };
    
    Swal.fire(config);
  }
}

// Initialize cookie consent when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.cookieConsent = new CookieConsent();
  });
} else {
  window.cookieConsent = new CookieConsent();
}
