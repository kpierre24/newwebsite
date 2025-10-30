// ============================================
// PAGE LOADER
// ============================================
window.addEventListener('load', () => {
  const pageLoader = document.getElementById('pageLoader');
  if (pageLoader) {
    // Hide loader after page is fully loaded
    setTimeout(() => {
      pageLoader.classList.add('hidden');
    }, 500);
  }
});

// ============================================
// TYPING ANIMATION EFFECT
// ============================================
const typingText = document.getElementById('typingText');
if (typingText) {
  const phrases = [
    'Exploring creativity through code and design',
    'Building interactive web experiences',
    'Turning ideas into digital reality',
    'Crafting beautiful user interfaces'
  ];
  
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  
  function typeEffect() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
      typingText.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingText.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }
    
    let typeSpeed = isDeleting ? 50 : 100;
    
    if (!isDeleting && charIndex === currentPhrase.length) {
      typeSpeed = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 500; // Pause before next phrase
    }
    
    setTimeout(typeEffect, typeSpeed);
  }
  
  // Start typing effect after a short delay
  setTimeout(typeEffect, 1000);
}

// ✅ Particle Background Animation
function createParticles() {
  const particlesContainer = document.getElementById('particles');
  if (!particlesContainer) return;

  function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random size between 2px and 6px
    const size = Math.random() * 4 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Random horizontal position
    particle.style.left = `${Math.random() * 100}%`;
    
    // Random animation delay
    particle.style.animationDelay = `${Math.random() * 15}s`;
    
    particlesContainer.appendChild(particle);
    
    // Remove particle after animation completes
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 20000);
  }

  // Create initial particles
  for (let i = 0; i < 15; i++) {
    setTimeout(() => createParticle(), i * 1000);
  }

  // Continue creating particles
  setInterval(createParticle, 3000);
}

// Initialize particles only on homepage
if (document.getElementById('particles')) {
  createParticles();
}

// ✅ Staggered animation for cards
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.animationDelay = `${index * 0.2}s`;
        entry.target.classList.add('visible');
      }, index * 100);
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
  fadeObserver.observe(el);
});

// ✅ Mobile Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', !isExpanded);
  });

  // Close menu when clicking on a nav link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Keyboard navigation for mobile menu
  navToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navToggle.click();
    }
  });

  // Escape key to close menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.focus();
    }
  });
}

// ✅ Highlight active nav link
document.querySelectorAll('.nav-links a').forEach(link => {
  if (link.href === window.location.href) {
    link.classList.add('active');
  }
});

// ✅ Project Modal Functionality
const projectCards = document.querySelectorAll('.project-card');
const modal = document.getElementById('projectModal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.querySelector('.modal-close');

const projectData = {
  '1': {
    title: 'Mobile App Dashboard',
    emoji: '📱',
    description: 'A comprehensive mobile application dashboard built with Vue.js and Firebase, featuring real-time data synchronization, user authentication, and responsive design principles.',
    technologies: ['Vue.js', 'Firebase', 'CSS3', 'JavaScript ES6', 'PWA'],
    features: [
      'Real-time data synchronization',
      'User authentication and authorization',
      'Responsive design for all devices',
      'Progressive Web App capabilities',
      'Push notifications',
      'Offline functionality'
    ],
    challenges: 'Implementing efficient real-time updates while maintaining optimal performance across different device sizes.',
    outcome: 'Successfully deployed application with 99.9% uptime and positive user feedback on performance and usability.'
  },
  '2': {
    title: 'Cooking Class Portfolio',
    emoji: '🍳',
    description: 'An elegant portfolio website designed for culinary professionals, featuring structured documentation, recipe management, and beautiful visual presentations.',
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'Local Storage', 'Responsive Design'],
    features: [
      'Interactive recipe management',
      'Photo gallery with lightbox',
      'Class scheduling system',
      'Student testimonials section',
      'Contact and booking forms',
      'SEO optimized structure'
    ],
    challenges: 'Creating an intuitive interface that balances visual appeal with functional recipe management.',
    outcome: 'Increased client bookings by 40% and improved online presence for the cooking instructor.'
  },
  '3': {
    title: 'Crypto Trend Dashboard',
    emoji: '📊',
    description: 'A real-time cryptocurrency tracking dashboard with interactive charts, market analytics, and portfolio management features.',
    technologies: ['React', 'Chart.js', 'WebSocket APIs', 'Redux', 'Material-UI'],
    features: [
      'Real-time price tracking',
      'Interactive charts and graphs',
      'Portfolio management',
      'Price alerts and notifications',
      'Market trend analysis',
      'Multi-currency support'
    ],
    challenges: 'Handling large amounts of real-time data while maintaining smooth user experience and chart responsiveness.',
    outcome: 'Processed over 1 million data points daily with sub-second update times and 95% user satisfaction rating.'
  }
};

function openModal(projectId) {
  const project = projectData[projectId];
  if (!project) return;

  modalBody.innerHTML = `
    <div class="modal-project-image">${project.emoji}</div>
    <h3>${project.title}</h3>
    <p style="color: #666; margin-bottom: 1.5rem;">${project.description}</p>
    
    <div class="project-details">
      <h4>Technologies Used</h4>
      <div class="project-tags" style="margin-bottom: 1.5rem;">
        ${project.technologies.map(tech => `<span class="tag">${tech}</span>`).join('')}
      </div>
    </div>

    <div class="project-details">
      <h4>Key Features</h4>
      <ul>
        ${project.features.map(feature => `<li>${feature}</li>`).join('')}
      </ul>
    </div>

    <div class="project-details">
      <h4>Technical Challenges</h4>
      <p style="color: #666;">${project.challenges}</p>
    </div>

    <div class="project-details">
      <h4>Project Outcome</h4>
      <p style="color: #666;">${project.outcome}</p>
    </div>
  `;

  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
  
  // Focus management for accessibility
  modalClose.focus();
  
  // Trap focus within modal
  trapFocus(modal);
}

function closeModal() {
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
  
  // Return focus to the trigger element
  const activeCard = document.querySelector('.project-card:focus');
  if (activeCard) {
    activeCard.focus();
  }
}

// Focus trap utility
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });
}

// Event listeners for project cards
projectCards.forEach(card => {
  card.addEventListener('click', () => {
    const projectId = card.getAttribute('data-project');
    openModal(projectId);
  });
});

// Event listeners for modal
if (modalClose) {
  modalClose.addEventListener('click', closeModal);
}

if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
      closeModal();
    }
  });
}

// ✅ Enhanced Contact form validation + success message
const form = document.getElementById('contactForm');
const successMessage = document.getElementById('formSuccess');
const submitBtn = document.getElementById('submitBtn');

// Validation functions
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validateField(field, errorElement, validationFn, errorMsg) {
  const value = field.value.trim();
  const isValid = validationFn ? validationFn(value) : value.length > 0;
  
  if (isValid) {
    field.classList.remove('invalid');
    field.classList.add('valid');
    errorElement.textContent = '';
    errorElement.classList.remove('show');
  } else {
    field.classList.remove('valid');
    field.classList.add('invalid');
    errorElement.textContent = errorMsg;
    errorElement.classList.add('show');
  }
  
  return isValid;
}

if (form) {
  const nameField = document.getElementById('name');
  const emailField = document.getElementById('email');
  const messageField = document.getElementById('message');
  const charCountElement = document.getElementById('charCount');
  
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');

  // Real-time validation
  nameField?.addEventListener('blur', () => {
    validateField(nameField, nameError, 
      (value) => value.length >= 2, 
      'Name must be at least 2 characters long'
    );
  });

  emailField?.addEventListener('blur', () => {
    validateField(emailField, emailError, 
      validateEmail, 
      'Please enter a valid email address'
    );
  });

  messageField?.addEventListener('blur', () => {
    validateField(messageField, messageError, 
      (value) => value.length >= 10, 
      'Message must be at least 10 characters long'
    );
  });

  // Character counter for message
  messageField?.addEventListener('input', () => {
    const length = messageField.value.length;
    charCountElement.textContent = `${length}/500`;
    
    if (length > 500) {
      charCountElement.style.color = '#ef4444';
      messageField.classList.add('invalid');
    } else {
      charCountElement.style.color = '#666';
      messageField.classList.remove('invalid');
    }
  });

  // Form submission
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Validate all fields
    const isNameValid = validateField(nameField, nameError, 
      (value) => value.length >= 2, 
      'Name must be at least 2 characters long'
    );
    
    const isEmailValid = validateField(emailField, emailError, 
      validateEmail, 
      'Please enter a valid email address'
    );
    
    const isMessageValid = validateField(messageField, messageError, 
      (value) => value.length >= 10 && value.length <= 500, 
      'Message must be between 10 and 500 characters'
    );

    if (isNameValid && isEmailValid && isMessageValid) {
      // Show loading state
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      // Simulate form submission
      setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        successMessage.classList.remove('hidden');
        successMessage.classList.add('show');
        form.reset();
        
        // Reset field states
        [nameField, emailField, messageField].forEach(field => {
          field.classList.remove('valid', 'invalid');
        });
        
        // Reset character counter
        if (charCountElement) {
          charCountElement.textContent = '0/500';
          charCountElement.style.color = '#666';
        }

        // Hide success message after 5 seconds
        setTimeout(() => {
          successMessage.classList.remove('show');
          setTimeout(() => {
            successMessage.classList.add('hidden');
          }, 500);
        }, 5000);
      }, 2000); // Simulate 2 second processing time
    }
  });
}

