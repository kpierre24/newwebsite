/**
 * Blog Search & Filter System
 * Real-time search across blog posts with advanced filtering
 * Features: Fuzzy search, tag filtering, date sorting, instant results
 */

class BlogSearch {
    constructor() {
        this.posts = [];
        this.filteredPosts = [];
        this.searchIndex = null;
        this.currentFilters = {
            query: '',
            tags: new Set(),
            sortBy: 'date-desc'
        };
        this.init();
    }

    async init() {
        try {
            await this.loadPosts();
            this.createSearchInterface();
            this.buildSearchIndex();
            this.attachEventListeners();
            this.displayResults();
        } catch (error) {
            console.error('Failed to initialize blog search:', error);
        }
    }

    async loadPosts() {
        // Load from RSS feed data or blog posts
        const feedElement = document.querySelector('.blog-feed');
        if (!feedElement) return;

        const articles = feedElement.querySelectorAll('.blog-card');
        this.posts = Array.from(articles).map(article => {
            const titleEl = article.querySelector('h3, .blog-card-title');
            const excerptEl = article.querySelector('p, .blog-card-excerpt');
            const tagsEl = article.querySelectorAll('.blog-tag, .tag');
            const dateEl = article.querySelector('.blog-date, .date, time');
            const linkEl = article.querySelector('a');
            const imageEl = article.querySelector('img');

            return {
                id: this.generateId(titleEl?.textContent || ''),
                title: titleEl?.textContent.trim() || '',
                excerpt: excerptEl?.textContent.trim() || '',
                tags: Array.from(tagsEl).map(tag => tag.textContent.trim()),
                date: this.parseDate(dateEl?.textContent || dateEl?.getAttribute('datetime') || ''),
                url: linkEl?.href || '#',
                image: imageEl?.src || '',
                element: article
            };
        }).filter(post => post.title);
    }

