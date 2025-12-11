// ========================================
// VISANEWS2YOU - Premium Three.js Globe
// Stripe/GitHub Level Quality
// ========================================

class PremiumGlobe {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    // Configuration
    this.config = {
      globeRadius: 100,
      dotsAmount: 18000,
      arcAltitude: 0.35,
      rotationSpeed: 0.0008,
      colors: {
        globe: 0xf5f0e8,
        dots: 0xb8956c,
        arc: 0xb8956c,
        atmosphere: 0xb8956c
      }
    };

    // State
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.targetRotation = { x: 0.4, y: 0 };
    this.currentRotation = { x: 0.4, y: 0 };
    this.autoRotate = true;
    this.arcs = [];
    this.pulsingDots = [];

    this.init();
  }

  init() {
    this.setupScene();
    this.createGlobe();
    this.createAtmosphere();
    this.createDots();
    this.createCityMarkers();
    this.createFlightArcs();
    this.setupLighting();
    this.setupEventListeners();
    this.animate();
  }

  setupScene() {
    const width = this.container.offsetWidth;
    const height = this.container.offsetHeight;

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    this.camera.position.z = 280;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);

    this.container.appendChild(this.renderer.domElement);

    // Globe group for rotation
    this.globeGroup = new THREE.Group();
    this.scene.add(this.globeGroup);
  }

  createGlobe() {
    // Main globe sphere with premium shader
    const globeGeometry = new THREE.SphereGeometry(this.config.globeRadius, 64, 64);
    
    const globeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uColor1: { value: new THREE.Color(0xfcfaf7) },
        uColor2: { value: new THREE.Color(0xf0ebe3) },
        uColor3: { value: new THREE.Color(0xe0d6c8) }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          vec3 color = mix(uColor1, uColor2, intensity);
          
          // Subtle top lighting
          float lightIntensity = dot(vNormal, normalize(vec3(-0.5, 0.8, 0.5)));
          lightIntensity = lightIntensity * 0.25 + 0.75;
          color *= lightIntensity;
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      transparent: false
    });

    this.globe = new THREE.Mesh(globeGeometry, globeMaterial);
    this.globeGroup.add(this.globe);

    // Subtle wireframe grid
    const wireGeometry = new THREE.SphereGeometry(this.config.globeRadius + 0.2, 48, 24);
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0xd4c4b0,
      wireframe: true,
      transparent: true,
      opacity: 0.06
    });
    this.wireframe = new THREE.Mesh(wireGeometry, wireMaterial);
    this.globeGroup.add(this.wireframe);
  }

  createAtmosphere() {
    // Outer glow
    const atmosphereGeometry = new THREE.SphereGeometry(this.config.globeRadius * 1.18, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(this.config.colors.atmosphere) }
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(uColor, intensity * 0.35);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });

    this.atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    this.scene.add(this.atmosphere);

    // Inner rim glow
    const rimGeometry = new THREE.SphereGeometry(this.config.globeRadius * 1.01, 64, 64);
    const rimMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(0xc9a87c) }
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.75 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.5);
          gl_FragColor = vec4(uColor, intensity * 0.25);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
      transparent: true
    });

    this.rimLight = new THREE.Mesh(rimGeometry, rimMaterial);
    this.globeGroup.add(this.rimLight);
  }

  createDots() {
    const dotsGeometry = new THREE.BufferGeometry();
    const positions = [];
    const sizes = [];

    for (let i = 0; i < this.config.dotsAmount; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / this.config.dotsAmount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      // Land-like distribution
      const noiseVal = this.pseudoNoise(phi * 3, theta * 2);
      if (noiseVal > 0.28) {
        const x = this.config.globeRadius * Math.sin(phi) * Math.cos(theta);
        const y = this.config.globeRadius * Math.sin(phi) * Math.sin(theta);
        const z = this.config.globeRadius * Math.cos(phi);

        positions.push(x, y, z);
        sizes.push(Math.random() * 1.2 + 0.4);
      }
    }

    dotsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    dotsGeometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    const dotsMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(this.config.colors.dots) },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
      },
      vertexShader: `
        attribute float size;
        uniform float uPixelRatio;
        varying float vOpacity;
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * uPixelRatio * (180.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
          
          vec3 vNormal = normalize(normalMatrix * normalize(position));
          vOpacity = dot(vNormal, vec3(0.0, 0.0, 1.0));
          vOpacity = smoothstep(-0.1, 0.5, vOpacity);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vOpacity;
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = smoothstep(0.5, 0.15, dist) * vOpacity * 0.55;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false
    });

    this.dots = new THREE.Points(dotsGeometry, dotsMaterial);
    this.globeGroup.add(this.dots);
  }

  pseudoNoise(x, y) {
    return (Math.sin(x * 2.3 + y * 3.7) * 
            Math.cos(y * 1.7 + x * 2.9) * 
            Math.sin(x * 4.1 - y * 1.3) + 1) / 2;
  }

  createCityMarkers() {
    const cities = [
      { name: 'Москва', lat: 55.7558, lng: 37.6173, isOrigin: true },
      { name: 'Берлин', lat: 52.5200, lng: 13.4050 },
      { name: 'Париж', lat: 48.8566, lng: 2.3522 },
      { name: 'Лондон', lat: 51.5074, lng: -0.1278 },
      { name: 'Рим', lat: 41.9028, lng: 12.4964 },
      { name: 'Нью-Йорк', lat: 40.7128, lng: -74.0060 },
      { name: 'Вашингтон', lat: 38.9072, lng: -77.0369 },
      { name: 'Оттава', lat: 45.4215, lng: -75.6972 },
      { name: 'Лиссабон', lat: 38.7223, lng: -9.1393 },
      { name: 'Афины', lat: 37.9838, lng: 23.7275 },
      { name: 'Будапешт', lat: 47.4979, lng: 19.0402 }
    ];

    this.cityMarkers = [];

    cities.forEach(city => {
      const position = this.latLngToVector3(city.lat, city.lng, this.config.globeRadius + 0.5);
      
      // City dot
      const markerGeometry = new THREE.SphereGeometry(city.isOrigin ? 2.2 : 1.5, 16, 16);
      const markerMaterial = new THREE.MeshBasicMaterial({
        color: city.isOrigin ? 0xb8956c : 0x9a7b5a,
        transparent: true,
        opacity: 0.95
      });
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.copy(position);
      this.globeGroup.add(marker);

      // Pulsing ring for Moscow
      if (city.isOrigin) {
        const ringGeometry = new THREE.RingGeometry(2.8, 4, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: 0xb8956c,
          transparent: true,
          opacity: 0.5,
          side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.position.copy(position);
        ring.lookAt(new THREE.Vector3(0, 0, 0));
        this.globeGroup.add(ring);
        
        this.pulsingDots.push({ ring, material: ringMaterial });
      }

      // Glow
      const glowGeometry = new THREE.SphereGeometry(city.isOrigin ? 5.5 : 3.5, 16, 16);
      const glowMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uColor: { value: new THREE.Color(0xb8956c) }
        },
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 uColor;
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.55 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            gl_FragColor = vec4(uColor, intensity * 0.45);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.position.copy(position);
      this.globeGroup.add(glow);

      this.cityMarkers.push({ marker, city, position });
    });
  }

  createFlightArcs() {
    const routes = [
      { from: { lat: 55.7558, lng: 37.6173 }, to: { lat: 52.5200, lng: 13.4050 } },
      { from: { lat: 55.7558, lng: 37.6173 }, to: { lat: 48.8566, lng: 2.3522 } },
      { from: { lat: 55.7558, lng: 37.6173 }, to: { lat: 51.5074, lng: -0.1278 } },
      { from: { lat: 55.7558, lng: 37.6173 }, to: { lat: 40.7128, lng: -74.0060 } },
      { from: { lat: 55.7558, lng: 37.6173 }, to: { lat: 41.9028, lng: 12.4964 } },
      { from: { lat: 55.7558, lng: 37.6173 }, to: { lat: 45.4215, lng: -75.6972 } },
    ];

    routes.forEach((route, index) => {
      const arc = this.createArc(route.from, route.to, index);
      this.arcs.push(arc);
    });
  }

  createArc(from, to, index) {
    const startVec = this.latLngToVector3(from.lat, from.lng, this.config.globeRadius);
    const endVec = this.latLngToVector3(to.lat, to.lng, this.config.globeRadius);

    const points = [];
    const segments = 80;
    
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const point = new THREE.Vector3().lerpVectors(startVec, endVec, t);
      const altitude = Math.sin(t * Math.PI) * this.config.globeRadius * this.config.arcAltitude;
      point.normalize().multiplyScalar(this.config.globeRadius + altitude);
      points.push(point);
    }

    // Arc line
    const arcGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const arcMaterial = new THREE.LineBasicMaterial({
      color: 0xc9a87c,
      transparent: true,
      opacity: 0.5,
      linewidth: 1
    });
    const arc = new THREE.Line(arcGeometry, arcMaterial);
    this.globeGroup.add(arc);

    // Moving particle
    const particleGeometry = new THREE.SphereGeometry(1.8, 12, 12);
    const particleMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0
    });
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    this.globeGroup.add(particle);

    // Particle glow trail
    const glowGeometry = new THREE.SphereGeometry(4.5, 12, 12);
    const glowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(0xd4b896) }
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.5 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(uColor, intensity * 0.55);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    this.globeGroup.add(glow);

    return {
      line: arc,
      particle,
      glow,
      points,
      progress: Math.random(),
      speed: 0.0015 + Math.random() * 0.0015
    };
  }

  latLngToVector3(lat, lng, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);

    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  }

  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(-80, 100, 100);
    this.scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0xc9a87c, 0.25);
    fillLight.position.set(80, -40, -80);
    this.scene.add(fillLight);
  }

  setupEventListeners() {
    window.addEventListener('resize', () => this.onResize());

    this.renderer.domElement.addEventListener('mousedown', (e) => this.onPointerDown(e));
    this.renderer.domElement.addEventListener('mousemove', (e) => this.onPointerMove(e));
    this.renderer.domElement.addEventListener('mouseup', () => this.onPointerUp());
    this.renderer.domElement.addEventListener('mouseleave', () => this.onPointerUp());

    this.renderer.domElement.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.onPointerDown(e.touches[0]);
    }, { passive: false });
    this.renderer.domElement.addEventListener('touchmove', (e) => {
      e.preventDefault();
      this.onPointerMove(e.touches[0]);
    }, { passive: false });
    this.renderer.domElement.addEventListener('touchend', () => this.onPointerUp());

    this.renderer.domElement.style.cursor = 'grab';
  }

  onPointerDown(e) {
    this.isDragging = true;
    this.autoRotate = false;
    this.previousMousePosition = { x: e.clientX, y: e.clientY };
    this.renderer.domElement.style.cursor = 'grabbing';
  }

  onPointerMove(e) {
    if (!this.isDragging) return;

    const deltaX = e.clientX - this.previousMousePosition.x;
    const deltaY = e.clientY - this.previousMousePosition.y;

    this.targetRotation.y += deltaX * 0.004;
    this.targetRotation.x += deltaY * 0.004;
    this.targetRotation.x = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, this.targetRotation.x));

    this.previousMousePosition = { x: e.clientX, y: e.clientY };
  }

  onPointerUp() {
    this.isDragging = false;
    this.renderer.domElement.style.cursor = 'grab';
    
    setTimeout(() => {
      if (!this.isDragging) this.autoRotate = true;
    }, 2500);
  }

  onResize() {
    const width = this.container.offsetWidth;
    const height = this.container.offsetHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const time = performance.now() * 0.001;

    // Auto rotation
    if (this.autoRotate) {
      this.targetRotation.y += this.config.rotationSpeed;
    }

    // Smooth interpolation
    this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.04;
    this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.04;

    this.globeGroup.rotation.x = this.currentRotation.x;
    this.globeGroup.rotation.y = this.currentRotation.y;

    // Animate flight arcs
    this.arcs.forEach(arc => {
      arc.progress += arc.speed;
      if (arc.progress > 1) arc.progress = 0;

      const idx = Math.floor(arc.progress * (arc.points.length - 1));
      const point = arc.points[idx];
      if (point) {
        arc.particle.position.copy(point);
        arc.glow.position.copy(point);
      }

      const fade = Math.sin(arc.progress * Math.PI);
      arc.particle.material.opacity = fade * 0.85;
    });

    // Pulse Moscow marker
    this.pulsingDots.forEach(dot => {
      const scale = 1 + Math.sin(time * 1.8) * 0.35;
      dot.ring.scale.set(scale, scale, scale);
      dot.material.opacity = 0.55 - Math.sin(time * 1.8) * 0.25;
    });

    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.renderer.dispose();
    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const canvas = document.getElementById('globe-canvas');
    if (canvas) {
      const container = canvas.parentElement;
      const div = document.createElement('div');
      div.id = 'globe-3d';
      div.style.cssText = 'width:100%;height:100%;position:absolute;inset:0;';
      container.innerHTML = '';
      container.appendChild(div);
      
      window.premiumGlobe = new PremiumGlobe('globe-3d');
    }
  }, 150);
});
