// ===== THEME MANAGEMENT =====
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.toggleButton = document.getElementById('theme-toggle');
        this.init();
    }

    init() {
        this.setTheme(this.theme);
        this.toggleButton.addEventListener('click', () => this.toggleTheme());
    }

    setTheme(theme) {
        this.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
}

// ===== NAVIGATION MANAGEMENT =====
class NavigationManager {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.lastScrollY = window.scrollY;
        this.init();
    }

    init() {
        this.hamburger.addEventListener('click', () => this.toggleMobileMenu());
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });
        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('resize', () => this.handleResize());
    }

    toggleMobileMenu() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
    }

    closeMobileMenu() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    handleScroll() {
        const currentScrollY = window.scrollY;
        
        // Add/remove background on scroll
        if (currentScrollY > 100) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }

        this.lastScrollY = currentScrollY;
    }

    handleResize() {
        if (window.innerWidth > 768) {
            this.closeMobileMenu();
        }
    }
}

// ===== SMOOTH SCROLLING =====
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ===== SCROLL ANIMATIONS =====
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('.fade-in');
        this.observer = null;
        this.init();
    }

    init() {
        // Add fade-in class to elements
        const elementsToAnimate = [
            ...document.querySelectorAll('.skill-item'),
            ...document.querySelectorAll('.project-card'),
            ...document.querySelectorAll('.timeline-item'),
            ...document.querySelectorAll('.contact-item'),
            document.querySelector('.hero-content'),
            document.querySelector('.about-content'),
            document.querySelector('.section-header')
        ].filter(el => el !== null);

        elementsToAnimate.forEach(el => el.classList.add('fade-in'));

        // Set up Intersection Observer
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe all fade-in elements
        document.querySelectorAll('.fade-in').forEach(el => {
            this.observer.observe(el);
        });
    }
}

