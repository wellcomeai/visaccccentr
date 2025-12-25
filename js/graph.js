/**
 * VISANEWS2U Interactive Graph
 * Интерактивный граф визовых направлений
 */

// ========================================
// FLAG URLs (Twemoji CDN)
// ========================================
const flagUrls = {
  'PT': 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f1f5-1f1f9.svg',
  'IT': 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f1ee-1f1f9.svg',
  'FR': 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f1eb-1f1f7.svg',
  'DE': 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f1e9-1f1ea.svg',
  'GR': 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f1ec-1f1f7.svg',
  'HU': 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f1ed-1f1fa.svg',
  'JP': 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f1ef-1f1f5.svg',
  'US': 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f1fa-1f1f8.svg',
  'GB': 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f1ec-1f1e7.svg',
  'CA': 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f1e8-1f1e6.svg',
  'EU': 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f1ea-1f1fa.svg'
};

// ========================================
// NODES DATA
// ========================================
const nodesData = [
  // ========================================
  // ЦЕНТРАЛЬНЫЕ ХАБЫ
  // ========================================
  { 
    id: 'schengen', 
    label: 'Шенген', 
    labelShort: 'Шенген', 
    type: 'hub', 
    x: 25, 
    y: 50, 
    description: 'Шенгенская виза открывает доступ в 27 стран Европы. Выберите страну для оформления.', 
    icon: '🇪🇺', 
    flag: 'EU',
    category: 'hub' 
  },
  { 
    id: 'premium', 
    label: 'Другие страны', 
    labelShort: 'Другие', 
    type: 'hub', 
    x: 75, 
    y: 50, 
    description: 'Визы в США, Великобританию, Канаду и другие страны с индивидуальным подходом.', 
    icon: '🌍', 
    category: 'hub' 
  },
  { 
    id: 'extra', 
    label: 'Доп. услуги', 
    labelShort: 'Услуги', 
    type: 'hub', 
    x: 50, 
    y: 85, 
    description: 'Дополнительные услуги: банковские карты, ВНЖ, страхование.', 
    icon: '⭐', 
    category: 'hub' 
  },

  // ========================================
  // ШЕНГЕН СТРАНЫ
  // ========================================
  { 
    id: 'portugal', 
    label: 'Португалия', 
    labelShort: 'Португалия', 
    type: 'country', 
    x: 10, 
    y: 18, 
    description: 'Туристическая виза. Сборы оплачиваются отдельно. От 45 дней. Оформление документов и запись в визовый центр.', 
    price: '17 000 ₽', 
    icon: '🇵🇹', 
    flag: 'PT', 
    features: ['От 45 дней', 'Сборы отдельно'], 
    tariff: 'standard', 
    category: 'schengen' 
  },
  { 
    id: 'italy', 
    label: 'Италия',
    labelShort: 'Италия',
    type: 'country', 
    x: 8, 
    y: 38, 
    description: 'Туристическая или бизнес виза. Первый шенген. Личная подача. Сборы оплачиваются отдельно.',
    icon: '🇮🇹', 
    flag: 'IT',
    category: 'schengen',
    hasTariffs: true,
    tariffs: {
      standard: {
        price: 'от 15 000 ₽',
        description: 'В зависимости от региона прописки. Оформление документов и запись в визовый центр.',
        features: ['Первый Шенген', 'Личная подача', 'Сборы отдельно']
      },
      gold: {
        price: '55 000 ₽',
        description: 'Удалённая подача без вашего присутствия при наличии биометрии за 5 лет.',
        features: ['Удалённо', 'Биометрия за 5 лет']
      },
      premium: {
        price: '85 000 ₽',
        description: 'Виза за 30 дней.',
        features: ['Виза за 30 дней']
      }
    }
  },
  { 
    id: 'france', 
    label: 'Франция',
    labelShort: 'Франция',
    type: 'country', 
    x: 12, 
    y: 55, 
    description: 'Туристическая или бизнес виза. Личная подача. На бизнес визу поможем с приглашением. Упрощённый пакет документов. Сборы оплачиваются отдельно.',
    icon: '🇫🇷', 
    flag: 'FR',
    category: 'schengen',
    hasTariffs: true,
    tariffs: {
      standard: {
        price: '27 000 ₽',
        description: 'Оформление документов и запись в визовый центр.',
        features: ['Упрощённый пакет', 'Помощь с приглашением', 'Сборы отдельно']
      },
      premium: {
        price: '55 000 ₽',
        description: 'Удалённая подача по доверенности без вашего присутствия.',
        features: ['Удалённо', 'По доверенности']
      }
    }
  },
  { 
    id: 'germany', 
    label: 'Германия', 
    labelShort: 'Германия', 
    type: 'country', 
    x: 25, 
    y: 12, 
    description: 'Туристическая виза по приглашению или бизнес виза. 15-20 дней. Сборы оплачиваются отдельно.', 
    price: '15 000 ₽', 
    icon: '🇩🇪', 
    flag: 'DE', 
    features: ['15-20 дней', 'Сборы отдельно'], 
    tariff: 'standard', 
    category: 'schengen' 
  },
  { 
    id: 'greece', 
    label: 'Греция', 
    labelShort: 'Греция', 
    type: 'country', 
    x: 38, 
    y: 15, 
    description: 'Самое быстрое оформление. 7-10 дней. Сборы оплачиваются отдельно.', 
    price: '15 000 ₽', 
    icon: '🇬🇷', 
    flag: 'GR', 
    features: ['7-10 дней', 'Самое быстрое'], 
    tariff: 'standard', 
    category: 'schengen' 
  },
  { 
    id: 'hungary', 
    label: 'Венгрия', 
    labelShort: 'Венгрия', 
    type: 'country', 
    x: 40, 
    y: 35, 
    description: 'Туристическая или бизнес виза. 15-20 дней. Сборы оплачиваются отдельно.', 
    price: '15 000 ₽', 
    icon: '🇭🇺', 
    flag: 'HU', 
    features: ['15-20 дней', 'Сборы отдельно'], 
    tariff: 'standard', 
    category: 'schengen' 
  },
  { 
    id: 'japan', 
    label: 'Япония', 
    labelShort: 'Япония', 
    type: 'country', 
    x: 45, 
    y: 22, 
    description: 'Туристическая виза. От 7 дней. Минимальный пакет документов.', 
    price: '14 000 ₽', 
    icon: '🇯🇵', 
    flag: 'JP', 
    features: ['От 7 дней', 'Минимум документов'], 
    tariff: 'standard', 
    category: 'schengen' 
  },

  // ========================================
  // ПРЕМИУМ СТРАНЫ
  // ========================================
  { 
    id: 'usa', 
    label: 'США', 
    labelShort: 'США', 
    type: 'premium', 
    x: 78, 
    y: 22, 
    description: 'Туристическая B1/B2 или студенческая виза F1. Полное сопровождение. Консульский сбор оплачивается отдельно.', 
    price: '35 000 ₽', 
    icon: '🇺🇸', 
    flag: 'US', 
    features: ['На 3 года', 'Запись ботом', 'Подготовка к интервью'], 
    category: 'premium' 
  },
  { 
    id: 'uk', 
    label: 'Великобритания', 
    labelShort: 'UK', 
    type: 'premium', 
    x: 85, 
    y: 42, 
    description: 'Туристическая виза. Консульский сбор оплачивается отдельно. Перевод включён.', 
    price: '37 000 ₽', 
    icon: '🇬🇧', 
    flag: 'GB', 
    features: ['От 6 месяцев до 2 лет', 'Перевод включён'], 
    category: 'premium' 
  },
  { 
    id: 'canada', 
    label: 'Канада', 
    labelShort: 'Канада', 
    type: 'premium', 
    x: 80, 
    y: 62, 
    description: 'Туристическая виза. Консульский сбор оплачивается отдельно. До 10 лет.', 
    price: '30 000 ₽', 
    icon: '🇨🇦', 
    flag: 'CA', 
    features: ['До 10 лет', 'Перевод включён'], 
    category: 'premium' 
  },

  // ========================================
  // ДОП. УСЛУГИ
  // ========================================
  { 
    id: 'bankcards', 
    label: 'Карты', 
    labelShort: 'Карты', 
    type: 'service', 
    x: 60, 
    y: 88, 
    description: 'Оформление иностранных карт банков СНГ. Тарифы и условия по запросу.', 
    price: 'По запросу', 
    icon: '💳', 
    features: ['Консультация', 'Сопровождение'], 
    category: 'extra' 
  },
  { 
    id: 'vnj', 
    label: 'ВНЖ', 
    labelShort: 'ВНЖ', 
    type: 'service', 
    x: 85, 
    y: 88, 
    description: 'Виза цифрового кочевника Digital Nomad. Италия, Испания.', 
    price: 'от €3 500', 
    icon: '🏠', 
    features: ['Италия', 'Испания'], 
    category: 'extra' 
  }
];

