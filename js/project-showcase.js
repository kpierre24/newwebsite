/**
 * Project Showcase Enhancement System
 * GitHub stats, tech badges, filters, timeline view
 */

class ProjectShowcase {
    constructor() {
        this.projects = [];
        this.githubCache = new Map();
        this.cacheExpiry = 30 * 60 * 1000; // 30 minutes
        this.filters = {
            technology: 'all',
            category: 'all',
            searchTerm: ''
        };
        this.init();
    }

    async init() {
        this.findProjects();
        this.createFilterUI();
        await this.enhanceProjects();
        this.attachEventListeners();
        this.createTimelineView();
    }

    findProjects() {
        // Find project cards
        const projectCards = document.querySelectorAll('.project-card, [data-project], .portfolio-item');
        
        this.projects = Array.from(projectCards).map((card, index) => ({
            element: card,
            index: index,
            title: this.extractProjectTitle(card),
            description: this.extractProjectDescription(card),
            technologies: this.extractTechnologies(card),
            category: card.dataset.category || 'general',
            github: card.dataset.github || this.extractGithubUrl(card),
            demo: card.dataset.demo || this.extractDemoUrl(card),
            date: card.dataset.date || null,
            featured: card.dataset.featured === 'true' || card.classList.contains('featured')
        }));
    }

    extractProjectTitle(card) {
        const titleSelectors = ['h3', 'h4', '.project-title', '[data-title]'];
        for (const selector of titleSelectors) {
            const element = card.querySelector(selector);
            if (element) return element.textContent.trim();
        }
        return 'Untitled Project';
    }

    extractProjectDescription(card) {
        const descSelectors = ['p', '.project-description', '[data-description]'];
        for (const selector of descSelectors) {
            const element = card.querySelector(selector);
            if (element) return element.textContent.trim();
        }
        return '';
    }

    extractTechnologies(card) {
        const techElements = card.querySelectorAll('.tech-badge, .technology, [data-tech]');
        return Array.from(techElements).map(el => el.textContent.trim().toLowerCase());
    }

    extractGithubUrl(card) {
        const githubLink = card.querySelector('a[href*="github.com"]');
        return githubLink ? githubLink.href : null;
    }

    extractDemoUrl(card) {
        const demoLink = card.querySelector('a[href]:not([href*="github.com"])');
        return demoLink ? demoLink.href : null;
    }

    async enhanceProjects() {
        const enhancements = this.projects.map(project => 
            this.enhanceProject(project)
        );
        await Promise.all(enhancements);
    }

    async enhanceProject(project) {
        // Add GitHub stats if available
        if (project.github) {
            await this.addGithubStats(project);
        }

        // Add tech badges if not already present
        this.addTechBadges(project);

        // Add interaction features
        this.addInteractionFeatures(project);

        // Add demo preview
        if (project.demo) {
            this.addDemoPreview(project);
        }
    }

    async addGithubStats(project) {
        try {
            const stats = await this.fetchGithubStats(project.github);
            
            if (!stats) return;

            // Create stats container
            const statsContainer = document.createElement('div');
            statsContainer.className = 'project-github-stats';
            statsContainer.innerHTML = `
                <div class="github-stat">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
                    </svg>
                    <span>${this.formatNumber(stats.stars)}</span>
                </div>
                <div class="github-stat">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"/>
                    </svg>
                    <span>${this.formatNumber(stats.forks)}</span>
                </div>
                <div class="github-stat">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                        <path d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"/>
                    </svg>
                    <span>${this.formatNumber(stats.watchers)}</span>
                </div>
                ${stats.language ? `
                    <div class="github-stat language">
                        <span class="language-dot" style="background: ${this.getLanguageColor(stats.language)}"></span>
                        <span>${stats.language}</span>
                    </div>
                ` : ''}
            `;

            // Insert stats into project card
            const insertPoint = project.element.querySelector('.project-links, .project-footer, .project-content');
            if (insertPoint) {
                insertPoint.insertAdjacentElement('beforebegin', statsContainer);
            } else {
                project.element.appendChild(statsContainer);
            }

            // Store stats in project data
            project.stats = stats;

        } catch (error) {
            console.warn(`Failed to fetch GitHub stats for ${project.github}:`, error);
        }
    }

