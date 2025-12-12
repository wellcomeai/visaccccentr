// ========================================
// VISANEWS2YOU - Smart Graph Visualization v4.0
// Performance Optimized Version
// ========================================

// Twemoji flag URLs
const flagUrls = {
  'PT': 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f1f5-1f1f9.svg',
  'IT': 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f1ee-1f1f9.svg',
  'FR': 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f1eb-1f1f7.svg',
  'DE': 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f1e9-1f1ea.svg',
  'GR': 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f1ec-1f1f7.svg',
  'HU': 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f1ed-1f1fa.svg',
  'US': 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f1fa-1f1f8.svg',
  'GB': 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f1ec-1f1e7.svg',
  'CA': 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f1e8-1f1e6.svg',
  'EU': 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f1ea-1f1fa.svg',
};

// Node data
const nodesData = [
  { id: 'center', label: 'VISANEWS2YOU', type: 'center', x: 50, y: 50, description: 'Ваш надёжный визовый партнёр', price: null, icon: '🌍', logo: 'https://i.ibb.co/9kVnKdnZ/visa.png', category: 'center' },
  { id: 'schengen', label: 'Шенген', type: 'category', x: 25, y: 32, description: 'Визы в страны Шенгенской зоны', price: null, icon: '🇪🇺', flag: 'EU', category: 'schengen' },
  { id: 'portugal', label: 'Португалия', labelShort: 'Португалия', type: 'country', x: 10, y: 18, description: 'Туристическая виза в Португалию. Срок оформления от 7 дней.', price: '18 000 ₽', icon: '🇵🇹', flag: 'PT', features: ['Мультивиза', '7-14 дней'], tariff: 'gold', category: 'schengen' },
  { 
    id: 'italy', 
    label: 'Италия',
    labelShort: 'Италия',
    type: 'country', 
    x: 8, 
    y: 38, 
    description: 'Виза в солнечную Италию для туризма и бизнеса.',
    icon: '🇮🇹', 
    flag: 'IT',
    category: 'schengen',
    hasTariffs: true,
    tariffs: {
      gold: {
        price: 'от 13 000 ₽',
        description: 'Москва, СПб и СЗ регионы — от 13 000 ₽. Регионы — 25 000 ₽ + сервисный сбор.',
        features: ['Туризм', 'Бизнес', 'Личная подача']
      },
      premium: {
        price: '55 000 ₽',
        description: 'Удалённая подача без вашего присутствия при наличии биометрии за 5 лет. Все сборы включены.',
        features: ['Удалённо', 'Всё включено', 'Доставка по РФ']
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
    description: 'Виза во Францию с возможностью удалённой подачи.',
    icon: '🇫🇷', 
    flag: 'FR',
    category: 'schengen',
    hasTariffs: true,
    tariffs: {
      gold: {
        price: '25 000 ₽',
        description: 'Стандартное оформление визы + сервисный сбор 35 евро.',
        features: ['Туризм', 'До 5 лет', 'Личная подача']
      },
      premium: {
        price: '55 000 ₽',
        description: 'Удалённая подача по доверенности без вашего присутствия. Все сборы включены.',
        features: ['Удалённо', 'Всё включено', 'Доставка по РФ']
      }
    }
  },
  { id: 'germany', label: 'Германия', labelShort: 'Германия', type: 'country', x: 25, y: 12, description: 'Виза в Германию по приглашению. Необходимы выкупленные билеты.', price: '15 000 ₽', icon: '🇩🇪', flag: 'DE', features: ['Приглашение', '5-10 дней'], tariff: 'gold', category: 'schengen' },
  { id: 'greece', label: 'Греция', labelShort: 'Греция', type: 'country', x: 38, y: 15, description: 'Быстрое оформление визы в Грецию. Необходимы выкупленные билеты.', price: '15 000 ₽', icon: '🇬🇷', flag: 'GR', features: ['Быстро', 'Туризм'], tariff: 'gold', category: 'schengen' },
  { id: 'hungary', label: 'Венгрия', labelShort: 'Венгрия', type: 'country', x: 40, y: 35, description: 'Виза в Венгрию — отличный вариант для первого Шенгена. Нужны билеты и отель.', price: '15 000 ₽', icon: '🇭🇺', flag: 'HU', features: ['Первый Шенген', '98% одобрений'], tariff: 'gold', category: 'schengen' },
  { id: 'usa', label: 'США', labelShort: 'США', type: 'premium', x: 78, y: 22, description: 'Полное сопровождение B1/B2, F1: документы, DS-160, подготовка к собеседованию. Консульский сбор $185 оплачивается отдельно.', price: '35 000 ₽', icon: '🇺🇸', flag: 'US', features: ['Собеседование', 'Запись ботом', 'Гарантия'], category: 'premium' },
  { id: 'uk', label: 'Великобритания', labelShort: 'UK', type: 'premium', x: 85, y: 42, description: 'Туристическая, студенческая и рабочая виза в UK. Перевод документов включён. Консульский сбор £127.', price: '37 000 ₽', icon: '🇬🇧', flag: 'GB', features: ['Все типы виз', 'Перевод', 'Сопровождение'], category: 'premium' },
  { id: 'canada', label: 'Канада', labelShort: 'Канада', type: 'premium', x: 80, y: 62, description: 'Туристическая виза в Канаду. Помощь с биометрией и оплатой. Консульский сбор CAD $100.', price: '30 000 ₽', icon: '🇨🇦', flag: 'CA', features: ['Биометрия', 'До 10 лет', 'Перевод'], category: 'premium' },
  { id: 'services', label: 'Услуги', type: 'category', x: 32, y: 75, description: 'Что входит в стоимость наших услуг', price: null, icon: '⭐', category: 'services' },
  { id: 'forms', label: 'Анкеты', labelShort: 'Анкеты', type: 'service', x: 15, y: 85, description: 'Профессиональное заполнение анкет на любом языке', price: null, icon: '📝', category: 'services' },
  { id: 'booking', label: 'Запись', labelShort: 'Запись', type: 'service', x: 28, y: 90, description: 'Запись в визовый центр на удобную дату (с ботом или без)', price: null, icon: '📅', category: 'services' },
  { id: 'translation', label: 'Переводы', labelShort: 'Переводы', type: 'service', x: 42, y: 88, description: 'Нотариальный перевод документов с русского на английский', price: null, icon: '🌐', category: 'services' },
  { id: 'consulting', label: 'Консультации', labelShort: 'Консультации', type: 'service', x: 55, y: 80, description: 'Оценка ситуации и подбор оптимальной стратегии', price: null, icon: '💬', category: 'services' },
  { id: 'remote', label: 'Удалённая подача', labelShort: 'Удалённо', type: 'feature', x: 68, y: 70, description: 'Подача без вашего присутствия при наличии биометрии', price: null, icon: '🚀', category: 'services' },
  { id: 'support', label: 'Поддержка', labelShort: 'Поддержка', type: 'feature', x: 75, y: 78, description: 'На связи 24/7 в любом мессенджере', price: null, icon: '🛟', category: 'services' },
];

// Connections
const connections = [
  { from: 'center', to: 'schengen' },
  { from: 'center', to: 'usa' },
  { from: 'center', to: 'uk' },
  { from: 'center', to: 'canada' },
  { from: 'center', to: 'services' },
  { from: 'schengen', to: 'portugal' },
  { from: 'schengen', to: 'italy' },
  { from: 'schengen', to: 'france' },
  { from: 'schengen', to: 'germany' },
  { from: 'schengen', to: 'greece' },
  { from: 'schengen', to: 'hungary' },
  { from: 'services', to: 'forms' },
  { from: 'services', to: 'booking' },
  { from: 'services', to: 'translation' },
  { from: 'services', to: 'consulting' },
  { from: 'consulting', to: 'remote' },
  { from: 'remote', to: 'support' },
  { from: 'usa', to: 'uk' },
  { from: 'uk', to: 'canada' },
];

// Mobile categories
const mobileCategories = [
  { id: 'schengen', label: 'Шенген', icon: '🇪🇺' },
  { id: 'premium', label: 'Premium', icon: '⭐' },
  { id: 'services', label: 'Услуги', icon: '📋' },
];

class SmartGraph {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.tooltip = document.getElementById('tooltip');
    this.isMobile = window.innerWidth < 900;
    this.hoveredNode = null;
    this.tooltipLocked = false;
    this.hoverTimeout = null;
    this.bottomSheet = null;

    this.init();
  }

  init() {
    if (this.isMobile) {
      this.createMobileLayout();
    } else {
      this.createDesktopLayout();
    }
    this.bindEvents();
  }

  // ==========================================
  // MOBILE LAYOUT
  // ==========================================
  createMobileLayout() {
    this.container.classList.add('graph-mobile');
    this.container.innerHTML = '';

    // Center logo
    const center = document.createElement('div');
    center.className = 'mobile-graph-center';
    center.innerHTML = `
      <div class="mobile-center-badge">
        <img src="https://i.ibb.co/9kVnKdnZ/visa.png" alt="Logo" class="mobile-center-logo">
        <span>VISANEWS2YOU</span>
      </div>
    `;
    this.container.appendChild(center);

    // Categories
    mobileCategories.forEach(cat => {
      const section = document.createElement('div');
      section.className = 'mobile-category';
      
      section.innerHTML = `
        <div class="mobile-category-header">
          <span class="mobile-category-icon">${cat.icon}</span>
          <span class="mobile-category-title">${cat.label}</span>
          <div class="mobile-category-line"></div>
        </div>
        <div class="mobile-nodes-row" data-category="${cat.id}"></div>
      `;
      
      this.container.appendChild(section);
      
      const row = section.querySelector('.mobile-nodes-row');
      const categoryNodes = nodesData.filter(n => 
        n.category === cat.id && n.type !== 'category'
      );
      
      categoryNodes.forEach(node => {
        const nodeEl = document.createElement('div');
        nodeEl.className = `mobile-node ${node.type === 'premium' ? 'mobile-node-premium' : ''}`;
        nodeEl.dataset.id = node.id;
        
        if (node.flag) {
          nodeEl.innerHTML = `
            <img src="${flagUrls[node.flag]}" alt="" class="mobile-node-flag">
            <span class="mobile-node-text">${node.labelShort || node.label}</span>
          `;
        } else {
          nodeEl.innerHTML = `
            <span class="mobile-node-icon">${node.icon}</span>
            <span class="mobile-node-text">${node.labelShort || node.label}</span>
          `;
        }
        
        row.appendChild(nodeEl);
      });
    });

    this.createBottomSheet();
  }

  createBottomSheet() {
    const sheet = document.createElement('div');
    sheet.className = 'bottom-sheet';
    sheet.innerHTML = `
      <div class="bottom-sheet-overlay"></div>
      <div class="bottom-sheet-content">
        <button class="bottom-sheet-close" aria-label="Закрыть">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
        <div class="bottom-sheet-handle"></div>
        <div class="bottom-sheet-header">
          <div class="bottom-sheet-flag-wrap"></div>
          <div class="bottom-sheet-info">
            <div class="bottom-sheet-title"></div>
            <div class="bottom-sheet-price"></div>
          </div>
        </div>
        <div class="bottom-sheet-desc"></div>
        <div class="bottom-sheet-features"></div>
        <div class="bottom-sheet-tariffs"></div>
        <a href="contacts.html" class="bottom-sheet-btn">Оформить визу</a>
      </div>
    `;
    
    document.body.appendChild(sheet);
    this.bottomSheet = sheet;
    
    sheet.querySelector('.bottom-sheet-close').addEventListener('click', () => this.hideBottomSheet());
    sheet.querySelector('.bottom-sheet-overlay').addEventListener('click', () => this.hideBottomSheet());
  }

  showBottomSheet(node) {
    if (!this.bottomSheet) return;

    // Mark rows as interacted
    document.querySelectorAll('.mobile-nodes-row').forEach(row => {
      row.classList.add('interacted');
    });

    const content = this.bottomSheet.querySelector('.bottom-sheet-content');
    const flagWrap = content.querySelector('.bottom-sheet-flag-wrap');
    const title = content.querySelector('.bottom-sheet-title');
    const price = content.querySelector('.bottom-sheet-price');
    const desc = content.querySelector('.bottom-sheet-desc');
    const features = content.querySelector('.bottom-sheet-features');
    const tariffs = content.querySelector('.bottom-sheet-tariffs');
    const btn = content.querySelector('.bottom-sheet-btn');
    
    title.textContent = node.label;
    desc.textContent = node.description;
    
    if (node.flag && flagUrls[node.flag]) {
      flagWrap.innerHTML = `<img class="bottom-sheet-flag" src="${flagUrls[node.flag]}" alt="">`;
    } else {
      flagWrap.innerHTML = `<span class="bottom-sheet-icon">${node.icon}</span>`;
    }
    
    if (node.price) {
      price.textContent = node.price + ' под ключ';
      price.style.display = 'block';
    } else if (node.hasTariffs && node.tariffs?.gold?.price) {
      price.textContent = node.tariffs.gold.price;
      price.style.display = 'block';
    } else {
      price.style.display = 'none';
    }
    
    if (node.features && node.features.length) {
      features.innerHTML = node.features.map(f => 
        `<span class="bottom-sheet-feature">✓ ${f}</span>`
      ).join('');
      features.style.display = 'flex';
    } else if (node.hasTariffs && node.tariffs?.gold?.features) {
      features.innerHTML = node.tariffs.gold.features.map(f => 
        `<span class="bottom-sheet-feature">✓ ${f}</span>`
      ).join('');
      features.style.display = 'flex';
    } else {
      features.style.display = 'none';
    }
    
    if (node.hasTariffs && node.tariffs) {
      tariffs.innerHTML = `
        <div class="bottom-sheet-tariff">
          <div class="bottom-sheet-tariff-header">
            <span class="bottom-sheet-tariff-name">⭐ Стандарт</span>
            <span class="bottom-sheet-tariff-price">${node.tariffs.gold.price}</span>
          </div>
          <div class="bottom-sheet-tariff-desc">${node.tariffs.gold.description}</div>
        </div>
        <div class="bottom-sheet-tariff bottom-sheet-tariff-premium">
          <div class="bottom-sheet-tariff-header">
            <span class="bottom-sheet-tariff-name">💎 Premium</span>
            <span class="bottom-sheet-tariff-price">${node.tariffs.premium.price}</span>
          </div>
          <div class="bottom-sheet-tariff-desc">${node.tariffs.premium.description}</div>
        </div>
      `;
      tariffs.style.display = 'block';
    } else {
      tariffs.style.display = 'none';
    }
    
    btn.style.display = (node.type === 'country' || node.type === 'premium') ? 'block' : 'none';
    
    this.bottomSheet.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  hideBottomSheet() {
    if (!this.bottomSheet) return;
    this.bottomSheet.classList.remove('active');
    document.body.style.overflow = '';
  }

  // ==========================================
  // DESKTOP LAYOUT
  // ==========================================
  createDesktopLayout() {
    this.createSVG();
    this.createNodes();
    this.updatePositions();
  }

  createSVG() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('graph-svg');
    svg.innerHTML = `
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="rgba(184, 149, 108, 0.35)" />
          <stop offset="50%" stop-color="rgba(184, 149, 108, 0.2)" />
          <stop offset="100%" stop-color="rgba(184, 149, 108, 0.35)" />
        </linearGradient>
      </defs>
    `;
    this.svg = svg;
    this.container.appendChild(svg);

    connections.forEach((conn) => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.classList.add('graph-line');
      line.dataset.from = conn.from;
      line.dataset.to = conn.to;
      svg.appendChild(line);
    });

    this.lines = svg.querySelectorAll('.graph-line');
  }

  createNodes() {
    nodesData.forEach(node => {
      const el = document.createElement('div');
      el.classList.add('graph-node', `graph-node-${node.type}`);
      el.dataset.id = node.id;
      
      if (node.type === 'center') {
        el.innerHTML = `
          <img src="${node.logo}" alt="Logo" class="center-logo">
          <span class="center-text">${node.label}</span>
        `;
      } else if ((node.type === 'country' || node.type === 'premium') && node.flag) {
        el.innerHTML = `
          <img src="${flagUrls[node.flag]}" alt="" class="country-flag">
          <span>${node.label}</span>
        `;
      } else {
        el.textContent = node.label;
      }
      
      this.container.appendChild(el);
    });

    this.nodes = this.container.querySelectorAll('.graph-node');
  }

  getNodePosition(node) {
    const rect = this.container.getBoundingClientRect();
    return {
      x: (node.x / 100) * rect.width,
      y: (node.y / 100) * rect.height
    };
  }

  updatePositions() {
    this.nodes.forEach(el => {
      const nodeData = nodesData.find(n => n.id === el.dataset.id);
      if (nodeData) {
        const pos = this.getNodePosition(nodeData);
        el.style.left = pos.x + 'px';
        el.style.top = pos.y + 'px';
      }
    });

    this.lines.forEach(line => {
      const fromNode = nodesData.find(n => n.id === line.dataset.from);
      const toNode = nodesData.find(n => n.id === line.dataset.to);
      
      if (fromNode && toNode) {
        const from = this.getNodePosition(fromNode);
        const to = this.getNodePosition(toNode);
        
        line.setAttribute('x1', from.x);
        line.setAttribute('y1', from.y);
        line.setAttribute('x2', to.x);
        line.setAttribute('y2', to.y);
      }
    });
  }

  // ==========================================
  // EVENT HANDLERS
  // ==========================================
  bindEvents() {
    // Debounced resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth < 900;
        
        if (wasMobile !== this.isMobile) {
          this.container.innerHTML = '';
          this.container.classList.remove('graph-mobile');
          if (this.bottomSheet) {
            this.bottomSheet.remove();
            this.bottomSheet = null;
          }
          this.init();
        } else if (!this.isMobile) {
          this.updatePositions();
        }
      }, 150);
    }, { passive: true });

    if (this.isMobile) {
      this.container.addEventListener('click', (e) => {
        const nodeEl = e.target.closest('.mobile-node');
        if (nodeEl) {
          const nodeData = nodesData.find(n => n.id === nodeEl.dataset.id);
          if (nodeData) {
            this.showBottomSheet(nodeData);
          }
        }
      });
    } else {
      this.nodes.forEach(el => {
        const nodeData = nodesData.find(n => n.id === el.dataset.id);
        
        el.addEventListener('mouseenter', (e) => {
          clearTimeout(this.hoverTimeout);
          this.showTooltip(nodeData, e);
        });
        
        el.addEventListener('mouseleave', () => {
          if (!this.tooltipLocked) {
            this.hoverTimeout = setTimeout(() => {
              this.hideTooltip();
            }, 200);
          }
        });
      });

      if (this.tooltip) {
        this.tooltip.addEventListener('mouseenter', () => {
          clearTimeout(this.hoverTimeout);
          this.tooltipLocked = true;
        });
        
        this.tooltip.addEventListener('mouseleave', () => {
          this.tooltipLocked = false;
          this.hideTooltip();
        });
      }
    }
  }

  calculateTooltipPosition(node, e) {
    const nodeEl = this.container.querySelector(`[data-id="${node.id}"]`);
    const nodeRect = nodeEl.getBoundingClientRect();
    const tooltipWidth = 320;
    const tooltipHeight = 300;
    const padding = 24;
    const offset = 20;

    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    const spaceRight = viewport.width - nodeRect.right;
    const spaceLeft = nodeRect.left;

    let position = { x: 0, y: 0, direction: 'right' };

    const nodeIsOnRight = nodeRect.left > viewport.width * 0.5;
    
    if (nodeIsOnRight && spaceLeft >= tooltipWidth + padding) {
      position.x = nodeRect.left - tooltipWidth - offset;
      position.y = nodeRect.top + (nodeRect.height / 2) - (tooltipHeight / 2);
      position.direction = 'left';
    } else if (!nodeIsOnRight && spaceRight >= tooltipWidth + padding) {
      position.x = nodeRect.right + offset;
      position.y = nodeRect.top + (nodeRect.height / 2) - (tooltipHeight / 2);
      position.direction = 'right';
    } else {
      position.x = nodeRect.right + offset;
      position.y = nodeRect.top + (nodeRect.height / 2) - (tooltipHeight / 2);
      position.direction = 'right';
    }

    position.y = Math.max(padding, Math.min(position.y, viewport.height - tooltipHeight - padding));
    position.x = Math.max(padding, Math.min(position.x, viewport.width - tooltipWidth - padding));

    return position;
  }

  showTooltip(node, e, selectedTariff = 'gold') {
    this.hoveredNode = node;
    this.currentTariff = selectedTariff;
    
    this.lines.forEach(line => {
      if (line.dataset.from === node.id || line.dataset.to === node.id) {
        line.classList.add('highlighted');
      } else {
        line.classList.remove('highlighted');
      }
    });

    if (!this.tooltip) return;

    const hasDetails = node.type === 'country' || node.type === 'premium';
    const flagUrl = node.flag ? flagUrls[node.flag] : null;
    
    let price, description, features;
    
    if (node.hasTariffs) {
      const tariffData = node.tariffs[selectedTariff];
      price = tariffData.price;
      description = tariffData.description;
      features = tariffData.features;
    } else {
      price = node.price;
      description = node.description;
      features = node.features;
    }
    
    let html = `
      <div class="tooltip-header">
        <div class="tooltip-icon">
          ${flagUrl ? `<img src="${flagUrl}" alt="" style="width: 28px; height: 28px;">` : node.icon || '🌍'}
        </div>
        <div class="tooltip-title">${node.label}</div>
      </div>
    `;
    
    if (node.hasTariffs) {
      html += `
        <div class="tooltip-tariff-toggle" data-node-id="${node.id}">
          <button class="tariff-btn ${selectedTariff === 'gold' ? 'active' : ''}" data-tariff="gold">
            <span class="tariff-icon">⭐</span> Gold
          </button>
          <button class="tariff-btn ${selectedTariff === 'premium' ? 'active' : ''}" data-tariff="premium">
            <span class="tariff-icon">💎</span> Premium
          </button>
        </div>
      `;
    }
    
    html += `<div class="tooltip-desc">${description}</div>`;

    if (features && features.length) {
      html += `<div class="tooltip-features">`;
      features.forEach(feature => {
        html += `<span class="tooltip-feature"><span class="tooltip-feature-icon">✓</span> ${feature}</span>`;
      });
      html += `</div>`;
    }

    if (price) {
      html += `
        <div class="tooltip-price">
          <span class="tooltip-price-dot"></span>
          ${price}
        </div>
      `;
    }

    if (hasDetails) {
      html += `
        <a href="contacts.html" class="btn btn-accent tooltip-btn">
          Оставить заявку
          <span class="btn-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </span>
        </a>
      `;
    }

    this.tooltip.innerHTML = html;
    
    if (node.hasTariffs) {
      const toggleBtns = this.tooltip.querySelectorAll('.tariff-btn');
      toggleBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const newTariff = btn.dataset.tariff;
          this.showTooltip(node, e, newTariff);
        });
      });
    }

    const pos = this.calculateTooltipPosition(node, e);
    
    this.tooltip.classList.remove('position-left', 'position-right', 'position-top', 'position-bottom');
    this.tooltip.classList.add(`position-${pos.direction}`);
    
    this.tooltip.style.left = pos.x + 'px';
    this.tooltip.style.top = pos.y + 'px';
    this.tooltip.style.transform = 'none';

    requestAnimationFrame(() => {
      this.tooltip.classList.add('active');
    });
  }

  hideTooltip() {
    this.hoveredNode = null;
    
    this.lines.forEach(line => {
      line.classList.remove('highlighted');
    });

    if (this.tooltip) {
      this.tooltip.classList.remove('active');
    }
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  new SmartGraph('graph-container');
});
