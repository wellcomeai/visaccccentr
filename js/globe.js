// ========================================
// VISANEWS2YOU - Elegant Minimalist Globe
// ========================================

class Globe {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.rotation = 0;
    this.rotationSpeed = 0.008;
    
    // Airplane animation
    this.planeAngle = 0;
    this.planeSpeed = 0.012;
    
    // Colors - elegant warm palette
    this.colors = {
      globeLight: '#f8f4ef',
      globeMid: '#e8dfd4',
      globeDark: '#d4c4b0',
      gridLine: 'rgba(184, 149, 108, 0.25)',
      accent: '#b8956c',
      accentLight: '#d4b896',
      accentDark: '#8a6d4a',
      glow: 'rgba(184, 149, 108, 0.2)'
    };
    
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
    
    this.cx = size / 2;
    this.cy = size / 2;
    this.r = size * 0.38;
    this.size = size;
  }
  
  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.size, this.size);
    
    // Outer glow
    this.drawGlow();
    
    // Main globe sphere
    this.drawSphere();
    
    // Grid lines (rotating)
    this.drawGrid();
    
    // City dots
    this.drawCities();
    
    // Flight path arc
    this.drawFlightPath();
    
    // Airplane
    this.drawPlane();
    
    // Highlight reflection
    this.drawHighlight();
    
    // Border ring
    this.drawBorder();
  }
  
  drawGlow() {
    const ctx = this.ctx;
    
    // Soft outer glow
    const glowGradient = ctx.createRadialGradient(
      this.cx, this.cy, this.r * 0.8,
      this.cx, this.cy, this.r * 1.5
    );
    glowGradient.addColorStop(0, this.colors.glow);
    glowGradient.addColorStop(1, 'transparent');
    
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, this.r * 1.5, 0, Math.PI * 2);
    ctx.fillStyle = glowGradient;
    ctx.fill();
  }
  
  drawSphere() {
    const ctx = this.ctx;
    
    // Main sphere gradient
    const sphereGradient = ctx.createRadialGradient(
      this.cx - this.r * 0.3, this.cy - this.r * 0.3, 0,
      this.cx, this.cy, this.r
    );
    sphereGradient.addColorStop(0, this.colors.globeLight);
    sphereGradient.addColorStop(0.5, this.colors.globeMid);
    sphereGradient.addColorStop(1, this.colors.globeDark);
    
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, this.r, 0, Math.PI * 2);
    ctx.fillStyle = sphereGradient;
    ctx.fill();
  }
  
  drawGrid() {
    const ctx = this.ctx;
    ctx.strokeStyle = this.colors.gridLine;
    ctx.lineWidth = 1;
    
    // Longitude lines (vertical arcs) - rotating
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI + this.rotation;
      this.drawLongitude(angle);
    }
    
    // Latitude lines (horizontal ellipses)
    const latitudes = [-0.5, -0.25, 0, 0.25, 0.5];
    latitudes.forEach(lat => {
      this.drawLatitude(lat);
    });
  }
  
  drawLongitude(angle) {
    const ctx = this.ctx;
    const visible = Math.cos(angle);
    
    if (Math.abs(visible) < 0.1) return; // Skip nearly edge-on lines
    
    ctx.globalAlpha = 0.3 + Math.abs(visible) * 0.4;
    
    ctx.beginPath();
    
    // Draw ellipse arc for longitude
    const rx = Math.abs(Math.sin(angle)) * this.r;
    const ry = this.r;
    
    if (rx > 2) {
      ctx.ellipse(this.cx, this.cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    ctx.globalAlpha = 1;
  }
  
  drawLatitude(lat) {
    const ctx = this.ctx;
    const y = this.cy + lat * this.r * 1.6;
    const rx = Math.sqrt(1 - lat * lat * 2.5) * this.r;
    
    if (rx > 0) {
      ctx.beginPath();
      ctx.ellipse(this.cx, y, rx, rx * 0.15, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  
  drawCities() {
    const ctx = this.ctx;
    
    // City positions (simplified 2D projection)
    const cities = [
      { x: 0.15, y: -0.2, name: 'Paris' },
      { x: 0.25, y: -0.25, name: 'Berlin' },
      { x: 0.2, y: 0.05, name: 'Rome' },
      { x: -0.4, y: -0.15, name: 'New York' },
      { x: 0.05, y: -0.3, name: 'London' },
      { x: 0.45, y: -0.35, name: 'Moscow' },
    ];
    
    cities.forEach(city => {
      // Rotate city position
      const rotatedX = city.x * Math.cos(this.rotation) - city.y * Math.sin(this.rotation * 0.3);
      const depth = city.x * Math.sin(this.rotation) + city.y * Math.cos(this.rotation * 0.3);
      
      // Only draw if on front side
      if (depth > -0.3) {
        const x = this.cx + rotatedX * this.r;
        const y = this.cy + city.y * this.r;
        const alpha = 0.4 + (depth + 0.3) * 0.8;
        
        // City glow
        const glowGrad = ctx.createRadialGradient(x, y, 0, x, y, 12);
        glowGrad.addColorStop(0, `rgba(184, 149, 108, ${alpha * 0.6})`);
        glowGrad.addColorStop(1, 'transparent');
        
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();
        
        // City dot
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = this.colors.accent;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    });
  }
  
  drawFlightPath() {
    const ctx = this.ctx;
    
    // Draw dashed arc path
    ctx.save();
    ctx.setLineDash([8, 6]);
    ctx.strokeStyle = this.colors.accentLight;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.5;
    
    ctx.beginPath();
    // Tilted elliptical orbit
    ctx.ellipse(this.cx, this.cy, this.r * 1.15, this.r * 0.4, -0.3, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.restore();
  }
  
  drawPlane() {
    const ctx = this.ctx;
    
    // Calculate plane position on tilted ellipse
    const orbitRx = this.r * 1.15;
    const orbitRy = this.r * 0.4;
    const tilt = -0.3;
    
    const angle = this.planeAngle * Math.PI * 2;
    
    // Position on ellipse
    let px = Math.cos(angle) * orbitRx;
    let py = Math.sin(angle) * orbitRy;
    
    // Apply tilt rotation
    const cosT = Math.cos(tilt);
    const sinT = Math.sin(tilt);
    const rotX = px * cosT - py * sinT;
    const rotY = px * sinT + py * cosT;
    
    const planeX = this.cx + rotX;
    const planeY = this.cy + rotY;
    
    // Calculate direction (tangent to ellipse)
    const nextAngle = angle + 0.1;
    let nx = Math.cos(nextAngle) * orbitRx;
    let ny = Math.sin(nextAngle) * orbitRy;
    const nRotX = nx * cosT - ny * sinT;
    const nRotY = nx * sinT + ny * cosT;
    
    const direction = Math.atan2(nRotY - rotY, nRotX - rotX);
    
    // Determine if plane is in front or behind globe
    const isFront = Math.sin(angle) > -0.2;
    
    ctx.save();
    ctx.translate(planeX, planeY);
    ctx.rotate(direction + Math.PI / 2); // Rotate to face direction
    
    if (isFront) {
      ctx.globalAlpha = 1;
      // Plane glow
      const glowGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 20);
      glowGrad.addColorStop(0, 'rgba(184, 149, 108, 0.4)');
      glowGrad.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.fillStyle = glowGrad;
      ctx.fill();
    } else {
      ctx.globalAlpha = 0.3;
    }
    
    // Draw plane icon
    ctx.fillStyle = this.colors.accentDark;
    ctx.beginPath();
    
    // Simple airplane shape
    // Body
    ctx.moveTo(0, -12);  // Nose
    ctx.lineTo(4, 0);
    ctx.lineTo(3, 8);
    ctx.lineTo(0, 6);
    ctx.lineTo(-3, 8);
    ctx.lineTo(-4, 0);
    ctx.closePath();
    ctx.fill();
    
    // Wings
    ctx.beginPath();
    ctx.moveTo(-3, -2);
    ctx.lineTo(-14, 2);
    ctx.lineTo(-14, 5);
    ctx.lineTo(-3, 2);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(3, -2);
    ctx.lineTo(14, 2);
    ctx.lineTo(14, 5);
    ctx.lineTo(3, 2);
    ctx.closePath();
    ctx.fill();
    
    // Tail
    ctx.beginPath();
    ctx.moveTo(0, 6);
    ctx.lineTo(-6, 12);
    ctx.lineTo(-5, 12);
    ctx.lineTo(0, 8);
    ctx.lineTo(5, 12);
    ctx.lineTo(6, 12);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  }
  
  drawHighlight() {
    const ctx = this.ctx;
    
    // Glass-like highlight
    const highlightGrad = ctx.createRadialGradient(
      this.cx - this.r * 0.35, this.cy - this.r * 0.35, 0,
      this.cx - this.r * 0.35, this.cy - this.r * 0.35, this.r * 0.5
    );
    highlightGrad.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
    highlightGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
    highlightGrad.addColorStop(1, 'transparent');
    
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, this.r - 1, 0, Math.PI * 2);
    ctx.fillStyle = highlightGrad;
    ctx.fill();
  }
  
  drawBorder() {
    const ctx = this.ctx;
    
    // Elegant border ring
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, this.r, 0, Math.PI * 2);
    ctx.strokeStyle = this.colors.accent;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.5;
    ctx.stroke();
    ctx.globalAlpha = 1;
    
    // Inner subtle ring
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, this.r - 4, 0, Math.PI * 2);
    ctx.strokeStyle = this.colors.gridLine;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  
  animate() {
    this.rotation += this.rotationSpeed;
    this.planeAngle += this.planeSpeed / 100;
    if (this.planeAngle >= 1) this.planeAngle = 0;
    
    this.draw();
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => new Globe('globe-canvas'), 100);
});
