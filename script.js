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


// Smooth scrolling for navigation links with offset for fixed navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // ignore empty anchors or modal openers
        const href = this.getAttribute('href');
        if (!href || href === '#' || this.hasAttribute('data-open-modal')) return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        // Close mobile nav first so we measure the stable header height
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger?.classList.remove('active');
        }

        // Measure header height using .nav-container (doesn't include expanded mobile menu)
        const navContainer = document.querySelector('.nav-container');
        const nav = document.querySelector('.navbar');
        const navHeight = navContainer ? navContainer.offsetHeight : (nav ? nav.offsetHeight : 72);

        // Compute target top position and offset by navbar height + small gap
        const targetY = target.getBoundingClientRect().top + window.scrollY - navHeight - 12;

        window.scrollTo({ top: targetY, behavior: 'smooth' });

        // Update the URL hash without jumping
        if (history.replaceState) history.replaceState(null, '', href);
    });
});

// Keep CSS variable in-sync with navbar height for browsers that support scroll-padding
function updateNavCssVar() {
    const nav = document.querySelector('.navbar');
    if (!nav) return;
    document.documentElement.style.setProperty('--nav-height', nav.offsetHeight + 'px');
}
window.addEventListener('resize', updateNavCssVar);
window.addEventListener('load', updateNavCssVar);
document.addEventListener('DOMContentLoaded', updateNavCssVar);

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
        const name = this.querySelector('input[type="text"]').value.trim();
        const email = this.querySelector('#contactEmail')?.value.trim() || this.querySelector('input[type="email"]').value.trim();
        const countryCode = this.querySelector('#countryCode')?.value || '';
        let mobile = this.querySelector('#contactMobile')?.value.trim() || this.querySelector('input[type="tel"]').value.trim();
        const service = this.querySelector('select').value;
        const message = this.querySelector('textarea').value.trim();

        // Basic validation
        if (!name || !email || !mobile || !service || !message) {
            showNotification('Please fill in all fields.', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }

        // Normalize mobile: remove non-digits, drop leading zero when paired with a country code
        let mobileDigits = mobile.replace(/\D/g, '');
        if (mobileDigits.startsWith('0') && countryCode.startsWith('+')) {
            mobileDigits = mobileDigits.replace(/^0+/, '');
        }

        // Validate phone length (E.164 max 15 digits, min practical 7)
        const fullDigits = (countryCode.replace(/\D/g, '') || '') + mobileDigits;
        if (!isValidPhone(countryCode, mobileDigits) || fullDigits.length < 7 || fullDigits.length > 15) {
            showNotification('Please enter a valid mobile number with country code.', 'error');
            return;
        }

        // Compose full international number for backend or display
        const internationalNumber = `${countryCode}${mobileDigits}`;

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

// Basic phone validation: ensures country code is present and local number has digits
function isValidPhone(countryCode, localDigits) {
    if (!countryCode || !/^\+\d{1,4}$/.test(countryCode)) return false;
    if (!localDigits || !/^\d{4,15}$/.test(localDigits)) return false;

    // Per-country rules (local number length without country code)
    const rules = {
        '+63': { min: 9, max: 10 },   // Philippines (e.g., 9178002477 -> 10)
        '+1':  { min: 10, max: 10 },   // USA/Canada
        '+44': { min: 9,  max: 10 },   // UK (without leading 0)
        '+61': { min: 9,  max: 9  },   // Australia (9 digits after country code)
        '+91': { min: 10, max: 10 },   // India
        '+82': { min: 9,  max: 10 },   // South Korea
        '+81': { min: 9,  max: 10 },   // Japan
        '+852':{ min: 8,  max: 8  },   // Hong Kong
        '+886':{ min: 9,  max: 9  },   // Taiwan
        '+66': { min: 9,  max: 9  }    // Thailand
    };

    const rule = rules[countryCode];
    if (!rule) {
        // fallback: accept 4-15 digits
        return localDigits.length >= 4 && localDigits.length <= 15;
    }

    return localDigits.length >= rule.min && localDigits.length <= rule.max;
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
    // Attach phone input filters (prevent letters)
    attachPhoneInputFilters();
    // Enhance country selects with flag icons when flag-icon and bootstrap-select are available
    enhanceCountrySelectsWithFlags();
});

// Prevent letters and non-digit characters in phone inputs; keep cursor position
function attachPhoneInputFilters() {
    const phoneSelectors = ['#contactMobile', '#schedMobile'];
    phoneSelectors.forEach(sel => {
        const el = document.querySelector(sel);
        if (!el) return;
        el.addEventListener('input', (e) => {
            const start = el.selectionStart;
            const cleaned = el.value.replace(/[^0-9]/g, '');
            if (cleaned !== el.value) {
                el.value = cleaned;
                // restore cursor near end (best-effort)
                el.setSelectionRange(Math.min(start - 1, el.value.length), Math.min(start - 1, el.value.length));
            }
        });
    });
}

function enhanceCountrySelectsWithFlags() {
    const mapping = {
        '+1':'us','+7':'ru','+20':'eg','+27':'za','+30':'gr','+31':'nl','+32':'be','+33':'fr','+34':'es','+36':'hu','+39':'it','+40':'ro','+41':'ch','+43':'at','+44':'gb','+45':'dk','+46':'se','+47':'no','+48':'pl','+49':'de','+52':'mx','+53':'cu','+54':'ar','+55':'br','+56':'cl','+57':'co','+58':'ve','+60':'my','+61':'au','+62':'id','+63':'ph','+64':'nz','+65':'sg','+66':'th','+81':'jp','+82':'kr','+84':'vn','+86':'cn','+90':'tr','+91':'in','+92':'pk','+93':'af','+94':'lk','+95':'mm','+98':'ir','+350':'gi','+351':'pt','+352':'lu','+353':'ie','+354':'is','+355':'al','+356':'mt','+357':'cy','+358':'fi','+359':'bg','+370':'lt','+371':'lv','+372':'ee','+373':'md','+374':'am','+375':'by','+376':'ad','+377':'mc','+378':'sm','+380':'ua','+381':'rs','+385':'hr','+386':'si','+387':'ba','+389':'mk','+420':'cz','+421':'sk'
    };

    document.querySelectorAll('.country-select').forEach(select => {
        select.querySelectorAll('option').forEach(opt => {
            const val = opt.value;
            const iso = mapping[val] || mapping['+' + val.replace(/\D/g,'')];
            if (iso) {
                // Use FlagCDN image tiles for rectangular flags which render consistently across platforms.
                // FlagCDN image URL format: https://flagcdn.com/24x18/{iso}.png  (iso must be lowercase)
                const imgUrl = `https://flagcdn.com/24x18/${iso.toLowerCase()}.png`;
                // data-content is used by bootstrap-select to render HTML inside options and the selected button
                opt.setAttribute('data-content', `<img src="${imgUrl}" class="flag-img" alt="${iso} flag"> ${opt.textContent}`);
            }
        });
    });

    // initialize bootstrap-select if available
    if (window.jQuery && jQuery && jQuery.fn && jQuery.fn.selectpicker) {
        jQuery('.country-select').selectpicker({ liveSearch: true, size: 6 });
    }
}

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
    // sections must be listed in the same top-to-bottom order they appear in the DOM
    const sections = ['home','pricing','services','testimonials','faq','about','newsletter','expertise','contact'];
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
