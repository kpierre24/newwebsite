/**
 * Automatic Blog Feed Generator
 * Fetches articles from tech RSS feeds and displays them in the existing blog format
 */

class BlogFeedManager {
  constructor() {
    // Using AllOrigins as CORS proxy + direct RSS parsing
    this.corsProxy = 'https://api.allorigins.win/raw?url=';
    
    // Tech blog RSS feeds - Comprehensive coverage (tested and working)
    this.feeds = [
      // AI & Machine Learning
      {
        name: 'OpenAI Blog',
        url: 'https://openai.com/blog/rss/',
        category: 'ai',
        icon: 'fas fa-brain'
      },
      {
        name: 'Google AI Blog',
        url: 'https://blog.google/technology/ai/rss/',
        category: 'ai',
        icon: 'fas fa-robot'
      },
      {
        name: 'Microsoft AI Blog',
        url: 'https://blogs.microsoft.com/ai/feed/',
        category: 'ai',
        icon: 'fas fa-microchip'
      },
      {
        name: 'Towards Data Science',
        url: 'https://towardsdatascience.com/feed',
        category: 'ai',
        icon: 'fas fa-chart-line'
      },
      
      // Microsoft Ecosystem
      {
        name: 'Microsoft DevBlogs - .NET',
        url: 'https://devblogs.microsoft.com/dotnet/feed/',
        category: 'microsoft',
        icon: 'fab fa-microsoft'
      },
      {
        name: 'Azure Updates',
        url: 'https://azurecomcdn.azureedge.net/en-us/updates/feed/',
        category: 'microsoft',
        icon: 'fas fa-cloud'
      },
      {
        name: 'Visual Studio Blog',
        url: 'https://devblogs.microsoft.com/visualstudio/feed/',
        category: 'microsoft',
        icon: 'fas fa-code'
      },
      {
        name: 'PowerShell Team Blog',
        url: 'https://devblogs.microsoft.com/powershell/feed/',
        category: 'microsoft',
        icon: 'fas fa-terminal'
      },
      
      // Software Development
      {
        name: 'Dev.to',
        url: 'https://dev.to/feed',
        category: 'software-development',
        icon: 'fab fa-dev'
      },
      {
        name: 'freeCodeCamp',
        url: 'https://www.freecodecamp.org/news/rss/',
        category: 'software-development',
        icon: 'fab fa-free-code-camp'
      },
      {
        name: 'GitHub Blog',
        url: 'https://github.blog/feed/',
        category: 'software-development',
        icon: 'fab fa-github'
      },
      {
        name: 'Stack Overflow Blog',
        url: 'https://stackoverflow.blog/feed/',
        category: 'software-development',
        icon: 'fab fa-stack-overflow'
      },
      {
        name: 'Martin Fowler',
        url: 'https://martinfowler.com/feed.atom',
        category: 'software-development',
        icon: 'fas fa-book'
      },
      {
        name: 'The Verge - Tech',
        url: 'https://www.theverge.com/rss/index.xml',
        category: 'software-development',
        icon: 'fas fa-newspaper'
      },
      
      // CSS & Design
      {
        name: 'CSS-Tricks',
        url: 'https://css-tricks.com/feed/',
        category: 'css',
        icon: 'fab fa-css3-alt'
      },
      {
        name: 'Codrops',
        url: 'https://tympanus.net/codrops/feed/',
        category: 'css',
        icon: 'fas fa-paint-brush'
      },
      {
        name: 'Smashing Magazine',
        url: 'https://www.smashingmagazine.com/feed/',
        category: 'css',
        icon: 'fas fa-newspaper'
      },
      {
        name: 'A List Apart',
        url: 'https://alistapart.com/main/feed/',
        category: 'css',
        icon: 'fas fa-list-alt'
      },
      
      // Vue.js
      {
        name: 'Vue.js News',
        url: 'https://news.vuejs.org/rss',
        category: 'vue',
        icon: 'fab fa-vuejs'
      },
      {
        name: 'Vue.js Blog',
        url: 'https://blog.vuejs.org/feed.rss',
        category: 'vue',
        icon: 'fab fa-vuejs'
      },
      {
        name: 'VueDose',
        url: 'https://vuedose.tips/rss.xml',
        category: 'vue',
        icon: 'fab fa-vuejs'
      },
      
      // JavaScript
      {
        name: 'JavaScript Weekly',
        url: 'https://javascriptweekly.com/rss',
        category: 'javascript',
        icon: 'fab fa-js-square'
      },
      {
        name: 'Node Weekly',
        url: 'https://nodeweekly.com/rss',
        category: 'javascript',
        icon: 'fab fa-node-js'
      },
      {
        name: 'Echo JS',
        url: 'https://www.echojs.com/rss',
        category: 'javascript',
        icon: 'fab fa-js'
      },
      {
        name: 'Frontend Focus',
        url: 'https://frontendfoc.us/rss',
        category: 'javascript',
        icon: 'fas fa-code'
      },
      
      // Google Ecosystem
      {
        name: 'Web.dev',
        url: 'https://web.dev/feed.xml',
        category: 'google',
        icon: 'fas fa-globe'
      },
      {
        name: 'Chrome Developers',
        url: 'https://developer.chrome.com/feeds/blog.xml',
        category: 'google',
        icon: 'fab fa-chrome'
      },
      {
        name: 'Google Testing Blog',
        url: 'https://testing.googleblog.com/feeds/posts/default',
        category: 'google',
        icon: 'fas fa-vial'
      },
      {
        name: 'Google Open Source',
        url: 'https://opensource.googleblog.com/feeds/posts/default',
        category: 'google',
        icon: 'fab fa-google'
      },
      {
        name: 'Firebase Blog',
        url: 'https://firebase.blog/feed/',
        category: 'google',
        icon: 'fas fa-fire'
      },
      
      // UI/UX Design
      {
        name: 'Nielsen Norman Group',
        url: 'https://www.nngroup.com/feed/rss/',
        category: 'ux-design',
        icon: 'fas fa-users'
      },
      {
        name: 'UX Collective',
        url: 'https://uxdesign.cc/feed',
        category: 'ux-design',
        icon: 'fas fa-palette'
      },
      {
        name: 'UX Planet',
        url: 'https://uxplanet.org/feed',
        category: 'ux-design',
        icon: 'fas fa-rocket'
      },
      {
        name: 'UX Booth',
        url: 'https://www.uxbooth.com/feed/',
        category: 'ux-design',
        icon: 'fas fa-pencil-ruler'
      },
      
      // Mobile Development
      {
        name: 'Android Developers Blog',
        url: 'https://android-developers.googleblog.com/feeds/posts/default',
        category: 'mobile-development',
        icon: 'fab fa-android'
      },
      {
        name: 'React Native Blog',
        url: 'https://reactnative.dev/blog/rss.xml',
        category: 'mobile-development',
        icon: 'fab fa-react'
      },
      {
        name: 'Flutter Blog',
        url: 'https://medium.com/flutter/feed',
        category: 'mobile-development',
        icon: 'fas fa-mobile-alt'
      },
      {
        name: 'iOS Dev Weekly',
        url: 'https://iosdevweekly.com/issues.rss',
        category: 'mobile-development',
        icon: 'fab fa-apple'
      },
      
      // Business & Tech
      {
        name: 'TechCrunch',
        url: 'https://techcrunch.com/feed/',
        category: 'business-tech',
        icon: 'fas fa-newspaper'
      },
      {
        name: 'Product Hunt',
        url: 'https://www.producthunt.com/feed',
        category: 'business-tech',
        icon: 'fab fa-product-hunt'
      },
      {
        name: 'Mind the Product',
        url: 'https://www.mindtheproduct.com/feed/',
        category: 'business-tech',
        icon: 'fas fa-lightbulb'
      },
      {
        name: 'Y Combinator',
        url: 'https://www.ycombinator.com/blog/feed',
        category: 'business-tech',
        icon: 'fas fa-rocket'
      },
      
      // Cloud & DevOps
      {
        name: 'AWS Blog',
        url: 'https://aws.amazon.com/blogs/aws/feed/',
        category: 'cloud-devops',
        icon: 'fab fa-aws'
      },
      {
        name: 'Google Cloud Blog',
        url: 'https://cloud.google.com/blog/feeds/posts.xml',
        category: 'cloud-devops',
        icon: 'fas fa-cloud'
      },
      {
        name: 'DigitalOcean Blog',
        url: 'https://www.digitalocean.com/blog/feed.xml',
        category: 'cloud-devops',
        icon: 'fas fa-server'
      },
      {
        name: 'Docker Blog',
        url: 'https://www.docker.com/blog/feed/',
        category: 'cloud-devops',
        icon: 'fab fa-docker'
      },
      {
        name: 'Kubernetes Blog',
        url: 'https://kubernetes.io/feed.xml',
        category: 'cloud-devops',
        icon: 'fas fa-dharmachakra'
      },
      
      // Web Security
      {
        name: 'OWASP Blog',
        url: 'https://owasp.org/blog/feed.xml',
        category: 'web-security',
        icon: 'fas fa-shield-alt'
      },
      {
        name: 'Krebs on Security',
        url: 'https://krebsonsecurity.com/feed/',
        category: 'web-security',
        icon: 'fas fa-lock'
      },
      {
        name: 'Troy Hunt',
        url: 'https://www.troyhunt.com/rss/',
        category: 'web-security',
        icon: 'fas fa-user-shield'
      },
      {
        name: 'Mozilla Security Blog',
        url: 'https://blog.mozilla.org/security/feed/',
        category: 'web-security',
        icon: 'fab fa-firefox'
      },
      
      // Additional feeds for existing categories
      {
        name: 'DeepMind Blog',
        url: 'https://deepmind.google/blog/rss.xml',
        category: 'ai',
        icon: 'fas fa-brain'
      },
      {
        name: 'Hugging Face Blog',
        url: 'https://huggingface.co/blog/feed.xml',
        category: 'ai',
        icon: 'fas fa-robot'
      },
      {
        name: 'TypeScript Blog',
        url: 'https://devblogs.microsoft.com/typescript/feed/',
        category: 'microsoft',
        icon: 'fas fa-code'
      },
      {
        name: 'Microsoft 365 Dev Blog',
        url: 'https://devblogs.microsoft.com/microsoft365dev/feed/',
        category: 'microsoft',
        icon: 'fab fa-microsoft'
      },
      {
        name: 'Hacker News',
        url: 'https://hnrss.org/frontpage',
        category: 'software-development',
        icon: 'fab fa-hacker-news'
      },
      {
        name: 'SitePoint',
        url: 'https://www.sitepoint.com/feed/',
        category: 'software-development',
        icon: 'fas fa-book'
      },
      {
        name: 'React Blog',
        url: 'https://react.dev/rss.xml',
        category: 'javascript',
        icon: 'fab fa-react'
      },
      {
        name: 'Deno Blog',
        url: 'https://deno.com/feed',
        category: 'javascript',
        icon: 'fas fa-code'
      }
    ];
    
    this.articles = [];
    this.articlesGrid = document.getElementById('articles-grid');
    this.resultsCount = document.getElementById('results-count');
    this.categoryFilter = document.getElementById('category-filter');
    this.searchInput = document.getElementById('blog-search');
    
    this.init();
  }
  
