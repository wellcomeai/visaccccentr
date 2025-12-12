// ========================================
// VISANEWS2YOU - Optimized Globe
// Performance-focused implementation
// ========================================

class MinimalGlobe {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d', {
      alpha: true,
      desynchronized: true // Better performance on some devices
    });
    
    this.rotation = 0;
    this.dots = [];
    this.isRunning = false;
    this.animationId = null;
    this.lastFrameTime = 0;
    this.targetFPS = this.isMobile() ? 30 : 60;
    this.frameInterval = 1000 / this.targetFPS;
    
    this.colors = {
      globe: '#f5f0e8',
      globeStroke: '#e8dfd2',
      dots: '#b8956c',
      dotsDim: '#d4c4b0',
      routes: '#b8956c',
      glow: 'rgba(184, 149, 108, 0.15)',
      text: '#6b5f4f'
    };
    
    this.cities = [
      { name: 'Москва', lat: 55.75, lng: 37.61, isCenter: true },
      { name: 'Берлин', lat: 52.52, lng: 13.40 },
      { name: 'Париж', lat: 48.85, lng: 2.35 },
      { name: 'Лондон', lat: 51.50, lng: -0.12 },
      { name: 'Рим', lat: 41.90, lng: 12.49 },
      { name: 'Нью-Йорк', lat: 40.71, lng: -74.00 },
      { name: 'Оттава', lat: 45.42, lng: -75.69 }
    ];
    
    this.init();
  }
  
  isMobile() {
    return window.innerWidth < 900;
  }
  
  isLowEnd() {
    return navigator.hardwareConcurrency <= 4 || 
           navigator.deviceMemory <= 4;
  }
  
  init() {
    // Don't initialize on low-end devices
    if (this.isLowEnd() && this.isMobile()) {
      this.canvas.style.display = 'none';
      return;
    }
    
    this.resize();
    this.generateDots();
    this.setupVisibilityObserver();
    
    // Debounced resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => this.resize(), 200);
    }, { passive: true });
    
    // Export instance for external control
    window.globeInstance = this;
  }
  
  setupVisibilityObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          this.setRunning(entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );
    
    const parent = this.canvas.parentElement;
    if (parent) {
      observer.observe(parent);
    }
  }
  
  setRunning(shouldRun) {
    if (shouldRun && !this.isRunning) {
      this.isRunning = true;
      this.lastFrameTime = performance.now();
      this.animate();
    } else if (!shouldRun && this.isRunning) {
      this.isRunning = false;
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
    }
  }
  
  resize() {
    const container = this.canvas.parentElement;
    if (!container) return;
    
    const size = Math.min(container.offsetWidth, container.offsetHeight);
    
    // Use device pixel ratio but cap it for performance
    const dpr = Math.min(window.devicePixelRatio || 1, this.isMobile() ? 1.5 : 2);
    
    this.canvas.width = size * dpr;
    this.canvas.height = size * dpr;
    this.canvas.style.width = size + 'px';
    this.canvas.style.height = size + 'px';
    
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);
    
    this.size = size;
    this.centerX = size / 2;
    this.centerY = size / 2;
    this.radius = Math.min(this.centerX, this.centerY) * 0.75;
  }
  
  generateDots() {
    this.dots = [];
    // Reduce dots count on mobile
    const count = this.isMobile() ? 400 : 800;
    
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      
      const noise = Math.sin(phi * 3) * Math.cos(theta * 2) * Math.sin(phi * 5 + theta);
      if (noise > -0.2) {
        this.dots.push({
          lat: 90 - (phi * 180 / Math.PI),
          lng: (theta * 180 / Math.PI) % 360 - 180,
          size: Math.random() * 1.5 + 0.8
        });
      }
    }
  }
  
  latLngTo3D(lat, lng, radius) {
    const phi = (90 - lat) * Math.PI / 180;
    const theta = (lng + this.rotation) * Math.PI / 180;
    
    return {
      x: radius * Math.sin(phi) * Math.cos(theta),
      y: radius * Math.cos(phi),
      z: radius * Math.sin(phi) * Math.sin(theta)
    };
  }
  
  project(point) {
    const tilt = 0.3;
    const y = point.y * Math.cos(tilt) - point.z * Math.sin(tilt);
    const z = point.y * Math.sin(tilt) + point.z * Math.cos(tilt);
    
    return {
      x: this.centerX + point.x,
      y: this.centerY - y,
      z: z,
      visible: z > 0
    };
  }
  
  drawGlobe() {
    const ctx = this.ctx;
    
    // Simplified glow - skip on mobile
    if (!this.isMobile()) {
      const glowGradient = ctx.createRadialGradient(
        this.centerX, this.centerY, this.radius * 0.9,
        this.centerX, this.centerY, this.radius * 1.2
      );
      glowGradient.addColorStop(0, 'rgba(184, 149, 108, 0.06)');
      glowGradient.addColorStop(1, 'rgba(184, 149, 108, 0)');
      
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(this.centerX, this.centerY, this.radius * 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Globe base - simplified gradient
    const gradient = ctx.createRadialGradient(
      this.centerX - this.radius * 0.3,
      this.centerY - this.radius * 0.3,
      0,
      this.centerX,
      this.centerY,
      this.radius
    );
    gradient.addColorStop(0, '#fdfcfa');
    gradient.addColorStop(1, '#ebe5db');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Border
    ctx.strokeStyle = this.colors.globeStroke;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
  
  drawDots() {
    const ctx = this.ctx;
    
    // Pre-calculate visible dots
    const visibleDots = [];
    
    for (const dot of this.dots) {
      const pos3d = this.latLngTo3D(dot.lat, dot.lng, this.radius);
      const projected = this.project(pos3d);
      
      if (projected.visible) {
        visibleDots.push({
          x: projected.x,
          y: projected.y,
          z: projected.z,
          size: dot.size
        });
      }
    }
    
    // Sort by z (back to front)
    visibleDots.sort((a, b) => a.z - b.z);
    
    // Batch draw - single fill call
    ctx.fillStyle = 'rgba(184, 149, 108, 0.4)';
    ctx.beginPath();
    
    for (const dot of visibleDots) {
      const size = dot.size * (0.8 + dot.z / this.radius * 0.4);
      ctx.moveTo(dot.x + size, dot.y);
      ctx.arc(dot.x, dot.y, size, 0, Math.PI * 2);
    }
    
    ctx.fill();
  }
  
  drawCities() {
    const ctx = this.ctx;
    const moscow = this.cities[0];
    
    for (const city of this.cities) {
      const pos3d = this.latLngTo3D(city.lat, city.lng, this.radius);
      const projected = this.project(pos3d);
      
      if (!projected.visible) continue;
      
      const alpha = 0.5 + (projected.z / this.radius) * 0.5;
      
      // Draw route from Moscow - skip on mobile
      if (!city.isCenter && !this.isMobile()) {
        const moscowPos = this.latLngTo3D(moscow.lat, moscow.lng, this.radius);
        const moscowProj = this.project(moscowPos);
        
        if (moscowProj.visible) {
          ctx.strokeStyle = `rgba(184, 149, 108, ${alpha * 0.25})`;
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          
          const midX = (moscowProj.x + projected.x) / 2;
          const midY = (moscowProj.y + projected.y) / 2 - 20;
          
          ctx.moveTo(moscowProj.x, moscowProj.y);
          ctx.quadraticCurveTo(midX, midY, projected.x, projected.y);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }
      
      // City dot
      const size = city.isCenter ? 6 : 4;
      
      // Glow - skip on mobile
      if (!this.isMobile()) {
        ctx.fillStyle = `rgba(184, 149, 108, ${alpha * 0.3})`;
        ctx.beginPath();
        ctx.arc(projected.x, projected.y, size * 2, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Main dot
      ctx.fillStyle = city.isCenter ? this.colors.dots : `rgba(184, 149, 108, ${alpha})`;
      ctx.beginPath();
      ctx.arc(projected.x, projected.y, size, 0, Math.PI * 2);
      ctx.fill();
      
      // White center
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(projected.x, projected.y, size * 0.35, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  drawGrid() {
    // Skip on mobile
    if (this.isMobile()) return;
    
    const ctx = this.ctx;
    ctx.strokeStyle = 'rgba(184, 149, 108, 0.06)';
    ctx.lineWidth = 0.5;
    
    // Reduced lines
    for (let lat = -45; lat <= 45; lat += 45) {
      ctx.beginPath();
      for (let lng = 0; lng <= 360; lng += 10) {
        const pos3d = this.latLngTo3D(lat, lng, this.radius);
        const projected = this.project(pos3d);
        
        if (lng === 0) {
          ctx.moveTo(projected.x, projected.y);
        } else if (projected.visible) {
          ctx.lineTo(projected.x, projected.y);
        }
      }
      ctx.stroke();
    }
  }
  
  animate(currentTime = 0) {
    if (!this.isRunning) return;
    
    // Frame rate limiting
    const elapsed = currentTime - this.lastFrameTime;
    
    if (elapsed >= this.frameInterval) {
      this.lastFrameTime = currentTime - (elapsed % this.frameInterval);
      
      // Clear
      this.ctx.clearRect(0, 0, this.size, this.size);
      
      // Draw layers
      this.drawGlobe();
      this.drawGrid();
      this.drawDots();
      this.drawCities();
      
      // Slow rotation
      this.rotation += this.isMobile() ? 0.05 : 0.08;
    }
    
    this.animationId = requestAnimationFrame((time) => this.animate(time));
  }
}

// Initialize with delay to not block initial render
document.addEventListener('DOMContentLoaded', () => {
  const initGlobe = () => {
    const canvas = document.getElementById('globe-canvas');
    if (canvas) {
      new MinimalGlobe('globe-canvas');
    }
  };
  
  // Use requestIdleCallback if available
  if ('requestIdleCallback' in window) {
    requestIdleCallback(initGlobe, { timeout: 500 });
  } else {
    setTimeout(initGlobe, 200);
  }
});
