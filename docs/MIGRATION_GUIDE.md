# 🔄 File Path Migration Guide

## Overview
After reorganization, all file paths need to be updated. This guide shows exactly what to change.

---

## 📍 New File Locations

### HTML Pages
| Old Path | New Path |
|----------|----------|
| `about.html` | `pages/about.html` |
| `blog.html` | `pages/blog.html` |
| `contact.html` | `pages/contact.html` |
| `projects.html` | `pages/projects.html` |
| `privacy.html` | `pages/privacy.html` |
| `timeline.html` | `pages/timeline.html` |
| `offline.html` | `pages/offline.html` |
| `toast-test.html` | `pages/toast-test.html` |

### JavaScript
| Old Path | New Path |
|----------|----------|
| `main.js` | `js/main.js` (needs splitting) |
| `cookie-consent.js` | `js/plugins/cookie-consent.js` |
| `analytics.js` | `js/plugins/analytics.js` |
| `accessibility.js` | `js/utils/accessibility.js` |
| `security.js` | `js/utils/security.js` |
| `timeline.js` | `js/features/timeline.js` |

### CSS
| Old Path | New Path |
|----------|----------|
| `styles.css` | `css/main.css` (needs splitting) |

### Config
| Old Path | New Path |
|----------|----------|
| `manifest.json` | `config/manifest.json` |
| `service-worker.js` | `config/service-worker.js` |
| `sw.js` | `config/sw.js` |

### Documentation
| Old Path | New Path |
|----------|----------|
| `QUICK_WINS_SUMMARY.md` | `docs/QUICK_WINS_SUMMARY.md` |
| `SECURITY_AND_DESIGN_ENHANCEMENTS.md` | `docs/SECURITY_AND_DESIGN_ENHANCEMENTS.md` |

---

## 🔧 Required Updates

### 1. index.html
Update all links to pages:

```html
<!-- OLD -->
<a href="about.html">About</a>
<a href="projects.html">Projects</a>
<a href="blog.html">Blog</a>
<a href="contact.html">Contact</a>

<!-- NEW -->
<a href="pages/about.html">About</a>
<a href="pages/projects.html">Projects</a>
<a href="pages/blog.html">Blog</a>
<a href="pages/contact.html">Contact</a>
```

Update stylesheet link:
```html
<!-- OLD -->
<link rel="stylesheet" href="styles.css">

<!-- NEW -->
<link rel="stylesheet" href="css/main.css">
```

Update JavaScript:
```html
<!-- OLD -->
<script src="main.js"></script>

<!-- NEW -->
<script src="js/main.js"></script>
```

Update manifest:
```html
<!-- OLD -->
<link rel="manifest" href="manifest.json">

<!-- NEW -->
<link rel="manifest" href="config/manifest.json">
```

### 2. All Pages (about.html, projects.html, etc.)
Since pages moved to `pages/` folder, update relative paths:

```html
<!-- OLD -->
<link rel="stylesheet" href="styles.css">
<script src="main.js"></script>
<a href="index.html">Home</a>
<a href="about.html">About</a>

<!-- NEW -->
<link rel="stylesheet" href="../css/main.css">
<script src="../js/main.js"></script>
<a href="../index.html">Home</a>
<a href="about.html">About</a>  <!-- Same folder -->
```

### 3. Service Worker (config/service-worker.js)
Update cached file paths:

```javascript
// OLD
const urlsToCache = [
  '/',
  '/index.html',
  '/about.html',
  '/styles.css',
  '/main.js',
  '/manifest.json'
];

// NEW
const urlsToCache = [
  '/',
  '/index.html',
  '/pages/about.html',
  '/pages/projects.html',
  '/pages/blog.html',
  '/pages/contact.html',
  '/css/main.css',
  '/js/main.js',
  '/config/manifest.json'
];
```

### 4. Manifest (config/manifest.json)
Update start URL and offline page:

```json
{
  "start_url": "/index.html",
  "offline_url": "/pages/offline.html"
}
```

---

## 📝 Step-by-Step Migration

### Step 1: Update index.html ✅
```bash
# Update navigation links
# Update stylesheet link
# Update script links
# Update manifest link
```

### Step 2: Update all pages/*.html files ✅
```bash
# Update relative paths (add ../)
# Update navigation links
# Update asset links
```

### Step 3: Update service worker ✅
```bash
# Update cache list
# Update offline page path
```

### Step 4: Update manifest.json ✅
```bash
# Update start_url
# Update offline_url
```

### Step 5: Test Everything ✅
```bash
# Test navigation
# Test PWA install
# Test offline mode
# Test all links
```

---

## 🧪 Testing Checklist

After migration, test:

- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] Styles load properly
- [ ] JavaScript functions work
- [ ] PWA installs successfully
- [ ] Offline mode works
- [ ] Service worker updates cache
- [ ] Cookie consent works
- [ ] Analytics tracking works
- [ ] Contact form submits
- [ ] Toast notifications show
- [ ] Custom cursor appears
- [ ] Dark mode toggles
- [ ] All animations play

---

## ⚠️ Common Issues

### Issue 1: 404 Errors
**Problem:** Files not found
**Solution:** Double-check file paths, add `../` for pages

### Issue 2: Styles Not Loading
**Problem:** CSS not applied
**Solution:** Verify `css/main.css` path in all HTML files

### Issue 3: Service Worker Fails
**Problem:** PWA doesn't work
**Solution:** Update cache list with new paths

### Issue 4: Relative Path Confusion
**Problem:** Links broken in subpages
**Solution:** Use `../` to go up one directory from pages/

---

## 🎯 Quick Reference

### From Root (index.html)
```html
<link href="css/main.css">
<script src="js/main.js"></script>
<a href="pages/about.html">
```

### From pages/ folder
```html
<link href="../css/main.css">
<script src="../js/main.js"></script>
<a href="../index.html">
<a href="about.html">  <!-- Same folder -->
```

### From any subfolder
```
Go up: ../
Go to root: /
Current folder: ./
```

---

## 📦 Automated Migration Script

```powershell
# PowerShell script to update all file references
# Run from website root directory

# Update index.html
(Get-Content index.html) `
  -replace 'href="about.html"', 'href="pages/about.html"' `
  -replace 'href="projects.html"', 'href="pages/projects.html"' `
  -replace 'href="blog.html"', 'href="pages/blog.html"' `
  -replace 'href="contact.html"', 'href="pages/contact.html"' `
  -replace 'href="privacy.html"', 'href="pages/privacy.html"' `
  -replace 'href="styles.css"', 'href="css/main.css"' `
  -replace 'src="main.js"', 'src="js/main.js"' `
  -replace 'href="manifest.json"', 'href="config/manifest.json"' |
  Set-Content index.html

# Update pages
Get-ChildItem pages/*.html | ForEach-Object {
  (Get-Content $_.FullName) `
    -replace 'href="styles.css"', 'href="../css/main.css"' `
    -replace 'src="main.js"', 'src="../js/main.js"' `
    -replace 'href="index.html"', 'href="../index.html"' `
    -replace 'href="about.html"', 'href="about.html"' |
    Set-Content $_.FullName
}

Write-Host "✅ Migration complete!" -ForegroundColor Green
```

---

**Next Steps:**
1. Review this guide
2. Run migration script or update manually
3. Test all pages
4. Verify PWA functionality
5. Deploy! 🚀