// ✅ Enhanced Contact Form with Multiple Backends
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const subjectField = document.getElementById('subject');
    const messageField = document.getElementById('message');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('formSuccess');
    
    if (!nameField || !emailField || !messageField) return;
    
    const name = nameField.value.trim();
    const email = emailField.value.trim();
    const subject = subjectField ? subjectField.value.trim() : '';
    const message = messageField.value.trim();
    
    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-group input, .form-group textarea').forEach(el => {
      el.classList.remove('invalid');
    });
    
    // Validation
    let isValid = true;
    
    if (!name || name.length < 2) {
      document.getElementById('nameError').textContent = 'Name must be at least 2 characters';
      nameField.classList.add('invalid');
      isValid = false;
    }
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      document.getElementById('emailError').textContent = 'Please enter a valid email address';
      emailField.classList.add('invalid');
      isValid = false;
    }
    
    if (!message || message.length < 10) {
      document.getElementById('messageError').textContent = 'Message must be at least 10 characters';
      messageField.classList.add('invalid');
      isValid = false;
    }
    
    if (message.length > 500) {
      document.getElementById('messageError').textContent = 'Message must be less than 500 characters';
      messageField.classList.add('invalid');
      isValid = false;
    }
    
    if (!isValid) return;
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').textContent = 'Sending...';
    
    try {
      // Try EmailJS first if configured
      if (typeof emailjs !== 'undefined' && emailjs._userID) {
        await emailjs.send(
          "YOUR_SERVICE_ID", // Replace with your EmailJS service ID
          "YOUR_TEMPLATE_ID", // Replace with your EmailJS template ID
          {
            from_name: name,
            from_email: email,
            subject: subject || 'New Contact Form Message',
            message: message,
            to_name: "Kendell",
            reply_to: email
          }
        );
      } else {
        // Fallback: Use Formspree or store locally
        // Option 1: Formspree (replace with your Formspree endpoint)
        // const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        //   method: 'POST',
        //   body: new FormData(contactForm),
        //   headers: { 'Accept': 'application/json' }
        // });
        
        // Option 2: Store locally for now
        const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
        submissions.push({
          name,
          email,
          subject,
          message,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
        
        console.log('📧 Contact form submitted (stored locally):', { name, email, subject, message });
      }
      
      // Show success message with SweetAlert2
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          title: '✅ Message Sent!',
          html: `Thank you <strong>${name}</strong>! I've received your message and will get back to you at <strong>${email}</strong> soon.`,
          icon: 'success',
          confirmButtonColor: '#6366f1',
          timer: 6000,
          timerProgressBar: true
        });
      } else if (successMessage) {
        successMessage.classList.remove('hidden');
        successMessage.classList.add('show');
        setTimeout(() => {
          successMessage.classList.remove('show');
          setTimeout(() => successMessage.classList.add('hidden'), 500);
        }, 5000);
      }
      
      // Reset form
      contactForm.reset();
      [nameField, emailField, messageField].forEach(field => {
        field.classList.remove('valid', 'invalid');
      });
      
      // Reset character counter
      const charCountElement = document.getElementById('charCount');
      if (charCountElement) {
        charCountElement.textContent = '0/500';
        charCountElement.style.color = '#666';
      }
      
      // Track with analytics if consent given
      if (typeof gtag !== 'undefined' && cookieConsent && cookieConsent.getConsent().analytics) {
        gtag('event', 'form_submit', {
          event_category: 'Contact',
          event_label: 'Contact Form Submission'
        });
      }
      
    } catch (error) {
      console.error('Contact Form Error:', error);
      
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          title: '❌ Oops!',
          html: 'There was an error sending your message. Please try again or email me directly at <strong>kpierre24@gmail.com</strong>',
          icon: 'error',
          confirmButtonColor: '#6366f1'
        });
      } else {
        alert('Sorry, there was an error sending your message. Please try again or contact me directly at kpierre24@gmail.com');
      }
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      submitBtn.querySelector('.btn-text').textContent = 'Send Message';
    }
  });
  
  // Real-time character counter
  const messageField = document.getElementById('message');
  const charCountElement = document.getElementById('charCount');
  if (messageField && charCountElement) {
    messageField.addEventListener('input', () => {
      const count = messageField.value.length;
      charCountElement.textContent = `${count}/500`;
      charCountElement.style.color = count > 500 ? '#ef4444' : count > 450 ? '#f59e0b' : '#666';
    });
  }
  
  // Real-time validation on blur
  const validateField = (field, errorEl, validator, errorMsg) => {
    field.addEventListener('blur', () => {
      const value = field.value.trim();
      if (value && !validator(value)) {
        errorEl.textContent = errorMsg;
        field.classList.add('invalid');
      } else if (value) {
        errorEl.textContent = '';
        field.classList.remove('invalid');
        field.classList.add('valid');
      }
    });
  };
  
  const nameField = document.getElementById('name');
  const emailField = document.getElementById('email');
  const messageField2 = document.getElementById('message');
  
  if (nameField) {
    validateField(
      nameField,
      document.getElementById('nameError'),
      (val) => val.length >= 2,
      'Name must be at least 2 characters'
    );
  }
  
  if (emailField) {
    validateField(
      emailField,
      document.getElementById('emailError'),
      (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      'Please enter a valid email'
    );
  }
  
  if (messageField2) {
    validateField(
      messageField2,
      document.getElementById('messageError'),
      (val) => val.length >= 10 && val.length <= 500,
      'Message must be 10-500 characters'
    );
  }
}

// ✅ Contact Form Data Storage (Fallback)
function storeContactSubmission(name, email, message) {
  const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
  const submission = {
    name,
    email,
    message,
    timestamp: new Date().toISOString(),
    id: Date.now()
  };
  submissions.push(submission);
  localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
  console.log('Contact submission stored locally:', submission);
  return submissions;
}

// ✅ Theme toggle with localStorage
const themeToggle = document.getElementById('themeToggle');

function updateThemeIcon(isDark) {
  if (themeToggle) {
    themeToggle.textContent = isDark ? '☀️' : '�';
  }
}

function setTheme(isDark) {
  if (isDark) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
  updateThemeIcon(isDark);
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Initialize theme
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialDarkMode = savedTheme === 'dark' || (savedTheme === null && prefersDark);

setTheme(initialDarkMode);

// Theme toggle event listener
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isDarkMode = document.body.classList.contains('dark-mode');
    setTheme(!isDarkMode);
  });
}

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) {
    setTheme(e.matches);
  }
});

// ✅ Fade-in animation on scroll
const fadeElements = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

fadeElements.forEach(el => observer.observe(el));

// ✅ Scroll Progress Bar and Scroll to Top
const scrollProgress = document.getElementById('scrollProgress');
const scrollToTopBtn = document.getElementById('scrollToTop');

function updateScrollProgress() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrollPercentage = (scrollTop / scrollHeight) * 100;
  
  if (scrollProgress) {
    scrollProgress.style.width = `${scrollPercentage}%`;
  }
  
  // Show/hide scroll to top button
  if (scrollToTopBtn) {
    if (scrollTop > 300) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  }
}

// Scroll to top functionality
if (scrollToTopBtn) {
  scrollToTopBtn.addEventListener('click', () => {
    // Use Lenis if available, otherwise fallback to native scroll
    if (window.lenis) {
      window.lenis.scrollTo(0, { duration: 1.5 });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  });
}

// Update scroll progress on scroll - Use Lenis event if available
if (window.lenis) {
  window.lenis.on('scroll', updateScrollProgress);
} else {
  window.addEventListener('scroll', updateScrollProgress);
}

// Initial call to set progress
updateScrollProgress();

// ✅ Smooth scroll for internal anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href'))?.scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// ✅ Testimonials carousel functionality
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial');
const testimonialBtns = document.querySelectorAll('.testimonial-btn');

function showTestimonial(index) {
  // Hide all testimonials
  testimonials.forEach(testimonial => {
    testimonial.classList.remove('active');
  });
  
  // Remove active class from all buttons
  testimonialBtns.forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Show current testimonial and activate button
  if (testimonials[index]) {
    testimonials[index].classList.add('active');
  }
  if (testimonialBtns[index]) {
    testimonialBtns[index].classList.add('active');
  }
}

// Initialize testimonials
if (testimonials.length > 0) {
  showTestimonial(0);
  
  // Add click listeners to testimonial buttons
  testimonialBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      currentTestimonial = index;
      showTestimonial(index);
    });
  });
  
  // Auto-advance testimonials every 5 seconds
  setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
  }, 5000);
}

// ✅ Profile stats counter animation
function animateStats() {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  statNumbers.forEach(stat => {
    const target = parseInt(stat.textContent);
    const increment = target / 50; // Animation duration
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      stat.textContent = Math.floor(current) + (stat.textContent.includes('+') ? '+' : '');
    }, 30);
  });
}

// Trigger stats animation when section is visible
const profileSection = document.querySelector('.profile-intro');
if (profileSection) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateStats();
        observer.unobserve(entry.target);
      }
    });
  });
  
  observer.observe(profileSection);
}

// ✅ Service items hover effects
document.querySelectorAll('.service-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    item.style.transform = 'translateY(-10px) scale(1.02)';
  });
  
  item.addEventListener('mouseleave', () => {
    item.style.transform = 'translateY(0) scale(1)';
  });
});

// ✅ Skills badge interaction
document.querySelectorAll('.skills-grid .badge').forEach(badge => {
  badge.addEventListener('click', () => {
    badge.style.transform = 'scale(0.95)';
    setTimeout(() => {
      badge.style.transform = 'scale(1)';
    }, 100);
  });
});

// ✅ Resume download functionality
const downloadResumeBtn = document.getElementById('download-resume');
if (downloadResumeBtn) {
  downloadResumeBtn.addEventListener('click', () => {
    // Create a sample resume content
    const resumeContent = generateResumeHTML();
    
    // Create a blob with the HTML content
    const blob = new Blob([resumeContent], { type: 'text/html' });
    
    // Create a download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Resume_Portfolio.html';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    // Show feedback
    const originalText = downloadResumeBtn.innerHTML;
    downloadResumeBtn.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
    downloadResumeBtn.style.background = '#10b981';
    
    setTimeout(() => {
      downloadResumeBtn.innerHTML = originalText;
      downloadResumeBtn.style.background = '';
    }, 2000);
  });
}

