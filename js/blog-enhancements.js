/**
 * Blog Engagement & Polish Features
 * Includes: Reading time, Progress bar, TOC, Comments, Share enhancements
 */

class BlogEnhancements {
  constructor() {
    this.init();
  }

  init() {
    if (this.isBlogPage()) {
      this.initReadingTime();
      this.initReadingProgress();
      this.initTableOfContents();
      this.initShareEnhancements();
      this.initComments();
      this.initAuthorBio();
      this.initScrollAnimations();
      this.initPrintOptimization();
    }
  }

  isBlogPage() {
    return document.querySelector('.blog-article-content') || 
           document.querySelector('.embedded-reader-content');
  }

  /**
   * Reading Time Calculator
   */
  initReadingTime() {
    const articles = document.querySelectorAll('.blog-card, .embedded-reader-content');
    
    articles.forEach(article => {
      const content = article.querySelector('.blog-excerpt, .article-body') || article;
      const text = content.textContent || content.innerText;
      const wordCount = text.trim().split(/\s+/).length;
      const readingTime = Math.ceil(wordCount / 200); // Average reading speed: 200 words/min
      
      // Find or create reading time container
      let timeElement = article.querySelector('.reading-time');
      if (!timeElement) {
        timeElement = document.createElement('div');
        timeElement.className = 'reading-time';
        
        const metaSection = article.querySelector('.blog-meta, .article-meta');
        if (metaSection) {
          metaSection.appendChild(timeElement);
        } else {
          const header = article.querySelector('.blog-title, h2, h1');
          if (header) {
            header.insertAdjacentElement('afterend', timeElement);
          }
        }
      }
      
      timeElement.innerHTML = `
        <i class="fas fa-clock"></i>
        <span>${readingTime} min read</span>
      `;
      timeElement.setAttribute('title', `Approximately ${readingTime} minutes to read`);
    });
  }

