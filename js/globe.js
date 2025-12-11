// ========================================
// VISANEWS2YOU - Minimal Elegant Globe
// Clean, Professional Design
// ========================================

class MinimalGlobe {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.rotation = 0;
    this.dots = [];
    this.routes = [];
    
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
  
  init() {
    this.resize();
    this.generateDots();
    this.animate();
    
    window.addEventListener('resize', () => this.resize());
  }
  
  resize() {
    const container = this.canvas.parentElement;
    const size = Math.min(container.offsetWidth, container.offsetHeight);
    
    this.canvas.width = size * 2;
    this.canvas.height = size * 2;
    this.canvas.style.width = size + 'px';
    this.canvas.style.height = size + 'px';
    
    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;
    this.radius = Math.min(this.centerX, this.centerY) * 0.75;
  }
  
  generateDots() {
    this.dots = [];
    const count = 800;
    
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      
      // Simple noise for land-like distribution
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
    // Simple orthographic projection with tilt
    const tilt = 0.3;
    const y = point.y * Math.cos(tilt) - point.z * Math.sin(tilt);
    const z = point.y * Math.sin(tilt) + point.z * Math.cos(tilt);
    
    return {
      x: this.centerX + point.x,
      y: this.centerY - y,
      z: z, // For depth sorting
      visible: z > 0
    };
  }
  
  drawGlobe() {
    const ctx = this.ctx;
    
    // Outer glow
    const glowGradient = ctx.createRadialGradient(
      this.centerX, this.centerY, this.radius * 0.9,
      this.centerX, this.centerY, this.radius * 1.3
    );
    glowGradient.addColorStop(0, 'rgba(184, 149, 108, 0.08)');
    glowGradient.addColorStop(1, 'rgba(184, 149, 108, 0)');
    
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.radius * 1.3, 0, Math.PI * 2);
    ctx.fill();
    
    // Globe base
    const gradient = ctx.createRadialGradient(
      this.centerX - this.radius * 0.3,
      this.centerY - this.radius * 0.3,
      0,
      this.centerX,
      this.centerY,
      this.radius
    );
    gradient.addColorStop(0, '#fdfcfa');
    gradient.addColorStop(0.7, '#f5f0e8');
    gradient.addColorStop(1, '#ebe5db');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Subtle border
    ctx.strokeStyle = this.colors.globeStroke;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  
  drawDots() {
    const ctx = this.ctx;
    
    // Sort dots by z for proper layering
    const projectedDots = this.dots.map(dot => {
      const pos3d = this.latLngTo3D(dot.lat, dot.lng, this.radius);
      const projected = this.project(pos3d);
      return { ...dot, ...projected };
    }).filter(d => d.visible).sort((a, b) => a.z - b.z);
    
    projectedDots.forEach(dot => {
      const alpha = 0.3 + (dot.z / this.radius) * 0.5;
      ctx.fillStyle = `rgba(184, 149, 108, ${alpha * 0.6})`;
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.size * (0.8 + dot.z / this.radius * 0.4), 0, Math.PI * 2);
      ctx.fill();
    });
  }
  
  drawCities() {
    const ctx = this.ctx;
    const moscow = this.cities[0];
    
    this.cities.forEach((city, i) => {
      const pos3d = this.latLngTo3D(city.lat, city.lng, this.radius);
      const projected = this.project(pos3d);
      
      if (!projected.visible) return;
      
      const alpha = 0.5 + (projected.z / this.radius) * 0.5;
      
      // Draw route from Moscow (if not Moscow itself)
      if (!city.isCenter) {
        const moscowPos = this.latLngTo3D(moscow.lat, moscow.lng, this.radius);
        const moscowProj = this.project(moscowPos);
        
        if (moscowProj.visible && projected.visible) {
          // Draw curved arc
          ctx.strokeStyle = `rgba(184, 149, 108, ${alpha * 0.3})`;
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          
          // Simple quadratic curve
          const midX = (moscowProj.x + projected.x) / 2;
          const midY = (moscowProj.y + projected.y) / 2 - 30;
          
          ctx.moveTo(moscowProj.x, moscowProj.y);
          ctx.quadraticCurveTo(midX, midY, projected.x, projected.y);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }
      
      // City dot
      const size = city.isCenter ? 8 : 5;
      
      // Glow
      const glowGradient = ctx.createRadialGradient(
        projected.x, projected.y, 0,
        projected.x, projected.y, size * 3
      );
      glowGradient.addColorStop(0, `rgba(184, 149, 108, ${alpha * 0.4})`);
      glowGradient.addColorStop(1, 'rgba(184, 149, 108, 0)');
      
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(projected.x, projected.y, size * 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Dot
      ctx.fillStyle = city.isCenter ? this.colors.dots : `rgba(184, 149, 108, ${alpha})`;
      ctx.beginPath();
      ctx.arc(projected.x, projected.y, size, 0, Math.PI * 2);
      ctx.fill();
      
      // White center
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(projected.x, projected.y, size * 0.4, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  
  drawGrid() {
    const ctx = this.ctx;
    ctx.strokeStyle = 'rgba(184, 149, 108, 0.08)';
    ctx.lineWidth = 1;
    
    // Latitude lines
    for (let lat = -60; lat <= 60; lat += 30) {
      ctx.beginPath();
      for (let lng = 0; lng <= 360; lng += 5) {
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
    
    // Longitude lines  
    for (let lng = 0; lng < 360; lng += 30) {
      ctx.beginPath();
      let started = false;
      for (let lat = -90; lat <= 90; lat += 5) {
        const pos3d = this.latLngTo3D(lat, lng, this.radius);
        const projected = this.project(pos3d);
        
        if (projected.visible) {
          if (!started) {
            ctx.moveTo(projected.x, projected.y);
            started = true;
          } else {
            ctx.lineTo(projected.x, projected.y);
          }
        } else {
          started = false;
        }
      }
      ctx.stroke();
    }
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.drawGlobe();
    this.drawGrid();
    this.drawDots();
    this.drawCities();
    
    // Slow rotation
    this.rotation += 0.08;
    
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const canvas = document.getElementById('globe-canvas');
    if (canvas) {
      new MinimalGlobe('globe-canvas');
    }
  }, 100);
});
