/**
 * Image Gallery & Lightbox System
 * Click to zoom, gallery mode, swipe navigation, captions, download
 */

class ImageGallery {
    constructor() {
        this.images = [];
        this.currentIndex = 0;
        this.lightbox = null;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.init();
    }

    init() {
        this.findImages();
        this.createLightbox();
        this.attachImageListeners();
        this.attachKeyboardListeners();
    }

    findImages() {
        // Find all images that should be zoomable
        const selectors = [
            'article img',
            '.blog-article-content img',
            '.embedded-reader-content img',
            '.project-image',
            '[data-lightbox]',
            'img[data-zoom="true"]'
        ];

        const imageElements = document.querySelectorAll(selectors.join(', '));
        
        this.images = Array.from(imageElements)
            .filter(img => !img.closest('.no-lightbox') && !img.classList.contains('no-zoom'))
            .map((img, index) => ({
                element: img,
                src: img.src,
                fullSrc: img.dataset.fullSrc || img.src,
                caption: img.alt || img.title || img.dataset.caption || '',
                index: index,
                gallery: img.dataset.gallery || 'default'
            }));
    }

    createLightbox() {
        const lightbox = document.createElement('div');
        lightbox.className = 'image-lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-overlay"></div>
            
            <div class="lightbox-content">
                <button class="lightbox-close" aria-label="Close lightbox">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                
                <button class="lightbox-prev" aria-label="Previous image">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>
                
                <button class="lightbox-next" aria-label="Next image">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
                
                <div class="lightbox-image-container">
                    <img class="lightbox-image" src="" alt="" />
                    <div class="lightbox-loading">
                        <div class="loading-spinner"></div>
                    </div>
                </div>
                
                <div class="lightbox-caption-container">
                    <p class="lightbox-caption"></p>
                    <div class="lightbox-meta">
                        <span class="lightbox-counter">1 / 1</span>
                        <div class="lightbox-actions">
                            <button class="lightbox-action-btn zoom-btn" title="Toggle zoom">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                    <line x1="11" y1="8" x2="11" y2="14"></line>
                                    <line x1="8" y1="11" x2="14" y2="11"></line>
                                </svg>
                            </button>
                            <button class="lightbox-action-btn download-btn" title="Download image">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                            </button>
                            <button class="lightbox-action-btn share-btn" title="Share image">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="18" cy="5" r="3"></circle>
                                    <circle cx="6" cy="12" r="3"></circle>
                                    <circle cx="18" cy="19" r="3"></circle>
                                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="lightbox-thumbnails">
                    <div class="thumbnails-container"></div>
                </div>
            </div>
        `;

        document.body.appendChild(lightbox);
        this.lightbox = lightbox;

        // Attach lightbox event listeners
        this.attachLightboxListeners();
    }

    attachImageListeners() {
        this.images.forEach((img, index) => {
            img.element.style.cursor = 'zoom-in';
            img.element.classList.add('zoomable-image');
            
            img.element.addEventListener('click', (e) => {
                e.preventDefault();
                this.openLightbox(index);
            });

            // Add hover effect
            img.element.addEventListener('mouseenter', () => {
                img.element.classList.add('zoom-hover');
            });

            img.element.addEventListener('mouseleave', () => {
                img.element.classList.remove('zoom-hover');
            });
        });
    }

    attachLightboxListeners() {
        // Close button
        this.lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
            this.closeLightbox();
        });

        // Overlay click
        this.lightbox.querySelector('.lightbox-overlay').addEventListener('click', () => {
            this.closeLightbox();
        });

        // Navigation
        this.lightbox.querySelector('.lightbox-prev').addEventListener('click', () => {
            this.showPrevious();
        });

        this.lightbox.querySelector('.lightbox-next').addEventListener('click', () => {
            this.showNext();
        });

        // Action buttons
        this.lightbox.querySelector('.zoom-btn').addEventListener('click', () => {
            this.toggleZoom();
        });

        this.lightbox.querySelector('.download-btn').addEventListener('click', () => {
            this.downloadImage();
        });

        this.lightbox.querySelector('.share-btn').addEventListener('click', () => {
            this.shareImage();
        });

        // Touch events for swipe
        const imageContainer = this.lightbox.querySelector('.lightbox-image-container');
        imageContainer.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
        });

        imageContainer.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].clientX;
            this.handleSwipe();
        });

        // Mouse wheel zoom
        imageContainer.addEventListener('wheel', (e) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                this.handleWheelZoom(e);
            }
        });
    }

    attachKeyboardListeners() {
        document.addEventListener('keydown', (e) => {
            if (!this.lightbox.classList.contains('active')) return;

            switch (e.key) {
                case 'Escape':
                    this.closeLightbox();
                    break;
                case 'ArrowLeft':
                    this.showPrevious();
                    break;
                case 'ArrowRight':
                    this.showNext();
                    break;
                case ' ':
                    e.preventDefault();
                    this.toggleZoom();
                    break;
            }
        });
    }

    openLightbox(index) {
        this.currentIndex = index;
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        this.loadImage(index);
        this.updateThumbnails();
        this.updateCounter();
        this.updateNavigation();
    }

    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset zoom
        const img = this.lightbox.querySelector('.lightbox-image');
        img.style.transform = 'scale(1)';
        img.classList.remove('zoomed');
    }

    loadImage(index) {
        const imageData = this.images[index];
        const img = this.lightbox.querySelector('.lightbox-image');
        const caption = this.lightbox.querySelector('.lightbox-caption');
        const loading = this.lightbox.querySelector('.lightbox-loading');

        // Show loading
        loading.style.display = 'flex';
        img.style.opacity = '0';

        // Load image
        const newImg = new Image();
        newImg.onload = () => {
            img.src = imageData.fullSrc;
            img.alt = imageData.caption;
            caption.textContent = imageData.caption;
            
            loading.style.display = 'none';
            img.style.opacity = '1';
        };
        newImg.onerror = () => {
            loading.style.display = 'none';
            caption.textContent = 'Failed to load image';
        };
        newImg.src = imageData.fullSrc;
    }

    showPrevious() {
        if (this.images.length <= 1) return;
        
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.loadImage(this.currentIndex);
        this.updateCounter();
        this.updateThumbnails();
        this.updateNavigation();
    }

    showNext() {
        if (this.images.length <= 1) return;
        
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.loadImage(this.currentIndex);
        this.updateCounter();
        this.updateThumbnails();
        this.updateNavigation();
    }

    updateCounter() {
        const counter = this.lightbox.querySelector('.lightbox-counter');
        counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
    }

    updateNavigation() {
        const prevBtn = this.lightbox.querySelector('.lightbox-prev');
        const nextBtn = this.lightbox.querySelector('.lightbox-next');

        if (this.images.length <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'flex';
            nextBtn.style.display = 'flex';
        }
    }

    updateThumbnails() {
        const container = this.lightbox.querySelector('.thumbnails-container');
        
        if (this.images.length <= 1) {
            container.style.display = 'none';
            return;
        }

        container.innerHTML = this.images.map((img, index) => `
            <div class="thumbnail ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <img src="${img.src}" alt="${img.caption}" />
            </div>
        `).join('');

        // Attach click listeners
        container.querySelectorAll('.thumbnail').forEach(thumb => {
            thumb.addEventListener('click', () => {
                const index = parseInt(thumb.dataset.index);
                this.currentIndex = index;
                this.loadImage(index);
                this.updateCounter();
                this.updateThumbnails();
            });
        });

        // Scroll active thumbnail into view
        const activeThumb = container.querySelector('.thumbnail.active');
        if (activeThumb) {
            activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }

    toggleZoom() {
        const img = this.lightbox.querySelector('.lightbox-image');
        const isZoomed = img.classList.toggle('zoomed');
        
        if (isZoomed) {
            img.style.transform = 'scale(2)';
            img.style.cursor = 'zoom-out';
        } else {
            img.style.transform = 'scale(1)';
            img.style.cursor = 'zoom-in';
        }
    }

    handleWheelZoom(e) {
        const img = this.lightbox.querySelector('.lightbox-image');
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        
        let currentScale = parseFloat(img.dataset.scale || 1);
        currentScale = Math.max(1, Math.min(3, currentScale + delta));
        
        img.dataset.scale = currentScale;
        img.style.transform = `scale(${currentScale})`;
    }

    downloadImage() {
        const imageData = this.images[this.currentIndex];
        const link = document.createElement('a');
        link.href = imageData.fullSrc;
        link.download = `image-${this.currentIndex + 1}.jpg`;
        link.click();
    }

    async shareImage() {
        const imageData = this.images[this.currentIndex];
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: imageData.caption || 'Image',
                    text: imageData.caption || 'Check out this image',
                    url: window.location.href
                });
            } catch (err) {
                console.log('Share cancelled or failed');
            }
        } else {
            // Fallback: copy link
            navigator.clipboard.writeText(window.location.href);
            this.showToast('Link copied to clipboard');
        }
    }

    handleSwipe() {
        const diff = this.touchStartX - this.touchEndX;
        const threshold = 50;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.showNext();
            } else {
                this.showPrevious();
            }
        }
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'lightbox-toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.imageGallery = new ImageGallery();
    });
} else {
    window.imageGallery = new ImageGallery();
}
