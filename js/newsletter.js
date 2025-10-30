/**
 * Newsletter Subscription System
 * Email capture with validation, success animations, and export-ready format
 * Works with Mailchimp, ConvertKit, or any email service
 */

class NewsletterSystem {
    constructor() {
        this.subscribers = this.loadSubscribers();
        this.emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        this.init();
    }

    init() {
        this.createNewsletterForms();
        this.attachEventListeners();
        this.loadFromLocalStorage();
    }

    loadSubscribers() {
        try {
            const stored = localStorage.getItem('newsletter-subscribers');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Failed to load subscribers:', error);
            return [];
        }
    }

    saveSubscribers() {
        try {
            localStorage.setItem('newsletter-subscribers', JSON.stringify(this.subscribers));
        } catch (error) {
            console.error('Failed to save subscribers:', error);
        }
    }

    createNewsletterForms() {
        // Find all newsletter placeholders
        const placeholders = document.querySelectorAll('.newsletter-placeholder, .newsletter-form-container');
        
        if (placeholders.length === 0) {
            // Create a default newsletter section at the end of main content
            this.createDefaultNewsletterSection();
        } else {
            placeholders.forEach(placeholder => {
                this.replaceWithForm(placeholder);
            });
        }
    }

    createDefaultNewsletterSection() {
        const main = document.querySelector('main');
        if (!main) return;

        const section = document.createElement('section');
        section.className = 'newsletter-section default-newsletter';
        section.innerHTML = this.getFormHTML('default');
        
        main.appendChild(section);
        this.attachFormListeners(section);
    }

    replaceWithForm(placeholder) {
        const variant = placeholder.dataset.variant || 'default';
        placeholder.innerHTML = this.getFormHTML(variant);
        this.attachFormListeners(placeholder);
    }

    getFormHTML(variant = 'default') {
        const variants = {
            default: {
                title: 'Stay Updated',
                subtitle: 'Get the latest articles and insights delivered straight to your inbox.',
                placeholder: 'Enter your email address',
                buttonText: 'Subscribe',
                icon: '📧'
            },
            minimal: {
                title: 'Newsletter',
                subtitle: 'Join our mailing list',
                placeholder: 'Your email',
                buttonText: 'Join',
                icon: '✉️'
            },
            popup: {
                title: 'Never Miss an Update!',
                subtitle: 'Subscribe to get notified about new posts, projects, and updates.',
                placeholder: 'Your email address',
                buttonText: 'Subscribe Now',
                icon: '🎉'
            },
            footer: {
                title: 'Stay in Touch',
                subtitle: 'Weekly updates on new content',
                placeholder: 'Email address',
                buttonText: 'Sign Up',
                icon: '💌'
            }
        };

        const config = variants[variant] || variants.default;

        return `
            <div class="newsletter-form-wrapper" data-variant="${variant}">
                <div class="newsletter-header">
                    <span class="newsletter-icon">${config.icon}</span>
                    <h3 class="newsletter-title">${config.title}</h3>
                    <p class="newsletter-subtitle">${config.subtitle}</p>
                </div>
                
                <form class="newsletter-form" novalidate>
                    <div class="form-group">
                        <input 
                            type="email" 
                            class="newsletter-email-input" 
                            placeholder="${config.placeholder}"
                            aria-label="Email address"
                            required
                        />
                        <button type="submit" class="newsletter-submit-btn" aria-label="Subscribe">
                            ${config.buttonText}
                        </button>
                    </div>
                    <div class="form-feedback" role="alert" aria-live="polite"></div>
                    <p class="newsletter-privacy">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                        We respect your privacy. Unsubscribe at any time.
                    </p>
                </form>
                
                <div class="newsletter-success" style="display: none;">
                    <div class="success-animation">
                        <svg class="success-checkmark" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                    </div>
                    <h4 class="success-title">You're subscribed! 🎉</h4>
                    <p class="success-message">Check your email to confirm your subscription.</p>
                </div>

                <div class="subscriber-count">
                    <span class="count-number">${this.subscribers.length}</span> subscribers
                </div>
            </div>
        `;
    }