    generateId(title) {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    parseDate(dateString) {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? new Date() : date;
    }

    buildSearchIndex() {
        // Create a simple search index for faster lookups
        this.searchIndex = this.posts.map(post => ({
            id: post.id,
            searchText: [
                post.title,
                post.excerpt,
                ...post.tags
            ].join(' ').toLowerCase()
        }));
    }

    createSearchInterface() {
        const container = document.querySelector('.blog-feed')?.parentElement;
        if (!container) return;

        const searchSection = document.createElement('div');
        searchSection.className = 'blog-search-section';
        searchSection.innerHTML = `
            <div class="search-container">
                <div class="search-input-wrapper">
                    <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <input 
                        type="text" 
                        class="blog-search-input" 
                        placeholder="Search blog posts..."
                        aria-label="Search blog posts"
                    />
                    <button class="search-clear-btn" aria-label="Clear search" style="display: none;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                
                <div class="search-filters">
                    <div class="filter-group">
                        <label class="filter-label">Sort by:</label>
                        <select class="sort-select" aria-label="Sort posts">
                            <option value="date-desc">Newest First</option>
                            <option value="date-asc">Oldest First</option>
                            <option value="title-asc">Title A-Z</option>
                            <option value="title-desc">Title Z-A</option>
                            <option value="relevance">Most Relevant</option>
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <label class="filter-label">Tags:</label>
                        <div class="tag-filters" id="tag-filters"></div>
                    </div>
                </div>
                
                <div class="search-stats">
                    <span class="results-count">Showing <strong>${this.posts.length}</strong> posts</span>
                    <button class="reset-filters-btn" style="display: none;">Reset Filters</button>
                </div>
            </div>
        `;

        container.insertBefore(searchSection, container.firstChild);
        this.populateTagFilters();
    }

    populateTagFilters() {
        const tagFiltersContainer = document.getElementById('tag-filters');
        if (!tagFiltersContainer) return;

        // Get all unique tags
        const allTags = new Set();
        this.posts.forEach(post => {
            post.tags.forEach(tag => allTags.add(tag));
        });

        if (allTags.size === 0) {
            tagFiltersContainer.innerHTML = '<span class="no-tags">No tags available</span>';
            return;
        }

        const sortedTags = Array.from(allTags).sort();
        tagFiltersContainer.innerHTML = sortedTags.map(tag => `
            <label class="tag-filter-item">
                <input type="checkbox" value="${tag}" class="tag-checkbox" />
                <span class="tag-filter-label">${tag}</span>
            </label>
        `).join('');
    }

    attachEventListeners() {
        // Search input
        const searchInput = document.querySelector('.blog-search-input');
        const clearBtn = document.querySelector('.search-clear-btn');
        
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce((e) => {
                this.currentFilters.query = e.target.value.toLowerCase();
                this.filterAndDisplay();
                clearBtn.style.display = e.target.value ? 'flex' : 'none';
            }, 300));
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                searchInput.value = '';
                this.currentFilters.query = '';
                this.filterAndDisplay();
                clearBtn.style.display = 'none';
                searchInput.focus();
            });
        }

        // Sort select
        const sortSelect = document.querySelector('.sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentFilters.sortBy = e.target.value;
                this.filterAndDisplay();
            });
        }

        // Tag filters
        const tagCheckboxes = document.querySelectorAll('.tag-checkbox');
        tagCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.currentFilters.tags.add(e.target.value);
                } else {
                    this.currentFilters.tags.delete(e.target.value);
                }
                this.filterAndDisplay();
            });
        });

        // Reset filters
        const resetBtn = document.querySelector('.reset-filters-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetFilters();
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchInput?.focus();
            }
        });
    }

    filterAndDisplay() {
        this.filteredPosts = this.filterPosts();
        this.sortPosts();
        this.displayResults();
        this.updateStats();
    }

    filterPosts() {
        return this.posts.filter(post => {
            // Text search
            if (this.currentFilters.query) {
                const searchText = this.searchIndex.find(item => item.id === post.id)?.searchText || '';
                if (!this.fuzzyMatch(searchText, this.currentFilters.query)) {
                    return false;
                }
            }

            // Tag filter
            if (this.currentFilters.tags.size > 0) {
                const hasMatchingTag = post.tags.some(tag => 
                    this.currentFilters.tags.has(tag)
                );
                if (!hasMatchingTag) {
                    return false;
                }
            }

            return true;
        });
    }

    fuzzyMatch(text, query) {
        // Simple fuzzy matching - check if all query words are in the text
        const queryWords = query.split(/\s+/).filter(w => w.length > 0);
        return queryWords.every(word => text.includes(word));
    }

    sortPosts() {
        const sortFunctions = {
            'date-desc': (a, b) => b.date - a.date,
            'date-asc': (a, b) => a.date - b.date,
            'title-asc': (a, b) => a.title.localeCompare(b.title),
            'title-desc': (a, b) => b.title.localeCompare(a.title),
            'relevance': (a, b) => {
                if (!this.currentFilters.query) return b.date - a.date;
                const aScore = this.calculateRelevance(a);
                const bScore = this.calculateRelevance(b);
                return bScore - aScore;
            }
        };

        const sortFn = sortFunctions[this.currentFilters.sortBy];
        if (sortFn) {
            this.filteredPosts.sort(sortFn);
        }
    }

    calculateRelevance(post) {
        const query = this.currentFilters.query.toLowerCase();
        let score = 0;

        // Title match (highest priority)
        if (post.title.toLowerCase().includes(query)) {
            score += 10;
        }

        // Tag match
        if (post.tags.some(tag => tag.toLowerCase().includes(query))) {
            score += 5;
        }

        // Excerpt match
        if (post.excerpt.toLowerCase().includes(query)) {
            score += 3;
        }

        return score;
    }

    displayResults() {
        const blogFeed = document.querySelector('.blog-feed');
        if (!blogFeed) return;

        // Hide all posts first
        this.posts.forEach(post => {
            if (post.element) {
                post.element.style.display = 'none';
            }
        });

        // Show filtered posts in order
        this.filteredPosts.forEach((post, index) => {
            if (post.element) {
                post.element.style.display = '';
                post.element.style.order = index;
                
                // Highlight search terms
                if (this.currentFilters.query) {
                    this.highlightSearchTerms(post.element, this.currentFilters.query);
                } else {
                    this.removeHighlights(post.element);
                }
            }
        });

        // Show no results message
        this.showNoResultsMessage(this.filteredPosts.length === 0);
    }

    highlightSearchTerms(element, query) {
        const textElements = element.querySelectorAll('h3, p, .blog-card-title, .blog-card-excerpt');
        const queryWords = query.split(/\s+/).filter(w => w.length > 0);

        textElements.forEach(el => {
            if (el.dataset.originalText) {
                el.innerHTML = el.dataset.originalText;
            } else {
                el.dataset.originalText = el.innerHTML;
            }

            let html = el.innerHTML;
            queryWords.forEach(word => {
                const regex = new RegExp(`(${this.escapeRegex(word)})`, 'gi');
                html = html.replace(regex, '<mark class="search-highlight">$1</mark>');
            });
            el.innerHTML = html;
        });
    }

    removeHighlights(element) {
        const textElements = element.querySelectorAll('h3, p, .blog-card-title, .blog-card-excerpt');
        textElements.forEach(el => {
            if (el.dataset.originalText) {
                el.innerHTML = el.dataset.originalText;
                delete el.dataset.originalText;
            }
        });
    }

    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    showNoResultsMessage(show) {
        let noResults = document.querySelector('.no-results-message');
        
        if (show) {
            if (!noResults) {
                noResults = document.createElement('div');
                noResults.className = 'no-results-message';
                noResults.innerHTML = `
                    <div class="no-results-content">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                            <line x1="11" y1="8" x2="11" y2="14"></line>
                            <circle cx="11" cy="17" r="0.5" fill="currentColor"></circle>
                        </svg>
                        <h3>No posts found</h3>
                        <p>Try adjusting your search or filters</p>
                        <button class="reset-search-btn">Clear Search</button>
                    </div>
                `;
                
                const blogFeed = document.querySelector('.blog-feed');
                if (blogFeed) {
                    blogFeed.parentElement.insertBefore(noResults, blogFeed.nextSibling);
                }

                noResults.querySelector('.reset-search-btn')?.addEventListener('click', () => {
                    this.resetFilters();
                });
            }
            noResults.style.display = 'flex';
        } else if (noResults) {
            noResults.style.display = 'none';
        }
    }

    updateStats() {
        const statsElement = document.querySelector('.results-count');
        const resetBtn = document.querySelector('.reset-filters-btn');
        
        if (statsElement) {
            const count = this.filteredPosts.length;
            const total = this.posts.length;
            
            if (count === total) {
                statsElement.innerHTML = `Showing <strong>${total}</strong> posts`;
            } else {
                statsElement.innerHTML = `Showing <strong>${count}</strong> of <strong>${total}</strong> posts`;
            }
        }

        // Show/hide reset button
        const hasActiveFilters = this.currentFilters.query || 
                                this.currentFilters.tags.size > 0 || 
                                this.currentFilters.sortBy !== 'date-desc';
        
        if (resetBtn) {
            resetBtn.style.display = hasActiveFilters ? 'inline-flex' : 'none';
        }
    }

    resetFilters() {
        // Clear search input
        const searchInput = document.querySelector('.blog-search-input');
        const clearBtn = document.querySelector('.search-clear-btn');
        if (searchInput) {
            searchInput.value = '';
            clearBtn.style.display = 'none';
        }

        // Reset sort
        const sortSelect = document.querySelector('.sort-select');
        if (sortSelect) {
            sortSelect.value = 'date-desc';
        }

        // Uncheck all tags
        const tagCheckboxes = document.querySelectorAll('.tag-checkbox');
        tagCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

        // Reset filters
        this.currentFilters = {
            query: '',
            tags: new Set(),
            sortBy: 'date-desc'
        };

        this.filterAndDisplay();
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.querySelector('.blog-feed')) {
            window.blogSearch = new BlogSearch();
        }
    });
} else {
    if (document.querySelector('.blog-feed')) {
        window.blogSearch = new BlogSearch();
    }
}
