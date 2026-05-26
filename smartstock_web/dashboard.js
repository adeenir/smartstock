const charts = {};
let stockMap;
let stockLayer;

const geocodeCache = {};

const dashboardConfig = {
  'notificacoes-pendentes-por-regiao': {
    chartId: 'chart-notificacoes',
    tableId: 'table-notificacoes',
    titleField: 'regiao',
    metricField: 'notificacoes_nao_lidas',
    secondaryField: 'total_notificacoes',
    color: '#f97316',
    chartType: 'bar',
    metricLabel: 'Nao lidas',
    secondaryLabel: 'Total',
  },
  'localidades-mais-alimentos': {
    chartId: 'chart-alimentos',
    tableId: 'table-alimentos',
    titleField: 'localidade',
    metricField: 'total_produtos_alimentos',
    secondaryField: 'total_usuarios',
    color: '#0ea5a4',
    chartType: 'bar',
    metricLabel: 'Produtos alimentares',
    secondaryLabel: 'Usuarios',
  },
  'localidades-produtos-vencendo': {
    chartId: 'chart-vencendo',
    tableId: 'table-vencendo',
    titleField: 'produto',
    metricField: 'valor_em_risco',
    secondaryField: 'quantidade_em_estoque',
    color: '#ef4444',
    chartType: 'bar',
    metricLabel: 'Valor em risco',
    secondaryLabel: 'Qtd estoque',
  },
  'percentual-codigo-barras-por-localidade': {
    chartId: 'chart-codigo',
    tableId: 'table-codigo',
    titleField: 'localidade',
    metricField: 'pct_codigo_barras',
    secondaryField: 'total_produtos',
    color: '#16a34a',
    chartType: 'line',
    metricLabel: '% codigo de barras',
    secondaryLabel: 'Total produtos',
  },
  'valor-total-estoque-por-localidade': {
    chartId: 'chart-estoque',
    tableId: 'table-estoque',
    titleField: 'localidade',
    metricField: 'valor_total_estoque',
    secondaryField: 'total_produtos',
    color: '#2563eb',
    chartType: 'bar',
    metricLabel: 'Valor total estoque',
    secondaryLabel: 'Total produtos',
  },
  'categorias-por-localidade': {
    chartId: 'chart-categorias',
    tableId: 'table-categorias',
    titleField: 'categoria',
    metricField: 'total_produtos',
    secondaryField: 'pct_categoria',
    color: '#a855f7',
    chartType: 'bar',
    metricLabel: 'Total produtos',
    secondaryLabel: '% da localidade',
  },
  'mapa-localidades-mais-itens': {
    tableId: 'table-mapa-localidades',
  },
};

function asNumber(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

function formatValue(value, key) {
  if (key.includes('pct') || key.startsWith('percentual')) {
    return `${asNumber(value).toFixed(2)}%`;
  }

  if (key.includes('valor') || key.includes('preco')) {
    return asNumber(value).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  if (key.includes('data') || key.includes('validade')) {
    const dt = new Date(value);
    return Number.isNaN(dt.getTime()) ? value : dt.toLocaleDateString('pt-BR');
  }

  const numeric = Number(value);
  if (!Number.isNaN(numeric) && String(value).trim() !== '') {
    return numeric.toLocaleString('pt-BR');
  }

  return value ?? '-';
}

function setStatus(message, error = false) {
  const status = document.getElementById('statusPill');
  status.textContent = message;
  status.style.background = error ? 'rgba(239,68,68,.2)' : 'rgba(255,255,255,.2)';
  status.style.borderColor = error ? 'rgba(239,68,68,.55)' : 'rgba(255,255,255,.45)';
}

function renderTable(containerId, rows) {
  const container = document.getElementById(containerId);

  if (!Array.isArray(rows) || rows.length === 0) {
    container.innerHTML = '<div class="empty-state">Sem dados para este dashboard.</div>';
    return;
  }

  const columns = Object.keys(rows[0]);
  const thead = `<thead><tr>${columns.map((col) => `<th>${col}</th>`).join('')}</tr></thead>`;
  const tbody = `<tbody>${rows
    .map((row) => `<tr>${columns.map((col) => `<td>${formatValue(row[col], col)}</td>`).join('')}</tr>`)
    .join('')}</tbody>`;

  container.innerHTML = `<table>${thead}${tbody}</table>`;
}

function destroyChart(chartId) {
  if (charts[chartId]) {
    charts[chartId].destroy();
    delete charts[chartId];
  }
}

function resetMap() {
  if (!window.L) return;
  if (!stockMap) {
    stockMap = L.map('map-localidades').setView([-14.235, -51.9253], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap',
    }).addTo(stockMap);
  }

  if (stockLayer) {
    stockLayer.clearLayers();
  } else {
    stockLayer = L.layerGroup().addTo(stockMap);
  }
}

async function geocodeLocalidade(localidade, estado) {
  const key = `${localidade || ''}-${estado || ''}`.toLowerCase();
  if (geocodeCache[key]) return geocodeCache[key];

  const cached = localStorage.getItem(`geo-${key}`);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      geocodeCache[key] = parsed;
      return parsed;
    } catch (_error) {
      localStorage.removeItem(`geo-${key}`);
    }
  }

  const query = encodeURIComponent(`${localidade}, ${estado || ''}, Brasil`);
  const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;

  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) return null;

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    const point = {
      lat: Number(data[0].lat),
      lon: Number(data[0].lon),
    };

    geocodeCache[key] = point;
    localStorage.setItem(`geo-${key}`, JSON.stringify(point));
    return point;
  } catch (_error) {
    return null;
  }
}

