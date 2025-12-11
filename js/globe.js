// ========================================
// VISATOYOU - Beautiful Rotating Globe
// With airplane flying around the surface
// ========================================

class Globe {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.rotation = 0;
    this.rotationSpeed = 0.004;
    
    // Airplane position (travels along a great circle route)
    this.airplaneAngle = 0;
    this.airplaneSpeed = 0.008;
    
    // Colors
    this.colors = {
      ocean: '#e8f4fc',
      oceanDark: '#d0e8f5',
      land: '#b8956c',
      landLight: '#d4b896',
      landDark: '#8a6d4a',
      grid: 'rgba(184, 149, 108, 0.15)',
      border: 'rgba(184, 149, 108, 0.5)',
      highlight: 'rgba(255, 255, 255, 0.4)',
      shadow: 'rgba(44, 36, 24, 0.1)',
      airplane: '#8a6d4a',
      trail: 'rgba(184, 149, 108, 0.6)'
    };
    
    // Flight route (simplified great circle route)
    this.flightRoute = this.generateFlightRoute();
    
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
  
  // Generate flight route points (circular path around globe)
  generateFlightRoute() {
    const points = [];
    
    // Create a tilted circular path around the globe
    for (let t = 0; t < 1; t += 0.01) {
      const angle = t * Math.PI * 2;
      const lon = (angle * 180 / Math.PI) - 180;
      const lat = Math.sin(angle * 2) * 35 + Math.cos(angle) * 15;
      points.push({ lon, lat });
    }
    
    return points;
  }
  
