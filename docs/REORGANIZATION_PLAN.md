# Website Reorganization Plan

## Current Issues
- ✗ `main.js` is 126 KB (too large, hard to maintain)
- ✗ `styles.css` is 179 KB (massive, needs splitting)
- ✗ All files in root directory (messy)
- ✗ No clear separation of concerns
- ✗ Difficult to find and edit specific features

## New Professional Structure

```
website/
├── index.html                  # Homepage (stays in root for hosting)
│
├── assets/                     # All static assets
│   ├── images/                # Project images, photos
│   ├── icons/                 # SVG icons, favicons
│   └── fonts/                 # Custom fonts (if any)
│
├── css/                       # Modular CSS
│   ├── main.css              # Import all CSS modules
│   ├── base/
│   │   ├── variables.css     # CSS custom properties
│   │   ├── reset.css         # CSS reset/normalize
│   │   └── typography.css    # Font styles
│   ├── layout/
│   │   ├── header.css        # Navigation bar
│   │   ├── footer.css        # Footer styles
│   │   ├── grid.css          # Layout grid system
│   │   └── sections.css      # Page sections
│   ├── components/
│   │   ├── buttons.css       # Button styles
│   │   ├── cards.css         # Card components
│   │   ├── forms.css         # Form elements
│   │   ├── modals.css        # Modal dialogs
│   │   ├── navigation.css    # Nav specific
│   │   ├── scrollbar.css     # Custom scrollbar
│   │   └── cursor.css        # Custom cursor
│   ├── features/
│   │   ├── animations.css    # All animations
│   │   ├── particles.css     # Particle effects
│   │   ├── counters.css      # Counter styles
│   │   └── toasts.css        # Toast notifications
│   ├── pages/
│   │   ├── home.css          # Homepage specific
│   │   ├── about.css         # About page
│   │   ├── projects.css      # Projects page
│   │   ├── blog.css          # Blog page
│   │   └── contact.css       # Contact page
│   └── utilities/
│       ├── dark-mode.css     # Dark theme
│       ├── spacing.css       # Margins, padding
│       ├── responsive.css    # Media queries
│       └── accessibility.css # A11y styles
│
├── js/                        # Modular JavaScript
│   ├── main.js               # Import all modules
│   ├── config.js             # Configuration
│   ├── core/
│   │   ├── init.js           # Initialization
│   │   ├── router.js         # Page routing
│   │   └── state.js          # State management
│   ├── features/
│   │   ├── animations.js     # GSAP, AOS animations
│   │   ├── navigation.js     # Nav toggle, scroll
│   │   ├── forms.js          # Form validation
│   │   ├── counter.js        # CountUp.js
│   │   ├── cursor.js         # Custom cursor
│   │   ├── particles.js      # Particle effects
│   │   ├── smooth-scroll.js  # Lenis scrolling
│   │   ├── typed.js          # Typed.js
│   │   └── dark-mode.js      # Theme switcher
│   ├── plugins/
│   │   ├── cookie-consent.js # Cookie banner
│   │   ├── analytics.js      # Google Analytics
│   │   ├── toast.js          # Toast notifications
│   │   └── pwa.js            # Service worker
│   └── utils/
│       ├── helpers.js        # Utility functions
│       ├── api.js            # API calls
│       └── validators.js     # Form validation
│
├── pages/                     # All HTML pages (except index)
│   ├── about.html
│   ├── projects.html
│   ├── blog.html
│   ├── contact.html
│   ├── privacy.html
│   ├── timeline.html
│   └── offline.html
│
├── config/                    # Configuration files
│   ├── manifest.json         # PWA manifest
│   ├── service-worker.js     # Service worker
│   └── .htaccess             # Server config
│
└── docs/                      # Documentation
    ├── README.md
    ├── QUICK_WINS_SUMMARY.md
    └── SECURITY_AND_DESIGN_ENHANCEMENTS.md
```

## Benefits

### ✅ Maintainability
- Easy to find specific styles or scripts
- Changes don't affect entire codebase
- Clear separation of concerns

### ✅ Performance
- Load only what you need per page
- Better browser caching
- Faster development builds

### ✅ Scalability
- Easy to add new features
- Team collaboration friendly
- Version control friendly

### ✅ Developer Experience
- Intuitive file organization
- Faster debugging
- Better code editor support

## Migration Steps

1. **Create folder structure** ✅
2. **Split CSS** (179 KB → ~15 files @ 10-15 KB each)
3. **Split JavaScript** (126 KB → ~20 files @ 5-10 KB each)
4. **Move HTML pages** (except index.html)
5. **Move config files**
6. **Move documentation**
7. **Update all file paths**
8. **Test thoroughly**
9. **Update service worker cache list**
10. **Update .htaccess if needed**

## File Size Targets

| File Type | Before | After |
|-----------|--------|-------|
| Single CSS | 179 KB | 15 files @ ~12 KB |
| Single JS | 126 KB | 20 files @ ~6 KB |
| Organization | Flat | Modular |

## Implementation Priority

1. **High Priority** - Split CSS and JS (biggest impact)
2. **Medium Priority** - Move pages and configs
3. **Low Priority** - Move assets, update docs

---

**Estimated Time:** 30-45 minutes
**Risk Level:** Low (just reorganization, no code changes)
**Testing Required:** All pages, all features