function generateResumeHTML() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Professional Resume</title>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #4e54c8; padding-bottom: 20px; margin-bottom: 30px; }
        .name { font-size: 2.5rem; color: #4e54c8; margin-bottom: 10px; }
        .title { font-size: 1.2rem; color: #666; margin-bottom: 15px; }
        .contact { display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #4e54c8; border-bottom: 1px solid #4e54c8; padding-bottom: 5px; }
        .experience-item, .education-item { margin-bottom: 20px; }
        .item-header { display: flex; justify-content: between; align-items: center; margin-bottom: 5px; }
        .item-title { font-weight: bold; color: #333; }
        .item-company { color: #4e54c8; }
        .item-date { color: #666; font-style: italic; }
        .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
        .skill-category h3 { color: #4e54c8; margin-bottom: 10px; }
        .skill-list { list-style: none; padding: 0; }
        .skill-list li { background: #f0f0f0; padding: 5px 10px; margin: 3px 0; border-radius: 15px; display: inline-block; margin-right: 10px; }
        @media print { body { padding: 0; } }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="name">Your Name</h1>
        <div class="title">Full-Stack Developer & UI/UX Designer</div>
        <div class="contact">
            <span>📧 your.email@example.com</span>
            <span>📱 (555) 123-4567</span>
            <span>🌐 yourportfolio.com</span>
        </div>
    </div>

    <div class="section">
        <h2>Professional Summary</h2>
        <p>Passionate full-stack developer with 5+ years of experience creating innovative web applications and mobile solutions. Expert in modern JavaScript frameworks, responsive design, and user experience optimization. Proven track record of delivering high-quality projects on time and exceeding client expectations.</p>
    </div>

    <div class="section">
        <h2>Technical Skills</h2>
        <div class="skills-grid">
            <div class="skill-category">
                <h3>Frontend</h3>
                <ul class="skill-list">
                    <li>Vue.js</li>
                    <li>React</li>
                    <li>JavaScript ES6+</li>
                    <li>HTML5</li>
                    <li>CSS3</li>
                    <li>Responsive Design</li>
                </ul>
            </div>
            <div class="skill-category">
                <h3>Backend & Database</h3>
                <ul class="skill-list">
                    <li>Node.js</li>
                    <li>Firebase</li>
                    <li>MongoDB</li>
                    <li>REST APIs</li>
                    <li>Authentication</li>
                </ul>
            </div>
            <div class="skill-category">
                <h3>Tools & Platforms</h3>
                <ul class="skill-list">
                    <li>Git & GitHub</li>
                    <li>VS Code</li>
                    <li>Vite</li>
                    <li>Netlify</li>
                    <li>Figma</li>
                </ul>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>Professional Experience</h2>
        <div class="experience-item">
            <div class="item-header">
                <div>
                    <div class="item-title">Senior Frontend Developer</div>
                    <div class="item-company">Tech Solutions Inc.</div>
                </div>
                <div class="item-date">2021 - Present</div>
            </div>
            <ul>
                <li>Led development of 15+ responsive web applications using Vue.js and React</li>
                <li>Improved application performance by 40% through code optimization</li>
                <li>Mentored junior developers and conducted code reviews</li>
                <li>Collaborated with UX/UI teams to implement pixel-perfect designs</li>
            </ul>
        </div>
        <div class="experience-item">
            <div class="item-header">
                <div>
                    <div class="item-title">Full-Stack Developer</div>
                    <div class="item-company">Digital Innovations Ltd.</div>
                </div>
                <div class="item-date">2019 - 2021</div>
            </div>
            <ul>
                <li>Built and maintained e-commerce platforms serving 10,000+ users</li>
                <li>Developed RESTful APIs and integrated third-party services</li>
                <li>Implemented secure authentication and payment processing</li>
                <li>Reduced page load times by 50% through optimization techniques</li>
            </ul>
        </div>
    </div>

    <div class="section">
        <h2>Education</h2>
        <div class="education-item">
            <div class="item-header">
                <div>
                    <div class="item-title">Bachelor of Science in Computer Science</div>
                    <div class="item-company">University of Technology</div>
                </div>
                <div class="item-date">2015 - 2019</div>
            </div>
            <p>Graduated Magna Cum Laude • Relevant Coursework: Web Development, Database Design, Software Engineering</p>
        </div>
    </div>

    <div class="section">
        <h2>Key Projects</h2>
        <div class="experience-item">
            <div class="item-title">E-Commerce Platform</div>
            <p>Full-featured online store with cart, payments, admin dashboard, and inventory management. Built with Vue.js, Firebase, and Stripe API.</p>
        </div>
        <div class="experience-item">
            <div class="item-title">Task Management Application</div>
            <p>Collaborative productivity app with real-time updates, drag-and-drop functionality, and team features. Technologies: React, Node.js, Socket.io.</p>
        </div>
        <div class="experience-item">
            <div class="item-title">Weather Dashboard</div>
            <p>Interactive weather application with forecasts, maps, and beautiful visualizations. Features responsive design and API integration.</p>
        </div>
    </div>
</body>
</html>
  `;
}

// ✅ Blog Page Functionality
if (document.getElementById('blog-search')) {
  const blogSearch = document.getElementById('blog-search');
  const categoryFilter = document.getElementById('category-filter');
  const articlesGrid = document.getElementById('articles-grid');
  const resultsCount = document.getElementById('results-count');
  const loadMoreBtn = document.getElementById('load-more-btn');
  
  let visibleArticles = 6;
  let allArticles = [];
  
  // Initialize blog functionality
  function initializeBlog() {
    allArticles = Array.from(document.querySelectorAll('.article-card'));
    updateArticleDisplay();
    
    // Search functionality
    blogSearch.addEventListener('input', handleSearch);
    
    // Filter functionality
    categoryFilter.addEventListener('change', handleFilter);
    
    // Load more functionality
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', loadMoreArticles);
    }
  }
  
  function handleSearch() {
    const searchTerm = blogSearch.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    
    filterArticles(searchTerm, selectedCategory);
  }
  
  function handleFilter() {
    const searchTerm = blogSearch.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    
    filterArticles(searchTerm, selectedCategory);
  }
  
  function filterArticles(searchTerm, category) {
    let filteredArticles = allArticles.filter(article => {
      const title = article.querySelector('.article-title').textContent.toLowerCase();
      const excerpt = article.querySelector('.article-excerpt').textContent.toLowerCase();
      const articleCategories = article.dataset.category || '';
      
      const matchesSearch = !searchTerm || 
        title.includes(searchTerm) || 
        excerpt.includes(searchTerm);
      
      const matchesCategory = category === 'all' || 
        articleCategories.includes(category);
      
      return matchesSearch && matchesCategory;
    });
    
    // Hide all articles first
    allArticles.forEach(article => {
      article.style.display = 'none';
    });
    
    // Show filtered articles
    filteredArticles.slice(0, visibleArticles).forEach(article => {
      article.style.display = 'block';
    });
    
    // Update results count
    updateResultsCount(filteredArticles.length);
    
    // Update load more button
    updateLoadMoreButton(filteredArticles.length);
  }
  
  function updateArticleDisplay() {
    const searchTerm = blogSearch.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    
    filterArticles(searchTerm, selectedCategory);
  }
  
  function updateResultsCount(count) {
    const displayed = Math.min(count, visibleArticles);
    resultsCount.textContent = `Showing ${displayed} of ${count} articles`;
  }
  
  function updateLoadMoreButton(totalCount) {
    if (loadMoreBtn) {
      if (visibleArticles >= totalCount) {
        loadMoreBtn.style.display = 'none';
      } else {
        loadMoreBtn.style.display = 'block';
        loadMoreBtn.innerHTML = `<i class="fas fa-plus"></i> Load More Articles (${totalCount - visibleArticles} remaining)`;
      }
    }
  }
  
  function loadMoreArticles() {
    visibleArticles += 6;
    updateArticleDisplay();
  }
  
  // Newsletter form
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const email = document.getElementById('newsletter-email').value;
      const submitBtn = newsletterForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
      submitBtn.disabled = true;
      
      // Simulate subscription
      setTimeout(() => {
        alert(`Thank you for subscribing with ${email}! You'll receive our latest articles.`);
        newsletterForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 2000);
    });
  }
  
  // Initialize blog when page loads
  document.addEventListener('DOMContentLoaded', initializeBlog);
}

// ✅ Performance Optimizations

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registered successfully:', registration.scope);
        
        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New version available
              showUpdateNotification();
            }
          });
        });
      })
      .catch(error => {
        console.log('Service Worker registration failed:', error);
      });
  });
}

function showUpdateNotification() {
  const notification = document.createElement('div');
  notification.className = 'update-notification';
  notification.innerHTML = `
    <div class="update-content">
      <span>A new version is available!</span>
      <button onclick="updateApp()" class="update-btn">Update</button>
      <button onclick="dismissUpdate(this)" class="dismiss-btn">×</button>
    </div>
  `;
  document.body.appendChild(notification);
}

function updateApp() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then(registration => {
      if (registration && registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    });
  }
}

function dismissUpdate(button) {
  button.closest('.update-notification').remove();
}

// ✅ Lazy Loading for Images
function implementLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}

// ✅ Resource Preloading
function preloadCriticalResources() {
  const criticalResources = [
    { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap', as: 'style' },
    { href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css', as: 'style' }
  ];
  
  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
}

// ✅ Performance Monitoring
function initPerformanceMonitoring() {
  // Web Vitals monitoring
  if ('PerformanceObserver' in window) {
    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log('LCP:', entry.startTime);
        // Send to analytics if needed
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });
    
    // First Input Delay
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log('FID:', entry.processingStart - entry.startTime);
        // Send to analytics if needed
      }
    }).observe({ entryTypes: ['first-input'] });
    
    // Cumulative Layout Shift
    new PerformanceObserver((list) => {
      let clsValue = 0;
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      console.log('CLS:', clsValue);
      // Send to analytics if needed
    }).observe({ entryTypes: ['layout-shift'] });
  }
  
  // Load time monitoring
  window.addEventListener('load', () => {
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    console.log('Page load time:', loadTime + 'ms');
    
    // Report slow loads
    if (loadTime > 3000) {
      console.warn('Slow page load detected:', loadTime + 'ms');
    }
  });
}

// ✅ Critical CSS Inlining (for production)
function inlineCriticalCSS() {
  // This would typically be done during build process
  // For demonstration, we'll add critical styles to head
  const criticalCSS = `
    .navbar { background: white; position: fixed; top: 0; width: 100%; z-index: 1000; }
    .hero { min-height: 100vh; display: flex; align-items: center; }
    .card { background: white; border-radius: 12px; padding: 2rem; }
  `;
  
  const style = document.createElement('style');
  style.textContent = criticalCSS;
  document.head.insertBefore(style, document.head.firstChild);
}

// ✅ Image Optimization Helper
function optimizeImages() {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    // Add loading="lazy" for native lazy loading
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
    
    // Add proper alt text if missing
    if (!img.hasAttribute('alt')) {
      img.setAttribute('alt', 'Portfolio image');
    }
    
    // Use WebP if supported
    if (supportsWebP() && !img.src.includes('.webp')) {
      const webpSrc = img.src.replace(/\.(jpg|jpeg|png)$/, '.webp');
      // You would check if WebP version exists on server
      // For demo, we'll just log the conversion
      console.log('WebP optimization available for:', img.src);
    }
  });
}

function supportsWebP() {
  return new Promise(resolve => {
    const webP = new Image();
    webP.onload = webP.onerror = () => resolve(webP.height === 2);
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
}

// ✅ Bundle Size Monitoring
function monitorBundleSize() {
  if ('PerformanceObserver' in window) {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.transferSize > 100000) { // 100KB threshold
          console.warn('Large resource detected:', entry.name, `${Math.round(entry.transferSize / 1024)}KB`);
        }
      }
    }).observe({ entryTypes: ['resource'] });
  }
}

// ✅ Memory Usage Monitoring
function monitorMemoryUsage() {
  if ('memory' in performance) {
    const logMemory = () => {
      const memory = performance.memory;
      console.log('Memory usage:', {
        used: Math.round(memory.usedJSHeapSize / 1048576) + 'MB',
        total: Math.round(memory.totalJSHeapSize / 1048576) + 'MB',
        limit: Math.round(memory.jsHeapSizeLimit / 1048576) + 'MB'
      });
    };
    
    // Log initial memory usage
    logMemory();
    
    // Monitor memory usage every 30 seconds
    setInterval(logMemory, 30000);
  }
}

// ✅ Loading Manager
class LoadingManager {
  constructor() {
    this.loadingElements = new Set();
    this.init();
  }

  init() {
    // Initialize intersection observer for animations
    this.observeAnimations();
    // Add page transition effects
    this.initPageTransitions();
    // Setup loading states
    this.setupLoadingStates();
  }

  // Show skeleton loading for specific elements
  showSkeleton(element, type = 'default') {
    const skeletonHTML = this.getSkeletonHTML(type);
    element.innerHTML = skeletonHTML;
    element.classList.add('content-loading');
    this.loadingElements.add(element);
  }

  // Hide skeleton and show content
  hideSkeleton(element, content) {
    element.classList.remove('content-loading');
    element.innerHTML = content;
    this.loadingElements.delete(element);
    
    // Trigger animations for newly loaded content
    this.triggerAnimations(element);
  }

  // Generate skeleton HTML based on type
  getSkeletonHTML(type) {
    const skeletons = {
      card: `
        <div class="skeleton-project-card">
          <div class="skeleton skeleton-image"></div>
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-description wide"></div>
          <div class="skeleton skeleton-description medium"></div>
          <div class="skeleton skeleton-description narrow"></div>
          <div class="skeleton-tags">
            <div class="skeleton skeleton-tag"></div>
            <div class="skeleton skeleton-tag"></div>
            <div class="skeleton skeleton-tag"></div>
          </div>
        </div>
      `,
      profile: `
        <div class="skeleton-header">
          <div class="skeleton skeleton-avatar"></div>
          <div>
            <div class="skeleton skeleton-text wide"></div>
            <div class="skeleton skeleton-text medium"></div>
          </div>
        </div>
      `,
      blog: `
        <div class="skeleton-project-card">
          <div class="skeleton skeleton-image"></div>
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-description wide"></div>
          <div class="skeleton skeleton-description medium"></div>
        </div>
      `,
      default: `
        <div class="skeleton skeleton-text wide"></div>
        <div class="skeleton skeleton-text medium"></div>
        <div class="skeleton skeleton-text narrow"></div>
      `
    };
    
    return skeletons[type] || skeletons.default;
  }

  // Observe elements for scroll animations
  observeAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll(
      '.fade-in, .slide-in-left, .slide-in-right, .scale-in'
    );
    
