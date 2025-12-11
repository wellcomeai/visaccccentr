// ========================================
// VISATOYOU - Smart Graph Visualization
// ========================================

// Данные узлов с иконками
const nodesData = [
  { id: 'center', label: 'visatoyou', type: 'center', x: 50, y: 50, description: 'Ваш надёжный визовый партнёр', price: null, icon: '🌍' },
  { id: 'schengen', label: 'Шенген', type: 'category', x: 25, y: 32, description: 'Визы в страны Шенгенской зоны', price: null, icon: '🇪🇺' },
  { id: 'portugal', label: 'Португалия', type: 'country', x: 10, y: 18, description: 'Туристическая виза в Португалию. Срок оформления от 7 дней.', price: '18 000 ₽', icon: '🇵🇹', features: ['Мультивиза', '7-14 дней'] },
  { id: 'italy', label: 'Италия', type: 'country', x: 8, y: 38, description: 'Виза в солнечную Италию для туризма и бизнеса.', price: 'от 15 000 ₽', icon: '🇮🇹', features: ['Туризм', 'Бизнес'] },
  { id: 'france', label: 'Франция', type: 'country', x: 12, y: 55, description: 'Виза во Францию с возможностью удалённой подачи.', price: '25 000 ₽', icon: '🇫🇷', features: ['Удалённо', 'До 5 лет'] },
  { id: 'germany', label: 'Германия', type: 'country', x: 25, y: 12, description: 'Виза в Германию по приглашению или для туризма.', price: '15 000 ₽', icon: '🇩🇪', features: ['Приглашение', '5-10 дней'] },
  { id: 'greece', label: 'Греция', type: 'country', x: 38, y: 15, description: 'Быстрое оформление визы в Грецию.', price: '15 000 ₽', icon: '🇬🇷', features: ['Быстро', 'Туризм'] },
  { id: 'hungary', label: 'Венгрия', type: 'country', x: 40, y: 35, description: 'Виза в Венгрию — отличный вариант для первого Шенгена.', price: '15 000 ₽', icon: '🇭🇺', features: ['Первый Шенген', '98% одобрений'] },
  { id: 'usa', label: 'США', type: 'premium', x: 78, y: 22, description: 'Полное сопровождение: подготовка документов, тренировка собеседования в консульстве.', price: '35 000 ₽', icon: '🇺🇸', features: ['Собеседование', 'Гарантия'] },
  { id: 'uk', label: 'Великобритания', type: 'premium', x: 85, y: 42, description: 'Туристическая, студенческая и рабочая виза в UK.', price: '38 000 ₽', icon: '🇬🇧', features: ['Все типы виз', 'Сопровождение'] },
  { id: 'canada', label: 'Канада', type: 'premium', x: 80, y: 62, description: 'Туристическая виза в Канаду с помощью в биометрии.', price: '30 000 ₽', icon: '🇨🇦', features: ['Биометрия', 'До 10 лет'] },
  { id: 'services', label: 'Услуги', type: 'category', x: 32, y: 75, description: 'Что входит в стоимость наших услуг', price: null, icon: '⭐' },
  { id: 'forms', label: 'Анкеты', type: 'service', x: 15, y: 85, description: 'Профессиональное заполнение анкет на любом языке', price: null, icon: '📝' },
  { id: 'booking', label: 'Запись', type: 'service', x: 28, y: 90, description: 'Запись в визовый центр на удобную дату', price: null, icon: '📅' },
  { id: 'translation', label: 'Переводы', type: 'service', x: 42, y: 88, description: 'Нотариальный перевод документов', price: null, icon: '🌐' },
  { id: 'consulting', label: 'Консультации', type: 'service', x: 55, y: 80, description: 'Оценка ситуации и подбор стратегии', price: null, icon: '💬' },
  { id: 'remote', label: 'Удалённая подача', type: 'feature', x: 68, y: 70, description: 'Подача без вашего присутствия', price: null, icon: '🚀' },
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
      el.textContent = node.label;
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
    const offset = 20; // Gap between node and tooltip

    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    // Calculate available space in each direction
    const spaceRight = viewport.width - nodeRect.right;
    const spaceLeft = nodeRect.left;
    const spaceTop = nodeRect.top;
    const spaceBottom = viewport.height - nodeRect.bottom;

    let position = { x: 0, y: 0, direction: 'right' };

    // Priority: Right > Left > Bottom > Top
    // For nodes on the right side of screen (USA, UK, Canada), prefer LEFT
    const nodeIsOnRight = nodeRect.left > viewport.width * 0.5;
    
    if (nodeIsOnRight && spaceLeft >= tooltipWidth + padding) {
      // Node is on right side - show tooltip on LEFT
      position.x = nodeRect.left - tooltipWidth - offset;
      position.y = nodeRect.top + (nodeRect.height / 2) - (tooltipHeight / 2);
      position.direction = 'left';
    } else if (!nodeIsOnRight && spaceRight >= tooltipWidth + padding) {
      // Node is on left side - show tooltip on RIGHT
      position.x = nodeRect.right + offset;
      position.y = nodeRect.top + (nodeRect.height / 2) - (tooltipHeight / 2);
      position.direction = 'right';
    } else if (spaceBottom >= tooltipHeight + padding) {
      // Fallback: show BELOW
      position.x = nodeRect.left + (nodeRect.width / 2) - (tooltipWidth / 2);
      position.y = nodeRect.bottom + offset;
      position.direction = 'bottom';
    } else if (spaceTop >= tooltipHeight + padding) {
      // Fallback: show ABOVE
      position.x = nodeRect.left + (nodeRect.width / 2) - (tooltipWidth / 2);
      position.y = nodeRect.top - tooltipHeight - offset;
      position.direction = 'top';
    } else if (spaceLeft >= tooltipWidth + padding) {
      // Last resort: LEFT
      position.x = nodeRect.left - tooltipWidth - offset;
      position.y = nodeRect.top + (nodeRect.height / 2) - (tooltipHeight / 2);
      position.direction = 'left';
    } else {
      // Ultimate fallback: RIGHT (might overflow)
      position.x = nodeRect.right + offset;
      position.y = nodeRect.top + (nodeRect.height / 2) - (tooltipHeight / 2);
      position.direction = 'right';
    }

    // Clamp Y to viewport (keep tooltip fully visible vertically)
    position.y = Math.max(padding, Math.min(position.y, viewport.height - tooltipHeight - padding));
    
    // Clamp X to viewport
    position.x = Math.max(padding, Math.min(position.x, viewport.width - tooltipWidth - padding));

    return position;
  }

  showTooltip(node, e) {
    this.hoveredNode = node;
    
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
    
    // Build tooltip content
    let html = `
      <div class="tooltip-header">
        <div class="tooltip-icon">${node.icon || '🌍'}</div>
        <div class="tooltip-title">${node.label}</div>
      </div>
      <div class="tooltip-desc">${node.description}</div>
    `;

    // Features
    if (node.features && node.features.length) {
      html += `<div class="tooltip-features">`;
      node.features.forEach(feature => {
        html += `<span class="tooltip-feature"><span class="tooltip-feature-icon">✓</span> ${feature}</span>`;
      });
      html += `</div>`;
    }

    // Price
    if (node.price) {
      html += `
        <div class="tooltip-price">
          <span class="tooltip-price-dot"></span>
          ${node.price}
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

    // Position tooltip
    if (!this.isMobile) {
      const pos = this.calculateTooltipPosition(node, e);
      
      // Remove old position classes
      this.tooltip.classList.remove('position-left', 'position-right', 'position-top', 'position-bottom');
      this.tooltip.classList.add(`position-${pos.direction}`);
      
      this.tooltip.style.left = pos.x + 'px';
      this.tooltip.style.top = pos.y + 'px';
      this.tooltip.style.transform = 'none'; // Position is already calculated correctly
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