  // Convert geographic coordinates to 3D
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
    return {
      x: this.centerX + point3D.x,
      y: this.centerY - point3D.y,
      z: point3D.z,
      visible: point3D.z > 0
    };
  }
  
  drawGlobe() {
    const ctx = this.ctx;
    
    ctx.clearRect(0, 0, this.size, this.size);
    
    // Outer glow
    const glowGradient = ctx.createRadialGradient(
      this.centerX, this.centerY, this.radius * 0.9,
      this.centerX, this.centerY, this.radius * 1.3
    );
    glowGradient.addColorStop(0, 'rgba(184, 149, 108, 0.15)');
    glowGradient.addColorStop(1, 'transparent');
    
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.radius * 1.3, 0, Math.PI * 2);
    ctx.fillStyle = glowGradient;
    ctx.fill();
    
    // Globe shadow
    ctx.beginPath();
    ctx.ellipse(
      this.centerX + this.radius * 0.1, 
      this.centerY + this.radius * 1.1, 
      this.radius * 0.8, 
      this.radius * 0.15, 
      0, 0, Math.PI * 2
    );
    ctx.fillStyle = 'rgba(44, 36, 24, 0.08)';
    ctx.fill();
    
    // Ocean base with beautiful gradient
    const oceanGradient = ctx.createRadialGradient(
      this.centerX - this.radius * 0.3,
      this.centerY - this.radius * 0.3,
      0,
      this.centerX,
      this.centerY,
      this.radius
    );
    oceanGradient.addColorStop(0, '#f5fbff');
    oceanGradient.addColorStop(0.4, '#e8f4fc');
    oceanGradient.addColorStop(0.8, '#dceef8');
    oceanGradient.addColorStop(1, '#d0e6f2');
    
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = oceanGradient;
    ctx.fill();
    
    // Draw grid lines
    this.drawGrid();
    
    // Draw continents
    this.drawContinents();
    
    // Draw flight trail
    this.drawFlightTrail();
    
    // Draw airplane
    this.drawAirplane();
    
    // Draw city markers
    this.drawCities();
    
    // Globe border
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2);
    ctx.strokeStyle = this.colors.border;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Highlight shine
    this.drawHighlight();
  }
  
  drawGrid() {
    const ctx = this.ctx;
    ctx.strokeStyle = this.colors.grid;
    ctx.lineWidth = 0.5;
    
    // Latitude lines
    for (let lat = -60; lat <= 60; lat += 30) {
      ctx.beginPath();
      let started = false;
      
      for (let lon = 0; lon <= 360; lon += 3) {
        const point3D = this.geoTo3D(lon, lat, this.radius * 0.99);
        const point2D = this.project(point3D);
        
        if (point2D.visible) {
          if (!started) {
            ctx.moveTo(point2D.x, point2D.y);
            started = true;
          } else {
            ctx.lineTo(point2D.x, point2D.y);
          }
        } else {
          started = false;
        }
      }
      ctx.stroke();
    }
    
    // Longitude lines
    for (let lon = 0; lon < 360; lon += 30) {
      ctx.beginPath();
      let started = false;
      
      for (let lat = -85; lat <= 85; lat += 3) {
        const point3D = this.geoTo3D(lon, lat, this.radius * 0.99);
        const point2D = this.project(point3D);
        
        if (point2D.visible) {
          if (!started) {
            ctx.moveTo(point2D.x, point2D.y);
            started = true;
          } else {
            ctx.lineTo(point2D.x, point2D.y);
          }
        } else {
          started = false;
        }
      }
      ctx.stroke();
    }
  }
  
  drawContinents() {
    const ctx = this.ctx;
    
    // Simplified continent shapes with better coordinates
    const continents = [
      // North America
      { points: [[-130,55],[-125,60],[-120,65],[-100,68],[-85,65],[-75,55],[-65,45],[-75,35],[-85,30],[-100,28],[-115,32],[-125,40],[-130,55]], color: this.colors.land },
      // South America
      { points: [[-82,10],[-75,8],[-60,5],[-50,-2],[-45,-10],[-40,-22],[-45,-30],[-55,-40],[-68,-52],[-75,-45],[-78,-35],[-80,-15],[-82,10]], color: this.colors.land },
      // Europe
      { points: [[-10,36],[0,38],[5,44],[10,50],[15,55],[25,58],[30,60],[35,58],[30,50],[25,42],[20,38],[10,36],[-10,36]], color: this.colors.landLight },
      // Africa
      { points: [[-18,35],[-5,36],[10,37],[25,32],[35,30],[42,20],[50,12],[50,0],[42,-15],[35,-25],[28,-34],[20,-35],[15,-25],[10,-5],[5,5],[-5,5],[-15,10],[-18,20],[-18,35]], color: this.colors.land },
      // Asia
      { points: [[35,55],[45,55],[60,60],[80,68],[100,72],[120,70],[135,65],[145,55],[145,45],[140,35],[130,30],[120,25],[105,20],[90,22],[75,25],[60,35],[50,40],[35,55]], color: this.colors.landLight },
      // Australia
      { points: [[115,-18],[125,-15],[135,-12],[145,-15],[150,-22],[152,-30],[148,-38],[140,-38],[130,-32],[120,-28],[115,-25],[115,-18]], color: this.colors.land },
      // Greenland
      { points: [[-45,60],[-35,65],[-25,72],[-20,78],[-30,82],[-45,82],[-55,78],[-58,72],[-55,65],[-45,60]], color: this.colors.landLight },
    ];
    
    continents.forEach(continent => {
      this.drawContinent(continent.points, continent.color);
    });
  }
  
  drawContinent(coords, color) {
    const ctx = this.ctx;
    const points = [];
    
    coords.forEach(([lon, lat]) => {
      const point3D = this.geoTo3D(lon, lat, this.radius * 0.995);
      const point2D = this.project(point3D);
      points.push(point2D);
    });
    
    // Check if enough points are visible
    const visibleCount = points.filter(p => p.visible).length;
    if (visibleCount < 3) return;
    
    ctx.beginPath();
    let started = false;
    
    points.forEach((point, i) => {
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
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = this.colors.landDark;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }
  }
  
  drawFlightTrail() {
    const ctx = this.ctx;
    const routeLength = this.flightRoute.length;
    const currentIndex = Math.floor(this.airplaneAngle * routeLength) % routeLength;
    
    // Draw trail behind airplane
    const trailLength = 20;
    
    ctx.strokeStyle = this.colors.trail;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    
    ctx.beginPath();
    let started = false;
    
    for (let i = 0; i < trailLength; i++) {
      const index = (currentIndex - i + routeLength) % routeLength;
      const point = this.flightRoute[index];
      const point3D = this.geoTo3D(point.lon, point.lat, this.radius * 1.03);
      const point2D = this.project(point3D);
      
      if (point2D.visible && point2D.z > 0) {
        // Fade out trail
        ctx.globalAlpha = 1 - (i / trailLength) * 0.7;
        
        if (!started) {
          ctx.moveTo(point2D.x, point2D.y);
          started = true;
        } else {
          ctx.lineTo(point2D.x, point2D.y);
        }
      } else {
        if (started) {
          ctx.stroke();
          ctx.beginPath();
          started = false;
        }
      }
    }
    
    if (started) ctx.stroke();
    
    ctx.globalAlpha = 1;
    ctx.setLineDash([]);
  }
  
  drawAirplane() {
    const ctx = this.ctx;
    const routeLength = this.flightRoute.length;
    
    // Get current position
    const currentIndex = Math.floor(this.airplaneAngle * routeLength) % routeLength;
    const nextIndex = (currentIndex + 1) % routeLength;
    
    const current = this.flightRoute[currentIndex];
    const next = this.flightRoute[nextIndex];
    
    const point3D = this.geoTo3D(current.lon, current.lat, this.radius * 1.06);
    const point2D = this.project(point3D);
    
    // Only draw if visible (front side of globe)
    if (!point2D.visible || point2D.z < this.radius * 0.1) return;
    
    // Calculate flight direction
    const next3D = this.geoTo3D(next.lon, next.lat, this.radius * 1.06);
    const next2D = this.project(next3D);
    
    const angle = Math.atan2(next2D.y - point2D.y, next2D.x - point2D.x);
    
    // Scale based on z-depth for pseudo-3D effect
    const scale = 0.8 + (point2D.z / this.radius) * 0.4;
    
    // Draw airplane
    ctx.save();
    ctx.translate(point2D.x, point2D.y);
    ctx.rotate(angle);
    ctx.scale(scale, scale);
    
    // Airplane glow
    const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 16);
    glowGradient.addColorStop(0, 'rgba(184, 149, 108, 0.5)');
    glowGradient.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fillStyle = glowGradient;
    ctx.fill();
    
    // Airplane shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.ellipse(2, 2, 10, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Airplane body - pointing in direction of flight
    ctx.fillStyle = this.colors.airplane;
    ctx.strokeStyle = '#6b5540';
    ctx.lineWidth = 1;
    
    // Fuselage
    ctx.beginPath();
    ctx.moveTo(12, 0);      // nose
    ctx.lineTo(4, -2);
    ctx.lineTo(-8, -1.5);
    ctx.lineTo(-12, 0);     // tail
    ctx.lineTo(-8, 1.5);
    ctx.lineTo(4, 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Wings
    ctx.beginPath();
    ctx.moveTo(2, -2);
    ctx.lineTo(-2, -10);
    ctx.lineTo(-6, -10);
    ctx.lineTo(-4, -2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(2, 2);
    ctx.lineTo(-2, 10);
    ctx.lineTo(-6, 10);
    ctx.lineTo(-4, 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Tail fin
    ctx.beginPath();
    ctx.moveTo(-10, 0);
    ctx.lineTo(-14, -6);
    ctx.lineTo(-14, -4);
    ctx.lineTo(-12, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    ctx.restore();
  }
  
  drawCities() {
    const ctx = this.ctx;
    
    const cities = [
      { name: 'Париж', lon: 2.35, lat: 48.85 },
      { name: 'Берлин', lon: 13.4, lat: 52.52 },
      { name: 'Рим', lon: 12.5, lat: 41.9 },
      { name: 'Нью-Йорк', lon: -74, lat: 40.7 },
      { name: 'Лондон', lon: -0.12, lat: 51.5 },
      { name: 'Москва', lon: 37.6, lat: 55.75 },
      { name: 'Лиссабон', lon: -9.14, lat: 38.72 },
      { name: 'Будапешт', lon: 19.04, lat: 47.5 },
    ];
    
    cities.forEach(city => {
      const point3D = this.geoTo3D(city.lon, city.lat, this.radius * 0.995);
      const point2D = this.project(point3D);
      
      if (point2D.visible && point2D.z > this.radius * 0.3) {
        // City glow
        const glowGradient = ctx.createRadialGradient(
          point2D.x, point2D.y, 0,
          point2D.x, point2D.y, 10
        );
        glowGradient.addColorStop(0, 'rgba(184, 149, 108, 0.7)');
        glowGradient.addColorStop(0.5, 'rgba(184, 149, 108, 0.3)');
        glowGradient.addColorStop(1, 'transparent');
        
        ctx.beginPath();
        ctx.arc(point2D.x, point2D.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();
        
        // City dot
        ctx.beginPath();
        ctx.arc(point2D.x, point2D.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.strokeStyle = this.colors.landDark;
        ctx.lineWidth = 1.5;
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
      this.radius * 0.6
    );
    shineGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
    shineGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.15)');
    shineGradient.addColorStop(1, 'transparent');
    
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.radius - 1, 0, Math.PI * 2);
    ctx.fillStyle = shineGradient;
    ctx.fill();
    
    // Edge atmosphere effect
    const atmosphereGradient = ctx.createRadialGradient(
      this.centerX, this.centerY, this.radius * 0.75,
      this.centerX, this.centerY, this.radius
    );
    atmosphereGradient.addColorStop(0, 'transparent');
    atmosphereGradient.addColorStop(0.7, 'rgba(135, 180, 220, 0.08)');
    atmosphereGradient.addColorStop(1, 'rgba(100, 150, 200, 0.15)');
    
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = atmosphereGradient;
    ctx.fill();
  }
  
  animate() {
    this.rotation += this.rotationSpeed;
    this.airplaneAngle += this.airplaneSpeed / 100;
    if (this.airplaneAngle >= 1) this.airplaneAngle = 0;
    
    this.drawGlobe();
    
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize globe on page load
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    new Globe('globe-canvas');
  }, 100);
});
