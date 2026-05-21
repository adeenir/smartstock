// use global fetch on Node 18+, otherwise fallback to node-fetch
let fetchFn;
if (globalThis.fetch) fetchFn = globalThis.fetch.bind(globalThis);
else fetchFn = (...args) => import('node-fetch').then(({default: f}) => f(...args));

const fetch = (...args) => fetchFn(...args);

const MB_URL = process.env.MB_URL || 'http://localhost:3000';
const ADMIN_EMAIL = process.env.MB_ADMIN_EMAIL || 'admin@local';
const ADMIN_PASS = process.env.MB_ADMIN_PASSWORD || 'admin123';

const PG = {
  host: process.env.PG_HOST || '127.0.0.1',
  port: parseInt(process.env.PG_PORT || '5432', 10),
  dbname: process.env.PG_DB || 'SmartStock',
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASS || 'postgres'
};

async function login() {
  const res = await fetch(`${MB_URL}/api/session`, {
    method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify({username: ADMIN_EMAIL, password: ADMIN_PASS})
  });
  if (!res.ok) throw new Error('Login failed: ' + await res.text());
  const j = await res.json();
  return j.id;
}

async function createDatabase(session) {
  const payload = {
    name: 'SmartStock',
    engine: 'postgres',
    details: {
      host: PG.host,
      port: PG.port,
      dbname: PG.dbname,
      user: PG.user,
      password: PG.password,
      ssl: false
    }
  };
  const res = await fetch(`${MB_URL}/api/database`, {
    method: 'POST', headers: {'Content-Type':'application/json','X-Metabase-Session': session}, body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Create DB failed: ' + await res.text());
  return await res.json();
}

async function createCard(session, dbId, name, query) {
  const payload = {
    name,
    dataset_query: {
      database: dbId,
      type: 'native',
      native: {query}
    },
    display: 'table'
  };
  const res = await fetch(`${MB_URL}/api/card`, {
    method: 'POST', headers: {'Content-Type':'application/json','X-Metabase-Session': session}, body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Create card failed: ' + await res.text());
  return await res.json();
}

async function createDashboard(session, title) {
  const res = await fetch(`${MB_URL}/api/dashboard`, {
    method: 'POST', headers: {'Content-Type':'application/json','X-Metabase-Session': session}, body: JSON.stringify({name: title})
  });
  if (!res.ok) throw new Error('Create dashboard failed: ' + await res.text());
  return await res.json();
}

async function addCardToDashboard(session, dashboardId, cardId) {
  const payload = {cardId, sizeX: 4, sizeY: 4, row: 0, col: 0};
  // Metabase expects POST /api/dashboard/:id/cards
  const res = await fetch(`${MB_URL}/api/dashboard/${dashboardId}/cards`, {
    method: 'POST', headers: {'Content-Type':'application/json','X-Metabase-Session': session}, body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Add card to dashboard failed: ' + await res.text());
  return await res.json();
}

async function main(){
  try {
    console.log('Logging in...');
    const session = await login();
    console.log('Session id:', session);

    console.log('Creating datasource...');
    const db = await createDatabase(session);
    console.log('Database created:', db.id);

    const dbId = db.id;

    const cards = [];
    cards.push(await createCard(session, dbId, 'Estoque por categoria', `SELECT "categoria", SUM("quantidade")::bigint AS quantidade_total, SUM(("preco")::numeric * "quantidade")::numeric AS valor_total FROM "Produtos" GROUP BY "categoria" ORDER BY quantidade_total DESC;`));
    cards.push(await createCard(session, dbId, 'Produtos vencendo 30d', `SELECT id, nome, "dataValidade" AS data_validade, quantidade FROM "Produtos" WHERE "dataValidade" BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days' ORDER BY "dataValidade" ASC LIMIT 500;`));
    cards.push(await createCard(session, dbId, 'Resumo risco perda 30/60/90d', `SELECT '30d' as periodo, SUM("quantidade")::bigint AS unidades FROM "Produtos" WHERE "dataValidade" BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days' UNION ALL SELECT '60d', SUM("quantidade")::bigint FROM "Produtos" WHERE "dataValidade" BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '60 days' UNION ALL SELECT '90d', SUM("quantidade")::bigint FROM "Produtos" WHERE "dataValidade" BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '90 days';`));
    cards.push(await createCard(session, dbId, 'Produtos estoque baixo', `SELECT id, nome, quantidade FROM "Produtos" WHERE quantidade < 5 ORDER BY quantidade ASC LIMIT 500;`));
    cards.push(await createCard(session, dbId, 'Top produtos por valor', `SELECT id, nome, SUM(("preco")::numeric * "quantidade")::numeric AS valor_total FROM "Produtos" GROUP BY id, nome ORDER BY valor_total DESC LIMIT 100;`));

    console.log('Creating dashboard...');
    const dashboard = await createDashboard(session, 'Dashboard SmartStock - Básico');
    console.log('Dashboard id:', dashboard.id);

    for (const c of cards) {
      await addCardToDashboard(session, dashboard.id, c.id);
      console.log('Added card', c.id);
    }

    console.log('Dashboard created at', `${MB_URL}/dashboard/${dashboard.id}`);
  } catch (err) {
    console.error('Error:', err.message || err);
    process.exit(1);
  }
}

main();
