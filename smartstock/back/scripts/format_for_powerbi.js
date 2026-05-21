const fs = require('fs');
const path = require('path');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function toCSV(rows) {
  if (!rows || rows.length === 0) return '';
  const keys = Object.keys(rows[0]);
  const header = keys.join(',');
  const lines = rows.map(r => keys.map(k => {
    const v = r[k] === null || r[k] === undefined ? '' : String(r[k]);
    return '"' + v.replace(/"/g, '""') + '"';
  }).join(','));
  return [header, ...lines].join('\n');
}

function formatRow(row) {
  const out = {};
  for (const k of Object.keys(row)) {
    const v = row[k];
    if (k.toLowerCase().includes('data') || k.toLowerCase().includes('date')) {
      // normalize date to YYYY-MM-DD
      const d = new Date(v);
      if (!isNaN(d)) out[k] = d.toISOString().slice(0,10);
      else out[k] = '';
    } else if (typeof v === 'number') {
      out[k] = v;
    } else {
      out[k] = v === null || v === undefined ? '' : String(v);
    }
  }
  return out;
}

async function run() {
  const exportsDir = path.join(__dirname, '..', 'exports');
  const outDir = path.join(exportsDir, 'powerbi');
  ensureDir(outDir);

  const files = fs.readdirSync(exportsDir).filter(f => f.endsWith('.json'));
  for (const file of files) {
    const name = path.basename(file, '.json');
    // ignore any english leftovers
    if (name.match(/stock_by_category|products_near_expiry|risk_loss|low_stock|top_products_by_value|top_users_by_products|notifications_per_product|notifications_by_read/)) continue;

    const full = path.join(exportsDir, file);
    const data = JSON.parse(fs.readFileSync(full, 'utf8'));
    if (!Array.isArray(data)) {
      // wrap single-row objects
      const single = Array.isArray(data) ? data : [data];
      const rows = single.map(formatRow);
      const csv = toCSV(rows);
      if (csv) fs.writeFileSync(path.join(outDir, `${name}.csv`), csv);
      continue;
    }

    const rows = data.map(formatRow);
    const csv = toCSV(rows);
    if (csv) fs.writeFileSync(path.join(outDir, `${name}.csv`), csv);
    console.log('Wrote', path.join(outDir, `${name}.csv`));
  }

  console.log('Power BI formatting completed. Files in', outDir);
}

run().catch(err => { console.error(err); process.exit(1); });