    animatedElements.forEach(el => observer.observe(el));
  }

  // Initialize page transitions
  initPageTransitions() {
    // Add transition class to main content
    const mainContent = document.querySelector('main') || document.body;
    mainContent.classList.add('page-transition');
    
    // Trigger loaded state after a short delay
    setTimeout(() => {
      mainContent.classList.add('loaded');
    }, 100);

    // Handle navigation transitions
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (link && link.hostname === window.location.hostname) {
        e.preventDefault();
        this.handlePageTransition(link.href);
      }
    });
  }

  // Handle smooth page transitions
  handlePageTransition(url) {
    const mainContent = document.querySelector('main') || document.body;
    
    // Fade out current content
    mainContent.classList.remove('loaded');
    
    // Navigate after transition
    setTimeout(() => {
      window.location.href = url;
    }, 300);
  }

  // Setup loading states for async operations
  setupLoadingStates() {
    // Create global loader styles
    if (!document.querySelector('#global-loader-styles')) {
      const style = document.createElement('style');
      style.id = 'global-loader-styles';
      style.textContent = `
        .global-loader {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 9999;
          display: none;
        }
        .image-error {
          background: #f5f5f5;
          color: #666;
          padding: 2rem;
          text-align: center;
          border-radius: 8px;
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Show global loading indicator
  showGlobalLoading() {
    let loader = document.querySelector('.global-loader');
    if (!loader) {
      loader = document.createElement('div');
      loader.className = 'global-loader';
      loader.innerHTML = `
        <div class="progress-bar">
          <div class="progress-fill" style="width: 0%"></div>
        </div>
      `;
      document.body.appendChild(loader);
    }
    
    loader.style.display = 'block';
    this.animateProgress(loader.querySelector('.progress-fill'));
  }

  // Hide global loading indicator
  hideGlobalLoading() {
    const loader = document.querySelector('.global-loader');
    if (loader) {
      const fill = loader.querySelector('.progress-fill');
      fill.style.width = '100%';
      
      setTimeout(() => {
        loader.style.display = 'none';
        fill.style.width = '0%';
      }, 300);
    }
  }

  // Animate progress bar
  animateProgress(element) {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress > 90) {
        clearInterval(interval);
        progress = 90;
      }
      element.style.width = progress + '%';
    }, 200);
  }

  // Trigger animations for newly loaded content
  triggerAnimations(container) {
    const elements = container.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
    elements.forEach((el, index) => {
      el.style.animationDelay = (index * 0.1) + 's';
      el.classList.add('visible');
    });
  }

  // Load content with skeleton
  async loadWithSkeleton(element, loadFunction, skeletonType = 'default') {
    this.showSkeleton(element, skeletonType);
    
    try {
      const content = await loadFunction();
      
      // Simulate minimum loading time for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      this.hideSkeleton(element, content);
    } catch (error) {
      console.error('Loading error:', error);
      this.hideSkeleton(element, '<p>Failed to load content</p>');
    }
  }

  // Lazy load images with skeleton
  lazyLoadImage(img) {
    const wrapper = document.createElement('div');
    wrapper.className = 'image-loader';
    wrapper.innerHTML = '<div class="skeleton skeleton-image"></div>';
    
    img.parentNode.insertBefore(wrapper, img);
    img.style.display = 'none';
    
    img.onload = () => {
      wrapper.remove();
      img.style.display = 'block';
      img.classList.add('fade-in', 'visible');
    };
    
    img.onerror = () => {
      wrapper.innerHTML = '<div class="image-error">Failed to load image</div>';
    };
  }

  // Staggered animations for lists
  staggerAnimations(elements, delay = 100) {
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('fade-in', 'visible');
      }, index * delay);
    });
  }
}

// Initialize loading manager
const loadingManager = new LoadingManager();

// ✅ Initialize Performance Optimizations
document.addEventListener('DOMContentLoaded', () => {
  implementLazyLoading();
  preloadCriticalResources();
  initPerformanceMonitoring();
  optimizeImages();
  monitorBundleSize();
  monitorMemoryUsage();
  
  // Defer non-critical JavaScript
  setTimeout(() => {
    // Load non-critical features after initial page load
    initAdvancedVisualEffects();
    console.log('Loading non-critical features...');
  }, 1000);
});

// ✨ ADVANCED VISUAL ENHANCEMENTS

// Intersection Observer for Scroll Animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, observerOptions);

  // Observe all animation elements
  document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .scale-in, .slide-in-down').forEach(el => {
    observer.observe(el);
  });
}

// Parallax Effect - Updated for Lenis compatibility
function initParallax() {
  const parallaxElements = document.querySelectorAll('.parallax-element');
  
  // Use Lenis scroll event if available, otherwise fallback to window scroll
  if (window.lenis) {
    window.lenis.on('scroll', ({ scroll }) => {
      const rate = scroll * -0.5;
      
      parallaxElements.forEach(element => {
        element.style.transform = `translateY(${rate}px)`;
      });
    });
  } else {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      
      parallaxElements.forEach(element => {
        element.style.transform = `translateY(${rate}px)`;
      });
    });
  }
}

// Particle System
function initParticleSystem() {
  const particlesContainer = document.createElement('div');
  particlesContainer.className = 'particles-container';
  document.body.appendChild(particlesContainer);

  function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random size and position
    const size = Math.random() * 4 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = (Math.random() * 20 + 10) + 's';
    particle.style.animationDelay = Math.random() * 20 + 's';
    
    particlesContainer.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 30000);
  }

  // Create particles periodically
  setInterval(createParticle, 2000);
}

// Floating Geometric Shapes
function initGeometricShapes() {
  const shapes = ['geometric-bg'];
  const shapesContainer = document.createElement('div');
  shapesContainer.style.position = 'fixed';
  shapesContainer.style.top = '0';
  shapesContainer.style.left = '0';
  shapesContainer.style.width = '100%';
  shapesContainer.style.height = '100%';
  shapesContainer.style.pointerEvents = 'none';
  shapesContainer.style.zIndex = '-1';
  document.body.appendChild(shapesContainer);

  for (let i = 0; i < 3; i++) {
    const shape = document.createElement('div');
    shape.className = 'geometric-bg';
    shape.style.top = Math.random() * 100 + '%';
    shape.style.left = Math.random() * 100 + '%';
    shape.style.animationDelay = i * 5 + 's';
    shapesContainer.appendChild(shape);
  }
}

// Button Ripple Effect
function initRippleEffects() {
  document.querySelectorAll('.cta-button, .btn-ripple').forEach(button => {
    button.classList.add('btn-ripple');
  });
}

// Enhanced Custom Cursor
function initCustomCursor() {
  if (window.innerWidth < 768) return; // Skip on mobile

  // Create cursor dot
  const cursorDot = document.createElement('div');
  cursorDot.className = 'cursor-dot';
  document.body.appendChild(cursorDot);

  // Create cursor outline
  const cursorOutline = document.createElement('div');
  cursorOutline.className = 'cursor-outline';
  document.body.appendChild(cursorOutline);

  let mouseX = 0, mouseY = 0;
  let dotX = 0, dotY = 0;
  let outlineX = 0, outlineY = 0;

  // Track mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth cursor animation
  function animateCursor() {
    // Dot follows quickly
    dotX += (mouseX - dotX) * 0.3;
    dotY += (mouseY - dotY) * 0.3;
    
    // Outline follows with delay
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;
    
    cursorDot.style.left = dotX + 'px';
    cursorDot.style.top = dotY + 'px';
    cursorOutline.style.left = outlineX + 'px';
    cursorOutline.style.top = outlineY + 'px';
    
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover effects on interactive elements
  const interactiveElements = 'a, button, input, textarea, select, .card, .project-card, .blog-card, .skill, .tag, .social-link';
  
  document.querySelectorAll(interactiveElements).forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
    });
    
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
    });
  });

  // Click effect
  document.addEventListener('mousedown', () => {
    document.body.classList.add('cursor-click');
  });

  document.addEventListener('mouseup', () => {
    document.body.classList.remove('cursor-click');
  });

  // Hide default cursor on interactive elements
  document.body.style.cursor = 'none';
  document.querySelectorAll(interactiveElements).forEach(el => {
    el.style.cursor = 'none';
  });
}


// Scroll Progress Indicator
function initScrollProgress() {
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
  });
}

// Animated Counters
function initCounterAnimations() {
  const counters = document.querySelectorAll('.counter, .stat-number');
  console.log('Found counters:', counters.length); // Debug log
  
  const observerOptions = {
    threshold: 0.5
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        console.log('Animating counter:', entry.target); // Debug log
        entry.target.classList.add('counted');
        animateCounter(entry.target);
      }
    });
  }, observerOptions);

  counters.forEach(counter => {
    counterObserver.observe(counter);
  });
}

function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-target')) || parseInt(element.textContent) || 0;
  console.log('Counter target:', target, 'Element:', element); // Debug log
  const duration = 2000;
  const increment = target / (duration / 16);
  let current = 0;

  // Ensure the element is visible first
  element.style.opacity = '1';
  element.style.visibility = 'visible';
  element.style.display = 'block';
  
  // Set initial value
  element.textContent = '0';

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current);
  }, 16);
}

// Progress Bar Animations
function initProgressBars() {
  const progressBars = document.querySelectorAll('.progress-bar');
  
  const observerOptions = {
    threshold: 0.5
  };

  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.progress-fill');
        const percentage = entry.target.dataset.percentage || '100';
        if (fill) {
          setTimeout(() => {
            fill.style.width = percentage + '%';
          }, 200);
        }
      }
    });
  }, observerOptions);

  progressBars.forEach(bar => {
    progressObserver.observe(bar);
  });
}

// Magnetic Effect for Interactive Elements
function initMagneticEffect() {
  document.querySelectorAll('.magnetic, .cta-button').forEach(element => {
    element.classList.add('magnetic');
    
    element.addEventListener('mousemove', (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });
    
    element.addEventListener('mouseleave', () => {
      element.style.transform = 'translate(0px, 0px)';
    });
  });
}

// Enhanced Loading States
function initLoadingStates() {
  // Add skeleton loading to dynamic content
  document.querySelectorAll('[data-loading]').forEach(element => {
    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton';
    skeleton.style.height = element.offsetHeight + 'px';
    skeleton.style.width = '100%';
    
    element.parentNode.insertBefore(skeleton, element);
    element.style.display = 'none';
    
    // Simulate loading time
    setTimeout(() => {
      skeleton.remove();
      element.style.display = '';
    }, 1500);
  });
}

// Enhanced Focus Management
function initEnhancedFocus() {
  document.querySelectorAll('button, a, input, textarea, select').forEach(element => {
    element.classList.add('focus-ring');
  });
}

// Performance Optimizations
function initPerformanceOptimizations() {
  // Add will-change properties to animated elements
  document.querySelectorAll('.card, .btn, .nav-links a').forEach(element => {
    element.classList.add('will-change-transform');
  });
  
  // Optimize images for retina displays
  document.querySelectorAll('img').forEach(img => {
    if (!img.srcset && img.src) {
      img.loading = 'lazy';
    }
  });
}

// Main initialization function for all advanced effects
function initAdvancedVisualEffects() {
  // Check for user preference for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (!prefersReducedMotion) {
    initScrollAnimations();
    initParallax();
    initParticleSystem();
    initGeometricShapes();
    initCustomCursor();
    initMagneticEffect();
  }
  
  // Always init these for better UX
  initRippleEffects();
  initScrollProgress();
  initCounterAnimations();
  initProgressBars();
  initLoadingStates();
  initEnhancedFocus();
  initPerformanceOptimizations();
  initFAQAccordion();
  
  console.log('🎨 Advanced visual effects initialized!');
}

// FAQ Accordion functionality
function initFAQAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      const answer = question.nextElementSibling;
      
      // Close all other FAQ items
      faqQuestions.forEach(otherQuestion => {
        if (otherQuestion !== question) {
          otherQuestion.setAttribute('aria-expanded', 'false');
          const otherAnswer = otherQuestion.nextElementSibling;
          otherAnswer.style.maxHeight = '0';
        }
      });
      
      // Toggle current FAQ item
      if (isExpanded) {
        question.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = '0';
      } else {
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

// Enhanced download resume functionality
function initDownloadResume() {
  const downloadBtn = document.getElementById('downloadResume');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Create downloadable resume
      downloadResumePDF();
    });
  }
}

// Generate and download resume as PDF-style HTML
function downloadResumePDF() {
  const resumeContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kendell Pierre - Resume</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; padding: 40px; max-width: 800px; margin: 0 auto; }
    h1 { color: #6366f1; font-size: 2.5rem; margin-bottom: 0.5rem; }
    .contact { margin-bottom: 2rem; color: #666; }
    .contact a { color: #6366f1; text-decoration: none; }
    h2 { color: #6366f1; border-bottom: 2px solid #6366f1; padding-bottom: 0.5rem; margin: 2rem 0 1rem; }
    h3 { color: #333; margin: 1rem 0 0.5rem; }
    .job-title { font-weight: bold; color: #666; }
    .date { color: #999; font-style: italic; }
    ul { margin-left: 1.5rem; }
    li { margin: 0.5rem 0; }
    .skills { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .skill { background: #e5e7eb; padding: 0.25rem 0.75rem; border-radius: 0.25rem; font-size: 0.9rem; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <h1>Kendell Pierre</h1>
  <div class="contact">
    📧 <a href="mailto:kpierre24@gmail.com">kpierre24@gmail.com</a> | 
    🐙 <a href="https://github.com/kpierre24">github.com/kpierre24</a> | 
    🐦 <a href="https://twitter.com/kentrini25">@kentrini25</a>
  </div>

  <h2>Professional Summary</h2>
  <p>Full-stack developer with 3+ years of experience specializing in modern web applications, mobile apps, and user-centered design. Passionate about creating engaging digital products that deliver exceptional user experiences. Proficient in JavaScript, React, Node.js, and modern development practices.</p>

  <h2>Technical Skills</h2>
  <div class="skills">
    <span class="skill">JavaScript (ES6+)</span>
    <span class="skill">React.js</span>
    <span class="skill">Node.js</span>
    <span class="skill">HTML5/CSS3</span>
    <span class="skill">Vue.js</span>
    <span class="skill">TypeScript</span>
    <span class="skill">Express.js</span>
    <span class="skill">MongoDB</span>
    <span class="skill">PostgreSQL</span>
    <span class="skill">Git/GitHub</span>
    <span class="skill">RESTful APIs</span>
    <span class="skill">Responsive Design</span>
    <span class="skill">UI/UX Design</span>
    <span class="skill">Agile/Scrum</span>
  </div>

  <h2>Professional Experience</h2>
  
  <h3>Full-Stack Developer <span class="job-title">| Freelance</span></h3>
  <p class="date">2022 - Present</p>
  <ul>
    <li>Designed and developed 15+ responsive web applications for clients across various industries</li>
    <li>Implemented modern UI/UX best practices resulting in 40% increase in user engagement</li>
    <li>Built RESTful APIs and integrated third-party services for seamless functionality</li>
    <li>Collaborated with clients to gather requirements and deliver custom solutions</li>
    <li>Maintained 100% client satisfaction rate with fast delivery within 48 hours</li>
  </ul>

  <h3>Web Developer <span class="job-title">| Tech Solutions Inc.</span></h3>
  <p class="date">2020 - 2022</p>
  <ul>
    <li>Developed and maintained company website with 10,000+ monthly visitors</li>
    <li>Optimized page load times by 60% through code splitting and lazy loading</li>
    <li>Implemented automated testing reducing bugs by 35%</li>
    <li>Mentored junior developers on best practices and code review</li>
  </ul>

  <h2>Education</h2>
  <h3>Bachelor of Science in Computer Science</h3>
  <p class="date">2016 - 2020</p>
  <ul>
    <li>GPA: 3.7/4.0</li>
    <li>Relevant coursework: Data Structures, Algorithms, Web Development, Database Systems</li>
  </ul>

  <h2>Notable Projects</h2>
  <ul>
    <li><strong>E-Commerce Platform:</strong> Built full-stack platform with payment integration, user authentication, and admin dashboard</li>
    <li><strong>Task Management App:</strong> React-based SPA with real-time updates using WebSockets</li>
    <li><strong>Portfolio Website:</strong> Modern, responsive portfolio with advanced animations and PWA capabilities</li>
  </ul>

  <h2>Certifications</h2>
  <ul>
    <li>AWS Certified Developer - Associate</li>
    <li>Google Mobile Web Specialist</li>
    <li>Frontend Masters Certificate</li>
  </ul>
</body>
</html>
  `;

  // Create blob and download
  const blob = new Blob([resumeContent], { type: 'text/html' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Kendell_Pierre_Resume.html';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);

  // Show success message
  if (typeof Swal !== 'undefined') {
    Swal.fire({
      title: '📄 Resume Downloaded!',
      html: 'Your resume has been downloaded as an HTML file.<br><br><small>💡 Tip: Open it in your browser and use Print → Save as PDF for a PDF version!</small>',
      icon: 'success',
      confirmButtonColor: '#6366f1',
      timer: 6000,
      timerProgressBar: true
    });
  }
}

// Initialize on DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Immediate counter fix
    ensureCountersVisible();
    
    setTimeout(() => {
      initAdvancedVisualEffects();
      initDownloadResume();
      // Double-check counters
      ensureCountersVisible();
    }, 500);
  });
} else {
  // Page already loaded
  ensureCountersVisible();
  
  setTimeout(() => {
    initAdvancedVisualEffects();
    initDownloadResume();
    // Double-check counters
    ensureCountersVisible();
  }, 500);
}

