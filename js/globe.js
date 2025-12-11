// ========================================
// VISATOYOU - Rotating Globe Animation
// Lightweight CSS/Canvas Implementation
// ========================================

class Globe {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.rotation = 0;
    this.rotationSpeed = 0.003;
    
    // Globe settings
    this.globeColor = '#b8956c';
    this.globeColorLight = '#d4b896';
    this.landColor = '#8a6d4a';
    this.oceanColor = 'rgba(184, 149, 108, 0.15)';
    this.gridColor = 'rgba(184, 149, 108, 0.3)';
    
    // Simplified land masses (longitude, latitude pairs for major continents)
    this.landMasses = this.generateSimplifiedContinents();
    
    this.init();
  }
  
  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.animate();
  }
  
  resize() {
    const container = this.canvas.parentElement;
    const size = Math.min(container.offsetWidth, container.offsetHeight);
    
    // Set canvas size with device pixel ratio for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = size * dpr;
    this.canvas.height = size * dpr;
    this.canvas.style.width = size + 'px';
    this.canvas.style.height = size + 'px';
    
    this.ctx.scale(dpr, dpr);
    
    this.centerX = size / 2;
    this.centerY = size / 2;
    this.radius = size * 0.42;
    this.size = size;
  }
  
  // Generate simplified continent outlines
  generateSimplifiedContinents() {
    // Simplified polygon data for continents (lon, lat)
    // These are rough approximations for visual effect
    return [
      // North America
      [
        [-130, 50], [-120, 60], [-100, 65], [-80, 60], [-70, 45], 
        [-80, 35], [-100, 30], [-120, 35], [-130, 50]
      ],
      // South America  
      [
        [-80, 10], [-60, 5], [-50, -5], [-45, -20], [-55, -35],
        [-70, -45], [-75, -35], [-80, -15], [-80, 10]
      ],
      // Europe
      [
        [-10, 40], [0, 50], [20, 55], [30, 60], [40, 55],
        [30, 45], [20, 40], [10, 38], [-10, 40]
      ],
      // Africa
      [
        [-15, 30], [10, 35], [35, 30], [50, 10], [40, -20],
        [30, -35], [15, -30], [10, -5], [-15, 10], [-15, 30]
      ],
      // Asia
      [
        [60, 55], [90, 65], [120, 65], [140, 55], [130, 40],
        [120, 30], [100, 25], [80, 30], [60, 40], [60, 55]
      ],
      // Australia
      [
        [115, -20], [130, -15], [145, -20], [150, -30], [145, -38],
        [130, -35], [115, -30], [115, -20]
      ]
    ];
  }
  
  // Convert geographic coordinates to 3D then to 2D screen coordinates
  geoTo3D(lon, lat, radius) {
    const phi = (90 - lat) * Math.PI / 180;
    const theta = (lon + this.rotation * 180 / Math.PI) * Math.PI / 180;
    
    return {
      x: radius * Math.sin(phi) * Math.cos(theta),
      y: radius * Math.cos(phi),
      z: radius * Math.sin(phi) * Math.sin(theta)
    };
  }
  
  project(point3D) {
    // Simple orthographic projection
    return {
      x: this.centerX + point3D.x,
      y: this.centerY - point3D.y,
      visible: point3D.z > 0
    };
  }
  
  drawGlobe() {
    const ctx = this.ctx;
    
    // Clear canvas
    ctx.clearRect(0, 0, this.size, this.size);
    
    // Draw globe background with gradient
    const gradient = ctx.createRadialGradient(
      this.centerX - this.radius * 0.3, 
      this.centerY - this.radius * 0.3, 
      0,
      this.centerX, 
      this.centerY, 
      this.radius
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(0.5, 'rgba(184, 149, 108, 0.1)');
    gradient.addColorStop(1, 'rgba(138, 109, 74, 0.2)');
    
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Draw globe border
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(184, 149, 108, 0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw latitude lines
    this.drawLatitudeLines();
    
    // Draw longitude lines
    this.drawLongitudeLines();
    
    // Draw land masses
    this.drawLandMasses();
    
    // Draw highlight/shine
    this.drawHighlight();
  }
  
  drawLatitudeLines() {
    const ctx = this.ctx;
    ctx.strokeStyle = this.gridColor;
    ctx.lineWidth = 0.5;
    
    for (let lat = -60; lat <= 60; lat += 30) {
      ctx.beginPath();
      
      for (let lon = 0; lon <= 360; lon += 5) {
        const point3D = this.geoTo3D(lon, lat, this.radius);
        const point2D = this.project(point3D);
        
        if (lon === 0) {
          ctx.moveTo(point2D.x, point2D.y);
        } else if (point2D.visible) {
          ctx.lineTo(point2D.x, point2D.y);
        } else {
          ctx.moveTo(point2D.x, point2D.y);
        }
      }
      
      ctx.stroke();
    }
  }
  
  drawLongitudeLines() {
    const ctx = this.ctx;
    ctx.strokeStyle = this.gridColor;
    ctx.lineWidth = 0.5;
    
    for (let lon = 0; lon < 360; lon += 30) {
      ctx.beginPath();
      
      let lastVisible = false;
      
      for (let lat = -90; lat <= 90; lat += 5) {
        const point3D = this.geoTo3D(lon, lat, this.radius);
        const point2D = this.project(point3D);
        
        if (!lastVisible && point2D.visible) {
          ctx.moveTo(point2D.x, point2D.y);
        } else if (point2D.visible) {
          ctx.lineTo(point2D.x, point2D.y);
        }
        
        lastVisible = point2D.visible;
      }
      
      ctx.stroke();
    }
  }
  
  drawLandMasses() {
    const ctx = this.ctx;
    
    this.landMasses.forEach(continent => {
      ctx.beginPath();
      ctx.fillStyle = 'rgba(138, 109, 74, 0.5)';
      ctx.strokeStyle = 'rgba(138, 109, 74, 0.7)';
      ctx.lineWidth = 1;
      
      let started = false;
      let allVisible = true;
      const points = [];
      
      continent.forEach(([lon, lat], index) => {
        const point3D = this.geoTo3D(lon, lat, this.radius * 0.98);
        const point2D = this.project(point3D);
        points.push({ ...point2D, visible: point3D.z > -10 });
        
        if (point3D.z <= -10) allVisible = false;
      });
      
      // Only draw if at least partially visible
      const visiblePoints = points.filter(p => p.visible);
      if (visiblePoints.length < 3) return;
      
      points.forEach((point, index) => {
        if (point.visible) {
          if (!started) {
            ctx.moveTo(point.x, point.y);
            started = true;
          } else {
            ctx.lineTo(point.x, point.y);
          }
        }
      });
      
      if (started) {
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    });
  }
  
  drawHighlight() {
    const ctx = this.ctx;
    
    // Top-left shine
    const shineGradient = ctx.createRadialGradient(
      this.centerX - this.radius * 0.4,
      this.centerY - this.radius * 0.4,
      0,
      this.centerX - this.radius * 0.4,
      this.centerY - this.radius * 0.4,
      this.radius * 0.5
    );
    shineGradient.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
    shineGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.radius - 1, 0, Math.PI * 2);
    ctx.fillStyle = shineGradient;
    ctx.fill();
  }
  
  // Draw dots for major cities/destinations
  drawCityDots() {
    const cities = [
      { name: 'Paris', lon: 2.35, lat: 48.85 },
      { name: 'Berlin', lon: 13.4, lat: 52.52 },
      { name: 'Rome', lon: 12.5, lat: 41.9 },
      { name: 'New York', lon: -74, lat: 40.7 },
      { name: 'London', lon: -0.12, lat: 51.5 },
      { name: 'Toronto', lon: -79.4, lat: 43.65 },
    ];
    
    const ctx = this.ctx;
    
    cities.forEach(city => {
      const point3D = this.geoTo3D(city.lon, city.lat, this.radius * 0.98);
      const point2D = this.project(point3D);
      
      if (point2D.visible && point3D.z > 0) {
        // Dot
        ctx.beginPath();
        ctx.arc(point2D.x, point2D.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#b8956c';
        ctx.fill();
        
        // Glow
        ctx.beginPath();
        ctx.arc(point2D.x, point2D.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(184, 149, 108, 0.3)';
        ctx.fill();
      }
    });
  }
  
  animate() {
    this.rotation += this.rotationSpeed;
    this.drawGlobe();
    this.drawCityDots();
    
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize globe on page load
document.addEventListener('DOMContentLoaded', function() {
  // Small delay to ensure container is properly sized
  setTimeout(() => {
    new Globe('globe-canvas');
  }, 100);
});
