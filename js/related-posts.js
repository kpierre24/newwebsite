/**
 * Related Posts Recommendation Engine
 * Intelligent content recommendations based on tags, categories, and similarity
 * Keeps users engaged by suggesting relevant articles
 */

class RelatedPostsEngine {
    constructor() {
        this.currentPost = null;
        this.allPosts = [];
        this.maxRecommendations = 4;
        this.init();
    }

    async init() {
        try {
            await this.loadAllPosts();
            this.identifyCurrentPost();
            
            if (this.currentPost) {
                this.displayRelatedPosts();
            }
        } catch (error) {
            console.error('Failed to initialize related posts:', error);
        }
    }

    async loadAllPosts() {
        // Try to load from blog feed
        const feedElement = document.querySelector('.blog-feed');
        if (feedElement) {
            const articles = feedElement.querySelectorAll('.blog-card');
            this.allPosts = Array.from(articles).map(article => this.extractPostData(article));
        }

        // Also check for embedded articles
        const embeddedArticles = document.querySelectorAll('[data-post-id], .blog-article-content, .embedded-reader-content');
        embeddedArticles.forEach(article => {
            const postData = this.extractPostData(article);
            if (postData && !this.allPosts.find(p => p.id === postData.id)) {
                this.allPosts.push(postData);
            }
        });
    }

    extractPostData(element) {
        const titleEl = element.querySelector('h1, h2, h3, .blog-card-title, .article-title');
        const excerptEl = element.querySelector('p, .blog-card-excerpt, .excerpt');
        const tagsEl = element.querySelectorAll('.blog-tag, .tag, [data-tag]');
        const categoryEl = element.querySelector('.category, [data-category]');
        const linkEl = element.querySelector('a[href*="blog"], a[href*="article"]');
        const imageEl = element.querySelector('img');
        const dateEl = element.querySelector('time, .date, .blog-date');

        const title = titleEl?.textContent.trim() || '';
        if (!title) return null;

        return {
            id: this.generateId(title),
            title: title,
            excerpt: excerptEl?.textContent.trim() || '',
            tags: Array.from(tagsEl).map(tag => tag.textContent.trim().toLowerCase()),
            category: categoryEl?.textContent.trim().toLowerCase() || 'uncategorized',
            url: linkEl?.href || element.querySelector('a')?.href || '#',
            image: imageEl?.src || '',
            date: this.parseDate(dateEl?.textContent || dateEl?.getAttribute('datetime')),
            element: element
        };
    }