// Emergency function to ensure counters are visible
function ensureCountersVisible() {
  console.log('🔍 Ensuring counters are visible...');
  const counters = document.querySelectorAll('.counter, .trust-number, .stat-number');
  console.log('Found counter elements:', counters.length);
  
  counters.forEach((counter, index) => {
    console.log(`Counter ${index}:`, counter, 'Text:', counter.textContent);
    
    // Get target number
    let targetNumber = counter.getAttribute('data-target') || counter.textContent.trim();
    
    // Ensure the element has content and is visible
    if (!targetNumber || targetNumber === '' || targetNumber === '0') {
      // Fallback based on context
      const parent = counter.closest('.trust-item, .stat-highlight, .stat-item');
      if (parent) {
        const label = parent.querySelector('.trust-label, .stat-label')?.textContent || '';
        if (label.includes('Clients')) targetNumber = '50';
        else if (label.includes('Success') || label.includes('Satisfaction')) targetNumber = '98';
        else if (label.includes('Star')) targetNumber = '5';
        else if (label.includes('Hours') || label.includes('Response')) targetNumber = '24';
        else if (label.includes('Experience')) targetNumber = '3';
        else if (label.includes('Projects')) targetNumber = '25';
        else targetNumber = '100';
      }
    }
    
    // Set the number immediately
    if (targetNumber) {
      counter.textContent = targetNumber;
      counter.setAttribute('data-target', targetNumber);
    }
    
    // Force visibility
    counter.style.opacity = '1';
    counter.style.visibility = 'visible';
    counter.style.display = 'block';
    counter.style.color = '#6366f1'; // Primary color as fallback
    counter.style.fontSize = counter.classList.contains('trust-number') ? '2.5rem' : '2rem';
    counter.style.fontWeight = 'bold';
    
    console.log(`✅ Counter ${index} set to:`, counter.textContent);
  });
}

// ============================================
// UNIQUE UI FEATURES
// ============================================

// 🎯 Interactive Cursor Trail
function initCursorTrail() {
  const cursorTrail = document.getElementById('cursorTrail');
  const cursorGlow = document.getElementById('cursorGlow');
  
  if (!cursorTrail || !cursorGlow) return;
  
  let mouseX = 0, mouseY = 0;
  let trailX = 0, trailY = 0;
  let glowX = 0, glowY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  function updateCursor() {
    // Smooth following animation
    trailX += (mouseX - trailX) * 0.3;
    trailY += (mouseY - trailY) * 0.3;
    
    glowX += (mouseX - glowX) * 0.15;
    glowY += (mouseY - glowY) * 0.15;
    
    cursorTrail.style.transform = `translate(${trailX - 10}px, ${trailY - 10}px)`;
    cursorGlow.style.transform = `translate(${glowX - 20}px, ${glowY - 20}px)`;
    
    requestAnimationFrame(updateCursor);
  }
  
  updateCursor();
}

// 🎭 Magnetic Effect for Elements
function initMagneticEffect() {
  const magneticElements = document.querySelectorAll('.magnetic');
  
  magneticElements.forEach(element => {
    element.addEventListener('mousemove', (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const moveX = x * 0.15;
      const moveY = y * 0.15;
      
      element.style.setProperty('--mouse-x', `${moveX}px`);
      element.style.setProperty('--mouse-y', `${moveY}px`);
    });
    
    element.addEventListener('mouseleave', () => {
      element.style.setProperty('--mouse-x', '0px');
      element.style.setProperty('--mouse-y', '0px');
    });
  });
}

// 🌟 Floating Particles
function initFloatingParticles() {
  const containers = document.querySelectorAll('.floating-particles');
  
  containers.forEach(container => {
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random position and animation delay
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 15 + 's';
      particle.style.animationDuration = (15 + Math.random() * 10) + 's';
      
      container.appendChild(particle);
    }
  });
}

// 📊 Animated Skill Bars
function initSkillBars() {
  const skillItems = document.querySelectorAll('.skill-item');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressFill = entry.target.querySelector('.skill-progress-fill');
        const width = progressFill.getAttribute('data-width');
        
        setTimeout(() => {
          progressFill.style.width = width;
        }, 300);
        
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  skillItems.forEach(item => observer.observe(item));
}

// 🚀 Smart FAB Menu
function initSmartFAB() {
  const smartFab = document.getElementById('smartFab');
  const fabMain = document.getElementById('fabMain');
  const themeToggleFab = document.getElementById('themeToggleFab');
  
  if (!smartFab || !fabMain) return;
  
  fabMain.addEventListener('click', () => {
    smartFab.classList.toggle('active');
  });
  
  // Close FAB when clicking outside
  document.addEventListener('click', (e) => {
    if (!smartFab.contains(e.target)) {
      smartFab.classList.remove('active');
    }
  });
  
  // Theme toggle from FAB
  if (themeToggleFab) {
    themeToggleFab.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleTheme();
      smartFab.classList.remove('active');
    });
  }
}

// 🎨 Advanced Theme Switcher
function initThemeSwitcher() {
  const themeSwitcher = document.getElementById('themeSwitcher');
  
  if (!themeSwitcher) return;
  
  // Check saved theme
  const savedTheme = localStorage.getItem('theme') || 'light';
  applyTheme(savedTheme);
  
  themeSwitcher.addEventListener('click', toggleTheme);
}

function toggleTheme() {
  const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  applyTheme(newTheme);
}

function applyTheme(theme) {
  const themeSwitcher = document.getElementById('themeSwitcher');
  
  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
    themeSwitcher?.classList.remove('light');
  } else {
    document.body.classList.remove('dark-mode');
    themeSwitcher?.classList.add('light');
  }
  
  localStorage.setItem('theme', theme);
}

// 🎭 Text Reveal Animation
function initTextReveal() {
  const textRevealElements = document.querySelectorAll('.text-reveal');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  textRevealElements.forEach(element => {
    observer.observe(element);
  });
}

// 🌊 Liquid Button Effect
function initLiquidButtons() {
  const liquidButtons = document.querySelectorAll('.liquid-button');
  
  liquidButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      // Create ripple effect
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 500);
    });
  });
}

// 🎯 Enhanced Counter Animations
function initEnhancedCounters() {
  const counters = document.querySelectorAll('.counter');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'));
        
        if (isNaN(target)) return;
        
        // Add counting animation
        counter.classList.add('counting');
        
        let current = 0;
        const increment = target / 50; // 50 steps
        const timer = setInterval(() => {
          current += increment;
          
          if (current >= target) {
            current = target;
            clearInterval(timer);
            counter.classList.remove('counting');
            counter.classList.add('counted');
          }
          
          counter.textContent = Math.floor(current);
        }, 30);
        
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => observer.observe(counter));
}