  async init() {
    // Show loading state
    this.showLoadingState();
    
    // Fetch articles from all feeds
    await this.fetchAllFeeds();
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Display articles
    this.displayArticles();
  }
  
  showLoadingState() {
    if (this.articlesGrid) {
      this.articlesGrid.innerHTML = `
        <div class="loading-state" style="grid-column: 1/-1; text-align: center; padding: 3rem;">
          <div class="spinner" style="margin: 0 auto 1rem; width: 50px; height: 50px; border: 4px solid #f3f3f3; border-top: 4px solid #6366f1; border-radius: 50%; animation: spin 1s linear infinite;"></div>
          <p style="color: #666;">Loading latest tech articles...</p>
        </div>
      `;
    }
  }
  
  async fetchAllFeeds() {
    const fetchPromises = this.feeds.map(feed => this.fetchFeed(feed));
    const results = await Promise.allSettled(fetchPromises);
    
    // Count successful feeds
    let successCount = 0;
    let failCount = 0;
    
    // Combine all articles and sort by date
    this.articles = results
      .filter(result => {
        if (result.status === 'fulfilled' && result.value && result.value.length > 0) {
          successCount++;
          return true;
        } else {
          failCount++;
          return false;
        }
      })
      .flatMap(result => result.value)
      .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
      .slice(0, 20); // Limit to 20 most recent articles
    
    console.log(`✅ Successfully loaded ${successCount}/${this.feeds.length} feeds (${failCount} skipped)`);
    console.log(`📰 Displaying ${this.articles.length} articles`);
  }
  