// ========================================
// CONNECTIONS (связи между нодами)
// ========================================
const connections = [
  // Шенген хаб -> страны
  { from: 'schengen', to: 'portugal' },
  { from: 'schengen', to: 'italy' },
  { from: 'schengen', to: 'france' },
  { from: 'schengen', to: 'germany' },
  { from: 'schengen', to: 'greece' },
  { from: 'schengen', to: 'hungary' },
  { from: 'schengen', to: 'japan' },
  
  // Премиум хаб -> страны
  { from: 'premium', to: 'usa' },
  { from: 'premium', to: 'uk' },
  { from: 'premium', to: 'canada' },
  
  // Доп. услуги хаб -> услуги
  { from: 'extra', to: 'bankcards' },
  { from: 'extra', to: 'vnj' },
  
  // Связи между хабами
  { from: 'schengen', to: 'premium', dashed: true },
  { from: 'schengen', to: 'extra', dashed: true },
  { from: 'premium', to: 'extra', dashed: true }
];

// ========================================
// GRAPH INITIALIZATION
// ========================================
class VisaGraph {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    
    this.canvas = null;
    this.ctx = null;
    this.nodes = [];
    this.edges = [];
    this.hoveredNode = null;
    this.selectedNode = null;
    this.animationFrame = null;
    this.mouseX = 0;
    this.mouseY = 0;
    this.isMobile = window.innerWidth <= 768;
    this.isTouch = 'ontouchstart' in window;
    