// ===== CONTACT FORM MANAGEMENT =====
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.submitButton = this.form.querySelector('.btn-submit');
        this.successMessage = document.getElementById('form-success');
        this.inputs = this.form.querySelectorAll('input, textarea');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateInput(input));
            input.addEventListener('input', () => this.clearErrors(input));
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        // Validate all inputs
        let isValid = true;
        this.inputs.forEach(input => {
            if (!this.validateInput(input)) {
                isValid = false;
            }
        });

        if (!isValid) return;

        // Show loading state
        this.setLoadingState(true);

        // Show production alert instead of actual submission
        try {
            await this.simulateFormSubmission();
            // Production alert for form submission
            this.showCustomAlert({
                title: 'Under Production',
                message: 'This contact form is currently under development. Your message cannot be sent at this time.',
                contacts: [
                    { icon: '📧', text: 'Email: lavshakya514@gmail.com', link: 'mailto:lavshakya514@gmail.com' },
                    { icon: '💼', text: 'LinkedIn: linkedin.com/in/lav-kumar-shakya-86a87a287', link: 'https://www.linkedin.com/in/lav-kumar-shakya-86a87a287' }
                ],
                type: 'production'
            });
        } catch (error) {
            this.showError('Something went wrong. Please try again.');
        } finally {
            this.setLoadingState(false);
        }
    }

    validateInput(input) {
        const value = input.value.trim();
        const isEmail = input.type === 'email';
        let isValid = true;
        let errorMessage = '';

        // Remove existing error styling
        input.classList.remove('error');
        this.removeErrorMessage(input);

        // Required field validation
        if (!value) {
            errorMessage = 'This field is required';
            isValid = false;
        }
        // Email validation
        else if (isEmail && !this.isValidEmail(value)) {
            errorMessage = 'Please enter a valid email address';
            isValid = false;
        }
        // Name validation (at least 2 characters)
        else if (input.name === 'name' && value.length < 2) {
            errorMessage = 'Name must be at least 2 characters long';
            isValid = false;
        }
        // Message validation (at least 10 characters)
        else if (input.name === 'message' && value.length < 10) {
            errorMessage = 'Message must be at least 10 characters long';
            isValid = false;
        }

        if (!isValid) {
            this.showInputError(input, errorMessage);
        }

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showInputError(input, message) {
        input.classList.add('error');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            opacity: 0;
            animation: fadeInError 0.2s ease forwards;
        `;

        input.parentNode.appendChild(errorElement);
    }

    removeErrorMessage(input) {
        const errorElement = input.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    clearErrors(input) {
        input.classList.remove('error');
        this.removeErrorMessage(input);
    }

    setLoadingState(loading) {
        this.submitButton.classList.toggle('loading', loading);
        this.submitButton.disabled = loading;
    }

    async simulateFormSubmission() {
        // Simulate API call delay
        return new Promise(resolve => setTimeout(resolve, 2000));
    }

    showSuccess() {
        this.successMessage.classList.add('show');
        
        // Reset form after showing success
        setTimeout(() => {
            this.form.reset();
            this.successMessage.classList.remove('show');
        }, 4000);
    }

    showError(message) {
        // You can implement error display here
        alert(message); // Simple fallback
    }

    showCustomAlert(options) {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'alert-overlay';
        
        // Create alert container
        const alertContainer = document.createElement('div');
        alertContainer.className = 'custom-alert';
        
        // Build alert HTML
        alertContainer.innerHTML = `
            <div class="alert-header">
                <div class="alert-icon">🚧</div>
                <h3 class="alert-title">${options.title}</h3>
            </div>
            <div class="alert-body">
                <p>${options.message}</p>
                <div class="alert-contacts">
                    <p class="highlight">For immediate contact, please reach out via:</p>
                    ${options.contacts.map(contact => 
                        `<div class="alert-contact-item">
                            <span class="alert-contact-icon">${contact.icon}</span>
                            <a href="${contact.link}" target="_blank" rel="noopener noreferrer" class="alert-contact-link">${contact.text}</a>
                        </div>`
                    ).join('')}
                </div>
            </div>
            <div class="alert-footer">
                <button class="alert-btn alert-btn-primary" onclick="this.closest('.alert-overlay').remove()">
                    Got it!
                </button>
            </div>
        `;
        
        // Add to DOM
        overlay.appendChild(alertContainer);
        document.body.appendChild(overlay);
        
        // Remove on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
        
        // Auto remove after 10 seconds
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.remove();
            }
        }, 10000);
    }
}

// ===== PERFORMANCE OPTIMIZATIONS =====
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        // Lazy load images
        this.lazyLoadImages();
        
        // Preload critical resources
        this.preloadResources();
        
        // Debounce scroll events
        this.debounceScrollEvents();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    preloadResources() {
        // Preload critical CSS and fonts
        const criticalResources = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = 'style';
            document.head.appendChild(link);
        });
    }

    debounceScrollEvents() {
        let ticking = false;
        
        const updateScrollPosition = () => {
            // Update scroll-dependent animations here
            ticking = false;
        };

        const requestScrollUpdate = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollPosition);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestScrollUpdate, { passive: true });
    }
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
class AccessibilityManager {
    constructor() {
        this.init();
    }

    init() {
        // Keyboard navigation
        this.setupKeyboardNavigation();
        
        // Focus management
        this.setupFocusManagement();
        
        // Reduced motion support
        this.setupReducedMotion();
    }

    setupKeyboardNavigation() {
        // Enable keyboard navigation for custom interactive elements
        document.querySelectorAll('.skill-item, .project-card').forEach(element => {
            element.setAttribute('tabindex', '0');
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    element.click();
                }
            });
        });
    }

    setupFocusManagement() {
        // Manage focus for mobile menu
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        
        hamburger.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                // Focus first nav link when menu opens
                setTimeout(() => {
                    const firstLink = navMenu.querySelector('.nav-link');
                    if (firstLink) firstLink.focus();
                }, 100);
            }
        });

        // Trap focus in mobile menu when open
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && navMenu.classList.contains('active')) {
                const focusableElements = navMenu.querySelectorAll('a, button');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

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

    setupReducedMotion() {
        // Respect user's motion preferences
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            document.documentElement.style.setProperty('--transition-fast', '0s');
            document.documentElement.style.setProperty('--transition-normal', '0s');
            document.documentElement.style.setProperty('--transition-slow', '0s');
        }
    }
}

// ===== CERTIFICATES MANAGEMENT =====
class CertificatesManager {
    constructor() {
        this.viewAllBtn = document.getElementById('view-all-certificates');
        this.modal = document.getElementById('certificate-modal');
        this.modalOverlay = document.getElementById('modal-overlay');
        this.modalClose = document.getElementById('modal-close');
        this.modalGrid = document.getElementById('modal-certificates-grid');
        this.certificates = this.getCertificates();
        this.init();
    }

    init() {
        if (this.viewAllBtn) {
            this.viewAllBtn.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default link behavior
                this.openModal();
            });
        }
        
        if (this.modalClose) {
            this.modalClose.addEventListener('click', () => this.closeModal());
        }
        
        if (this.modalOverlay) {
            this.modalOverlay.addEventListener('click', () => this.closeModal());
        }
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });

        this.setupIntersectionObserver();
    }

    getCertificates() {
        // Get certificates from main page (visible ones)
        const mainCertificates = document.querySelectorAll('.certificates-grid .certificate-card');
        const mainCerts = Array.from(mainCertificates).map(card => ({
            title: card.querySelector('.certificate-title').textContent,
            issuer: card.querySelector('.certificate-issuer').textContent,
            date: card.querySelector('.certificate-date').textContent,
            icon: card.querySelector('.certificate-icon svg').outerHTML,
            link: card.querySelector('.certificate-view-btn').href
        }));

        // Get additional certificates (modal-only) from hidden container
        const modalOnlyCertificates = document.querySelectorAll('.modal-only-certificates .certificate-card');
        const modalOnlyCerts = Array.from(modalOnlyCertificates).map(card => ({
            title: card.querySelector('.certificate-title').textContent,
            issuer: card.querySelector('.certificate-issuer').textContent,
            date: card.querySelector('.certificate-date').textContent,
            icon: card.querySelector('.certificate-icon svg').outerHTML,
            link: card.querySelector('.certificate-view-btn').href
        }));

        // Combine both arrays - main certificates first, then modal-only ones
        return [...mainCerts, ...modalOnlyCerts];
    }

    setupIntersectionObserver() {
        const certificates = document.querySelectorAll('.certificate-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        certificates.forEach(cert => {
            cert.style.animationPlayState = 'paused';
            observer.observe(cert);
        });
    }

    openModal() {
        this.populateModal();
        
        // Store current scroll position
        this.scrollPosition = window.pageYOffset;
        
        // Disable background scroll
        document.body.style.position = 'fixed';
        document.body.style.top = `-${this.scrollPosition}px`;
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';
        
        this.modal.classList.add('active');
        
        // Focus trap
        const focusableElements = this.modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    }

    closeModal() {
        this.modal.classList.remove('active');
        
        // Restore background scroll
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        
        // Restore scroll position
        if (this.scrollPosition !== undefined) {
            window.scrollTo(0, this.scrollPosition);
        }
        
        if (this.viewAllBtn) {
            this.viewAllBtn.focus();
        }
    }

    populateModal() {
        this.modalGrid.innerHTML = '';
        
        this.certificates.forEach(cert => {
            const certCard = document.createElement('div');
            certCard.className = 'certificate-card';
            certCard.innerHTML = `
                <div class="certificate-header">
                    <div class="certificate-icon">
                        ${cert.icon}
                    </div>
                </div>
                <div class="certificate-content">
                    <h3 class="certificate-title">${cert.title}</h3>
                    <p class="certificate-issuer">${cert.issuer}</p>
                    <p class="certificate-date">${cert.date}</p>
                    <a href="${cert.link}" class="certificate-view-btn" target="_blank" rel="noopener">View Certificate</a>
                </div>
            `;
            this.modalGrid.appendChild(certCard);
        });
    }
}

// ===== RESUME BUTTON MANAGEMENT =====
class ResumeManager {
    constructor() {
        this.resumeButton = document.querySelector('.btn-outline');
        this.init();
    }

    init() {
        if (this.resumeButton && this.resumeButton.textContent.trim() === 'Resume') {
            this.resumeButton.addEventListener('click', (e) => this.handleResumeClick(e));
        }
    }

    handleResumeClick(e) {
        e.preventDefault();
        
        // Production alert for resume download
        this.showCustomAlert({
            title: 'Under Production',
            message: 'The resume download feature is currently under development.',
            contacts: [
                { icon: '💼', text: 'LinkedIn: linkedin.com/in/lav-kumar-shakya-86a87a287', link: 'https://www.linkedin.com/in/lav-kumar-shakya-86a87a287' },
                { icon: '🐱', text: 'GitHub: github.com/LavKumarShakya', link: 'https://github.com/LavKumarShakya' }
            ],
            type: 'production'
        });
    }

    showCustomAlert(options) {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'alert-overlay';
        
        // Create alert container
        const alertContainer = document.createElement('div');
        alertContainer.className = 'custom-alert';
        
        // Build alert HTML
        alertContainer.innerHTML = `
            <div class="alert-header">
                <div class="alert-icon">🚧</div>
                <h3 class="alert-title">${options.title}</h3>
            </div>
            <div class="alert-body">
                <p>${options.message}</p>
                <div class="alert-contacts">
                    <p class="highlight">For now, you can view my professional profile on:</p>
                    ${options.contacts.map(contact => 
                        `<div class="alert-contact-item">
                            <span class="alert-contact-icon">${contact.icon}</span>
                            <a href="${contact.link}" target="_blank" rel="noopener noreferrer" class="alert-contact-link">${contact.text}</a>
                        </div>`
                    ).join('')}
                    <div class="alert-contact-item">
                        <span class="alert-contact-icon">📄</span>
                        <span>Resume will be available soon!</span>
                    </div>
                </div>
            </div>
            <div class="alert-footer">
                <button class="alert-btn alert-btn-primary" onclick="this.closest('.alert-overlay').remove()">
                    Got it!
                </button>
            </div>
        `;
        
        // Add to DOM
        overlay.appendChild(alertContainer);
        document.body.appendChild(overlay);
        
        // Remove on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
        
        // Auto remove after 10 seconds
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.remove();
            }
        }, 10000);
    }
}

// ===== INITIALIZE EVERYTHING =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all managers
    new ThemeManager();
    new NavigationManager();
    new SmoothScroll();
    new ScrollAnimations();
    new ContactForm();
    new ResumeManager();
    new CertificatesManager();
    new PerformanceOptimizer();
    new AccessibilityManager();
    new ScrollToTop();
    new FooterManager();

    // Add CSS for error animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInError {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .form-group input.error,
        .form-group textarea.error {
            border-color: #ef4444;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }
        
        .navbar.scrolled {
            box-shadow: var(--shadow-md);
        }
        
        .lazy {
            opacity: 0;
            transition: opacity 0.3s;
        }
        
        .lazy.loaded {
            opacity: 1;
        }
        
        /* Loading animation for submit button */
        .btn-submit.loading {
            pointer-events: none;
        }
        
        .btn-loading::after {
            content: '';
            width: 16px;
            height: 16px;
            border: 2px solid transparent;
            border-top: 2px solid currentColor;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            display: inline-block;
            margin-left: 8px;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        /* Focus styles for better accessibility */
        *:focus {
            outline: 2px solid var(--color-primary);
            outline-offset: 2px;
        }
        
        .skip-link {
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--color-primary);
            color: white;
            padding: 8px;
            text-decoration: none;
            transition: top 0.3s;
            z-index: 1001;
        }
        
        .skip-link:focus {
            top: 6px;
        }
    `;
    document.head.appendChild(style);

    // Add skip link for accessibility
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add main content ID
    document.querySelector('.hero').id = 'main-content';

    // Console message for developers
    console.log(`
    🎨 Portfolio Website Loaded Successfully!
    
    Features:
    ✅ Responsive Design
    ✅ Dark/Light Theme Toggle
    ✅ Smooth Scroll Animations  
    ✅ Contact Form Validation
    ✅ Accessibility Features
    ✅ Performance Optimizations
    
    Built with vanilla HTML, CSS, and JavaScript
    No frameworks, just clean code! 🚀
    `);
});