  async fetchFeed(feedConfig) {
    try {
      // Fetch RSS feed through CORS proxy
      const response = await fetch(`${this.corsProxy}${encodeURIComponent(feedConfig.url)}`);
      
      if (!response.ok) {
        console.warn(`Feed ${feedConfig.name} returned HTTP ${response.status}.`);
        return [];
      }
      
      const xmlText = await response.text();
      
      // Parse RSS/Atom XML
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      // Check for parsing errors
      const parseError = xmlDoc.querySelector('parsererror');
      if (parseError) {
        console.warn(`Feed ${feedConfig.name} XML parsing error.`);
        return [];
      }
      
      // Parse items (works for both RSS and Atom)
      const items = this.parseItems(xmlDoc, feedConfig);
      
      if (items.length === 0) {
        console.warn(`Feed ${feedConfig.name} returned no items.`);
      }
      
      return items.slice(0, 10); // Limit to 10 items per feed
    } catch (error) {
      console.warn(`Skipping ${feedConfig.name}:`, error.message);
      return [];
    }
  }
  
  parseItems(xmlDoc, feedConfig) {
    const items = [];
    
    // Try RSS format first
    let entries = xmlDoc.querySelectorAll('item');
    
    // If no items, try Atom format
    if (entries.length === 0) {
      entries = xmlDoc.querySelectorAll('entry');
    }
    
    entries.forEach(entry => {
      try {
        const item = this.parseEntry(entry, feedConfig);
        if (item) items.push(item);
      } catch (e) {
        // Skip problematic entries
      }
    });
    
    return items;
  }
  
