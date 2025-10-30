/**
 * SEO & Performance Optimization System
 * Meta tags, Open Graph, Twitter Cards, Schema.org, lazy loading, and more
 */

class SEOOptimizer {
    constructor() {
        this.siteConfig = {
            siteName: 'Kendrick Pierre',
            siteUrl: window.location.origin,
            description: 'Software Engineer & Tech Blogger - Sharing insights on web development, programming, and technology.',
            author: 'Kendrick Pierre',
            twitter: '@kpierre24',
            image: '/images/og-image.jpg',
            type: 'website'
        };
        this.init();
    }

    init() {
        this.addMetaTags();
        this.addOpenGraphTags();
        this.addTwitterCardTags();
        this.addSchemaOrgMarkup();
        this.initLazyLoading();
        this.generateSitemap();
        this.addRobotsTxt();
        this.optimizeImages();
        this.addPerformanceMonitoring();
    }

    addMetaTags() {
        const meta = {
            'description': this.getPageDescription(),
            'keywords': this.getPageKeywords(),
            'author': this.siteConfig.author,
            'robots': 'index, follow',
            'googlebot': 'index, follow',
            'viewport': 'width=device-width, initial-scale=1.0',
            'theme-color': '#6366f1',
            'color-scheme': 'dark light'
        };

        Object.entries(meta).forEach(([name, content]) => {
            this.addOrUpdateMeta('name', name, content);
        });

        // Canonical URL
        this.addCanonicalLink();
    }

    addOrUpdateMeta(attribute, key, value) {
        let element = document.querySelector(`meta[${attribute}="${key}"]`);
        
        if (!element) {
            element = document.createElement('meta');
            element.setAttribute(attribute, key);
            document.head.appendChild(element);
        }
        
        element.setAttribute('content', value);
    }

    addCanonicalLink() {
        let canonical = document.querySelector('link[rel="canonical"]');
        
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }
        
