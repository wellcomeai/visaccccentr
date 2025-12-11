// ========================================
// VISATOYOU - Main JavaScript v3.0
// Premium Animations & Interactions
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  initGrainOverlay();
  initScrollProgress();
  initBurgerMenu();
  initActiveNavLinks();
  initHeaderScroll();
  initRevealOnScroll();
  initParallax();
  initButtonEffects();
  initCardSwiper();
  initStepsScrollIndicator();
  initDestinationAccordions();
  initTariffSwitches();
  initDestinationFilter();
});

// ========================================
// Grain Texture Overlay
// ========================================

function initGrainOverlay() {
  const grain = document.createElement('div');
  grain.className = 'grain-overlay';
  document.body.appendChild(grain);
}

// ========================================
// Scroll Progress Indicator
// ========================================

function initScrollProgress() {
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  document.body.appendChild(progress);

  let ticking = false;

  function updateProgress() {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    const progressValue = scrollHeight > 0 ? scrolled / scrollHeight : 0;
    progress.style.transform = `scaleX(${progressValue})`;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });
}

// ========================================
// Smooth Parallax System
// ========================================

function initParallax() {
  // Only on desktop
  if (window.innerWidth < 900) return;

  const parallaxElements = [
    { el: document.querySelector('.hero-bg-decor-1'), speed: 0.15 },
    { el: document.querySelector('.hero-bg-decor-2'), speed: -0.1 },
    { el: document.querySelector('.hero-bg-decor-3'), speed: 0.08 },
  ].filter(item => item.el);

  if (parallaxElements.length === 0) return;

  let scrollY = 0;
  let currentY = 0;
  const ease = 0.06;
  let rafId = null;

  function lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  function updateParallax() {
    currentY = lerp(currentY, scrollY, ease);

    parallaxElements.forEach(item => {
      const yPos = currentY * item.speed;
      item.el.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });

    // Continue animation if there's still movement
    if (Math.abs(currentY - scrollY) > 0.1) {
      rafId = requestAnimationFrame(updateParallax);
    } else {
      rafId = null;
    }
  }

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    if (!rafId) {
      rafId = requestAnimationFrame(updateParallax);
    }
  }, { passive: true });
}

// ========================================
// Button Ripple & Glow Effects
// ========================================

function initButtonEffects() {
  const buttons = document.querySelectorAll('.btn');

  buttons.forEach(btn => {
    // Track mouse position for ripple effect
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      btn.style.setProperty('--mouse-x', x + '%');
      btn.style.setProperty('--mouse-y', y + '%');
    });

    // Magnetic effect on hover (subtle)
    btn.addEventListener('mousemove', (e) => {
      if (window.innerWidth < 900) return;
      
      const rect = btn.getBoundingClientRect();
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
// Card Swiper (Mobile Touch)
// ========================================

function initCardSwiper() {
  if (window.innerWidth > 900) return;

  const cards = document.querySelectorAll('.destination-card, .review-card');
  
  cards.forEach(card => {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    card.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      card.style.transition = 'none';
    }, { passive: true });

    card.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      
      currentX = e.touches[0].clientX - startX;
      const maxMove = 30;
      const move = Math.max(-maxMove, Math.min(maxMove, currentX * 0.3));
      const rotation = move * 0.08;
      
      card.style.transform = `translateX(${move}px) rotate(${rotation}deg)`;
    }, { passive: true });

    card.addEventListener('touchend', () => {
      isDragging = false;
      card.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
      card.style.transform = '';
    });
  });
}

// ========================================
// Burger Menu
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

  // Close on link click
  const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', function() {
      burger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  });

  // Close on Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      burger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  });
}

// ========================================
// Active Navigation Links
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
// Header Scroll Effect
// ========================================

function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  let ticking = false;

  function updateHeader() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });
}

// ========================================
// Reveal on Scroll Animation - Enhanced
// ========================================

function initRevealOnScroll() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add visible class with slight delay for stagger effect
        entry.target.classList.add('visible');
        
        // Animate children with stagger
        const children = entry.target.querySelectorAll('.step-item, .destination-card, .review-card');
        children.forEach((child, index) => {
          child.style.transitionDelay = `${index * 0.1}s`;
          child.classList.add('visible');
        });
        
        // Unobserve after animation
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach(el => observer.observe(el));

  // Also observe individual cards for grid stagger
  const cards = document.querySelectorAll('.destination-card, .review-card, .step-item');
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0) scale(1)';
        entry.target.style.filter = 'blur(0)';
        cardObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  cards.forEach((card, index) => {
    // Set initial state
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px) scale(0.96)';
    card.style.filter = 'blur(6px)';
    card.style.transition = `
      opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index % 4 * 0.1}s,
      transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${index % 4 * 0.1}s,
      filter 0.6s ease-out ${index % 4 * 0.1}s
    `;
    cardObserver.observe(card);
  });
}

// ========================================
// Smooth Scroll
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
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

// ========================================
// Performance: Reduce motion for users who prefer it
// ========================================

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.setProperty('--transition-fast', '0.01s');
  document.documentElement.style.setProperty('--transition-base', '0.01s');
  document.documentElement.style.setProperty('--transition-slow', '0.01s');
}

// ========================================
// Steps Scroll Indicator (Mobile)
// ========================================

function initStepsScrollIndicator() {
  const stepsList = document.querySelector('.steps-list');
  const dots = document.querySelectorAll('.steps-dot');

  if (!stepsList || !dots.length || window.innerWidth > 900) return;

  stepsList.addEventListener('scroll', () => {
    const scrollLeft = stepsList.scrollLeft;
    const cardWidth = 280 + 16; // card width + gap
    const currentIndex = Math.round(scrollLeft / cardWidth);

    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }, { passive: true });

  // Click on dot to scroll
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.dataset.step);
      const cardWidth = 280 + 16;
      stepsList.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
    });
  });
}

// ========================================
// Destination Accordions
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
// Tariff Switches
// ========================================

function initTariffSwitches() {
  document.querySelectorAll('.tariff-switch-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.destination-card');
      const tariff = btn.dataset.tariff;

      // Update active button
      card.querySelectorAll('.tariff-switch-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update price
      const priceEl = card.querySelector('.destination-card-price-value');
      if (priceEl && priceEl.dataset[tariff]) {
        priceEl.textContent = priceEl.dataset[tariff];
      }

      // Update features visibility
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
// Destination Filter
// ========================================

function initDestinationFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.destination-card');

  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter cards
      cards.forEach(card => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
          card.style.display = '';
          card.style.opacity = '1';
          card.style.transform = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}