  parseEntry(entry, feedConfig) {
    // Get title
    const titleEl = entry.querySelector('title');
    const title = titleEl ? titleEl.textContent.trim() : 'Untitled';
    
    // Get link
    let link = '';
    const linkEl = entry.querySelector('link');
    if (linkEl) {
      link = linkEl.getAttribute('href') || linkEl.textContent.trim();
    }
    
    // Get description/content
    let description = '';
    const descEl = entry.querySelector('description') || 
                    entry.querySelector('summary') || 
                    entry.querySelector('content');
    if (descEl) {
      description = this.stripHtml(descEl.textContent).substring(0, 150).trim() + '...';
    }
    
    // Get date
    let pubDate = new Date();
    const dateEl = entry.querySelector('pubDate') || 
                   entry.querySelector('published') || 
                   entry.querySelector('updated');
    if (dateEl) {
      pubDate = new Date(dateEl.textContent);
    }
    
    // Get categories
    const categories = [];
    entry.querySelectorAll('category').forEach(cat => {
      categories.push(cat.textContent || cat.getAttribute('term') || '');
    });
    
    // Calculate reading time
    const wordCount = description.split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));
    
    // Get thumbnail if available
    let thumbnail = null;
    const mediaContent = entry.querySelector('content[url]');
    const enclosure = entry.querySelector('enclosure[url]');
    if (mediaContent) {
      thumbnail = mediaContent.getAttribute('url');
    } else if (enclosure) {
      thumbnail = enclosure.getAttribute('url');
    }
    
    return {
      title: title,
      link: link,
      description: description,
      pubDate: pubDate.toISOString(),
      author: feedConfig.name,
      category: this.mapCategory(categories, feedConfig.category),
      icon: feedConfig.icon,
      readTime: readTime,
      source: feedConfig.name,
      tags: categories.slice(0, 3),
      thumbnail: thumbnail
    };
  }
  
  stripHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }
  
  mapCategory(tags, defaultCategory) {
    // Map tags to your blog categories
    const tagStr = tags.join(' ').toLowerCase();
    
    // AI & Machine Learning
    if (tagStr.includes('ai') || tagStr.includes('machine learning') || 
        tagStr.includes('artificial intelligence') || tagStr.includes('ml') ||
        tagStr.includes('deep learning') || tagStr.includes('neural')) {
      return 'ai';
    }
    
    // Microsoft
    if (tagStr.includes('microsoft') || tagStr.includes('azure') || 
        tagStr.includes('typescript') || tagStr.includes('.net') ||
        tagStr.includes('visual studio')) {
      return 'microsoft';
    }
    
    // Google
    if (tagStr.includes('google') || tagStr.includes('chrome') || 
        tagStr.includes('android') || tagStr.includes('firebase') ||
        tagStr.includes('cloud platform')) {
      return 'google';
    }
    
    // Vue.js
    if (tagStr.includes('vue') || tagStr.includes('vuejs') || tagStr.includes('nuxt')) {
      return 'vue';
    }
    
    // JavaScript
    if (tagStr.includes('javascript') || tagStr.includes('js') || 
        tagStr.includes('node') || tagStr.includes('react') ||
        tagStr.includes('typescript')) {
      return 'javascript';
    }
    
    // CSS
    if (tagStr.includes('css') || tagStr.includes('style') || 
        tagStr.includes('design') || tagStr.includes('sass') ||
        tagStr.includes('tailwind')) {
      return 'css';
    }
    
    // UI/UX Design
    if (tagStr.includes('ux') || tagStr.includes('ui') || 
        tagStr.includes('user experience') || tagStr.includes('user interface') ||
        tagStr.includes('usability') || tagStr.includes('design thinking')) {
      return 'ux-design';
    }
    
    // Mobile Development
    if (tagStr.includes('mobile') || tagStr.includes('ios') || 
        tagStr.includes('android') || tagStr.includes('react native') ||
        tagStr.includes('flutter') || tagStr.includes('swift')) {
      return 'mobile-development';
    }
    
    // Business & Tech
    if (tagStr.includes('startup') || tagStr.includes('business') || 
        tagStr.includes('product') || tagStr.includes('strategy') ||
        tagStr.includes('entrepreneurship')) {
      return 'business-tech';
    }
    
    // Cloud & DevOps
    if (tagStr.includes('cloud') || tagStr.includes('devops') || 
        tagStr.includes('aws') || tagStr.includes('kubernetes') ||
        tagStr.includes('docker') || tagStr.includes('ci/cd')) {
      return 'cloud-devops';
    }
    
    // Web Security
    if (tagStr.includes('security') || tagStr.includes('vulnerability') || 
        tagStr.includes('encryption') || tagStr.includes('owasp') ||
        tagStr.includes('privacy') || tagStr.includes('hack')) {
      return 'web-security';
    }
    
    // Software Development (default for dev-related content)
    if (tagStr.includes('development') || tagStr.includes('programming') ||
        tagStr.includes('code') || tagStr.includes('software')) {
      return 'software-development';
    }
    
    return defaultCategory || 'software-development';
  }
  
  displayArticles(filteredArticles = null) {
    const articlesToShow = filteredArticles || this.articles;
    
    if (!this.articlesGrid) return;
    
    if (articlesToShow.length === 0) {
      this.articlesGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
          <p style="color: #666; font-size: 1.1rem;">No articles found. Try adjusting your filters.</p>
        </div>
      `;
      if (this.resultsCount) {
        this.resultsCount.textContent = 'No articles found';
      }
      return;
    }
    
    // Update results count
    if (this.resultsCount) {
      this.resultsCount.textContent = `Showing ${articlesToShow.length} ${articlesToShow.length === 1 ? 'article' : 'articles'}`;
    }
    
    // Generate article cards
    this.articlesGrid.innerHTML = articlesToShow.map(article => this.createArticleCard(article)).join('');
    
    // Add click handlers for embedded reader
    this.attachCardClickHandlers();
    
    // Add animation to cards
    this.animateCards();
  }
  
  attachCardClickHandlers() {
    const cards = this.articlesGrid.querySelectorAll('.article-card');
    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        // Don't open reader if clicking on a link directly
        if (e.target.tagName === 'A' || e.target.closest('a')) {
          e.preventDefault();
          const link = e.target.tagName === 'A' ? e.target : e.target.closest('a');
          const url = link.getAttribute('href');
          const title = card.querySelector('.article-title').textContent.trim();
          
          if (window.articleReader) {
            window.articleReader.open(url, title);
          } else {
            // Fallback to opening in new tab
            window.open(url, '_blank');
          }
        }
      });
    });
  }
  
  createArticleCard(article) {
    const date = new Date(article.pubDate);
    const formattedDate = date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    const isoDate = date.toISOString().split('T')[0];
    
    // Determine category class
    const categoryClass = article.category.toLowerCase().replace(/\s+/g, '-');
    
    // Create article card HTML matching your existing format
    return `
      <article class="article-card" data-category="${article.category} ${article.tags.join(' ').toLowerCase()}" style="cursor: pointer;">
        <div class="article-image">
          ${article.thumbnail ? 
            `<img src="${article.thumbnail}" alt="${article.title}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;">` :
            `<div class="image-placeholder">
              <i class="${article.icon}"></i>
            </div>`
          }
        </div>
        <div class="article-content">
          <div class="article-meta">
            <span class="category ${categoryClass}">${this.capitalizeCategory(article.category)}</span>
            <time datetime="${isoDate}">${formattedDate}</time>
          </div>
          <h3 class="article-title">
            <a href="${article.link}" class="article-link">${article.title}</a>
          </h3>
          <p class="article-excerpt">
            ${article.description}
          </p>
          <div class="article-footer">
            <div class="article-stats">
              <span><i class="fas fa-clock"></i> ${article.readTime} min read</span>
              <span><i class="fas fa-book-open"></i> ${article.source}</span>
            </div>
            <a href="${article.link}" class="read-more-link">Read Article</a>
          </div>
        </div>
      </article>
    `;
  }
  
  capitalizeCategory(category) {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  setupEventListeners() {
    // Category filter
    if (this.categoryFilter) {
      this.categoryFilter.addEventListener('change', () => this.filterArticles());
    }
    
    // Search
    if (this.searchInput) {
      this.searchInput.addEventListener('input', () => this.filterArticles());
    }
  }
  
  filterArticles() {
    const searchTerm = this.searchInput ? this.searchInput.value.toLowerCase() : '';
    const selectedCategory = this.categoryFilter ? this.categoryFilter.value : 'all';
    
    const filtered = this.articles.filter(article => {
      // Category filter
      const categoryMatch = selectedCategory === 'all' || 
                           article.category === selectedCategory ||
                           article.tags.some(tag => tag.toLowerCase() === selectedCategory);
      
      // Search filter
      const searchMatch = !searchTerm || 
                         article.title.toLowerCase().includes(searchTerm) ||
                         article.description.toLowerCase().includes(searchTerm) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm));
      
      return categoryMatch && searchMatch;
    });
    
    this.displayArticles(filtered);
  }
  
  animateCards() {
    const cards = this.articlesGrid.querySelectorAll('.article-card');
    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }
  
  // Public method to refresh feed
  async refresh() {
    this.showLoadingState();
    await this.fetchAllFeeds();
    this.displayArticles();
  }
}

// Embedded Article Reader
class ArticleReader {
  constructor() {
    this.modal = document.getElementById('articleReaderModal');
    this.readerContent = document.getElementById('readerContent');
    this.readerTitle = document.getElementById('readerTitle');
    this.closeBtn = document.getElementById('closeReader');
    this.openOriginalBtn = document.getElementById('openOriginal');
    this.currentUrl = '';
    
    this.init();
  }
  
  init() {
    // Close modal when clicking close button
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }
    
    // Close modal when clicking outside
    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) {
          this.close();
        }
      });
    }
    
    // Open original article in new tab
    if (this.openOriginalBtn) {
      this.openOriginalBtn.addEventListener('click', () => {
        if (this.currentUrl) {
          window.open(this.currentUrl, '_blank');
        }
      });
    }
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.close();
      }
    });
  }
  
  open(url, title) {
    this.currentUrl = url;
    this.readerTitle.textContent = title || 'Article Reader';
    
    // Show loading state
    this.readerContent.innerHTML = `
      <div class="reader-loading">
        <div class="spinner"></div>
        <p>Loading article...</p>
      </div>
    `;
    
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Load article in iframe
    setTimeout(() => {
      this.readerContent.innerHTML = `<iframe src="${url}" title="${title}" sandbox="allow-same-origin allow-scripts allow-popups allow-forms"></iframe>`;
    }, 500);
  }
  
  close() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
    this.currentUrl = '';
    
    // Clear iframe after animation
    setTimeout(() => {
      this.readerContent.innerHTML = `
        <div class="reader-loading">
          <div class="spinner"></div>
          <p>Loading article...</p>
        </div>
      `;
    }, 300);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.blogFeed = new BlogFeedManager();
    window.articleReader = new ArticleReader();
  });
} else {
  window.blogFeed = new BlogFeedManager();
  window.articleReader = new ArticleReader();
}

// Add spinner animation styles if not already present
if (!document.querySelector('#spinner-styles')) {
  const style = document.createElement('style');
  style.id = 'spinner-styles';
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}