// ===== SCROLL TO TOP FUNCTIONALITY =====
class ScrollToTop {
    constructor() {
        this.scrollTopBtn = document.getElementById('scrollTop');
        this.init();
    }

    init() {
        if (!this.scrollTopBtn) return;
        
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => this.toggleVisibility());
        
        // Smooth scroll to top when clicked
        this.scrollTopBtn.addEventListener('click', () => this.scrollToTop());
    }

    toggleVisibility() {
        const scrollY = window.scrollY;
        const showThreshold = 300; // Show button after scrolling 300px
        
        if (scrollY > showThreshold) {
            this.scrollTopBtn.classList.add('visible');
        } else {
            this.scrollTopBtn.classList.remove('visible');
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// ===== FOOTER SOCIAL LINKS =====
class FooterManager {
    constructor() {
        this.init();
    }

    init() {
        this.updateSocialLinks();
    }

    updateSocialLinks() {
        const socialLinks = document.querySelectorAll('.footer-links .social-link');
        const socialData = {
            'fa-github': 'https://github.com/LavKumarShakya',
            'fa-linkedin': 'https://www.linkedin.com/in/lav-kumar-shakya-86a87a287',
            'fa-twitter': 'https://twitter.com/lavkumarshakya',
            'fa-envelope': 'mailto:lavshakya514@gmail.com'
        };

        socialLinks.forEach(link => {
            const icon = link.querySelector('i');
            if (icon) {
                const iconClass = Array.from(icon.classList).find(cls => cls.startsWith('fa-'));
                if (iconClass && socialData[iconClass]) {
                    link.href = socialData[iconClass];
                }
            }
        });
    }
}