    async fetchGithubStats(githubUrl) {
        // Check cache first
        const cached = this.githubCache.get(githubUrl);
        if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
            return cached.data;
        }

        // Extract owner and repo from URL
        const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (!match) return null;

        const [, owner, repo] = match;
        const cleanRepo = repo.replace(/\.git$/, '');

        try {
            const response = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`);
            if (!response.ok) throw new Error('GitHub API request failed');

            const data = await response.json();
            const stats = {
                stars: data.stargazers_count,
                forks: data.forks_count,
                watchers: data.watchers_count,
                language: data.language,
                description: data.description,
                topics: data.topics || []
            };

            // Cache the result
            this.githubCache.set(githubUrl, {
                data: stats,
                timestamp: Date.now()
            });

            return stats;

        } catch (error) {
            console.warn('GitHub API error:', error);
            return null;
        }
    }

    addTechBadges(project) {
        if (project.technologies.length === 0) return;

        const existingBadges = project.element.querySelector('.tech-badges, .technologies');
        if (existingBadges) return; // Already has badges

        const badgeContainer = document.createElement('div');
        badgeContainer.className = 'tech-badges';
        
        project.technologies.forEach(tech => {
            const badge = document.createElement('span');
            badge.className = 'tech-badge';
            badge.dataset.tech = tech;
            badge.textContent = tech;
            badge.style.background = this.getTechColor(tech);
            badgeContainer.appendChild(badge);
        });

        // Insert badges
        const insertPoint = project.element.querySelector('.project-content, .project-header');
        if (insertPoint) {
            insertPoint.appendChild(badgeContainer);
        }
    }

    addInteractionFeatures(project) {
        // Add hover effects
        project.element.classList.add('enhanced-project');

        // Add quick preview on hover
        project.element.addEventListener('mouseenter', () => {
            this.showQuickPreview(project);
        });

        project.element.addEventListener('mouseleave', () => {
            this.hideQuickPreview(project);
        });
    }

    addDemoPreview(project) {
        const demoBtn = project.element.querySelector('a[href*="' + project.demo + '"]');
        if (!demoBtn) return;

        demoBtn.classList.add('demo-btn-enhanced');
        
        // Add preview icon
        const icon = document.createElement('span');
        icon.className = 'demo-icon';
        icon.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
        `;
        demoBtn.appendChild(icon);
    }

    showQuickPreview(project) {
        // Add glow effect
        project.element.classList.add('project-preview-active');
    }

    hideQuickPreview(project) {
        project.element.classList.remove('project-preview-active');
    }

    createFilterUI() {
        const projectsContainer = document.querySelector('.projects-grid, .portfolio-grid, [data-projects]');
        if (!projectsContainer) return;

        const filterContainer = document.createElement('div');
        filterContainer.className = 'project-filters';
        filterContainer.innerHTML = `
            <div class="filter-section">
                <label for="tech-filter" class="filter-label">Technology:</label>
                <select id="tech-filter" class="filter-select">
                    <option value="all">All Technologies</option>
                    ${this.getUniqueTechnologies().map(tech => 
                        `<option value="${tech}">${tech}</option>`
                    ).join('')}
                </select>
            </div>
            
            <div class="filter-section">
                <label for="category-filter" class="filter-label">Category:</label>
                <select id="category-filter" class="filter-select">
                    <option value="all">All Categories</option>
                    ${this.getUniqueCategories().map(cat => 
                        `<option value="${cat}">${cat}</option>`
                    ).join('')}
                </select>
            </div>
            
            <div class="filter-section search-section">
                <label for="project-search" class="filter-label">Search:</label>
                <input type="search" id="project-search" class="filter-search" placeholder="Search projects..." />
            </div>
            
            <button class="filter-reset" id="reset-filters">Reset Filters</button>
        `;

        projectsContainer.insertAdjacentElement('beforebegin', filterContainer);
        this.attachFilterListeners();
    }

