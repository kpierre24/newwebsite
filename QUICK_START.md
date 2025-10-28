# 🚀 Quick Start Guide - Reorganized Portfolio

## File Structure at a Glance

```
website/
├── index.html              ← Main entry point (ROOT)
├── README.md               ← Project documentation
│
├── assets/                 ← Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── css/                    ← Stylesheets
│   ├── main.css           ← IMPORTS ALL MODULES
│   ├── legacy-styles.css  ← Original monolithic file (backup)
│   ├── base/              ← Foundation (variables, reset, typography)
│   ├── layout/            ← Structure (header, nav, footer, container)
│   ├── components/        ← Reusable UI (buttons, cards, forms, modals)
│   ├── features/          ← Page-specific (timeline, blog, projects)
│   ├── utilities/         ← Helpers (dark-mode, responsive)
│   └── pages/             ← Page-specific styles
│
├── js/                     ← JavaScript
│   ├── main.js            ← IMPORTS ALL MODULES
│   ├── legacy-main.js     ← Original monolithic file (backup)
│   ├── core/              ← Initialization & config
│   ├── features/          ← Functionality (nav, forms, animations)
│   ├── plugins/           ← Third-party integrations (analytics, PWA)
│   └── utils/             ← Utilities (helpers, validators, security)
│
├── pages/                  ← All HTML pages (except index.html)
│   ├── about.html
│   ├── projects.html
│   ├── blog.html
│   ├── contact.html
│   ├── timeline.html
│   ├── privacy.html
│   ├── offline.html
│   └── toast-test.html
│
├── config/                 ← Configuration files
│   ├── manifest.json      ← PWA manifest
│   ├── service-worker.js  ← PWA service worker
│   ├── sw.js              ← Additional SW
│   └── .htaccess          ← Server config
│
└── docs/                   ← Documentation
    ├── QUICK_WINS_SUMMARY.md
    ├── SECURITY_AND_DESIGN_ENHANCEMENTS.md
    ├── REORGANIZATION_PLAN.md
    ├── MIGRATION_GUIDE.md
    └── REORGANIZATION_COMPLETE.md
```

---

## 📋 Key Changes

### CSS
**Before:** `<link rel="stylesheet" href="styles.css">`  
**After:** `<link rel="stylesheet" href="css/main.css">`

### JavaScript
**Before:** `<script src="main.js"></script>`  
**After:** `<script src="js/main.js"></script>`

### Manifest
**Before:** `<link rel="manifest" href="manifest.json">`  
**After:** `<link rel="manifest" href="config/manifest.json">`

### Page Links (from index.html)
**Before:** `<a href="about.html">About</a>`  
**After:** `<a href="pages/about.html">About</a>`

### Page Links (from pages/*.html)
**Before:** `<a href="index.html">Home</a>`  
**After:** `<a href="../index.html">Home</a>`

---

## 🛠️ Adding New Features

### Adding a New CSS Component
1. Create file: `css/components/my-component.css`
2. Add import to `css/main.css`:
   ```css
   @import './components/my-component.css';
   ```

### Adding a New JS Feature
1. Create file: `js/features/my-feature.js`
2. Add import to `js/main.js`:
   ```javascript
   import './features/my-feature.js';
   ```

### Adding a New Page
1. Create file: `pages/new-page.html`
2. Use template from existing pages
3. Remember to use `../` for paths:
   ```html
   <link rel="stylesheet" href="../css/main.css">
   <script src="../js/main.js"></script>
   <a href="../index.html">Home</a>
   ```

---

## ⚠️ Important Notes

### Legacy Files
The site currently uses a **hybrid approach**:
- `css/main.css` imports `legacy-styles.css` (original 179KB file)
- `js/main.js` imports `legacy-main.js` (original 126KB file)

**Why?** This ensures nothing breaks during the transition period.

**Next Steps:** Gradually extract code from legacy files into appropriate modules.

### Path Rules
- **From root (index.html):** `pages/`, `css/`, `js/`, `config/`
- **From pages/*.html:** `../css/`, `../js/`, `../index.html`, `about.html` (same folder)

---

## 🧪 Testing Checklist

After making changes, verify:

- [ ] Homepage loads (open `index.html`)
- [ ] All navigation links work
- [ ] CSS styles display correctly
- [ ] JavaScript features function
- [ ] Dark mode toggle works
- [ ] Mobile navigation works
- [ ] Contact form works
- [ ] PWA installs correctly
- [ ] No console errors
- [ ] Service worker registers

---

## 🔍 Finding Code

**Looking for...**

- **CSS Variables?** → `css/base/variables.css`
- **Button styles?** → `css/components/buttons.css`
- **Navigation code?** → `js/features/navigation.js`
- **Form validation?** → `js/features/forms.js`
- **Dark mode logic?** → `js/features/dark-mode.js`
- **Analytics setup?** → `js/plugins/analytics.js`
- **Header styles?** → `css/layout/header.css`
- **Animations?** → `css/features/animations.css` or `js/features/animations.js`

---

## 📚 Documentation

- **Full reorganization details:** `docs/REORGANIZATION_COMPLETE.md`
- **Migration guide:** `docs/MIGRATION_GUIDE.md`
- **Project overview:** `README.md`
- **Previous enhancements:** `docs/QUICK_WINS_SUMMARY.md`

---

## 🚨 Troubleshooting

### Styles not loading?
- Check browser console for 404 errors
- Verify path: `css/main.css` from root, `../css/main.css` from pages

### JavaScript not working?
- Check browser console for errors
- Verify path: `js/main.js` from root, `../js/main.js` from pages

### Links broken?
- From root: Use `pages/page-name.html`
- From pages: Use `page-name.html` (same folder) or `../index.html` (to home)

### PWA not working?
- Clear browser cache
- Check `config/service-worker.js` paths
- Verify `config/manifest.json` is accessible

---

## 🎯 Quick Commands

```bash
# View root directory
ls

# View CSS modules
ls css -Recurse

# View JS modules
ls js -Recurse

# Count total files
ls -Recurse -File | Measure-Object

# Open in browser (from PowerShell)
start index.html
```

---

**Last Updated:** October 28, 2025  
**Status:** ✅ Reorganization Complete  
**Mode:** Hybrid (Legacy + Modular)