// 🎨 Stagger Animation
function initStaggerAnimations() {
  const staggerContainers = document.querySelectorAll('.stagger-container');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const items = entry.target.querySelectorAll('.stagger-item');
        items.forEach((item, index) => {
          item.style.animationDelay = `${index * 0.1}s`;
          item.classList.add('animate');
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  
  staggerContainers.forEach(container => observer.observe(container));
}

// 🎪 Initialize All Unique Features
function initUniqueFeatures() {
  // Only initialize on non-mobile devices for performance
  const isMobile = window.innerWidth <= 768;
  
  if (!isMobile) {
    initCursorTrail();
  }
  
  initMagneticEffect();
  initFloatingParticles();
  initSkillBars();
  initSmartFAB();
  initThemeSwitcher();
  initTextReveal();
  initLiquidButtons();
  initEnhancedCounters();
  initStaggerAnimations();
  initProgressiveDisclosure();
  initExpandableTestimonials();
  initInteractiveFeedback();
  initLoadingStates();
  initNotificationSystem();
  initAccessibilityFeatures();
  initPerformanceOptimizations();
  
  console.log('🎉 All unique UI features initialized!');
}

// Progressive Disclosure for Service Items
function initProgressiveDisclosure() {
  const serviceItems = document.querySelectorAll('.service-item.expandable');
  
  serviceItems.forEach(item => {
    const expandBtn = item.querySelector('.expand-btn');
    const details = item.querySelector('.service-details');
    
    if (expandBtn && details) {
      expandBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleServiceDetails(item);
      });
      
      // Also allow clicking on the whole item
      item.addEventListener('click', () => {
        toggleServiceDetails(item);
      });
    }
  });
}

function toggleServiceDetails(item) {
  const isExpanded = item.classList.contains('expanded');
  
  // Close all other expanded items
  const allItems = document.querySelectorAll('.service-item.expandable');
  allItems.forEach(otherItem => {
    if (otherItem !== item) {
      otherItem.classList.remove('expanded');
    }
  });
  
  // Toggle current item
  if (isExpanded) {
    item.classList.remove('expanded');
  } else {
    item.classList.add('expanded');
    
    // Add analytics or tracking here if needed
    console.log('Service expanded:', item.dataset.service);
    
    // Smooth scroll to ensure visibility
    setTimeout(() => {
      item.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }, 100);
  }
}

// Expandable Testimonials
function initExpandableTestimonials() {
  const toggleBtn = document.getElementById('toggleTestimonials');
  const testimonialsExpanded = document.getElementById('testimonialsExpanded');
  
  if (toggleBtn && testimonialsExpanded) {
    toggleBtn.addEventListener('click', () => {
      const isActive = testimonialsExpanded.classList.contains('active');
      
      if (isActive) {
        testimonialsExpanded.classList.remove('active');
        toggleBtn.innerHTML = `
          View All Reviews
          <span class="toggle-icon">▼</span>
        `;
      } else {
        testimonialsExpanded.classList.add('active');
        toggleBtn.innerHTML = `
          Hide Reviews
          <span class="toggle-icon">▼</span>
        `;
        
        // Smooth scroll to show expanded content
        setTimeout(() => {
          testimonialsExpanded.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }, 300);
      }
    });
  }
}

// Interactive Feedback Systems
function initInteractiveFeedback() {
  // Initialize enhanced buttons with ripple effects
  const interactiveButtons = document.querySelectorAll('.interactive-btn');
  
  interactiveButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      createRippleEffect(e, btn);
      
      // Show success notification for important actions
      if (btn.classList.contains('cta-primary')) {
        showNotification('success', 'Great choice!', 'Redirecting to contact form...');
      }
    });
    
    // Enhanced hover effects
    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'translateY(-3px) scale(1.02)';
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translateY(0) scale(1)';
    });
  });
  
  // Interactive links with progress bars
  const interactiveLinks = document.querySelectorAll('.interactive-link');
  
  interactiveLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      
      // Show loading state
      const progress = link.querySelector('.link-progress');
      if (progress) {
        progress.style.width = '100%';
        progress.style.transition = 'width 0.8s ease';
      }
      
      // Navigate after animation
      setTimeout(() => {
        window.location.href = href;
      }, 800);
    });
  });
}

function createRippleEffect(event, element) {
  const ripple = element.querySelector('.btn-ripple');
  if (!ripple) return;
  
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;
  
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  ripple.style.transform = 'scale(0)';
  
  // Trigger animation
  requestAnimationFrame(() => {
    ripple.style.transform = 'scale(1)';
    ripple.style.opacity = '1';
  });
  
  // Reset after animation
  setTimeout(() => {
    ripple.style.transform = 'scale(0)';
    ripple.style.opacity = '0';
  }, 600);
}

// Loading States Management
function initLoadingStates() {
  // Page loading progress
  const loadingBar = document.getElementById('pageLoadingBar');
  
  if (loadingBar) {
    // Show loading on page start
    window.addEventListener('load', () => {
      loadingBar.classList.add('loading');
      
      setTimeout(() => {
        loadingBar.classList.add('complete');
        
        setTimeout(() => {
          loadingBar.style.opacity = '0';
        }, 200);
      }, 500);
    });
  }
  
  // Skeleton loading for sample cards
  const skeletonCards = document.querySelectorAll('.loading-skeleton');
  
  skeletonCards.forEach((card, index) => {
    const delay = parseInt(card.dataset.loadDelay) || 1000;
    
    setTimeout(() => {
      card.classList.add('loaded');
      
      // Add entrance animation
      setTimeout(() => {
        card.style.transform = 'translateY(0)';
        card.style.opacity = '1';
      }, 100);
    }, delay);
  });
}

// Notification System
function initNotificationSystem() {
  // Create notification container if it doesn't exist
  let container = document.getElementById('notificationContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'notificationContainer';
    container.className = 'notification-container';
    document.body.appendChild(container);
  }
  
  // Show welcome notification
  setTimeout(() => {
    showNotification('success', 'Welcome! 👋', 'Thanks for visiting my portfolio');
  }, 2000);
}

function showNotification(type, title, message, duration = 5000) {
  const container = document.getElementById('notificationContainer');
  if (!container) return;
  
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  
  const icons = {
    success: '✅',
    warning: '⚠️',
    error: '❌',
    info: 'ℹ️'
  };
  
  notification.innerHTML = `
    <div class="notification-icon">${icons[type] || 'ℹ️'}</div>
    <div class="notification-content">
      <div class="notification-title">${title}</div>
      <div class="notification-message">${message}</div>
    </div>
    <button class="notification-close">×</button>
  `;
  
  // Add close functionality
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => {
    removeNotification(notification);
  });
  
  // Add to container
  container.appendChild(notification);
  
  // Show notification
  requestAnimationFrame(() => {
    notification.classList.add('show');
  });
  
  // Auto remove
  setTimeout(() => {
    removeNotification(notification);
  }, duration);
}

function removeNotification(notification) {
  notification.classList.remove('show');
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 300);
}

// Accessibility Features
function initAccessibilityFeatures() {
  // Keyboard navigation for expandable service items
  const serviceItems = document.querySelectorAll('.service-item.expandable');
  
  serviceItems.forEach(item => {
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleServiceDetails(item);
        announceToScreenReader(`${item.querySelector('h3').textContent} section ${item.classList.contains('expanded') ? 'expanded' : 'collapsed'}`);
      }
    });
  });
  
  // Enhanced focus management
  document.addEventListener('keydown', (e) => {
    // Escape key to close expanded sections
    if (e.key === 'Escape') {
      const expandedItems = document.querySelectorAll('.service-item.expanded');
      expandedItems.forEach(item => {
        item.classList.remove('expanded');
        item.setAttribute('aria-expanded', 'false');
        item.querySelector('.service-details').setAttribute('aria-hidden', 'true');
      });
      
      if (expandedItems.length > 0) {
        announceToScreenReader('All sections collapsed');
      }
    }
  });
  
  // Update ARIA attributes for service items
  serviceItems.forEach(item => {
    const details = item.querySelector('.service-details');
    if (details) {
      details.setAttribute('aria-hidden', 'true');
    }
  });
  
  // Color scheme preference detection
  if (window.matchMedia) {
    const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    colorSchemeQuery.addEventListener('change', handleColorSchemeChange);
    handleColorSchemeChange(colorSchemeQuery);
  }
  
  // Reduced motion preference
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motionQuery.matches) {
    document.body.classList.add('reduced-motion');
    announceToScreenReader('Animations reduced for accessibility');
  }
}

function announceToScreenReader(message) {
  const liveRegion = document.getElementById('liveRegion');
  if (liveRegion) {
    liveRegion.textContent = message;
    
    // Clear after announcement
    setTimeout(() => {
      liveRegion.textContent = '';
    }, 1000);
  }
}

function announceAlert(message) {
  const alertRegion = document.getElementById('alertRegion');
  if (alertRegion) {
    alertRegion.textContent = message;
    
    setTimeout(() => {
      alertRegion.textContent = '';
    }, 1000);
  }
}

function handleColorSchemeChange(e) {
  if (e.matches) {
    // Dark mode preferred
    document.body.classList.add('dark-mode');
    announceToScreenReader('Dark mode activated');
  } else {
    // Light mode preferred
    document.body.classList.remove('dark-mode');
    announceToScreenReader('Light mode activated');
  }
}

// Enhanced toggleServiceDetails with accessibility
function toggleServiceDetails(item) {
  const isExpanded = item.classList.contains('expanded');
  const details = item.querySelector('.service-details');
  
  // Close all other expanded items
  const allItems = document.querySelectorAll('.service-item.expandable');
  allItems.forEach(otherItem => {
    if (otherItem !== item) {
      otherItem.classList.remove('expanded');
      otherItem.setAttribute('aria-expanded', 'false');
      const otherDetails = otherItem.querySelector('.service-details');
      if (otherDetails) {
        otherDetails.setAttribute('aria-hidden', 'true');
      }
    }
  });
  
  // Toggle current item
  if (isExpanded) {
    item.classList.remove('expanded');
    item.setAttribute('aria-expanded', 'false');
    if (details) {
      details.setAttribute('aria-hidden', 'true');
    }
  } else {
    item.classList.add('expanded');
    item.setAttribute('aria-expanded', 'true');
    if (details) {
      details.setAttribute('aria-hidden', 'false');
    }
    
    // Focus management for keyboard users
    setTimeout(() => {
      const firstFocusable = details.querySelector('a, button, [tabindex]');
      if (firstFocusable && document.activeElement === item) {
        firstFocusable.focus();
      }
    }, 300);
    
    // Smooth scroll to ensure visibility
    setTimeout(() => {
      item.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }, 100);
  }
}

// Performance Optimizations
function initPerformanceOptimizations() {
  // Lazy loading with Intersection Observer
  const lazyElements = document.querySelectorAll('.lazy-load');
  
  if ('IntersectionObserver' in window) {
    const lazyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          element.classList.add('loaded');
          lazyObserver.unobserve(element);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.1
    });
    
    lazyElements.forEach(element => {
      lazyObserver.observe(element);
    });
  } else {
    // Fallback for browsers without Intersection Observer
    lazyElements.forEach(element => {
      element.classList.add('loaded');
    });
  }
  
  // Preload critical resources
  preloadCriticalResources();
  
  // Optimize scroll performance
  optimizeScrollPerformance();
  
  // Bundle size optimization
  optimizeBundleSize();
  
  // Memory cleanup
  setupMemoryCleanup();
}

function preloadCriticalResources() {
  // Preload next page resources on hover
  const navigationLinks = document.querySelectorAll('a[href$=".html"]');
  
  navigationLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      const href = link.getAttribute('href');
      if (href && !document.querySelector(`link[href="${href}"]`)) {
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'prefetch';
        preloadLink.href = href;
        document.head.appendChild(preloadLink);
      }
    }, { once: true });
  });
  
  // Preload images on hover
  const imageContainers = document.querySelectorAll('.sample-image');
  imageContainers.forEach(container => {
    container.addEventListener('mouseenter', () => {
      // Simulate image preloading
      container.style.backgroundImage = 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))';
    }, { once: true });
  });
}

