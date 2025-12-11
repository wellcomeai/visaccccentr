// ========================================
// VISATOYOU - Smart Graph Visualization v2.0
// With Logo Center & Twemoji Flags
// ========================================

// Twemoji flag URLs (Twitter emoji as SVG)
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

// Данные узлов с Twemoji флагами
const nodesData = [
  { id: 'center', label: 'visatoyou', type: 'center', x: 50, y: 50, description: 'Ваш надёжный визовый партнёр', price: null, icon: '🌍', logo: 'https://i.ibb.co/9kVnKdnZ/visa.png' },
  { id: 'schengen', label: 'Шенген', type: 'category', x: 25, y: 32, description: 'Визы в страны Шенгенской зоны', price: null, icon: '🇪🇺', flag: 'EU' },
  { id: 'portugal', label: 'Португалия', type: 'country', x: 10, y: 18, description: 'Туристическая виза в Португалию. Срок оформления от 7 дней.', price: '18 000 ₽', icon: '🇵🇹', flag: 'PT', features: ['Мультивиза', '7-14 дней'], tariff: 'gold' },
  { 
    id: 'italy', 
    label: 'Италия', 
    type: 'country', 
    x: 8, 
    y: 38, 
    description: 'Виза в солнечную Италию для туризма и бизнеса.',
    icon: '🇮🇹', 
    flag: 'IT',
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
    type: 'country', 
    x: 12, 
    y: 55, 
    description: 'Виза во Францию с возможностью удалённой подачи.',
    icon: '🇫🇷', 
    flag: 'FR',
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
  { id: 'germany', label: 'Германия', type: 'country', x: 25, y: 12, description: 'Виза в Германию по приглашению. Необходимы выкупленные билеты.', price: '15 000 ₽', icon: '🇩🇪', flag: 'DE', features: ['Приглашение', '5-10 дней'], tariff: 'gold' },
  { id: 'greece', label: 'Греция', type: 'country', x: 38, y: 15, description: 'Быстрое оформление визы в Грецию. Необходимы выкупленные билеты.', price: '15 000 ₽', icon: '🇬🇷', flag: 'GR', features: ['Быстро', 'Туризм'], tariff: 'gold' },
  { id: 'hungary', label: 'Венгрия', type: 'country', x: 40, y: 35, description: 'Виза в Венгрию — отличный вариант для первого Шенгена. Нужны билеты и отель.', price: '15 000 ₽', icon: '🇭🇺', flag: 'HU', features: ['Первый Шенген', '98% одобрений'], tariff: 'gold' },
  { id: 'usa', label: 'США', type: 'premium', x: 78, y: 22, description: 'Полное сопровождение B1/B2, F1: документы, DS-160, подготовка к собеседованию. Консульский сбор $185 оплачивается отдельно.', price: '35 000 ₽', icon: '🇺🇸', flag: 'US', features: ['Собеседование', 'Запись ботом', 'Гарантия'] },
  { id: 'uk', label: 'Великобритания', type: 'premium', x: 85, y: 42, description: 'Туристическая, студенческая и рабочая виза в UK. Перевод документов включён. Консульский сбор £127.', price: '37 000 ₽', icon: '🇬🇧', flag: 'GB', features: ['Все типы виз', 'Перевод', 'Сопровождение'] },
  { id: 'canada', label: 'Канада', type: 'premium', x: 80, y: 62, description: 'Туристическая виза в Канаду. Помощь с биометрией и оплатой. Консульский сбор CAD $100.', price: '30 000 ₽', icon: '🇨🇦', flag: 'CA', features: ['Биометрия', 'До 10 лет', 'Перевод'] },
  { id: 'services', label: 'Услуги', type: 'category', x: 32, y: 75, description: 'Что входит в стоимость наших услуг', price: null, icon: '⭐' },
  { id: 'forms', label: 'Анкеты', type: 'service', x: 15, y: 85, description: 'Профессиональное заполнение анкет на любом языке', price: null, icon: '📝' },
  { id: 'booking', label: 'Запись', type: 'service', x: 28, y: 90, description: 'Запись в визовый центр на удобную дату (с ботом или без)', price: null, icon: '📅' },
  { id: 'translation', label: 'Переводы', type: 'service', x: 42, y: 88, description: 'Нотариальный перевод документов с русского на английский', price: null, icon: '🌐' },
  { id: 'consulting', label: 'Консультации', type: 'service', x: 55, y: 80, description: 'Оценка ситуации и подбор оптимальной стратегии', price: null, icon: '💬' },
  { id: 'remote', label: 'Удалённая подача', type: 'feature', x: 68, y: 70, description: 'Подача без вашего присутствия при наличии биометрии', price: null, icon: '🚀' },
  { id: 'support', label: 'Поддержка', type: 'feature', x: 75, y: 78, description: 'На связи 24/7 в любом мессенджере', price: null, icon: '🛟' },
];

// Связи между узлами
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

class SmartGraph {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.tooltip = document.getElementById('tooltip');
    this.isMobile = window.innerWidth < 900;
    this.hoveredNode = null;
    this.tooltipLocked = false;
    this.hoverTimeout = null;

    this.init();
  }

  init() {
    this.createSVG();
    this.createNodes();
    this.updatePositions();
    this.bindEvents();
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

    // Create lines
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
      
      // Special handling for center node with logo
      if (node.type === 'center') {
        el.innerHTML = `
          <img src="${node.logo}" alt="Logo" class="center-logo">
          <span class="center-text">${node.label}</span>
        `;
      } 
      // Country and premium nodes with Twemoji flags
      else if ((node.type === 'country' || node.type === 'premium') && node.flag) {
        el.innerHTML = `
          <img src="${flagUrls[node.flag]}" alt="" class="country-flag">
          <span>${node.label}</span>
        `;
      }
      else {
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
    // Position nodes
    this.nodes.forEach(el => {
      const nodeData = nodesData.find(n => n.id === el.dataset.id);
      if (nodeData) {
        const pos = this.getNodePosition(nodeData);
        el.style.left = pos.x + 'px';
        el.style.top = pos.y + 'px';
      }
    });

    // Update lines
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

  bindEvents() {
    // Resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.isMobile = window.innerWidth < 900;
        this.updatePositions();
      }, 100);
    });

    // Node interactions
    this.nodes.forEach(el => {
      const nodeData = nodesData.find(n => n.id === el.dataset.id);

      if (this.isMobile) {
        el.addEventListener('click', (e) => this.handleNodeClick(nodeData, e));
      } else {
        el.addEventListener('mouseenter', (e) => this.handleNodeEnter(nodeData, e));
        el.addEventListener('mouseleave', () => this.handleNodeLeave());
      }
    });

    // Tooltip interactions (desktop)
    if (this.tooltip && !this.isMobile) {
      this.tooltip.addEventListener('mouseenter', () => {
        clearTimeout(this.hoverTimeout);
        this.tooltipLocked = true;
      });

      this.tooltip.addEventListener('mouseleave', () => {
        this.tooltipLocked = false;
        this.hideTooltip();
      });
    }

    // Close tooltip on outside click (mobile)
    document.addEventListener('click', (e) => {
      if (this.isMobile && this.hoveredNode) {
        if (!e.target.closest('.graph-node') && !e.target.closest('.tooltip')) {
          this.hideTooltip();
        }
      }
    });
  }

  handleNodeClick(node, e) {
    e.stopPropagation();
    
    if (this.hoveredNode?.id === node.id) {
      this.hideTooltip();
    } else {
      this.showTooltip(node, e);
    }
  }

  handleNodeEnter(node, e) {
    clearTimeout(this.hoverTimeout);
    this.showTooltip(node, e);
  }

  handleNodeLeave() {
    if (!this.tooltipLocked) {
      this.hoverTimeout = setTimeout(() => {
        this.hideTooltip();
      }, 200);
    }
  }

  // Smart tooltip positioning - NEVER covers the node
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
    const spaceTop = nodeRect.top;
    const spaceBottom = viewport.height - nodeRect.bottom;

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
    } else if (spaceBottom >= tooltipHeight + padding) {
      position.x = nodeRect.left + (nodeRect.width / 2) - (tooltipWidth / 2);
      position.y = nodeRect.bottom + offset;
      position.direction = 'bottom';
    } else if (spaceTop >= tooltipHeight + padding) {
      position.x = nodeRect.left + (nodeRect.width / 2) - (tooltipWidth / 2);
      position.y = nodeRect.top - tooltipHeight - offset;
      position.direction = 'top';
    } else if (spaceLeft >= tooltipWidth + padding) {
      position.x = nodeRect.left - tooltipWidth - offset;
      position.y = nodeRect.top + (nodeRect.height / 2) - (tooltipHeight / 2);
      position.direction = 'left';
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
    
    // Highlight connected lines
    this.lines.forEach(line => {
      if (line.dataset.from === node.id || line.dataset.to === node.id) {
        line.classList.add('highlighted');
      } else {
        line.classList.remove('highlighted');
      }
    });

    if (!this.tooltip) return;

    const hasDetails = node.type === 'country' || node.type === 'premium';
    
    // Get flag URL if available
    const flagUrl = node.flag ? flagUrls[node.flag] : null;
    
    // Get tariff data if available
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
    
    // Build tooltip content
    let html = `
      <div class="tooltip-header">
        <div class="tooltip-icon">
          ${flagUrl ? `<img src="${flagUrl}" alt="" style="width: 28px; height: 28px;">` : node.icon || '🌍'}
        </div>
        <div class="tooltip-title">${node.label}</div>
      </div>
    `;
    
    // Add tariff toggle for Italy and France
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

    // Features
    if (features && features.length) {
      html += `<div class="tooltip-features">`;
      features.forEach(feature => {
        html += `<span class="tooltip-feature"><span class="tooltip-feature-icon">✓</span> ${feature}</span>`;
      });
      html += `</div>`;
    }

    // Price
    if (price) {
      html += `
        <div class="tooltip-price">
          <span class="tooltip-price-dot"></span>
          ${price}
        </div>
      `;
    }

    // Button for countries
    if (hasDetails) {
      html += `
        <a href="contacts.html" class="btn btn-accent tooltip-btn">
          Оставить заявку
          <span class="btn-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </span>
        </a>
      `;
    }

    this.tooltip.innerHTML = html;
    
    // Add event listeners for tariff toggle buttons
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

    // Position tooltip
    if (!this.isMobile) {
      const pos = this.calculateTooltipPosition(node, e);
      
      this.tooltip.classList.remove('position-left', 'position-right', 'position-top', 'position-bottom');
      this.tooltip.classList.add(`position-${pos.direction}`);
      
      this.tooltip.style.left = pos.x + 'px';
      this.tooltip.style.top = pos.y + 'px';
      this.tooltip.style.transform = 'none';
    }

    // Show
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  new SmartGraph('graph-container');
});
