/**
 * Automatic Blog Feed Generator
 * Fetches articles from tech RSS feeds and displays them in the existing blog format
 */

class BlogFeedManager {
  constructor() {
    // Using AllOrigins as CORS proxy + direct RSS parsing
    // Fallback to corsproxy.io if AllOrigins fails
    this.corsProxies = [
      'https://api.allorigins.win/raw?url=',
      'https://corsproxy.io/?'
    ];
    this.currentProxyIndex = 0;
    
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
    // Try each CORS proxy until one works
    for (let proxyIndex = 0; proxyIndex < this.corsProxies.length; proxyIndex++) {
      try {
        const corsProxy = this.corsProxies[proxyIndex];
        
        // Fetch RSS feed through CORS proxy
        const response = await fetch(`${corsProxy}${encodeURIComponent(feedConfig.url)}`, {
          signal: AbortSignal.timeout(10000) // 10 second timeout
        });
        
        if (!response.ok) {
          console.warn(`Feed ${feedConfig.name} returned HTTP ${response.status} with proxy ${proxyIndex + 1}.`);
          continue; // Try next proxy
        }
        
        const xmlText = await response.text();
        
        // Check if response is actually XML/HTML, not an error page
        if (!xmlText.includes('<?xml') && !xmlText.includes('<rss') && !xmlText.includes('<feed')) {
          console.warn(`Feed ${feedConfig.name} returned invalid XML with proxy ${proxyIndex + 1}.`);
          continue; // Try next proxy
        }
        
        // Parse RSS/Atom XML
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        
        // Check for parsing errors
        const parseError = xmlDoc.querySelector('parsererror');
        if (parseError) {
          console.warn(`Feed ${feedConfig.name} XML parsing error with proxy ${proxyIndex + 1}.`);
          continue; // Try next proxy
        }
        
        // Parse items (works for both RSS and Atom)
        const items = this.parseItems(xmlDoc, feedConfig);
        
        if (items.length === 0) {
          console.warn(`Feed ${feedConfig.name} returned no items with proxy ${proxyIndex + 1}.`);
          continue; // Try next proxy
        }
        
        // Success! Return the items
        return items.slice(0, 10); // Limit to 10 items per feed
        
      } catch (error) {
        console.warn(`Feed ${feedConfig.name} failed with proxy ${proxyIndex + 1}:`, error.message);
        // Continue to next proxy
      }
    }
    
    // All proxies failed
    console.warn(`❌ Skipping ${feedConfig.name}: All CORS proxies failed`);
    return [];
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
      const articleId = card.dataset.articleId;
      
      // Like button handler
      const likeBtn = card.querySelector('.like-btn');
      likeBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleLike(articleId, likeBtn);
      });
      
      // Share button handler
      const shareBtn = card.querySelector('.share-btn');
      const shareMenu = card.querySelector('.share-menu');
      shareBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        // Close other open share menus
        document.querySelectorAll('.share-menu.active').forEach(menu => {
          if (menu !== shareMenu) menu.classList.remove('active');
        });
        shareMenu?.classList.toggle('active');
      });
      
      // Share options handlers
      const shareOptions = card.querySelectorAll('.share-option');
      shareOptions.forEach(option => {
        option.addEventListener('click', (e) => {
          e.stopPropagation();
          const shareType = option.dataset.share;
          const link = card.querySelector('.article-link');
          const url = link.getAttribute('data-article-url');
          const title = link.getAttribute('data-article-title');
          this.handleShare(shareType, url, title);
          shareMenu?.classList.remove('active');
        });
      });
      
      // Comment button handler
      const commentBtn = card.querySelector('.comment-btn');
      const commentSection = card.querySelector('.comment-section');
      commentBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        commentSection?.classList.toggle('active');
      });
      
      // Comment input handler
      const commentInput = card.querySelector('.comment-input');
      const commentSubmit = card.querySelector('.comment-submit');
      
      commentInput?.addEventListener('input', (e) => {
        e.stopPropagation();
        commentSubmit.disabled = !e.target.value.trim();
      });
      
      commentInput?.addEventListener('click', (e) => e.stopPropagation());
      
      commentInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !commentSubmit.disabled) {
          e.preventDefault();
          this.handleComment(articleId, commentInput, card);
        }
      });
      
      commentSubmit?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleComment(articleId, commentInput, card);
      });
      
      // Card click handler for article reader
      card.addEventListener('click', (e) => {
        // Don't open reader if clicking on action buttons, inputs, or footer area
        if (e.target.closest('.action-btn') || 
            e.target.closest('.action-buttons') ||
            e.target.closest('.article-actions') ||
            e.target.closest('.comment-input') || 
            e.target.closest('.comment-submit') ||
            e.target.closest('.comment-section') ||
            e.target.closest('.share-menu')) {
          return;
        }
        
        // Only open reader if clicking on title link or read more link
        if (e.target.tagName === 'A' && (e.target.classList.contains('article-link') || e.target.classList.contains('read-more-link'))) {
          e.preventDefault();
          const url = e.target.getAttribute('data-article-url') || e.target.getAttribute('href');
          const title = e.target.getAttribute('data-article-title') || card.querySelector('.article-title').textContent.trim();
          
          if (window.articleReader) {
            window.articleReader.open(url, title);
          } else {
            window.open(url, '_blank');
          }
          return;
        }
        
        // Open reader if clicking on the card itself (but not footer)
        if (e.target.closest('.article-image') || e.target.closest('.article-title') || e.target.closest('.article-excerpt') || e.target.closest('.article-meta')) {
          const link = card.querySelector('.article-link');
          const url = link.getAttribute('data-article-url') || link.getAttribute('href');
          const title = link.getAttribute('data-article-title') || card.querySelector('.article-title').textContent.trim();
          
          if (window.articleReader) {
            window.articleReader.open(url, title);
          }
        }
      });
    });
    
    // Close share menus when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.share-btn') && !e.target.closest('.share-menu')) {
        document.querySelectorAll('.share-menu.active').forEach(menu => {
          menu.classList.remove('active');
        });
      }
    });
  }
  
  handleLike(articleId, button) {
    const interactions = this.getArticleInteractions(articleId);
    interactions.liked = !interactions.liked;
    interactions.likes += interactions.liked ? 1 : -1;
    
    this.saveArticleInteractions(articleId, interactions);
    
    // Update UI
    const icon = button.querySelector('i');
    const count = button.querySelector('.action-count');
    
    if (interactions.liked) {
      button.classList.add('liked');
      icon.className = 'fas fa-heart';
      this.showToast('Added to liked articles!', 'success');
    } else {
      button.classList.remove('liked');
      icon.className = 'far fa-heart';
    }
    
    count.textContent = interactions.likes;
  }
  
  handleShare(type, url, title) {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    
    let shareUrl = '';
    
    switch(type) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        window.open(shareUrl, '_blank', 'width=600,height=400');
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        window.open(shareUrl, '_blank', 'width=600,height=400');
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        window.open(shareUrl, '_blank', 'width=600,height=400');
        break;
      case 'copy':
        navigator.clipboard.writeText(url).then(() => {
          this.showToast('Link copied to clipboard!', 'success');
        }).catch(() => {
          this.showToast('Failed to copy link', 'error');
        });
        break;
    }
  }
  
  handleComment(articleId, input, card) {
    const text = input.value.trim();
    if (!text) return;
    
    const interactions = this.getArticleInteractions(articleId);
    
    // Get author name from localStorage or prompt
    let authorName = localStorage.getItem('blog_author_name');
    if (!authorName) {
      authorName = prompt('Enter your name:') || 'Anonymous';
      localStorage.setItem('blog_author_name', authorName);
    }
    
    const comment = {
      author: authorName,
      text: text,
      timestamp: Date.now()
    };
    
    interactions.comments.unshift(comment);
    this.saveArticleInteractions(articleId, interactions);
    
    // Update UI
    const commentsList = card.querySelector('.comments-list');
    commentsList.insertAdjacentHTML('afterbegin', this.createCommentHTML(comment));
    
    // Update comment count
    const commentCount = card.querySelector('.comment-btn .action-count');
    commentCount.textContent = interactions.comments.length;
    
    // Clear input
    input.value = '';
    card.querySelector('.comment-submit').disabled = true;
    
    this.showToast('Comment added!', 'success');
  }
  
  showToast(message, type = 'success') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
      existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
      <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
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
    
    // Generate unique article ID for interactions
    const articleId = btoa(article.link).replace(/[^a-zA-Z0-9]/g, '').substring(0, 20);
    
    // Get stored interactions from localStorage
    const interactions = this.getArticleInteractions(articleId);
    
    // Create article card HTML matching your existing format
    return `
      <article class="article-card" data-category="${article.category} ${article.tags.join(' ').toLowerCase()}" data-article-id="${articleId}">
        <div class="article-image" style="cursor: pointer;">
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
          <h3 class="article-title" style="cursor: pointer;">
            <a href="${article.link}" class="article-link" data-article-url="${article.link}" data-article-title="${this.escapeHtml(article.title)}">${article.title}</a>
          </h3>
          <p class="article-excerpt" style="cursor: pointer;">
            ${article.description}
          </p>
          <div class="article-footer">
            <div class="article-stats">
              <span><i class="fas fa-clock"></i> ${article.readTime} min read</span>
              <span><i class="fas fa-book-open"></i> ${article.source}</span>
            </div>
            
            <div class="article-actions">
              <div class="action-buttons">
                <button class="action-btn like-btn ${interactions.liked ? 'liked' : ''}" data-action="like" title="Like article">
                  <i class="${interactions.liked ? 'fas' : 'far'} fa-heart"></i>
                  <span class="action-count">${interactions.likes}</span>
                </button>
                
                <div style="position: relative;">
                  <button class="action-btn share-btn" data-action="share" title="Share article">
                    <i class="fas fa-share-alt"></i>
                  </button>
                  <div class="share-menu">
                    <button class="share-option twitter" data-share="twitter">
                      <i class="fab fa-twitter"></i>
                      <span>Twitter</span>
                    </button>
                    <button class="share-option facebook" data-share="facebook">
                      <i class="fab fa-facebook"></i>
                      <span>Facebook</span>
                    </button>
                    <button class="share-option linkedin" data-share="linkedin">
                      <i class="fab fa-linkedin"></i>
                      <span>LinkedIn</span>
                    </button>
                    <button class="share-option copy" data-share="copy">
                      <i class="fas fa-link"></i>
                      <span>Copy Link</span>
                    </button>
                  </div>
                </div>
                
                <button class="action-btn comment-btn" data-action="comment" title="View comments">
                  <i class="far fa-comment"></i>
                  <span class="action-count">${interactions.comments.length}</span>
                </button>
              </div>
              
              <a href="${article.link}" class="read-more-link" data-article-url="${article.link}" data-article-title="${this.escapeHtml(article.title)}">Read Article</a>
            </div>
            
            <div class="comment-section" data-article-id="${articleId}">
              <div class="comment-input-wrapper">
                <input type="text" class="comment-input" placeholder="Add a comment..." maxlength="200">
                <button class="comment-submit" disabled>Post</button>
              </div>
              <div class="comments-list">
                ${interactions.comments.map(comment => this.createCommentHTML(comment)).join('')}
              </div>
            </div>
          </div>
        </div>
      </article>
    `;
  }
  
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  createCommentHTML(comment) {
    const timeAgo = this.getTimeAgo(comment.timestamp);
    const initial = comment.author.charAt(0).toUpperCase();
    
    return `
      <div class="comment-item">
        <div class="comment-avatar">${initial}</div>
        <div class="comment-content">
          <div class="comment-header">
            <span class="comment-author">${this.escapeHtml(comment.author)}</span>
            <span class="comment-time">${timeAgo}</span>
          </div>
          <p class="comment-text">${this.escapeHtml(comment.text)}</p>
        </div>
      </div>
    `;
  }
  
  getTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return `${Math.floor(seconds / 604800)}w ago`;
  }
  
  getArticleInteractions(articleId) {
    const stored = localStorage.getItem(`article_${articleId}`);
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      liked: false,
      likes: Math.floor(Math.random() * 50) + 5, // Random initial likes
      comments: []
    };
  }
  
  saveArticleInteractions(articleId, interactions) {
    localStorage.setItem(`article_${articleId}`, JSON.stringify(interactions));
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