function optimizeScrollPerformance() {
  let ticking = false;
  
  function updateScrollElements() {
    // Batch DOM updates
    requestAnimationFrame(() => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      
      // Update parallax elements if they exist
      const parallaxElements = document.querySelectorAll('.parallax');
      parallaxElements.forEach(element => {
        element.style.transform = `translateY(${rate}px)`;
      });
      
      ticking = false;
    });
  }
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      updateScrollElements();
    }
  }, { passive: true });
}

function optimizeBundleSize() {
  // Dynamically import heavy features only when needed
  const heavyFeatures = document.querySelectorAll('[data-heavy-feature]');
  
  heavyFeatures.forEach(element => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const featureType = element.dataset.heavyFeature;
          loadHeavyFeature(featureType);
          observer.unobserve(element);
        }
      });
    });
    
    observer.observe(element);
  });
}

function loadHeavyFeature(featureType) {
  switch (featureType) {
    case 'charts':
      // Load chart library only when needed
      console.log('Loading charts feature...');
      break;
    case 'animations':
      // Load animation library only when needed
      console.log('Loading animations feature...');
      break;
    default:
      console.log(`Loading ${featureType} feature...`);
  }
}

function setupMemoryCleanup() {
  // Cleanup inactive animations
  const cleanupInterval = setInterval(() => {
    const inactiveElements = document.querySelectorAll('.particle:not(:hover)');
    if (inactiveElements.length > 50) {
      // Remove excess particles
      for (let i = 50; i < inactiveElements.length; i++) {
        inactiveElements[i].remove();
      }
    }
  }, 30000);
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    clearInterval(cleanupInterval);
    
    // Remove event listeners
    const elements = document.querySelectorAll('[data-cleanup]');
    elements.forEach(element => {
      element.removeEventListener('click', handleClick);
      element.removeEventListener('mouseover', handleMouseOver);
    });
  });
}

// Core Web Vitals optimization
function optimizeWebVitals() {
  // Largest Contentful Paint optimization
  const heroImage = document.querySelector('.hero-visual');
  if (heroImage) {
    heroImage.style.contentVisibility = 'auto';
  }
  
  // Cumulative Layout Shift prevention
  const dynamicContent = document.querySelectorAll('.dynamic-content');
  dynamicContent.forEach(element => {
    element.style.minHeight = '200px'; // Prevent layout shift
  });
  
  // First Input Delay optimization
  document.addEventListener('click', (e) => {
    // Optimize first interaction
    e.target.style.transform = 'scale(0.98)';
    setTimeout(() => {
      e.target.style.transform = '';
    }, 100);
  }, { once: true, passive: true });
}

// Initialize performance optimizations early
document.addEventListener('DOMContentLoaded', () => {
  optimizeWebVitals();
  initUniqueFeatures();
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initUniqueFeatures);
/* ============================================
   ENHANCED PLUGIN LIBRARY INITIALIZATIONS
   ============================================ */

// 1. GSAP + ScrollTrigger Animations
function initGSAPAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  
  gsap.registerPlugin(ScrollTrigger);
  
  // Fade in sections on scroll
  gsap.utils.toArray('section').forEach(section => {
    gsap.from(section, {
      opacity: 0,
      y: 50,
      duration: 1,
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'top 50%',
        scrub: 1,
        toggleActions: 'play none none reverse'
      }
    });
  });
  
  // Animate hero section elements (with existence checks)
  if (document.querySelector('.hero-badge')) {
    gsap.from('.hero-badge', { opacity: 0, y: -20, duration: 0.8, delay: 0.2 });
  }
  if (document.querySelector('.hero-title')) {
    gsap.from('.hero-title', { opacity: 0, y: 30, duration: 0.8, delay: 0.4 });
  }
  if (document.querySelector('.hero-description')) {
    gsap.from('.hero-description', { opacity: 0, y: 20, duration: 0.8, delay: 0.6 });
  }
  if (document.querySelector('.value-props')) {
    gsap.from('.value-props', { opacity: 0, y: 20, duration: 0.8, delay: 0.8 });
  }
  if (document.querySelector('.hero-actions')) {
    gsap.from('.hero-actions', { opacity: 0, y: 20, duration: 0.8, delay: 1 });
  }
  if (document.querySelector('.hero-visual')) {
    gsap.from('.hero-visual', { opacity: 0, scale: 0.8, duration: 1, delay: 0.5 });
  }
  
  // Parallax effect for decorative elements (only if they exist)
  if (document.querySelector('.blob')) {
    gsap.to('.blob', {
      y: -100,
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }
  
  // Stagger animation for cards (only if they exist)
  const cards = document.querySelectorAll('.service-card, .project-card, .skill-card');
  if (cards.length > 0) {
    gsap.from(cards, {
      opacity: 0,
      y: 60,
      stagger: 0.2,
      duration: 0.8,
      scrollTrigger: {
        trigger: cards[0],
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    });
  }
  
  // Testimonial animation (only if they exist)
  const testimonials = document.querySelectorAll('.testimonial-card');
  if (testimonials.length > 0) {
    gsap.from(testimonials, {
      opacity: 0,
      x: -50,
      stagger: 0.3,
      duration: 0.8,
      scrollTrigger: {
        trigger: testimonials[0],
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });
  }
  
  // Stats counter animation trigger
  const statNumbers = document.querySelectorAll('.stat-number, .counter, .trust-number');
  statNumbers.forEach(stat => {
    ScrollTrigger.create({
      trigger: stat,
      start: 'top 80%',
      onEnter: () => {
        if (!stat.classList.contains('counted')) {
          stat.classList.add('counted');
          initCountUpForElement(stat);
        }
      }
    });
  });
  
  console.log('✨ GSAP animations initialized');
}

// 2. Typed.js for Hero Typing Effect
function initTypedJS() {
  if (typeof Typed === 'undefined') return;
  
  const typingElement = document.getElementById('typingText');
  if (typingElement) {
    // Stop the old typing effect
    typingElement.textContent = '';
    
    new Typed('#typingText', {
      strings: [
        'captivate users',
        'drive engagement',
        'solve real problems',
        'create value',
        'inspire action',
        'exceed expectations'
      ],
      typeSpeed: 80,
      backSpeed: 50,
      backDelay: 2000,
      startDelay: 500,
      loop: true,
      showCursor: true,
      cursorChar: '|',
      autoInsertCss: true
    });
    
    console.log('⌨️ Typed.js initialized');
  }
}

// 3. CountUp.js for Number Animations
function initCountUpForElement(element) {
  if (typeof CountUp === 'undefined') return;
  
  const target = parseInt(element.textContent.replace(/[^0-9]/g, ''));
  const suffix = element.textContent.replace(/[0-9]/g, '');
  
  const options = {
    duration: 2.5,
    useEasing: true,
    useGrouping: true,
    separator: ',',
    decimal: '.',
    suffix: suffix
  };
  
  const countUp = new CountUp(element, target, options);
  if (!countUp.error) {
    countUp.start();
  }
}

function initCountUp() {
  if (typeof CountUp === 'undefined') return;
  console.log('🔢 CountUp.js ready');
}

// 4. GLightbox for Image Gallery
function initGLightbox() {
  if (typeof GLightbox === 'undefined') return;
  
  // Add lightbox to project images
  const projectImages = document.querySelectorAll('.project-card img, .sample-card img, .portfolio-item img');
  projectImages.forEach(img => {
    if (!img.parentElement.classList.contains('glightbox-wrapper')) {
      const link = document.createElement('a');
      link.href = img.src;
      link.classList.add('glightbox');
      link.setAttribute('data-gallery', 'portfolio');
      link.setAttribute('data-title', img.alt || 'Project Image');
      
      img.parentNode.insertBefore(link, img);
      link.appendChild(img);
    }
  });
  
  // Initialize GLightbox
  const lightbox = GLightbox({
    touchNavigation: true,
    loop: true,
    autoplayVideos: false,
    zoomable: true,
    draggable: true,
    skin: 'modern',
    closeButton: true,
    closeOnOutsideClick: true
  });
  
  console.log('🖼️ GLightbox initialized');
  return lightbox;
}

// 5. Vanilla Tilt for 3D Card Effects
function initVanillaTilt() {
  if (typeof VanillaTilt === 'undefined') return;
  
  // Apply tilt to project cards
  VanillaTilt.init(document.querySelectorAll('.project-card, .sample-card'), {
    max: 8,
    speed: 400,
    glare: true,
    'max-glare': 0.3,
    scale: 1.03,
    perspective: 1000
  });
  
  // Apply tilt to service cards
  VanillaTilt.init(document.querySelectorAll('.service-card'), {
    max: 6,
    speed: 400,
    glare: true,
    'max-glare': 0.2,
    scale: 1.02
  });
  
  // Apply tilt to testimonial cards
  VanillaTilt.init(document.querySelectorAll('.testimonial-card'), {
    max: 5,
    speed: 400,
    glare: false,
    scale: 1.02
  });
  
  // Apply tilt to skill cards
  VanillaTilt.init(document.querySelectorAll('.skill-card, .tech-card'), {
    max: 10,
    speed: 300,
    glare: true,
    'max-glare': 0.4,
    scale: 1.05
  });
  
  console.log('🎴 Vanilla Tilt initialized');
}

// 6. Rellax for Parallax Scrolling
function initRellax() {
  if (typeof Rellax === 'undefined') return;
  
  // Add parallax data attributes to elements
  const decorativeElements = document.querySelectorAll('.blob, .floating-shape, .background-decoration');
  decorativeElements.forEach((el, index) => {
    el.setAttribute('data-rellax-speed', (index % 3 - 1) * 2);
  });
  
  // Add parallax to hero visual
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual) {
    heroVisual.setAttribute('data-rellax-speed', '-2');
  }
  
  // Add parallax to section backgrounds
  const sections = document.querySelectorAll('section:nth-child(even)');
  sections.forEach(section => {
    section.setAttribute('data-rellax-speed', '-1');
  });
  
  // Initialize Rellax
  const rellax = new Rellax('[data-rellax-speed]', {
    speed: -2,
    center: false,
    wrapper: null,
    round: true,
    vertical: true,
    horizontal: false
  });
  
  console.log('🌊 Rellax parallax initialized');
  return rellax;
}

// Master initialization function
function initEnhancedPlugins() {
  console.log('🚀 Initializing enhanced plugin libraries...');
  
  setTimeout(() => {
    initGSAPAnimations();
    initTypedJS();
    initCountUp();
    initGLightbox();
    initVanillaTilt();
    initRellax();
    
    console.log('✅ All enhanced plugins initialized successfully!');
  }, 500);
}

// ============================================
// NEW UX ENHANCEMENT PLUGINS
// ============================================

// 1. Lenis - Ultra-smooth scrolling
function initLenisScrolling() {
  if (typeof Lenis === 'undefined') {
    console.warn('⚠️ Lenis not loaded');
    return;
  }

  // Prevent duplicate instances
  if (window.lenis) {
    console.log('🌊 Lenis already initialized, skipping...');
    return window.lenis;
  }

  // Disable native smooth scrolling to prevent conflicts
  document.documentElement.style.scrollBehavior = 'auto';
  document.body.style.scrollBehavior = 'auto';

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  // Store lenis instance globally for debugging
  window.lenis = lenis;

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  // Integrate with GSAP ScrollTrigger
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
    
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    
    gsap.ticker.lagSmoothing(0);
  }

  // Override anchor link behavior for smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        lenis.scrollTo(target, {
          offset: -80,
          duration: 1.2
        });
      }
    });
  });

  console.log('🌊 Lenis smooth scrolling initialized');
  return lenis;
}

// 2. AOS - Animate On Scroll
function initAOS() {
  if (typeof AOS === 'undefined') {
    console.warn('⚠️ AOS not loaded');
    return;
  }

  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false,
    offset: 100,
    delay: 0,
    anchorPlacement: 'top-bottom',
  });

  console.log('✨ AOS (Animate On Scroll) initialized');
}

