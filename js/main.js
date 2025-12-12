// ========================================
// VISANEWS2YOU - Main JavaScript v4.0
// Performance Optimized Version
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  // Performance utilities first
  initPerformanceOptimizations();
  
  // Then initialize features
  initGrainOverlay();
  initScrollProgress();
  initBurgerMenu();
  initActiveNavLinks();
  initHeaderScroll();
  initRevealOnScroll();
  initParallax();
  initButtonEffects();
  initDestinationAccordions();
  initTariffSwitches();
  initDestinationFilter();
  initOrbitalVisibility();
  initMobileOptimizations();
});

// ========================================
// PERFORMANCE UTILITIES
// ========================================

const isMobile = () => window.innerWidth < 900;

const isLowEndDevice = () => {
  return navigator.hardwareConcurrency <= 4 || 
         navigator.deviceMemory <= 4 ||
         /Android [4-6]/.test(navigator.userAgent);
};

// Throttle function - limits execution frequency
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Debounce function - delays execution until pause
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Single global IntersectionObserver for performance
class PerformantObserver {
  constructor() {
    this.callbacks = new Map();
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const callback = this.callbacks.get(entry.target);
          if (callback) {
            callback(entry.isIntersecting, entry);
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: [0, 0.1, 0.5]
      }
    );
  }
  
  observe(element, callback) {
    if (!element) return;
    this.callbacks.set(element, callback);
    this.observer.observe(element);
  }
  
  unobserve(element) {
    if (!element) return;
    this.callbacks.delete(element);
    this.observer.unobserve(element);
  }
}

let globalObserver = null;

// Optimized scroll handler with RAF
class OptimizedScrollHandler {
  constructor() {
    this.callbacks = [];
    this.ticking = false;
    this.lastScrollY = 0;
    
    window.addEventListener('scroll', () => {
      this.lastScrollY = window.scrollY;
      this.requestTick();
    }, { passive: true });
  }
  