  /**
   * Reading Progress Bar
   */
  initReadingProgress() {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar) {
      const bar = document.createElement('div');
      bar.id = 'reading-progress-bar';
      bar.className = 'reading-progress-bar';
      document.body.prepend(bar);
    }

    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      
      const bar = document.getElementById('reading-progress-bar') || document.getElementById('scroll-progress');
      if (bar) {
        bar.style.width = scrolled + '%';
      }
    });
  }

  /**
   * Table of Contents with Scroll Spy
   */
  initTableOfContents() {
    const content = document.querySelector('.embedded-reader-content, .blog-article-content');
    if (!content) return;

    const headings = content.querySelectorAll('h1, h2, h3, h4');
    if (headings.length < 3) return; // Only show TOC if there are enough headings

    // Create TOC container
    const tocContainer = document.createElement('div');
    tocContainer.className = 'table-of-contents';
    tocContainer.innerHTML = `
      <div class="toc-header">
        <h3>Table of Contents</h3>
        <button class="toc-toggle" aria-label="Toggle table of contents">
          <i class="fas fa-chevron-up"></i>
        </button>
      </div>
      <nav class="toc-nav" aria-label="Table of contents">
        <ul class="toc-list"></ul>
      </nav>
    `;

    const tocList = tocContainer.querySelector('.toc-list');
    
    // Generate TOC items
    headings.forEach((heading, index) => {
      const id = heading.id || `heading-${index}`;
      heading.id = id;
      
      const level = parseInt(heading.tagName.substring(1));
      const listItem = document.createElement('li');
      listItem.className = `toc-item toc-level-${level}`;
      listItem.innerHTML = `
        <a href="#${id}" class="toc-link" data-heading="${id}">
          ${heading.textContent}
        </a>
      `;
      
      tocList.appendChild(listItem);
    });

    // Insert TOC after the first paragraph or at the start of content
    const firstPara = content.querySelector('p');
    if (firstPara) {
      firstPara.insertAdjacentElement('afterend', tocContainer);
    } else {
      content.prepend(tocContainer);
    }

    // TOC toggle functionality
    const tocToggle = tocContainer.querySelector('.toc-toggle');
    const tocNav = tocContainer.querySelector('.toc-nav');
    
    tocToggle.addEventListener('click', () => {
      tocContainer.classList.toggle('toc-collapsed');
      const isCollapsed = tocContainer.classList.contains('toc-collapsed');
      tocToggle.setAttribute('aria-expanded', !isCollapsed);
      tocToggle.querySelector('i').className = isCollapsed ? 'fas fa-chevron-down' : 'fas fa-chevron-up';
    });

    // Smooth scroll for TOC links
    tocList.querySelectorAll('.toc-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Update URL without scrolling
          history.pushState(null, null, `#${targetId}`);
        }
      });
    });

    // Scroll spy - highlight current section
    this.initScrollSpy(headings, tocList);
  }

  initScrollSpy(headings, tocList) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          // Remove active class from all links
          tocList.querySelectorAll('.toc-link').forEach(link => {
            link.classList.remove('active');
          });
          // Add active class to current link
          const activeLink = tocList.querySelector(`[data-heading="${id}"]`);
          if (activeLink) {
            activeLink.classList.add('active');
          }
        }
      });
    }, observerOptions);

    headings.forEach(heading => observer.observe(heading));
  }

  /**
   * Enhanced Share Functionality
   */
  initShareEnhancements() {
    // Add copy link to clipboard
    this.addCopyLinkButton();
    
    // Add click-to-tweet for blockquotes
    this.addClickToTweet();
    
    // Add WhatsApp share
    this.addWhatsAppShare();
    
    // Add QR code generator
    this.addQRCodeButton();
  }

  addCopyLinkButton() {
    const shareContainers = document.querySelectorAll('.share-buttons, .blog-actions');
    
    shareContainers.forEach(container => {
      if (container.querySelector('.copy-link-btn')) return;
      
      const copyBtn = document.createElement('button');
      copyBtn.className = 'share-option copy-link-btn';
      copyBtn.innerHTML = `
        <i class="fas fa-link"></i>
        <span>Copy Link</span>
      `;
      copyBtn.setAttribute('aria-label', 'Copy link to clipboard');
      
      copyBtn.addEventListener('click', async () => {
        const url = window.location.href;
        try {
          await navigator.clipboard.writeText(url);
          this.showToast('Link copied to clipboard!', 'success');
          copyBtn.innerHTML = `
            <i class="fas fa-check"></i>
            <span>Copied!</span>
          `;
          setTimeout(() => {
            copyBtn.innerHTML = `
              <i class="fas fa-link"></i>
              <span>Copy Link</span>
            `;
          }, 2000);
        } catch (err) {
          this.showToast('Failed to copy link', 'error');
        }
      });
      
      container.appendChild(copyBtn);
    });
  }

  addClickToTweet() {
    const blockquotes = document.querySelectorAll('blockquote');
    
    blockquotes.forEach(quote => {
      if (quote.querySelector('.tweet-quote-btn')) return;
      
      const tweetBtn = document.createElement('button');
      tweetBtn.className = 'tweet-quote-btn';
      tweetBtn.innerHTML = `
        <i class="fab fa-twitter"></i>
        <span>Tweet this</span>
      `;
      tweetBtn.setAttribute('aria-label', 'Share quote on Twitter');
      
      tweetBtn.addEventListener('click', () => {
        const text = quote.textContent.trim();
        const url = window.location.href;
        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        window.open(tweetUrl, '_blank', 'width=550,height=420');
      });
      
      quote.style.position = 'relative';
      quote.appendChild(tweetBtn);
    });
  }

  addWhatsAppShare() {
    const shareContainers = document.querySelectorAll('.share-buttons, .blog-actions');
    
    shareContainers.forEach(container => {
      if (container.querySelector('.whatsapp-share-btn')) return;
      
      const whatsappBtn = document.createElement('button');
      whatsappBtn.className = 'share-option whatsapp-share-btn';
      whatsappBtn.innerHTML = `
        <i class="fab fa-whatsapp"></i>
        <span>WhatsApp</span>
      `;
      whatsappBtn.setAttribute('aria-label', 'Share on WhatsApp');
      
      whatsappBtn.addEventListener('click', () => {
        const url = window.location.href;
        const title = document.title;
        const text = `${title} - ${url}`;
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, '_blank');
      });
      
      container.appendChild(whatsappBtn);
    });
  }

  addQRCodeButton() {
    const shareContainers = document.querySelectorAll('.share-buttons, .blog-actions');
    
    shareContainers.forEach(container => {
      if (container.querySelector('.qr-code-btn')) return;
      
      const qrBtn = document.createElement('button');
      qrBtn.className = 'share-option qr-code-btn';
      qrBtn.innerHTML = `
        <i class="fas fa-qrcode"></i>
        <span>QR Code</span>
      `;
      qrBtn.setAttribute('aria-label', 'Generate QR code');
      
      qrBtn.addEventListener('click', () => {
        this.showQRCodeModal();
      });
      
      container.appendChild(qrBtn);
    });
  }

  showQRCodeModal() {
    const url = window.location.href;
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
    
    const modal = document.createElement('div');
    modal.className = 'qr-modal';
    modal.innerHTML = `
      <div class="qr-modal-content">
        <button class="qr-modal-close" aria-label="Close QR code modal">
          <i class="fas fa-times"></i>
        </button>
        <h3>Scan to view on mobile</h3>
        <img src="${qrApiUrl}" alt="QR Code for current page" class="qr-code-image">
        <p class="qr-url">${url}</p>
        <button class="download-qr-btn">
          <i class="fas fa-download"></i>
          Download QR Code
        </button>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal
    modal.querySelector('.qr-modal-close').addEventListener('click', () => {
      modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
    
    // Download QR code
    modal.querySelector('.download-qr-btn').addEventListener('click', () => {
      const link = document.createElement('a');
      link.href = qrApiUrl;
      link.download = 'qr-code.png';
      link.click();
    });
    
    // Show modal
    setTimeout(() => modal.classList.add('show'), 10);
  }

  /**
   * Comments System (Utterances - GitHub Issues)
   */
  initComments() {
    const articleContent = document.querySelector('.embedded-reader-content, .blog-article-content');
    if (!articleContent) return;

    // Create comments container
    const commentsContainer = document.createElement('div');
    commentsContainer.className = 'comments-section';
    commentsContainer.innerHTML = `
      <div class="comments-header">
        <h3>
          <i class="fas fa-comments"></i>
          Comments & Discussion
        </h3>
        <p class="comments-subtitle">Share your thoughts and engage with the community</p>
      </div>
      <div id="utterances-container"></div>
    `;

    // Insert after article content
    articleContent.insertAdjacentElement('afterend', commentsContainer);

    // Load Utterances script
    const script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    script.setAttribute('repo', 'kpierre24/blog-comments'); // You'll need to create this repo
    script.setAttribute('issue-term', 'pathname');
    script.setAttribute('theme', 'github-dark');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;

    document.getElementById('utterances-container').appendChild(script);
  }

  /**
   * Author Bio Section
   */
  initAuthorBio() {
    const articleContent = document.querySelector('.embedded-reader-content, .blog-article-content');
    if (!articleContent) return;

    if (document.querySelector('.author-bio')) return;

    const authorBio = document.createElement('div');
    authorBio.className = 'author-bio';
    authorBio.innerHTML = `
      <div class="author-bio-content">
        <div class="author-avatar">
          <img src="../images/avatar.jpg" alt="Kendell Pierre" onerror="this.src='https://ui-avatars.com/api/?name=Kendell+Pierre&size=100&background=6366f1&color=fff'">
        </div>
        <div class="author-info">
          <h3>Written by Kendell Pierre</h3>
          <p class="author-title">Full-Stack Developer & Tech Enthusiast</p>
          <p class="author-description">
            Passionate about creating elegant solutions to complex problems. 
            Sharing insights on web development, programming best practices, and emerging technologies.
          </p>
          <div class="author-social">
            <a href="https://github.com/kpierre24" target="_blank" rel="noopener" aria-label="GitHub">
              <i class="fab fa-github"></i>
            </a>
            <a href="https://twitter.com/kentrini25" target="_blank" rel="noopener" aria-label="Twitter">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="mailto:kpierre24@gmail.com" aria-label="Email">
              <i class="fas fa-envelope"></i>
            </a>
          </div>
          <a href="../pages/about.html" class="author-link">
            More about me <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    `;

    // Insert before comments or at end of article
    const commentsSection = document.querySelector('.comments-section');
    if (commentsSection) {
      commentsSection.insertAdjacentElement('beforebegin', authorBio);
    } else {
      articleContent.insertAdjacentElement('afterend', authorBio);
    }
  }

  /**
   * Scroll Animations
   */
  initScrollAnimations() {
    const animateElements = document.querySelectorAll('.blog-card, .blog-article, .author-bio');
    
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animateElements.forEach(el => {
      el.classList.add('animate-on-scroll');
      observer.observe(el);
    });
  }

  /**
   * Print Optimization
   */
  initPrintOptimization() {
    // Add print button to articles
    const articles = document.querySelectorAll('.blog-article-header, .embedded-reader-header');
    
    articles.forEach(header => {
      if (header.querySelector('.print-btn')) return;
      
      const printBtn = document.createElement('button');
      printBtn.className = 'print-btn';
      printBtn.innerHTML = `
        <i class="fas fa-print"></i>
        <span>Print</span>
      `;
      printBtn.setAttribute('aria-label', 'Print article');
      
      printBtn.addEventListener('click', () => {
        window.print();
      });
      
      header.appendChild(printBtn);
    });

    // Optimize content for printing
    window.addEventListener('beforeprint', () => {
      document.body.classList.add('printing');
      this.showToast('Preparing print version...', 'info');
    });

    window.addEventListener('afterprint', () => {
      document.body.classList.remove('printing');
    });
  }

  /**
   * Toast notification helper
   */
  showToast(message, type = 'info') {
    // Check if toast container exists
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
      </div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new BlogEnhancements();
  });
} else {
  new BlogEnhancements();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BlogEnhancements;
}
