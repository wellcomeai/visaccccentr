// ========================================
// VISANEWS2YOU - 3D Perspective Reviews Carousel
// Touch-enabled, Auto-rotate, Circular navigation
// ========================================

class ReviewsCarousel {
  constructor(container) {
    this.container = container;
    if (!this.container) return;

    this.track = container.querySelector('.reviews-track');
    this.cards = Array.from(container.querySelectorAll('.review-card-3d'));
    this.dotsContainer = container.querySelector('.carousel-dots');
    this.prevBtn = container.querySelector('.carousel-nav-prev');
    this.nextBtn = container.querySelector('.carousel-nav-next');
    this.progressBar = container.querySelector('.carousel-progress-bar');

    this.currentIndex = 0;
    this.totalCards = this.cards.length;
    this.isAnimating = false;
    this.autoPlayInterval = null;
    this.autoPlayDelay = 5000; // 5 секунд
    this.isPaused = false;

    // Touch/Swipe
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.isDragging = false;
    this.dragOffset = 0;

    this.init();
  }

  init() {
    this.createDots();
    this.updatePositions();
    this.bindEvents();
    this.startAutoPlay();
  }

  // ========================================
  // DOTS NAVIGATION
  // ========================================
  createDots() {
    if (!this.dotsContainer) return;

    this.dotsContainer.innerHTML = '';
    this.cards.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Перейти к отзыву ${index + 1}`);
      dot.dataset.index = index;
      this.dotsContainer.appendChild(dot);
    });

    this.dots = Array.from(this.dotsContainer.querySelectorAll('.carousel-dot'));
  }

  updateDots() {
    if (!this.dots) return;
    
    this.dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentIndex);
    });
  }

  // ========================================
  // POSITION CARDS - Circular Layout
  // ========================================
  updatePositions() {
    const half = Math.floor(this.totalCards / 2);
    
    this.cards.forEach((card, index) => {
      // Убираем класс hidden - управляем видимостью через data-position
      card.classList.remove('hidden');
      
      // Вычисляем относительную позицию от центра (circular)
      let position = index - this.currentIndex;

      // Обработка кругового перехода
      if (position > half) {
        position -= this.totalCards;
      } else if (position < -half) {
        position += this.totalCards;
      }

      // Ограничиваем позицию для визуального отображения
      const clampedPosition = Math.max(-5, Math.min(5, position));

      card.dataset.position = clampedPosition;
      
      // Управление pointer-events
      if (clampedPosition === 0) {
        card.style.pointerEvents = 'auto';
      } else {
        card.style.pointerEvents = 'none';
      }
    });

    this.updateDots();
  }

  // ========================================
  // NAVIGATION
  // ========================================
  goTo(index) {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    this.currentIndex = (index + this.totalCards) % this.totalCards;
    this.updatePositions();
    this.resetAutoPlay();

    // Снимаем блокировку после анимации
    setTimeout(() => {
      this.isAnimating = false;
    }, 700);
  }

  next() {
    this.goTo(this.currentIndex + 1);
  }

  prev() {
    this.goTo(this.currentIndex - 1);
  }

  // ========================================
  // AUTO-PLAY
  // ========================================
  startAutoPlay() {
    if (this.autoPlayInterval) return;

    this.resetProgressBar();
    
    this.autoPlayInterval = setInterval(() => {
      if (!this.isPaused && !this.isDragging) {
        this.next();
        this.resetProgressBar();
      }
    }, this.autoPlayDelay);

    // Запускаем анимацию прогресс-бара
    if (this.progressBar) {
      this.progressBar.classList.add('animating');
    }
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
    
    if (this.progressBar) {
      this.progressBar.classList.remove('animating');
      this.progressBar.style.width = '0%';
    }
  }

  resetAutoPlay() {
    this.stopAutoPlay();
    this.startAutoPlay();
  }

  resetProgressBar() {
    if (!this.progressBar) return;
    
    this.progressBar.classList.remove('animating');
    void this.progressBar.offsetWidth; // Force reflow
    this.progressBar.classList.add('animating');
  }

  pauseAutoPlay() {
    this.isPaused = true;
    if (this.progressBar) {
      this.progressBar.style.animationPlayState = 'paused';
    }
  }

  resumeAutoPlay() {
    this.isPaused = false;
    if (this.progressBar) {
      this.progressBar.style.animationPlayState = 'running';
    }
  }

  // ========================================
  // TOUCH / SWIPE HANDLING
  // ========================================
  handleTouchStart(e) {
    this.touchStartX = e.touches ? e.touches[0].clientX : e.clientX;
    this.isDragging = true;
    this.container.classList.add('swiping');
    this.pauseAutoPlay();
  }

  handleTouchMove(e) {
    if (!this.isDragging) return;

    const currentX = e.touches ? e.touches[0].clientX : e.clientX;
    this.dragOffset = currentX - this.touchStartX;

    // Визуальная обратная связь при свайпе
    const activeCard = this.cards.find(card => card.dataset.position === '0');
    if (activeCard) {
      const maxDrag = 80;
      const clampedOffset = Math.max(-maxDrag, Math.min(maxDrag, this.dragOffset * 0.3));
      const rotation = clampedOffset * 0.015;
      activeCard.style.transform = `translateX(${clampedOffset}px) translateZ(80px) scale(1) rotateY(${rotation}deg)`;
    }
  }

  handleTouchEnd() {
    if (!this.isDragging) return;

    this.isDragging = false;
    this.container.classList.remove('swiping');

    // Определяем направление свайпа
    const threshold = 40;
    
    if (this.dragOffset > threshold) {
      this.prev();
    } else if (this.dragOffset < -threshold) {
      this.next();
    } else {
      // Возвращаем карточку на место
      this.updatePositions();
    }

    // Сбрасываем inline стили
    const activeCard = this.cards.find(card => card.dataset.position === '0');
    if (activeCard) {
      activeCard.style.transform = '';
    }

    this.dragOffset = 0;
    this.resumeAutoPlay();
  }

  // ========================================
  // EVENT BINDINGS
  // ========================================
  bindEvents() {
    // Arrows
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prev());
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.next());
    }

    // Dots
    if (this.dotsContainer) {
      this.dotsContainer.addEventListener('click', (e) => {
        const dot = e.target.closest('.carousel-dot');
        if (dot) {
          const index = parseInt(dot.dataset.index, 10);
          this.goTo(index);
        }
      });
    }

    // Card clicks - navigate to clicked card
    this.cards.forEach((card, index) => {
      card.addEventListener('click', () => {
        const position = parseInt(card.dataset.position, 10);
        if (position !== 0) {
          this.goTo(index);
        }
      });
    });

    // Touch events
    this.container.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
    this.container.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true });
    this.container.addEventListener('touchend', () => this.handleTouchEnd());

    // Mouse drag (desktop)
    this.container.addEventListener('mousedown', (e) => {
      if (e.target.closest('.carousel-nav')) return;
      this.handleTouchStart(e);
    });
    document.addEventListener('mousemove', (e) => {
      if (this.isDragging) this.handleTouchMove(e);
    });
    document.addEventListener('mouseup', () => {
      if (this.isDragging) this.handleTouchEnd();
    });

    // Pause on hover (desktop)
    this.container.addEventListener('mouseenter', () => {
      if (window.innerWidth > 900) {
        this.pauseAutoPlay();
      }
    });
    this.container.addEventListener('mouseleave', () => {
      if (window.innerWidth > 900 && !this.isDragging) {
        this.resumeAutoPlay();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      // Только если карусель в viewport
      const rect = this.container.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (!inView) return;

      if (e.key === 'ArrowRight') {
        this.next();
      } else if (e.key === 'ArrowLeft') {
        this.prev();
      }
    });

    // Pause when tab not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stopAutoPlay();
      } else {
        this.startAutoPlay();
      }
    });

    // Intersection Observer - pause when out of view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.startAutoPlay();
        } else {
          this.stopAutoPlay();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(this.container);
  }
}

// ========================================
// INITIALIZE ON DOM READY
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  const carouselContainer = document.querySelector('.reviews-carousel');
  if (carouselContainer) {
    new ReviewsCarousel(carouselContainer);
  }
});

// Export for potential external use
window.ReviewsCarousel = ReviewsCarousel;