        canonical.href = window.location.href.split('?')[0].split('#')[0];
    }

    addOpenGraphTags() {
        const og = {
            'og:site_name': this.siteConfig.siteName,
            'og:title': this.getPageTitle(),
            'og:description': this.getPageDescription(),
            'og:type': this.getPageType(),
            'og:url': window.location.href,
            'og:image': this.getPageImage(),
            'og:image:width': '1200',
            'og:image:height': '630',
            'og:locale': 'en_US'
        };

        Object.entries(og).forEach(([property, content]) => {
            this.addOrUpdateMeta('property', property, content);
        });
    }

    addTwitterCardTags() {
        const twitter = {
            'twitter:card': 'summary_large_image',
            'twitter:site': this.siteConfig.twitter,
            'twitter:creator': this.siteConfig.twitter,
            'twitter:title': this.getPageTitle(),
            'twitter:description': this.getPageDescription(),
            'twitter:image': this.getPageImage()
        };

        Object.entries(twitter).forEach(([name, content]) => {
            this.addOrUpdateMeta('name', name, content);
        });
    }

    addSchemaOrgMarkup() {
        const schemas = [];

        // Website schema
        schemas.push({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            'name': this.siteConfig.siteName,
            'url': this.siteConfig.siteUrl,
            'description': this.siteConfig.description,
            'author': {
                '@type': 'Person',
                'name': this.siteConfig.author
            }
        });

        // Person schema (for about page)
        if (this.isAboutPage()) {
            schemas.push({
                '@context': 'https://schema.org',
                '@type': 'Person',
                'name': this.siteConfig.author,
                'url': this.siteConfig.siteUrl,
                'sameAs': this.getSocialLinks()
            });
        }

        // Blog post schema
        if (this.isBlogPost()) {
            schemas.push(this.getBlogPostSchema());
        }

        // BreadcrumbList schema
        schemas.push(this.getBreadcrumbSchema());

        // Add all schemas to page
        schemas.forEach(schema => {
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.textContent = JSON.stringify(schema);
            document.head.appendChild(script);
        });
    }

    getBlogPostSchema() {
        const article = document.querySelector('article, .blog-article-content, .embedded-reader-content');
        if (!article) return null;

        const title = document.querySelector('h1')?.textContent || document.title;
        const datePublished = article.querySelector('time')?.getAttribute('datetime') || new Date().toISOString();
        const image = article.querySelector('img')?.src || this.getPageImage();

        return {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            'headline': title,
            'image': image,
            'datePublished': datePublished,
            'dateModified': datePublished,
            'author': {
                '@type': 'Person',
                'name': this.siteConfig.author
            },
            'publisher': {
                '@type': 'Organization',
                'name': this.siteConfig.siteName,
                'logo': {
                    '@type': 'ImageObject',
                    'url': `${this.siteConfig.siteUrl}/images/logo.png`
                }
            },
            'description': this.getPageDescription()
        };
    }

    getBreadcrumbSchema() {
        const path = window.location.pathname;
        const parts = path.split('/').filter(p => p);
        
        const items = [
            {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Home',
                'item': this.siteConfig.siteUrl
            }
        ];

        parts.forEach((part, index) => {
            items.push({
                '@type': 'ListItem',
                'position': index + 2,
                'name': this.capitalize(part.replace(/-/g, ' ')),
                'item': `${this.siteConfig.siteUrl}/${parts.slice(0, index + 1).join('/')}`
            });
        });

        return {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            'itemListElement': items
        };
    }

    initLazyLoading() {
        // Use native lazy loading where supported
        const images = document.querySelectorAll('img:not([loading])');
        images.forEach(img => {
            img.loading = 'lazy';
        });

        // Intersection Observer for additional control
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        observer.unobserve(img);
                    }
                });
            });

            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }

    optimizeImages() {
        // Add responsive image attributes
        const images = document.querySelectorAll('img:not([srcset])');
        images.forEach(img => {
            if (img.naturalWidth > 768) {
                // Add width and height to prevent layout shift
                if (!img.hasAttribute('width') && img.naturalWidth) {
                    img.width = img.naturalWidth;
                }
                if (!img.hasAttribute('height') && img.naturalHeight) {
                    img.height = img.naturalHeight;
                }
            }
        });
    }

    generateSitemap() {
        // Generate sitemap data (would be exported to XML)
        const pages = this.getAllPages();
        const sitemap = {
            pages: pages,
            generated: new Date().toISOString()
        };

        // Store in sessionStorage for admin export
        sessionStorage.setItem('sitemap-data', JSON.stringify(sitemap));
    }

    getAllPages() {
        const pages = [
            { url: '/', priority: 1.0, changefreq: 'daily' },
            { url: '/pages/blog.html', priority: 0.9, changefreq: 'daily' },
            { url: '/pages/projects.html', priority: 0.8, changefreq: 'weekly' },
            { url: '/about.html', priority: 0.7, changefreq: 'monthly' },
            { url: '/contact.html', priority: 0.6, changefreq: 'monthly' }
        ];

        return pages;
    }

    addRobotsTxt() {
        // Generate robots.txt content
        const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /private/

Sitemap: ${this.siteConfig.siteUrl}/sitemap.xml`;

        sessionStorage.setItem('robots-txt', robots);
    }

    addPerformanceMonitoring() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    const paintData = performance.getEntriesByType('paint');

                    const metrics = {
                        'First Contentful Paint': this.findPaintMetric(paintData, 'first-contentful-paint'),
                        'DOM Content Loaded': perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                        'Load Complete': perfData.loadEventEnd - perfData.loadEventStart,
                        'Total Load Time': perfData.loadEventEnd - perfData.fetchStart
                    };

                    console.group('⚡ Performance Metrics');
                    Object.entries(metrics).forEach(([name, value]) => {
                        if (value) {
                            console.log(`${name}: ${Math.round(value)}ms`);
                        }
                    });
                    console.groupEnd();

                    // Store metrics
                    this.storeMetrics(metrics);
                }, 0);
            });
        }
    }

    findPaintMetric(paintData, name) {
        const metric = paintData.find(p => p.name === name);
        return metric ? metric.startTime : null;
    }

    storeMetrics(metrics) {
        const stored = JSON.parse(localStorage.getItem('performance-metrics') || '[]');
        stored.push({
            url: window.location.pathname,
            timestamp: new Date().toISOString(),
            ...metrics
        });

        // Keep only last 50 measurements
        if (stored.length > 50) {
            stored.shift();
        }

        localStorage.setItem('performance-metrics', JSON.stringify(stored));
    }

    // Helper methods
    getPageTitle() {
        return document.title || this.siteConfig.siteName;
    }

    getPageDescription() {
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) return metaDesc.content;

        const firstP = document.querySelector('article p, main p');
        if (firstP) {
            return firstP.textContent.slice(0, 160) + '...';
        }

        return this.siteConfig.description;
    }

    getPageKeywords() {
        const path = window.location.pathname;
        const keywords = ['Kendrick Pierre', 'Software Engineer', 'Web Development', 'Programming'];

        if (path.includes('blog')) {
            keywords.push('Blog', 'Tech Articles', 'Tutorials');
        } else if (path.includes('project')) {
            keywords.push('Projects', 'Portfolio', 'Code');
        }

        return keywords.join(', ');
    }

    getPageType() {
        if (this.isBlogPost()) return 'article';
        return 'website';
    }

    getPageImage() {
        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) return ogImage.content;

        const firstImg = document.querySelector('article img, main img');
        if (firstImg) return firstImg.src;

        return `${this.siteConfig.siteUrl}${this.siteConfig.image}`;
    }

    isBlogPost() {
        return window.location.pathname.includes('blog') && 
               document.querySelector('article, .blog-article-content');
    }

    isAboutPage() {
        return window.location.pathname.includes('about');
    }

    getSocialLinks() {
        const links = [];
        const socialLinksContainer = document.querySelectorAll('a[href*="github"], a[href*="twitter"], a[href*="linkedin"]');
        
        socialLinksContainer.forEach(link => {
            links.push(link.href);
        });

        return links;
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.seoOptimizer = new SEOOptimizer();
    });
} else {
    window.seoOptimizer = new SEOOptimizer();
}
