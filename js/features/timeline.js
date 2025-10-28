// Timeline Functionality
class Timeline {
  constructor() {
    this.container = document.getElementById('timelineContainer');
    this.items = document.querySelectorAll('.timeline-item');
    this.filterButtons = document.querySelectorAll('.filter-btn');
    this.viewButtons = document.querySelectorAll('.view-btn');
    this.currentFilter = 'all';
    this.currentView = 'vertical';
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.animateStats();
    this.initScrollAnimations();
    this.setupHoverEffects();
  }

  setupEventListeners() {
    // Filter buttons
    this.filterButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        this.filterTimeline(e.target.dataset.filter);
      });
    });

    // View toggle buttons
    this.viewButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        this.toggleView(e.target.dataset.view);
      });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        this.navigateTimeline(e.key === 'ArrowDown');
        e.preventDefault();
      }
    });

    // Intersection observer for animations
    this.observeTimelineItems();
  }

  filterTimeline(filter) {
    this.currentFilter = filter;
    
    // Update active button
    this.filterButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');

    // Filter items
    this.items.forEach(item => {
      const category = item.dataset.category;
      const shouldShow = filter === 'all' || category === filter;
      
      if (shouldShow) {
        item.style.display = 'flex';
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        // Animate in with delay
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, 100);
      } else {
        item.style.opacity = '0';
        item.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
          item.style.display = 'none';
        }, 300);
      }
    });

    // Update item count
    this.updateItemCount();
  }

  toggleView(view) {
    this.currentView = view;
    
    // Update active button
    this.viewButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-view="${view}"]`).classList.add('active');

    // Toggle timeline layout
    this.container.classList.remove('horizontal-view', 'vertical-view');
    this.container.classList.add(`${view}-view`);

    // Re-animate items for new layout
    this.items.forEach((item, index) => {
      item.style.animationDelay = `${index * 0.1}s`;
      item.classList.add('view-transition');
      
      setTimeout(() => {
        item.classList.remove('view-transition');
      }, 600);
    });
  }

  navigateTimeline(down) {
    const visibleItems = Array.from(this.items).filter(item => 
      item.style.display !== 'none' && getComputedStyle(item).display !== 'none'
    );
    
    const currentIndex = visibleItems.findIndex(item => 
      item.classList.contains('focused')
    );
    
    let newIndex;
    if (currentIndex === -1) {
      newIndex = down ? 0 : visibleItems.length - 1;
    } else {
      newIndex = down 
        ? Math.min(currentIndex + 1, visibleItems.length - 1)
        : Math.max(currentIndex - 1, 0);
    }

    // Remove focus from all items
    visibleItems.forEach(item => item.classList.remove('focused'));
    
    // Add focus to new item
    const newFocusedItem = visibleItems[newIndex];
    if (newFocusedItem) {
      newFocusedItem.classList.add('focused');
      newFocusedItem.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }

  animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.target);
          this.countUp(entry.target, target);
          observer.unobserve(entry.target);
        }
      });
    });

    stats.forEach(stat => observer.observe(stat));
  }

  countUp(element, target) {
    let current = 0;
    const increment = target / 60; // 60 frames for smooth animation
    
    const timer = setInterval(() => {
      current += increment;
      element.textContent = Math.floor(current);
      
      if (current >= target) {
        element.textContent = target;
        clearInterval(timer);
        
        // Add completed animation class
        element.parentElement.classList.add('stat-completed');
      }
    }, 16); // ~60fps
  }

  initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          
          // Add staggered animation for timeline items
          if (entry.target.classList.contains('timeline-item')) {
            const index = Array.from(this.items).indexOf(entry.target);
            entry.target.style.animationDelay = `${index * 0.2}s`;
          }
        }
      });
    }, { threshold: 0.2 });

    this.items.forEach(item => observer.observe(item));
  }

  observeTimelineItems() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const item = entry.target;
          const content = item.querySelector('.timeline-content');
          const marker = item.querySelector('.timeline-marker');
          
          // Animate marker
          marker.classList.add('marker-active');
          
          // Animate content based on side
          const isLeft = content.classList.contains('slide-in-left');
          content.style.transform = 'translateX(0)';
          content.style.opacity = '1';
          
          // Add ripple effect to marker
          this.addRippleEffect(marker);
        }
      });
    }, { 
      threshold: 0.3,
      rootMargin: '-50px 0px'
    });

    this.items.forEach(item => observer.observe(item));
  }

  addRippleEffect(marker) {
    const ripple = document.createElement('div');
    ripple.className = 'marker-ripple';
    marker.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 1000);
  }

  setupHoverEffects() {
    this.items.forEach(item => {
      const content = item.querySelector('.timeline-content');
      
      item.addEventListener('mouseenter', () => {
        content.classList.add('content-hover');
        this.showAdditionalInfo(item);
      });
      
      item.addEventListener('mouseleave', () => {
        content.classList.remove('content-hover');
        this.hideAdditionalInfo(item);
      });
    });
  }

  showAdditionalInfo(item) {
    const details = item.querySelector('.timeline-details, .timeline-skills, .timeline-achievements');
    if (details) {
      details.style.maxHeight = details.scrollHeight + 'px';
      details.style.opacity = '1';
    }
  }

  hideAdditionalInfo(item) {
    const details = item.querySelector('.timeline-details, .timeline-skills, .timeline-achievements');
    if (details) {
      details.style.maxHeight = '0';
      details.style.opacity = '0';
    }
  }

  updateItemCount() {
    const visibleCount = Array.from(this.items).filter(item => 
      item.style.display !== 'none' && getComputedStyle(item).display !== 'none'
    ).length;
    
    // Update filter button text to show count
    const activeButton = document.querySelector('.filter-btn.active');
    const originalText = activeButton.textContent.split('(')[0].trim();
    activeButton.textContent = `${originalText} (${visibleCount})`;
  }

  // Export timeline data
  exportTimeline() {
    const timelineData = Array.from(this.items).map(item => {
      return {
        date: item.querySelector('.timeline-date').textContent,
        title: item.querySelector('h3').textContent,
        description: item.querySelector('p').textContent,
        category: item.dataset.category,
        year: item.dataset.year
      };
    });
    
    const dataStr = JSON.stringify(timelineData, null, 2);
    const dataBlob = new Blob([dataStr], {type:'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'timeline-data.json';
    link.click();
  }

  // Search timeline
  searchTimeline(query) {
    const searchResults = Array.from(this.items).filter(item => {
      const text = item.textContent.toLowerCase();
      return text.includes(query.toLowerCase());
    });
    
    // Hide all items first
    this.items.forEach(item => {
      item.style.display = 'none';
    });
    
    // Show matching items
    searchResults.forEach(item => {
      item.style.display = 'flex';
    });
    
    return searchResults.length;
  }
}

// Progress tracking for timeline
class TimelineProgress {
  constructor() {
    this.progressBar = this.createProgressBar();
    this.init();
  }

  createProgressBar() {
    const progressContainer = document.createElement('div');
    progressContainer.className = 'timeline-progress';
    progressContainer.innerHTML = `
      <div class="progress-track">
        <div class="progress-fill"></div>
      </div>
      <div class="progress-labels">
        <span class="progress-label start">Start</span>
        <span class="progress-label current">Current</span>
      </div>
    `;
    
    const timelineSection = document.querySelector('.timeline-section');
    timelineSection.insertBefore(progressContainer, timelineSection.firstChild);
    
    return progressContainer.querySelector('.progress-fill');
  }

  init() {
    window.addEventListener('scroll', () => {
      this.updateProgress();
    });
  }

  updateProgress() {
    const timelineContainer = document.getElementById('timelineContainer');
    const containerRect = timelineContainer.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    const scrollProgress = Math.max(0, Math.min(1, 
      (windowHeight - containerRect.top) / (windowHeight + containerRect.height)
    ));
    
    this.progressBar.style.width = `${scrollProgress * 100}%`;
  }
}

// Initialize timeline when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const timeline = new Timeline();
  const timelineProgress = new TimelineProgress();
  
  // Add search functionality
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Search timeline events...';
  searchInput.className = 'timeline-search';
  
  const controlsSection = document.querySelector('.timeline-controls .control-group');
  controlsSection.appendChild(searchInput);
  
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value;
    if (query.length > 0) {
      const results = timeline.searchTimeline(query);
      console.log(`Found ${results} matching events`);
    } else {
      timeline.filterTimeline(timeline.currentFilter);
    }
  });
  
  // Add export button
  const exportButton = document.createElement('button');
  exportButton.textContent = 'Export Timeline';
  exportButton.className = 'export-btn';
  exportButton.addEventListener('click', () => timeline.exportTimeline());
  
  const viewControls = document.querySelector('.view-controls');
  viewControls.appendChild(exportButton);
});

// Auto-update current year marker
function updateCurrentMarker() {
  const currentYear = new Date().getFullYear();
  const currentItems = document.querySelectorAll(`[data-year="${currentYear}"]`);
  
  currentItems.forEach(item => {
    const marker = item.querySelector('.timeline-marker');
    marker.classList.add('current-year');
  });
}

// Initialize current marker
updateCurrentMarker();