  requestTick() {
    if (!this.ticking) {
      requestAnimationFrame(() => {
        this.update();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }
  
  update() {
    const scrollY = this.lastScrollY;
    this.callbacks.forEach(cb => cb(scrollY));
  }
  
  add(callback) {
    this.callbacks.push(callback);
  }
}

let scrollHandler = null;

// ========================================
// PERFORMANCE INITIALIZATION
// ========================================

function initPerformanceOptimizations() {
  globalObserver = new PerformantObserver();
  scrollHandler = new OptimizedScrollHandler();
  
  // Add device classes
  if (isMobile()) {
    document.body.classList.add('touch-device');
  }
  
  if (isLowEndDevice()) {
    document.body.classList.add('low-end-device');
    console.log('Low-end device detected, applying extra optimizations');
  }
  
  // Memory management - pause animations when page hidden
  document.addEventListener('visibilitychange', () => {
    const orbitalFlags = document.querySelectorAll('.orbital-flag');
    if (document.hidden) {
      orbitalFlags.forEach(flag => {
        flag.style.animationPlayState = 'paused';
      });
    }
  });
}

// ========================================
// MOBILE SPECIFIC OPTIMIZATIONS
// ========================================

function initMobileOptimizations() {
  if (!isMobile()) return;
  
  // Remove grain overlay on mobile
  const grain = document.querySelector('.grain-overlay');
  if (grain) grain.remove();
  
  // Remove wave particles
  const particles = document.querySelectorAll('.wave-particle');
  particles.forEach(p => p.remove());
  
  // Optimize mobile graph scroll
  const scrollRows = document.querySelectorAll('.mobile-nodes-row');
  scrollRows.forEach(row => {
    const category = row.closest('.mobile-category');
    
    const handleScroll = throttle(() => {
      const isAtEnd = row.scrollLeft + row.clientWidth >= row.scrollWidth - 10;
      if (category) {
        category.classList.toggle('scrolled-end', isAtEnd);
      }
    }, 100);
    
    row.addEventListener('scroll', handleScroll, { passive: true });
  });
  
  // Add touch feedback
  const interactiveElements = document.querySelectorAll('.btn, .mobile-node');
  interactiveElements.forEach(el => {
    el.addEventListener('touchstart', () => {
      el.style.opacity = '0.9';
    }, { passive: true });
    
    el.addEventListener('touchend', () => {
      el.style.opacity = '';
    }, { passive: true });
  });
}

// ========================================
// ORBITAL FLAGS VISIBILITY
// ========================================

function initOrbitalVisibility() {
  const stepsVisual = document.querySelector('.steps-visual');
  const orbitalFlags = document.querySelectorAll('.orbital-flag');
  
  if (!stepsVisual || !orbitalFlags.length) return;
  
  // Start paused on mobile
  if (isMobile()) {
    orbitalFlags.forEach(flag => {
      flag.style.animationPlayState = 'paused';
    });
  }
  
  globalObserver.observe(stepsVisual, (isVisible) => {
    requestAnimationFrame(() => {
      stepsVisual.classList.toggle('in-view', isVisible);
      if (isMobile()) {
        orbitalFlags.forEach(flag => {
          flag.style.animationPlayState = isVisible ? 'running' : 'paused';
        });
      }
    });
  });
}

// ========================================
// GRAIN TEXTURE OVERLAY
// ========================================

function initGrainOverlay() {
  // Skip on mobile - handled by CSS/initMobileOptimizations
  if (isMobile()) return;
  
  const grain = document.createElement('div');
  grain.className = 'grain-overlay';
  document.body.appendChild(grain);
}

// ========================================
// SCROLL PROGRESS INDICATOR
// ========================================

function initScrollProgress() {
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  document.body.appendChild(progress);

  let scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  
  // Update on resize
  const updateScrollHeight = debounce(() => {
    scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  }, 200);
  
  window.addEventListener('resize', updateScrollHeight, { passive: true });

  scrollHandler.add((scrollY) => {
    if (scrollHeight > 0) {
      const progressValue = scrollY / scrollHeight;
      progress.style.transform = `scaleX(${progressValue})`;
    }
  });
}

// ========================================
// SMOOTH PARALLAX SYSTEM
// ========================================

function initParallax() {
  // Skip on mobile
  if (isMobile()) return;

  const parallaxElements = [
    { el: document.querySelector('.hero-bg-decor-1'), speed: 0.15 },
    { el: document.querySelector('.hero-bg-decor-2'), speed: -0.1 },
    { el: document.querySelector('.hero-bg-decor-3'), speed: 0.08 },
  ].filter(item => item.el);

  if (parallaxElements.length === 0) return;

  let currentY = 0;
  const ease = 0.06;

  function lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  let rafId = null;
  
  function updateParallax(scrollY) {
    currentY = lerp(currentY, scrollY, ease);

    parallaxElements.forEach(item => {
      const yPos = currentY * item.speed;
      item.el.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });

    if (Math.abs(currentY - scrollY) > 0.1) {
      rafId = requestAnimationFrame(() => updateParallax(scrollY));
    } else {
      rafId = null;
    }
  }

  scrollHandler.add((scrollY) => {
    if (!rafId) {
      rafId = requestAnimationFrame(() => updateParallax(scrollY));
    }
  });
}

// ========================================
// BUTTON EFFECTS
// ========================================

function initButtonEffects() {
  // Skip magnetic effect on mobile
  if (isMobile()) return;
  
  const buttons = document.querySelectorAll('.btn');

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      btn.style.setProperty('--mouse-x', x + '%');
      btn.style.setProperty('--mouse-y', y + '%');
      
      // Subtle magnetic effect
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * 0.1;
      const deltaY = (e.clientY - centerY) * 0.1;
      btn.style.transform = `translate(${deltaX}px, ${deltaY}px) translateY(-3px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

// ========================================
// BURGER MENU
// ========================================

function initBurgerMenu() {
  const burger = document.querySelector('.burger');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (!burger || !mobileMenu) return;

  burger.addEventListener('click', function() {
    burger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  });

  const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', function() {
      burger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      burger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  });
}

// ========================================
// ACTIVE NAVIGATION LINKS
// ========================================

function initActiveNavLinks() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  document.querySelectorAll('.nav .btn-ghost, .mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ========================================
// HEADER SCROLL EFFECT
// ========================================

function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  let isScrolled = false;

  scrollHandler.add((scrollY) => {
    const shouldBeScrolled = scrollY > 50;
    
    if (shouldBeScrolled !== isScrolled) {
      isScrolled = shouldBeScrolled;
      requestAnimationFrame(() => {
        header.classList.toggle('scrolled', isScrolled);
      });
    }
  });
}

// ========================================
// REVEAL ON SCROLL ANIMATION - Optimized
// ========================================

function initRevealOnScroll() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  reveals.forEach(el => {
    globalObserver.observe(el, (isVisible) => {
      if (isVisible) {
        requestAnimationFrame(() => {
          el.classList.add('visible');
        });
        globalObserver.unobserve(el);
      }
    });
  });

  // Cards with stagger effect
  const cards = document.querySelectorAll('.destination-card, .review-card');
  
  // Batch initial styles
  requestAnimationFrame(() => {
    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = `
        opacity 0.5s ease-out ${(index % 4) * 0.08}s,
        transform 0.5s ease-out ${(index % 4) * 0.08}s
      `;
    });
  });

  cards.forEach(card => {
    globalObserver.observe(card, (isVisible) => {
      if (isVisible) {
        requestAnimationFrame(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
          card.classList.add('in-view');
        });
        globalObserver.unobserve(card);
      }
    });
  });
}

// ========================================
// SMOOTH SCROLL
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: isMobile() ? 'auto' : 'smooth',
        block: 'start'
      });
    }
  });
});

// ========================================
// REDUCED MOTION PREFERENCE
// ========================================

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.setProperty('--transition-fast', '0.01s');
  document.documentElement.style.setProperty('--transition-base', '0.01s');
  document.documentElement.style.setProperty('--transition-slow', '0.01s');
}

// ========================================
// DESTINATION ACCORDIONS
// ========================================

function initDestinationAccordions() {
  document.querySelectorAll('.destination-accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const accordion = trigger.closest('.destination-accordion');
      accordion.classList.toggle('open');
    });
  });
}

// ========================================
// TARIFF SWITCHES
// ========================================

function initTariffSwitches() {
  document.querySelectorAll('.tariff-switch-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.destination-card');
      const tariff = btn.dataset.tariff;

      card.querySelectorAll('.tariff-switch-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const priceEl = card.querySelector('.destination-card-price-value');
      if (priceEl && priceEl.dataset[tariff]) {
        priceEl.textContent = priceEl.dataset[tariff];
      }

      const goldFeatures = card.querySelector('.included-list:not(.premium-only)');
      const premiumFeatures = card.querySelector('.included-list.premium-only');

      if (goldFeatures && premiumFeatures) {
        goldFeatures.style.display = tariff === 'gold' ? 'block' : 'none';
        premiumFeatures.style.display = tariff === 'premium' ? 'block' : 'none';
      }
    });
  });
}

// ========================================
// DESTINATION FILTER
// ========================================

function initDestinationFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.destination-card');

  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      requestAnimationFrame(() => {
        cards.forEach(card => {
          const category = card.dataset.category;
          if (filter === 'all' || category === filter) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  });
}