    this.init();
  }
  
  init() {
    this.createCanvas();
    this.processData();
    this.setupEvents();
    this.animate();
    this.handleResize();
  }
  
  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'graph-canvas';
    this.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();
  }
  
  resizeCanvas() {
    const rect = this.container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
    this.ctx.scale(dpr, dpr);
    this.width = rect.width;
    this.height = rect.height;
  }
  
  processData() {
    // Преобразуем проценты в пиксели
    this.nodes = nodesData.map(node => ({
      ...node,
      px: (node.x / 100) * this.width,
      py: (node.y / 100) * this.height,
      radius: node.type === 'hub' ? 45 : 35,
      pulsePhase: Math.random() * Math.PI * 2,
      hoverScale: 1
    }));
    
    // Создаём рёбра
    this.edges = connections.map(conn => ({
      from: this.nodes.find(n => n.id === conn.from),
      to: this.nodes.find(n => n.id === conn.to),
      dashed: conn.dashed || false,
      progress: 0
    }));
  }
  
  setupEvents() {
    // Mouse events
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.canvas.addEventListener('mouseleave', () => this.handleMouseLeave());
    this.canvas.addEventListener('click', (e) => this.handleClick(e));
    
    // Touch events
    this.canvas.addEventListener('touchstart', (e) => this.handleTouch(e), { passive: true });
    this.canvas.addEventListener('touchmove', (e) => this.handleTouch(e), { passive: true });
    this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e));
    
    // Resize
    window.addEventListener('resize', () => this.handleResize());
  }
  
  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouseX = e.clientX - rect.left;
    this.mouseY = e.clientY - rect.top;
    
    const node = this.getNodeAtPosition(this.mouseX, this.mouseY);
    if (node !== this.hoveredNode) {
      this.hoveredNode = node;
      this.canvas.style.cursor = node ? 'pointer' : 'default';
      this.showTooltip(node);
    }
  }
  
  handleMouseLeave() {
    this.hoveredNode = null;
    this.canvas.style.cursor = 'default';
    this.hideTooltip();
  }
  
  handleClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const node = this.getNodeAtPosition(x, y);
    if (node) {
      this.selectedNode = node;
      this.scrollToCard(node);
    }
  }
  
  handleTouch(e) {
    if (e.touches.length > 0) {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.touches[0].clientX - rect.left;
      this.mouseY = e.touches[0].clientY - rect.top;
      
      const node = this.getNodeAtPosition(this.mouseX, this.mouseY);
      this.hoveredNode = node;
    }
  }
  
  handleTouchEnd(e) {
    if (this.hoveredNode) {
      this.selectedNode = this.hoveredNode;
      this.scrollToCard(this.hoveredNode);
    }
    this.hoveredNode = null;
    this.hideTooltip();
  }
  
  handleResize() {
    this.isMobile = window.innerWidth <= 768;
    this.resizeCanvas();
    this.processData();
  }
  
  getNodeAtPosition(x, y) {
    for (let i = this.nodes.length - 1; i >= 0; i--) {
      const node = this.nodes[i];
      const dx = x - node.px;
      const dy = y - node.py;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= node.radius * node.hoverScale) {
        return node;
      }
    }
    return null;
  }
  
  showTooltip(node) {
    const tooltip = document.getElementById('tooltip');
    if (!tooltip) return;
    
    if (!node) {
      this.hideTooltip();
      return;
    }
    
    let priceHtml = '';
    if (node.hasTariffs && node.tariffs) {
      const firstTariff = Object.values(node.tariffs)[0];
      priceHtml = `<div class="tooltip-price">${firstTariff.price}</div>`;
    } else if (node.price) {
      priceHtml = `<div class="tooltip-price">${node.price}</div>`;
    }
    
    let featuresHtml = '';
    if (node.features && node.features.length > 0) {
      featuresHtml = `
        <div class="tooltip-features">
          ${node.features.map(f => `<span class="tooltip-feature">✓ ${f}</span>`).join('')}
        </div>
      `;
    }
    
    tooltip.innerHTML = `
      <div class="tooltip-header">
        <span class="tooltip-icon">${node.icon}</span>
        <span class="tooltip-title">${node.label}</span>
      </div>
      <div class="tooltip-desc">${node.description}</div>
      ${priceHtml}
      ${featuresHtml}
      ${node.type !== 'hub' ? '<div class="tooltip-cta">Нажмите для подробностей →</div>' : ''}
    `;
    
    const rect = this.canvas.getBoundingClientRect();
    let left = rect.left + node.px + 20;
    let top = rect.top + node.py - 10;
    
    // Проверяем границы экрана
    const tooltipRect = tooltip.getBoundingClientRect();
    if (left + 280 > window.innerWidth) {
      left = rect.left + node.px - 290;
    }
    if (top + 200 > window.innerHeight) {
      top = window.innerHeight - 210;
    }
    if (top < 10) top = 10;
    
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
    tooltip.classList.add('visible');
  }
  
  hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
      tooltip.classList.remove('visible');
    }
  }
  
  scrollToCard(node) {
    if (node.type === 'hub') return;
    
    const card = document.querySelector(`[data-country="${node.id}"]`);
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      card.classList.add('highlight');
      setTimeout(() => card.classList.remove('highlight'), 2000);
    }
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    const time = Date.now() / 1000;
    
    // Рисуем рёбра
    this.drawEdges(time);
    
    // Обновляем и рисуем ноды
    this.nodes.forEach(node => {
      // Анимация hover
      const targetScale = node === this.hoveredNode ? 1.15 : 1;
      node.hoverScale += (targetScale - node.hoverScale) * 0.15;
      
      // Пульсация
      node.pulsePhase += 0.02;
      
      this.drawNode(node, time);
    });
    
    this.animationFrame = requestAnimationFrame(() => this.animate());
  }
  
  drawEdges(time) {
    this.edges.forEach(edge => {
      if (!edge.from || !edge.to) return;
      
      this.ctx.beginPath();
      this.ctx.moveTo(edge.from.px, edge.from.py);
      this.ctx.lineTo(edge.to.px, edge.to.py);
      
      if (edge.dashed) {
        this.ctx.setLineDash([8, 8]);
        this.ctx.strokeStyle = 'rgba(180, 160, 130, 0.2)';
      } else {
        this.ctx.setLineDash([]);
        
        // Градиент для линии
        const gradient = this.ctx.createLinearGradient(
          edge.from.px, edge.from.py,
          edge.to.px, edge.to.py
        );
        gradient.addColorStop(0, 'rgba(180, 160, 130, 0.4)');
        gradient.addColorStop(0.5, 'rgba(180, 160, 130, 0.6)');
        gradient.addColorStop(1, 'rgba(180, 160, 130, 0.4)');
        this.ctx.strokeStyle = gradient;
      }
      
      this.ctx.lineWidth = 1.5;
      this.ctx.stroke();
      this.ctx.setLineDash([]);
      
      // Анимированные точки на линиях
      if (!edge.dashed) {
        const progress = (time * 0.3 + edge.from.px * 0.01) % 1;
        const dotX = edge.from.px + (edge.to.px - edge.from.px) * progress;
        const dotY = edge.from.py + (edge.to.py - edge.from.py) * progress;
        
        this.ctx.beginPath();
        this.ctx.arc(dotX, dotY, 2, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(180, 160, 130, 0.8)';
        this.ctx.fill();
      }
    });
  }
  
  drawNode(node, time) {
    const x = node.px;
    const y = node.py;
    const r = node.radius * node.hoverScale;
    const pulse = Math.sin(node.pulsePhase) * 0.05 + 1;
    
    // Внешнее свечение
    if (node === this.hoveredNode || node.type === 'hub') {
      const glowRadius = r * 1.5 * pulse;
      const glow = this.ctx.createRadialGradient(x, y, r * 0.5, x, y, glowRadius);
      
      if (node.type === 'hub') {
        glow.addColorStop(0, 'rgba(180, 160, 130, 0.3)');
        glow.addColorStop(1, 'rgba(180, 160, 130, 0)');
      } else {
        glow.addColorStop(0, 'rgba(200, 180, 150, 0.4)');
        glow.addColorStop(1, 'rgba(200, 180, 150, 0)');
      }
      
      this.ctx.beginPath();
      this.ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
      this.ctx.fillStyle = glow;
      this.ctx.fill();
    }
    
    // Основной круг
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, Math.PI * 2);
    
    // Градиент заливки
    const gradient = this.ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r);
    
    if (node.type === 'hub') {
      gradient.addColorStop(0, '#f5f0e8');
      gradient.addColorStop(1, '#e8e0d5');
    } else if (node.type === 'premium') {
      gradient.addColorStop(0, '#fff8f0');
      gradient.addColorStop(1, '#f0e8dd');
    } else if (node.type === 'service') {
      gradient.addColorStop(0, '#f0f8f5');
      gradient.addColorStop(1, '#e0f0e8');
    } else {
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(1, '#f5f0e8');
    }
    
    this.ctx.fillStyle = gradient;
    this.ctx.fill();
    
    // Обводка
    this.ctx.strokeStyle = node === this.hoveredNode 
      ? 'rgba(100, 80, 60, 0.6)' 
      : 'rgba(180, 160, 130, 0.4)';
    this.ctx.lineWidth = node === this.hoveredNode ? 2.5 : 1.5;
    this.ctx.stroke();
    
    // Иконка/флаг
    this.drawNodeIcon(node, x, y, r);
    
    // Подпись
    this.drawNodeLabel(node, x, y, r);
  }
  
  drawNodeIcon(node, x, y, r) {
    const iconSize = r * 0.7;
    
    if (node.flag && flagUrls[node.flag]) {
      // Загружаем и рисуем флаг
      const img = new Image();
      img.src = flagUrls[node.flag];
      
      if (img.complete) {
        this.ctx.drawImage(img, x - iconSize / 2, y - iconSize / 2, iconSize, iconSize);
      } else {
        // Пока загружается — рисуем эмодзи
        this.ctx.font = `${iconSize}px sans-serif`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = '#333';
        this.ctx.fillText(node.icon, x, y);
      }
    } else {
      // Рисуем эмодзи
      this.ctx.font = `${iconSize}px sans-serif`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(node.icon, x, y);
    }
  }
  
  drawNodeLabel(node, x, y, r) {
    const label = this.isMobile ? node.labelShort : node.label;
    const fontSize = this.isMobile ? 10 : 12;
    
    this.ctx.font = `500 ${fontSize}px "DM Sans", sans-serif`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'top';
    
    // Тень для текста
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    this.ctx.fillText(label, x + 1, y + r + 9);
    
    // Основной текст
    this.ctx.fillStyle = '#4a4035';
    this.ctx.fillText(label, x, y + r + 8);
  }
  
  destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    if (this.canvas) {
      this.canvas.remove();
    }
  }
}

// ========================================
// INITIALIZE
// ========================================
let visaGraph = null;

document.addEventListener('DOMContentLoaded', () => {
  // Задержка для полной загрузки контейнера
  setTimeout(() => {
    visaGraph = new VisaGraph('graph-container');
  }, 100);
});

// Экспорт для возможного использования
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { VisaGraph, nodesData, connections, flagUrls };
}
