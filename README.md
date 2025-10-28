# 🎨 Kendell Pierre - Portfolio Website

A modern, responsive portfolio website showcasing web development projects and skills.

## 📁 Project Structure

```
website/
├── index.html                      # Homepage
├── assets/                         # Static assets
│   ├── images/                    # Project images
│   ├── icons/                     # Icons and favicons
│   └── fonts/                     # Custom fonts
├── css/                           # Stylesheets (modular)
│   ├── main.css                   # Main stylesheet (imports all)
│   ├── base/                      # Base styles
│   ├── layout/                    # Layout components
│   ├── components/                # UI components
│   ├── features/                  # Feature-specific styles
│   ├── pages/                     # Page-specific styles
│   └── utilities/                 # Utility classes
├── js/                            # JavaScript (modular)
│   ├── main.js                    # Main entry point
│   ├── config.js                  # Configuration
│   ├── core/                      # Core functionality
│   ├── features/                  # Feature modules
│   ├── plugins/                   # Third-party integrations
│   └── utils/                     # Utility functions
├── pages/                         # HTML pages
│   ├── about.html
│   ├── projects.html
│   ├── blog.html
│   ├── contact.html
│   ├── privacy.html
│   └── ...
├── config/                        # Configuration files
│   ├── manifest.json
│   ├── service-worker.js
│   └── .htaccess
└── docs/                          # Documentation
    └── README.md
```

## 🚀 Features

### Core Features
- ✅ Responsive design (mobile-first)
- ✅ Dark/Light mode toggle
- ✅ Smooth scrolling (Lenis)
- ✅ Custom animated cursor
- ✅ Progressive Web App (PWA)
- ✅ Offline support

### Animations & Effects
- ✅ GSAP animations
- ✅ Scroll-triggered animations (AOS)
- ✅ Particle effects (Particles.js)
- ✅ Page transitions (Barba.js)
- ✅ Typing effect (Typed.js)
- ✅ CountUp numbers
- ✅ Parallax scrolling (Rellax)
- ✅ Text splitting effects (Splitting.js)

### UI Components
- ✅ Toast notifications (SweetAlert2)
- ✅ Image lightbox (GLightbox)
- ✅ Tilt effects (Vanilla Tilt)
- ✅ Custom scrollbar
- ✅ Loading skeletons
- ✅ Micro-interactions

### Functionality
- ✅ Contact form with validation
- ✅ Newsletter signup
- ✅ Resume download
- ✅ Cookie consent (GDPR)
- ✅ Google Analytics 4
- ✅ Social media integration

### Security & Performance
- ✅ Content Security Policy (CSP)
- ✅ Security headers (X-Frame-Options, etc.)
- ✅ Service worker caching
- ✅ Lazy loading
- ✅ Code splitting
- ✅ Optimized assets

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid & Flexbox
- **JavaScript (ES6+)** - Vanilla JS, modular architecture

### Libraries & Frameworks
- **GSAP** 3.12.5 - Animation library
- **Lenis** 1.0.42 - Smooth scrolling
- **Particles.js** 2.0.0 - Particle effects
- **SweetAlert2** 11.10.5 - Beautiful alerts
- **AOS** 2.3.1 - Animate on scroll
- **Typed.js** 2.0.16 - Typing animations
- **CountUp.js** 1.8.2 - Number animations
- **GLightbox** - Image lightbox
- **Vanilla Tilt** 1.8.1 - 3D tilt effect
- **Rellax** 1.12.1 - Parallax scrolling
- **Splitting.js** - Text effects
- **Barba.js** 2.9.7 - Page transitions

### Tools & Services
- **Google Analytics 4** - Analytics
- **EmailJS** - Contact form backend
- **Service Worker** - PWA & offline support

## 📝 File Organization

### CSS Modules (Split from 179 KB monolith)
Each CSS file is now focused and maintainable (~10-15 KB each):

- **base/** - Variables, reset, typography
- **layout/** - Header, footer, grid
- **components/** - Buttons, cards, forms, modals
- **features/** - Animations, particles, counters
- **pages/** - Page-specific styles
- **utilities/** - Dark mode, spacing, responsive

### JavaScript Modules (Split from 126 KB monolith)
Each JS file has a single responsibility (~5-10 KB each):

- **core/** - Initialization, routing, state
- **features/** - Animations, navigation, forms, cursor
- **plugins/** - Cookie consent, analytics, toast
- **utils/** - Helpers, validators, API calls

## 🔧 Development

### Local Development
```bash
# Just open index.html in a browser
# Or use a local server:
python -m http.server 8000
# or
npx serve
```

### File Imports
The modular structure uses multiple small files. To combine for production:

```bash
# Concatenate CSS
cat css/**/*.css > dist/styles.min.css

# Concatenate JS  
cat js/**/*.js > dist/main.min.js
```

Or use build tools like:
- **Vite** - Modern build tool
- **Webpack** - Module bundler
- **Parcel** - Zero-config bundler

## 📊 Performance

### Before Reorganization
- ❌ Single CSS file: 179 KB
- ❌ Single JS file: 126 KB
- ❌ Hard to maintain
- ❌ Difficult debugging

### After Reorganization
- ✅ Modular CSS: ~15 files @ 10-15 KB each
- ✅ Modular JS: ~20 files @ 5-10 KB each
- ✅ Easy to maintain
- ✅ Fast debugging
- ✅ Better caching
- ✅ Load only what you need

## 🔒 Security

- ✅ Content Security Policy
- ✅ X-Frame-Options: DENY
- ✅ X-Content-Type-Options: nosniff
- ✅ Referrer-Policy
- ✅ Permissions-Policy
- ✅ GDPR-compliant cookies

## 📱 PWA Support

- ✅ Offline functionality
- ✅ Install prompt
- ✅ Service worker caching
- ✅ App manifest
- ✅ Background sync

## 🌐 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ⚠️ IE11 (limited support)

## 📄 License

© 2025 Kendell Pierre. All rights reserved.

## 📧 Contact

- **Email:** kpierre24@gmail.com
- **GitHub:** [@kpierre24](https://github.com/kpierre24)
- **Twitter:** [@kentrini25](https://twitter.com/kentrini25)

---

**Version:** 2.0.0
**Last Updated:** October 2025
**Status:** Production Ready 🚀