    attachFilterListeners() {
        document.getElementById('tech-filter')?.addEventListener('change', (e) => {
            this.filters.technology = e.target.value;
            this.applyFilters();
        });

        document.getElementById('category-filter')?.addEventListener('change', (e) => {
            this.filters.category = e.target.value;
            this.applyFilters();
        });

        document.getElementById('project-search')?.addEventListener('input', (e) => {
            this.filters.searchTerm = e.target.value.toLowerCase();
            this.applyFilters();
        });

        document.getElementById('reset-filters')?.addEventListener('click', () => {
            this.resetFilters();
        });
    }

    applyFilters() {
        this.projects.forEach(project => {
            const matchesTech = this.filters.technology === 'all' || 
                project.technologies.includes(this.filters.technology);
            
            const matchesCategory = this.filters.category === 'all' || 
                project.category === this.filters.category;
            
            const matchesSearch = this.filters.searchTerm === '' ||
                project.title.toLowerCase().includes(this.filters.searchTerm) ||
                project.description.toLowerCase().includes(this.filters.searchTerm);

            if (matchesTech && matchesCategory && matchesSearch) {
                project.element.style.display = '';
                project.element.classList.add('filter-match');
            } else {
                project.element.style.display = 'none';
                project.element.classList.remove('filter-match');
            }
        });
    }

    resetFilters() {
        this.filters = { technology: 'all', category: 'all', searchTerm: '' };
        document.getElementById('tech-filter').value = 'all';
        document.getElementById('category-filter').value = 'all';
        document.getElementById('project-search').value = '';
        this.applyFilters();
    }

    getUniqueTechnologies() {
        const allTech = this.projects.flatMap(p => p.technologies);
        return [...new Set(allTech)].sort();
    }

    getUniqueCategories() {
        const allCategories = this.projects.map(p => p.category);
        return [...new Set(allCategories)].sort();
    }

    createTimelineView() {
        // Add timeline toggle button
        const projectsContainer = document.querySelector('.projects-grid, .portfolio-grid');
        if (!projectsContainer || this.projects.every(p => !p.date)) return;

        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'timeline-toggle';
        toggleBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="19 12 12 19 5 12"></polyline>
            </svg>
            View as Timeline
        `;

        projectsContainer.insertAdjacentElement('beforebegin', toggleBtn);

        toggleBtn.addEventListener('click', () => {
            this.toggleTimelineView(projectsContainer, toggleBtn);
        });
    }

    toggleTimelineView(container, button) {
        container.classList.toggle('timeline-view');
        
        if (container.classList.contains('timeline-view')) {
            button.textContent = 'View as Grid';
            this.sortProjectsByDate();
        } else {
            button.textContent = 'View as Timeline';
        }
    }

    sortProjectsByDate() {
        const sortedProjects = [...this.projects]
            .filter(p => p.date)
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        sortedProjects.forEach(project => {
            project.element.parentElement.appendChild(project.element);
        });
    }

    attachEventListeners() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'f':
                        e.preventDefault();
                        document.getElementById('project-search')?.focus();
                        break;
                }
            }
        });
    }

    formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    }

    getTechColor(tech) {
        const colors = {
            javascript: '#f7df1e',
            typescript: '#3178c6',
            python: '#3776ab',
            react: '#61dafb',
            vue: '#42b883',
            node: '#339933',
            css: '#1572b6',
            html: '#e34f26',
            php: '#777bb4',
            java: '#007396',
            go: '#00add8',
            rust: '#000000',
            ruby: '#cc342d',
            swift: '#fa7343'
        };
        return colors[tech.toLowerCase()] || '#6366f1';
    }

    getLanguageColor(language) {
        return this.getTechColor(language);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.projectShowcase = new ProjectShowcase();
    });
} else {
    window.projectShowcase = new ProjectShowcase();
}