    generateId(title) {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    parseDate(dateString) {
        if (!dateString) return new Date();
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? new Date() : date;
    }

    identifyCurrentPost() {
        // Try to find current post from URL, title, or article element
        const currentUrl = window.location.href;
        const pageTitle = document.querySelector('h1')?.textContent.trim();

        // Check if we're on a blog article page
        const articleElement = document.querySelector('article, .blog-article-content, .embedded-reader-content, [data-post-id]');
        
        if (articleElement) {
            this.currentPost = this.extractPostData(articleElement);
        } else if (pageTitle) {
            // Try to match by title
            this.currentPost = this.allPosts.find(post => 
                post.title.toLowerCase() === pageTitle.toLowerCase()
            );
        }

        // If still not found, try URL matching
        if (!this.currentPost && currentUrl.includes('?')) {
            const urlParams = new URLSearchParams(window.location.search);
            const postId = urlParams.get('id') || urlParams.get('post');
            if (postId) {
                this.currentPost = this.allPosts.find(post => post.id === postId);
            }
        }
    }

    displayRelatedPosts() {
        const relatedPosts = this.getRelatedPosts();
        
        if (relatedPosts.length === 0) {
            console.log('No related posts found');
            return;
        }

        this.createRelatedPostsSection(relatedPosts);
    }

    getRelatedPosts() {
        if (!this.currentPost) return [];

        // Calculate similarity scores for all other posts
        const scoredPosts = this.allPosts
            .filter(post => post.id !== this.currentPost.id)
            .map(post => ({
                post,
                score: this.calculateSimilarity(this.currentPost, post)
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, this.maxRecommendations);

        return scoredPosts.map(item => item.post);
    }

    calculateSimilarity(post1, post2) {
        let score = 0;

        // Tag similarity (highest weight)
        const commonTags = post1.tags.filter(tag => post2.tags.includes(tag));
        score += commonTags.length * 10;

        // Category match
        if (post1.category === post2.category) {
            score += 5;
        }

        // Content similarity (basic word matching)
        const words1 = this.getWords(post1.title + ' ' + post1.excerpt);
        const words2 = this.getWords(post2.title + ' ' + post2.excerpt);
        const commonWords = words1.filter(word => words2.includes(word));
        score += commonWords.length * 0.5;

        // Recency bonus (newer posts get slight boost)
        const daysDiff = Math.abs(post1.date - post2.date) / (1000 * 60 * 60 * 24);
        if (daysDiff < 30) {
            score += 2;
        }

        return score;
    }

    getWords(text) {
        return text.toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 3); // Ignore short words
    }

    createRelatedPostsSection(posts) {
        // Find where to insert related posts
        const insertPoint = this.findInsertionPoint();
        if (!insertPoint) return;

        const section = document.createElement('section');
        section.className = 'related-posts-section';
        section.innerHTML = `
            <div class="related-posts-container">
                <div class="related-posts-header">
                    <h2 class="related-posts-title">
                        <svg class="related-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                        </svg>
                        You Might Also Like
                    </h2>
                    <p class="related-posts-subtitle">Recommended based on this article</p>
                </div>
                
                <div class="related-posts-grid">
                    ${posts.map(post => this.createPostCard(post)).join('')}
                </div>
            </div>
        `;

        insertPoint.parentNode.insertBefore(section, insertPoint.nextSibling);
        
        // Add click tracking
        this.addClickTracking(section);
        
        // Animate in
        this.animateSection(section);
    }

    findInsertionPoint() {
        // Try different locations in order of preference
        const selectors = [
            'article',
            '.blog-article-content',
            '.embedded-reader-content',
            '.comments-section',
            '.author-bio',
            'main'
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) return element;
        }

        return null;
    }

    createPostCard(post) {
        const tagsHTML = post.tags.slice(0, 3).map(tag => 
            `<span class="related-post-tag">${tag}</span>`
        ).join('');

        const imageHTML = post.image ? 
            `<div class="related-post-image" style="background-image: url('${post.image}')"></div>` :
            `<div class="related-post-image related-post-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                </svg>
            </div>`;

        return `
            <article class="related-post-card" data-post-id="${post.id}">
                <a href="${post.url}" class="related-post-link">
                    ${imageHTML}
                    <div class="related-post-content">
                        <h3 class="related-post-title">${post.title}</h3>
                        <p class="related-post-excerpt">${this.truncate(post.excerpt, 100)}</p>
                        <div class="related-post-tags">
                            ${tagsHTML}
                        </div>
                        <div class="related-post-footer">
                            <span class="related-post-date">${this.formatDate(post.date)}</span>
                            <span class="related-post-arrow">→</span>
                        </div>
                    </div>
                </a>
            </article>
        `;
    }

    truncate(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength).trim() + '...';
    }

    formatDate(date) {
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    }

    addClickTracking(section) {
        const cards = section.querySelectorAll('.related-post-card');
        cards.forEach((card, index) => {
            card.addEventListener('click', () => {
                // Track which related post was clicked
                const postId = card.dataset.postId;
                this.trackClick(postId, index);
                
                // Add to recently viewed
                this.addToRecentlyViewed(postId);
            });
        });
    }

    trackClick(postId, position) {
        // Store click data for analytics
        const clicks = JSON.parse(localStorage.getItem('related-posts-clicks') || '[]');
        clicks.push({
            fromPost: this.currentPost.id,
            toPost: postId,
            position: position,
            timestamp: new Date().toISOString()
        });

        // Keep only last 100 clicks
        if (clicks.length > 100) {
            clicks.shift();
        }

        localStorage.setItem('related-posts-clicks', JSON.stringify(clicks));
    }

    addToRecentlyViewed(postId) {
        const recent = JSON.parse(localStorage.getItem('recently-viewed-posts') || '[]');
        
        // Remove if already exists
        const filtered = recent.filter(id => id !== postId);
        
        // Add to front
        filtered.unshift(postId);
        
        // Keep only last 10
        const limited = filtered.slice(0, 10);
        
        localStorage.setItem('recently-viewed-posts', JSON.stringify(limited));
    }

    animateSection(section) {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, 100);

        // Stagger card animations
        const cards = section.querySelectorAll('.related-post-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 200 + (index * 100));
        });
    }

    // Public API
    static getAnalytics() {
        const clicks = JSON.parse(localStorage.getItem('related-posts-clicks') || '[]');
        const recentlyViewed = JSON.parse(localStorage.getItem('recently-viewed-posts') || '[]');
        
        return {
            totalClicks: clicks.length,
            clickThroughRate: clicks.length / (window.pageViews || 1),
            recentlyViewedCount: recentlyViewed.length,
            topPosts: this.getTopClickedPosts(clicks)
        };
    }

    static getTopClickedPosts(clicks) {
        const counts = {};
        clicks.forEach(click => {
            counts[click.toPost] = (counts[click.toPost] || 0) + 1;
        });

        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([postId, count]) => ({ postId, count }));
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.relatedPostsEngine = new RelatedPostsEngine();
    });
} else {
    window.relatedPostsEngine = new RelatedPostsEngine();
}

// Export analytics function
window.getRelatedPostsAnalytics = () => RelatedPostsEngine.getAnalytics();
