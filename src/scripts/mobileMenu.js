/**
 * Mobile Menu Handler
 * Manages the mobile navigation sidebar
 */

let mobileMenuToggle;
let mainNav;
let navOverlay;
let navLinks;

/**
 * Initialize mobile menu functionality
 */
function initMobileMenu() {
    mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    mainNav = document.querySelector('.main-nav');
    navOverlay = document.querySelector('.nav-overlay');
    navLinks = document.querySelectorAll('.nav-link');
    
    if (!mobileMenuToggle || !mainNav || !navOverlay) {
        console.warn('Mobile menu elements not found');
        return;
    }
    
    // Toggle menu on button click
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    
    // Close menu when overlay is clicked
    navOverlay.addEventListener('click', closeMobileMenu);
    
    // Close menu when a nav link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mainNav.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Close menu when window is resized to desktop size
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768 && mainNav.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    console.log('✓ Mobile menu initialized');
}

/**
 * Toggle mobile menu open/closed
 */
function toggleMobileMenu() {
    const isOpen = mainNav.classList.contains('active');
    
    if (isOpen) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

/**
 * Open mobile menu
 */
function openMobileMenu() {
    mainNav.classList.add('active');
    navOverlay.classList.add('active');
    mobileMenuToggle.classList.add('active');
    mobileMenuToggle.setAttribute('aria-expanded', 'true');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = 'hidden';
}

/**
 * Close mobile menu
 */
function closeMobileMenu() {
    mainNav.classList.remove('active');
    navOverlay.classList.remove('active');
    mobileMenuToggle.classList.remove('active');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    
    // Restore body scroll
    document.body.style.overflow = '';
}

// Initialize when components are loaded
document.addEventListener('componentsLoaded', initMobileMenu);

// Export for potential use in other modules
export { initMobileMenu, toggleMobileMenu, openMobileMenu, closeMobileMenu };