async function renderStockMap(rows) {
  resetMap();
  if (!stockMap || !stockLayer) return;

  if (!Array.isArray(rows) || rows.length === 0) {
    return;
  }

  const topRows = rows.slice(0, 25);
  const maxItems = Math.max(...topRows.map((row) => asNumber(row.total_itens)), 1);
  const bounds = [];

  for (const row of topRows) {
    const point = await geocodeLocalidade(row.localidade, row.estado);
    if (!point) continue;

    bounds.push([point.lat, point.lon]);
    const intensity = asNumber(row.total_itens) / maxItems;
    const radius = 8 + intensity * 24;

    const marker = L.circleMarker([point.lat, point.lon], {
      radius,
      color: '#c2410c',
      weight: 1,
      fillColor: '#fb923c',
      fillOpacity: 0.45 + intensity * 0.35,
    });

    marker.bindPopup(`
      <div class="map-popup">
        <h3>${row.localidade || 'N/A'}${row.estado ? ` - ${row.estado}` : ''}</h3>
        <p><strong>Regiao:</strong> ${row.regiao || 'N/A'}</p>
        <p><strong>Total de itens:</strong> ${formatValue(row.total_itens, 'total_itens')}</p>
        <p><strong>Total de produtos:</strong> ${formatValue(row.total_produtos, 'total_produtos')}</p>
        <p><strong>Valor em estoque:</strong> ${formatValue(row.valor_total_estoque, 'valor_total_estoque')}</p>
      </div>
    `);

    marker.addTo(stockLayer);
  }

  if (bounds.length) {
    stockMap.fitBounds(bounds, { padding: [40, 40], maxZoom: 8 });
  }
}

function renderChart(slug, rows) {
  if (slug === 'mapa-localidades-mais-itens') {
    return;
  }

  const conf = dashboardConfig[slug];
  if (!conf) return;

  const canvas = document.getElementById(conf.chartId);
  if (!canvas) return;

  destroyChart(conf.chartId);

  if (!Array.isArray(rows) || rows.length === 0) {
    return;
  }

  const limitedRows = rows.slice(0, 12);
  const labels = limitedRows.map((row) => row[conf.titleField] || 'N/A');
  const metricData = limitedRows.map((row) => asNumber(row[conf.metricField]));
  const secondaryData = limitedRows.map((row) => asNumber(row[conf.secondaryField]));

  charts[conf.chartId] = new Chart(canvas.getContext('2d'), {
    type: conf.chartType,
    data: {
      labels,
      datasets: [
        {
          label: conf.metricLabel,
          data: metricData,
          borderColor: conf.color,
          backgroundColor: `${conf.color}55`,
          borderWidth: 2,
          tension: 0.3,
          fill: conf.chartType === 'line',
          yAxisID: 'y',
        },
        {
          label: conf.secondaryLabel,
          data: secondaryData,
          borderColor: '#0f172a',
          backgroundColor: '#0f172a22',
          borderWidth: 1.5,
          tension: 0.25,
          fill: false,
          yAxisID: 'y1',
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'bottom' },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: '#e4ede9' },
        },
        y1: {
          beginAtZero: true,
          grid: { drawOnChartArea: false },
          position: 'right',
        },
        x: {
          grid: { display: false },
        },
      },
    },
  });
}

async function loadDashboards() {
  const apiBaseInput = document.getElementById('apiBase');
  const baseUrl = apiBaseInput.value.trim().replace(/\/$/, '');

  try {
    setStatus('Carregando dados...');

    const response = await fetch(`${baseUrl}/all`);
    if (!response.ok) {
      throw new Error(`Falha ${response.status} ao consultar API.`);
    }

    const payload = await response.json();
    const allDashboards = payload.dashboards || {};

    Object.entries(dashboardConfig).forEach(([slug, conf]) => {
      const rows = allDashboards[slug]?.data || [];
      renderChart(slug, rows);
      renderTable(conf.tableId, rows);
    });

    await renderStockMap(allDashboards['mapa-localidades-mais-itens']?.data || []);

    const updatedAt = payload.atualizadoEm ? new Date(payload.atualizadoEm).toLocaleString('pt-BR') : 'agora';
    setStatus(`Atualizado em ${updatedAt}`);
  } catch (error) {
    console.error(error);
    setStatus(`Erro: ${error.message}`, true);

    Object.values(dashboardConfig).forEach((conf) => {
      if (conf.tableId) renderTable(conf.tableId, []);
      if (conf.chartId) destroyChart(conf.chartId);
    });

    resetMap();
  }
}

function bindEvents() {
  const reloadBtn = document.getElementById('reloadBtn');
  reloadBtn.addEventListener('click', loadDashboards);
}

bindEvents();
loadDashboards();
