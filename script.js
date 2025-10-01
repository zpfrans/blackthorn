// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(3, 7, 18, 0.98)';
    } else {
        navbar.style.background = 'rgba(3, 7, 18, 0.95)';
    }
    updateScrollProgress();
    toggleBackToTop();
    updateActiveNavLink();
});

// Form submission handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const service = this.querySelector('select').value;
        const message = this.querySelector('textarea').value;
        
        // Basic validation
        if (!name || !email || !service || !message) {
            showNotification('Please fill in all fields.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        // Simulate form submission
        showNotification('Thank you for your message. We will get back to you soon.', 'success');
        this.reset();
    });
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#6469da'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .expertise-item, .stat');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Cookie consent
    initCookieConsent();
    // Testimonials slider
    initTestimonialSlider();
    // FAQ accordion
    initFaq();
    // Newsletter
    initNewsletter();
    // Modal
    initModal();
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Service card hover effects
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Expertise item hover effects
document.querySelectorAll('.expertise-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateX(10px)';
        this.style.boxShadow = '0 10px 30px rgba(100, 105, 218, 0.2)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateX(0)';
        this.style.boxShadow = 'none';
    });
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + (element.textContent.includes('+') ? '+' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + (element.textContent.includes('+') ? '+' : '');
        }
    }, 16);
}

// Trigger counter animation when stats come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('h3');
            const text = statNumber.textContent;
            const number = parseInt(text.replace(/\D/g, ''));
            
            if (number && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                animateCounter(statNumber, number);
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat').forEach(stat => {
    statsObserver.observe(stat);
});

// ====== New Features ======
// Scroll progress bar
function updateScrollProgress() {
    const progress = document.getElementById('scrollProgress');
    if (!progress) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (scrollTop / height) * 100;
    progress.style.width = scrolled + '%';
}

// Back to top button
function toggleBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    if (window.scrollY > 400) {
        btn.classList.add('show');
    } else {
        btn.classList.remove('show');
    }
}
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Cookie consent
function initCookieConsent() {
    const banner = document.getElementById('cookieConsent');
    const accept = document.getElementById('acceptCookies');
    if (!banner || !accept) return;
    const accepted = localStorage.getItem('bt_cookie_accepted');
    if (!accepted) banner.style.display = 'block';
    accept.addEventListener('click', () => {
        localStorage.setItem('bt_cookie_accepted', '1');
        banner.style.display = 'none';
    });
}

// Testimonials slider
function initTestimonialSlider() {
    const track = document.querySelector('.ts-track');
    const prev = document.querySelector('.ts-prev');
    const next = document.querySelector('.ts-next');
    const dotsWrap = document.querySelector('.ts-dots');
    if (!track || !prev || !next || !dotsWrap) return;
    let index = 0;
    const slides = Array.from(track.children);

    // build dots
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'ts-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('role', 'tab');
        dot.addEventListener('click', () => goto(i));
        dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function goto(i) {
        index = (i + slides.length) % slides.length;
        track.scrollTo({ left: slides[index].offsetLeft, behavior: 'smooth' });
        dots.forEach((d, di) => d.classList.toggle('active', di === index));
    }
    prev.addEventListener('click', () => goto(index - 1));
    next.addEventListener('click', () => goto(index + 1));

    // auto-advance with pause on hover
    let timer = setInterval(() => goto(index + 1), 6000);
    track.addEventListener('mouseenter', () => clearInterval(timer));
    track.addEventListener('mouseleave', () => timer = setInterval(() => goto(index + 1), 6000));

    // sync on scroll (dragging on touch)
    track.addEventListener('scroll', () => {
        const closest = slides.reduce((acc, el, i) => {
            const diff = Math.abs(track.scrollLeft - el.offsetLeft);
            return diff < acc.diff ? { i, diff } : acc;
        }, { i: 0, diff: Infinity });
        if (closest.i !== index) {
            index = closest.i;
            dots.forEach((d, di) => d.classList.toggle('active', di === index));
        }
    });
}

// FAQ accordion
function initFaq() {
    document.querySelectorAll('.faq-item').forEach(item => {
        const q = item.querySelector('.faq-question');
        q.addEventListener('click', () => {
            const expanded = item.classList.toggle('active');
            q.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        });
    });
}

// Newsletter subscribe
function initNewsletter() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;
    form.addEventListener('submit', e => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]').value;
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        showNotification('Subscribed! You will receive our next monthly briefing.', 'success');
        form.reset();
    });
}

// Modal
function initModal() {
    const modal = document.getElementById('consultationModal');
    const openers = document.querySelectorAll('[data-open-modal="consultation"]');
    const closeBtn = modal?.querySelector('.modal-close');
    const overlay = modal;
    if (!modal) return;
    function open() { modal.style.display = 'flex'; modal.setAttribute('aria-hidden', 'false'); }
    function close() { modal.style.display = 'none'; modal.setAttribute('aria-hidden', 'true'); }
    openers.forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); open(); }));
    closeBtn?.addEventListener('click', close);
    overlay?.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    const modalForm = document.getElementById('modalForm');
    modalForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Request received. Our team will contact you shortly.', 'success');
        close();
    });
}

// Scrollspy active nav link
function updateActiveNavLink() {
    const sections = ['home','services','pricing','expertise','about','testimonials','faq','contact'];
    const links = document.querySelectorAll('.nav-menu a');
    const fromTop = window.scrollY + 120;
    let activeId = sections[0];
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= fromTop) activeId = id;
    });
    links.forEach(a => {
        const href = a.getAttribute('href');
        if (!href || !href.startsWith('#')) return;
        const id = href.substring(1);
        if (id === activeId) a.classList.add('active'); else a.classList.remove('active');
    });
}