    attachFormListeners(container) {
        const form = container.querySelector('.newsletter-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit(form);
        });

        const emailInput = form.querySelector('.newsletter-email-input');
        if (emailInput) {
            emailInput.addEventListener('input', () => {
                this.clearFeedback(form);
            });

            emailInput.addEventListener('blur', () => {
                if (emailInput.value) {
                    this.validateEmail(emailInput.value, form);
                }
            });
        }
    }

    attachEventListeners() {
        // Create popup newsletter (appears after scroll or time)
        this.createPopupNewsletter();

        // Export functionality
        this.addExportButton();
    }

    async handleSubmit(form) {
        const emailInput = form.querySelector('.newsletter-email-input');
        const email = emailInput.value.trim();

        // Validate email
        if (!this.validateEmail(email, form)) {
            return;
        }

        // Check if already subscribed
        if (this.isSubscribed(email)) {
            this.showFeedback(form, 'You\'re already subscribed! 😊', 'info');
            return;
        }

        // Disable form during submission
        this.setFormLoading(form, true);

        try {
            // Simulate API call (replace with actual API endpoint)
            await this.subscribeUser(email);

            // Save to local storage
            this.addSubscriber(email);

            // Show success
            this.showSuccess(form);

            // Update subscriber count
            this.updateSubscriberCount();

        } catch (error) {
            this.showFeedback(form, 'Something went wrong. Please try again.', 'error');
        } finally {
            this.setFormLoading(form, false);
        }
    }

    validateEmail(email, form) {
        if (!email) {
            this.showFeedback(form, 'Please enter your email address', 'error');
            return false;
        }

        if (!this.emailRegex.test(email)) {
            this.showFeedback(form, 'Please enter a valid email address', 'error');
            return false;
        }

        return true;
    }

    isSubscribed(email) {
        return this.subscribers.some(sub => sub.email.toLowerCase() === email.toLowerCase());
    }

    async subscribeUser(email) {
        // Simulate API call - replace with actual endpoint
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 95% success rate
                if (Math.random() > 0.05) {
                    resolve({ success: true });
                } else {
                    reject(new Error('Network error'));
                }
            }, 1000);
        });

        // Example real API call:
        // return fetch('YOUR_API_ENDPOINT', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ email })
        // });
    }

    addSubscriber(email) {
        const subscriber = {
            email: email,
            subscribedAt: new Date().toISOString(),
            source: 'website'
        };

        this.subscribers.push(subscriber);
        this.saveSubscribers();
    }

    showSuccess(form) {
        const wrapper = form.closest('.newsletter-form-wrapper');
        const formElement = wrapper.querySelector('.newsletter-form');
        const successElement = wrapper.querySelector('.newsletter-success');

        formElement.style.display = 'none';
        successElement.style.display = 'block';

        // Trigger animation
        setTimeout(() => {
            successElement.classList.add('animate');
        }, 50);

        // Reset after 10 seconds
        setTimeout(() => {
            this.resetForm(form);
        }, 10000);
    }

    resetForm(form) {
        const wrapper = form.closest('.newsletter-form-wrapper');
        const formElement = wrapper.querySelector('.newsletter-form');
        const successElement = wrapper.querySelector('.newsletter-success');

        successElement.classList.remove('animate');
        
        setTimeout(() => {
            formElement.style.display = 'block';
            successElement.style.display = 'none';
            form.reset();
        }, 300);
    }

    showFeedback(form, message, type = 'error') {
        const feedback = form.querySelector('.form-feedback');
        if (!feedback) return;

        feedback.textContent = message;
        feedback.className = `form-feedback ${type}`;
        feedback.style.display = 'block';

        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.clearFeedback(form);
        }, 5000);
    }

    clearFeedback(form) {
        const feedback = form.querySelector('.form-feedback');
        if (feedback) {
            feedback.style.display = 'none';
        }
    }

    setFormLoading(form, loading) {
        const button = form.querySelector('.newsletter-submit-btn');
        const input = form.querySelector('.newsletter-email-input');

        if (loading) {
            button.disabled = true;
            button.classList.add('loading');
            button.innerHTML = `
                <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                </svg>
                Subscribing...
            `;
            input.disabled = true;
        } else {
            button.disabled = false;
            button.classList.remove('loading');
            button.textContent = 'Subscribe';
            input.disabled = false;
        }
    }

    updateSubscriberCount() {
        const countElements = document.querySelectorAll('.count-number');
        countElements.forEach(el => {
            el.textContent = this.subscribers.length;
        });
    }

    createPopupNewsletter() {
        // Don't show popup if user already subscribed or dismissed
        if (localStorage.getItem('newsletter-popup-dismissed')) {
            return;
        }

        const popup = document.createElement('div');
        popup.className = 'newsletter-popup';
        popup.style.display = 'none';
        popup.innerHTML = `
            <div class="newsletter-popup-content">
                <button class="newsletter-popup-close" aria-label="Close">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                ${this.getFormHTML('popup')}
            </div>
        `;

        document.body.appendChild(popup);

        // Attach listeners to popup form
        this.attachFormListeners(popup);

        // Close button
        const closeBtn = popup.querySelector('.newsletter-popup-close');
        closeBtn.addEventListener('click', () => {
            this.closePopup(popup);
        });

        // Close on backdrop click
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                this.closePopup(popup);
            }
        });

        // Show popup after scroll or time
        let shown = false;
        const showPopup = () => {
            if (!shown) {
                shown = true;
                this.showPopup(popup);
            }
        };

        // Show after 30 seconds
        setTimeout(showPopup, 30000);

        // Or after scrolling 50% of page
        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            if (scrollPercent > 50) {
                showPopup();
            }
        }, { once: true });
    }

    showPopup(popup) {
        popup.style.display = 'flex';
        setTimeout(() => {
            popup.classList.add('show');
        }, 50);
    }

    closePopup(popup) {
        popup.classList.remove('show');
        localStorage.setItem('newsletter-popup-dismissed', 'true');
        setTimeout(() => {
            popup.style.display = 'none';
        }, 300);
    }

    addExportButton() {
        // Add export button to footer or admin panel
        const footer = document.querySelector('footer');
        if (!footer || this.subscribers.length === 0) return;

        const exportBtn = document.createElement('button');
        exportBtn.className = 'export-subscribers-btn';
        exportBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Export Subscribers (${this.subscribers.length})
        `;
        exportBtn.style.display = 'none'; // Hidden by default, shown on admin key
        
        footer.appendChild(exportBtn);

        exportBtn.addEventListener('click', () => {
            this.exportSubscribers();
        });

        // Show export button on special key combination (Ctrl+Shift+E)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'E') {
                e.preventDefault();
                exportBtn.style.display = exportBtn.style.display === 'none' ? 'inline-flex' : 'none';
            }
        });
    }

    exportSubscribers() {
        // Export as CSV
        const csv = this.generateCSV();
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        
        URL.revokeObjectURL(url);

        this.showToast('Subscribers exported successfully! 📊');
    }

    generateCSV() {
        const headers = ['Email', 'Subscribed Date', 'Source'];
        const rows = this.subscribers.map(sub => [
            sub.email,
            new Date(sub.subscribedAt).toLocaleDateString(),
            sub.source
        ]);

        return [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'newsletter-toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 50);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    loadFromLocalStorage() {
        // Initialize subscriber count displays
        this.updateSubscriberCount();
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.newsletterSystem = new NewsletterSystem();
    });
} else {
    window.newsletterSystem = new NewsletterSystem();
}