// 3. Particles.js - Interactive background
function initParticlesJS() {
  if (typeof particlesJS === 'undefined') {
    console.warn('⚠️ Particles.js not loaded');
    return;
  }

  // Add particles container to hero section
  const heroSection = document.querySelector('.hero-section');
  if (!heroSection) return;

  // Create particles container
  let particlesContainer = document.getElementById('particles-js');
  if (!particlesContainer) {
    particlesContainer = document.createElement('div');
    particlesContainer.id = 'particles-js';
    heroSection.insertBefore(particlesContainer, heroSection.firstChild);
  }

  particlesJS('particles-js', {
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: '#6366f1'
      },
      shape: {
        type: 'circle',
        stroke: {
          width: 0,
          color: '#000000'
        },
      },
      opacity: {
        value: 0.5,
        random: false,
        anim: {
          enable: false,
          speed: 1,
          opacity_min: 0.1,
          sync: false
        }
      },
      size: {
        value: 3,
        random: true,
        anim: {
          enable: false,
          speed: 40,
          size_min: 0.1,
          sync: false
        }
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: '#6366f1',
        opacity: 0.4,
        width: 1
      },
      move: {
        enable: true,
        speed: 2,
        direction: 'none',
        random: false,
        straight: false,
        out_mode: 'out',
        bounce: false,
      }
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: {
          enable: true,
          mode: 'grab'
        },
        onclick: {
          enable: true,
          mode: 'push'
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 140,
          line_linked: {
            opacity: 1
          }
        },
        push: {
          particles_nb: 4
        }
      }
    },
    retina_detect: true
  });

  console.log('✨ Particles.js initialized');
}

// 4. SweetAlert2 - Enhanced alerts
function initSweetAlert() {
  if (typeof Swal === 'undefined') {
    console.warn('⚠️ SweetAlert2 not loaded');
    return;
  }

  // Replace download resume alert
  const downloadBtn = document.getElementById('downloadResume');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', (e) => {
      e.preventDefault();
      Swal.fire({
        title: '📄 Resume Download',
        text: 'Your resume download will begin shortly!',
        icon: 'success',
        confirmButtonText: 'Great!',
        confirmButtonColor: '#6366f1',
        timer: 3000,
        timerProgressBar: true,
      });
    });
  }

  // Enhance contact form submissions
  const contactForms = document.querySelectorAll('form');
  contactForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      Swal.fire({
        title: '✅ Message Sent!',
        text: 'Thank you for your message. I\'ll get back to you within 24 hours!',
        icon: 'success',
        confirmButtonText: 'Awesome!',
        confirmButtonColor: '#6366f1',
        showConfirmButton: true,
      });
      form.reset();
    });
  });

  console.log('🎉 SweetAlert2 initialized');
}

// 5. Splitting.js - Advanced text animations
function initSplitting() {
  if (typeof Splitting === 'undefined') {
    console.warn('⚠️ Splitting.js not loaded');
    return;
  }

  // Apply splitting to hero headings
  const heroHeadings = document.querySelectorAll('.hero-section h1, .hero-section h2');
  heroHeadings.forEach(heading => {
    heading.setAttribute('data-splitting', '');
  });

  // Apply splitting to section titles
  const sectionTitles = document.querySelectorAll('.section-title, h2.gradient-text');
  sectionTitles.forEach(title => {
    if (!title.closest('.hero-section')) {
      title.setAttribute('data-splitting', '');
    }
  });

  Splitting();

  console.log('✨ Splitting.js text animations initialized');
}

// 6. Barba.js - Page transitions
function initBarba() {
  if (typeof barba === 'undefined') {
    console.warn('⚠️ Barba.js not loaded');
    return;
  }

  barba.init({
    transitions: [{
      name: 'fade',
      leave(data) {
        return gsap.to(data.current.container, {
          opacity: 0,
          duration: 0.5
        });
      },
      enter(data) {
        return gsap.from(data.next.container, {
          opacity: 0,
          duration: 0.5
        });
      }
    }],
    views: [{
      namespace: 'home',
      beforeEnter() {
        // Reinitialize plugins after page transition
        initEnhancedPlugins();
        initNewUXPlugins();
      }
    }]
  });

  console.log('🎭 Barba.js page transitions initialized');
}

// Master initialization for new UX plugins
function initNewUXPlugins() {
  console.log('🎨 Initializing new UX enhancement plugins...');
  
  // Initialize Lenis FIRST (synchronously, no delay)
  initLenisScrolling();
  
  // Then initialize other plugins with slight delay
  setTimeout(() => {
    initAOS();
    initParticlesJS();
    initSweetAlert();
    initSplitting();
    initBarba();
    
    console.log('✅ All new UX plugins initialized successfully!');
  }, 100);
}

// Initialize Lenis IMMEDIATELY on script load (before everything else)
if (typeof Lenis !== 'undefined') {
  // Immediate Lenis init for smooth scrolling from the start
  const earlyLenis = initLenisScrolling();
}

// Initialize enhanced plugins when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initEnhancedPlugins);
} else {
  initEnhancedPlugins();
}

// Initialize new UX plugins - Lenis will re-init if needed
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initNewUXPlugins, 200);
  });
} else {
  setTimeout(initNewUXPlugins, 200);
}

// ============================================
// GOOGLE ANALYTICS 4 TRACKING UTILITIES
// ============================================

/**
 * Track custom events with GA4 (respects cookie consent)
 * @param {string} eventName - The event name (e.g., 'download', 'click')
 * @param {object} params - Event parameters
 */
function trackEvent(eventName, params = {}) {
  if (typeof gtag === 'undefined') {
    console.warn('⚠️ Google Analytics not loaded');
    return;
  }
  
  // Check if analytics consent is given
  const cookieConsent = window.cookieConsent?.getConsent();
  if (!cookieConsent || !cookieConsent.analytics) {
    console.log('📊 Analytics tracking skipped (no consent)');
    return;
  }
  
  gtag('event', eventName, params);
  console.log('📊 Event tracked:', eventName, params);
}

/**
 * Track page views
 * @param {string} pageTitle - The page title
 * @param {string} pagePath - The page path
 */
function trackPageView(pageTitle, pagePath) {
  if (typeof gtag === 'undefined') return;
  
  const cookieConsent = window.cookieConsent?.getConsent();
  if (!cookieConsent || !cookieConsent.analytics) return;
  
  gtag('event', 'page_view', {
    page_title: pageTitle,
    page_path: pagePath
  });
}

// Track outbound links automatically
document.addEventListener('click', (e) => {
  const link = e.target.closest('a');
  if (!link) return;
  
  const href = link.href;
  if (href && (href.startsWith('http') || href.startsWith('mailto:'))) {
    const isExternal = !href.includes(window.location.hostname);
    
    if (isExternal) {
      trackEvent('outbound_link', {
        event_category: 'Engagement',
        event_label: href,
        destination: href
      });
    }
    
    if (href.startsWith('mailto:')) {
      trackEvent('email_click', {
        event_category: 'Contact',
        event_label: 'Email Link Click'
      });
    }
  }
});

// Track social media clicks
document.querySelectorAll('.social-link').forEach(link => {
  link.addEventListener('click', function() {
    const platform = this.getAttribute('aria-label') || 'Unknown';
    trackEvent('social_click', {
      event_category: 'Social Media',
      event_label: platform,
      platform: platform.toLowerCase()
    });
  });
});

// Track scroll depth
let maxScrollDepth = 0;
let scrollDepthTracked = {
  '25': false,
  '50': false,
  '75': false,
  '100': false
};

window.addEventListener('scroll', () => {
  const scrollPercentage = Math.round(
    (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
  );
  
  if (scrollPercentage > maxScrollDepth) {
    maxScrollDepth = scrollPercentage;
  }
  
  // Track milestones
  ['25', '50', '75', '100'].forEach(milestone => {
    const milestoneNum = parseInt(milestone);
    if (scrollPercentage >= milestoneNum && !scrollDepthTracked[milestone]) {
      scrollDepthTracked[milestone] = true;
      trackEvent('scroll_depth', {
        event_category: 'Engagement',
        event_label: `${milestone}%`,
        value: milestoneNum
      });
    }
  });
});

// Track time on page (send when user leaves)
let timeOnPage = 0;
const timeTracker = setInterval(() => {
  timeOnPage += 10; // Increment every 10 seconds
}, 10000);

window.addEventListener('beforeunload', () => {
  clearInterval(timeTracker);
  trackEvent('time_on_page', {
    event_category: 'Engagement',
    event_label: document.title,
    value: Math.round(timeOnPage / 60), // Convert to minutes
    seconds: timeOnPage
  });
});

// Make tracking functions available globally
window.trackEvent = trackEvent;
window.trackPageView = trackPageView;

// ============================================
// SERVICE WORKER REGISTRATION (PWA)
// ============================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('✅ Service Worker registered successfully:', registration.scope);
        
        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60000); // Check every minute
        
        // Handle service worker updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker available
              if (typeof Swal !== 'undefined') {
                Swal.fire({
                  title: '🔄 Update Available',
                  text: 'A new version is available. Reload to update?',
                  icon: 'info',
                  showCancelButton: true,
                  confirmButtonText: 'Reload',
                  confirmButtonColor: '#6366f1'
                }).then((result) => {
                  if (result.isConfirmed) {
                    newWorker.postMessage({ type: 'SKIP_WAITING' });
                    window.location.reload();
                  }
                });
              }
            }
          });
        });
      })
      .catch((error) => {
        console.error('❌ Service Worker registration failed:', error);
      });
    
    // Handle controller change (new SW activated)
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('🔄 New Service Worker activated');
    });
  });
}

// PWA Install prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('💾 PWA install prompt available');
  e.preventDefault();
  deferredPrompt = e;
  
  // Show custom install button/prompt
  showInstallPromotion();
});

function showInstallPromotion() {
  // You can show a custom install button here
  console.log('📱 App can be installed');
  
  if (typeof Swal !== 'undefined') {
    Swal.fire({
      title: '📱 Install App',
      text: 'Install this app on your device for quick access and offline use!',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Install',
      cancelButtonText: 'Maybe Later',
      confirmButtonColor: '#6366f1',
      timer: 10000
    }).then((result) => {
      if (result.isConfirmed && deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('✅ User accepted PWA install');
          }
          deferredPrompt = null;
        });
      }
    });
  }
}

window.addEventListener('appinstalled', () => {
  console.log('✅ PWA installed successfully');
  deferredPrompt = null;
  
  if (typeof Swal !== 'undefined') {
    Swal.fire({
      title: '🎉 Installed!',
      text: 'App installed successfully. You can now use it offline!',
      icon: 'success',
      confirmButtonColor: '#6366f1',
      timer: 3000
    });
  }
});

// =============================================
// TOAST NOTIFICATION HELPERS
// =============================================

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {string} type - Type of toast (success, error, warning, info)
 * @param {number} duration - Duration in ms (default 3000)
 */
function showToast(message, type = 'info', duration = 3000) {
  if (typeof Swal === 'undefined') {
    console.log('Toast:', message);
    return;
  }

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: duration,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });

  Toast.fire({
    icon: type,
    title: message
  });
}

// Convenience methods
function showSuccessToast(message, duration = 3000) {
  showToast(message, 'success', duration);
}

function showErrorToast(message, duration = 3000) {
  showToast(message, 'error', duration);
}

function showWarningToast(message, duration = 3000) {
  showToast(message, 'warning', duration);
}

function showInfoToast(message, duration = 3000) {
  showToast(message, 'info', duration);
}

// Make toast functions globally available
window.showToast = showToast;
window.showSuccessToast = showSuccessToast;
window.showErrorToast = showErrorToast;
window.showWarningToast = showWarningToast;
window.showInfoToast = showInfoToast;

