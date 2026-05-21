const fs = require('fs');
const path = require('path');
const db = require('../src/models');

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

const LOW_STOCK_THRESHOLD = parseInt(process.env.LOW_STOCK_THRESHOLD, 10) || 5;

const queries = {
  // existentes (pt-BR)
  "estoque_por_categoria": `SELECT "categoria", SUM("quantidade")::bigint AS quantidade_total, SUM(("preco")::numeric * "quantidade")::numeric AS valor_total FROM "Produtos" GROUP BY "categoria" ORDER BY quantidade_total DESC;`,
  "produtos_vencendo_30d": `SELECT id, nome, "dataValidade" AS data_validade, quantidade FROM "Produtos" WHERE "dataValidade" BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days' ORDER BY "dataValidade" ASC LIMIT 500;`,
  "usuarios_top_por_produtos": `SELECT "usuarioId" AS usuario_id, COUNT(*)::bigint AS qtd_produtos FROM "Produtos" GROUP BY "usuarioId" ORDER BY qtd_produtos DESC LIMIT 100;`,
  "notificacoes_por_produto": `SELECT "produtoId" AS produto_id, COUNT(*)::bigint AS qtd_notificacoes FROM "Notificacoes" GROUP BY "produtoId" ORDER BY qtd_notificacoes DESC LIMIT 100;`,
  "notificacoes_por_leitura": `SELECT lida AS lida, COUNT(*)::bigint AS qtd FROM "Notificacoes" GROUP BY lida;`,
  "preco_medio_por_categoria": `SELECT "categoria", AVG(("preco")::numeric) AS preco_medio FROM "Produtos" GROUP BY "categoria";`,

  // novos indicadores (pt-BR)
  "perda_risco_30d": `SELECT SUM("quantidade")::bigint AS unidades_vencendo_30d FROM "Produtos" WHERE "dataValidade" BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days';`,
  "perda_risco_60d": `SELECT SUM("quantidade")::bigint AS unidades_vencendo_60d FROM "Produtos" WHERE "dataValidade" BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '60 days';`,
  "perda_risco_90d": `SELECT SUM("quantidade")::bigint AS unidades_vencendo_90d FROM "Produtos" WHERE "dataValidade" BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '90 days';`,
  "produtos_estoque_baixo": `SELECT id, nome, quantidade FROM "Produtos" WHERE quantidade < ${LOW_STOCK_THRESHOLD} ORDER BY quantidade ASC LIMIT 500;`,
  "resumo_estoque_baixo": `SELECT COUNT(*)::bigint AS qtd_estoque_baixo, SUM("quantidade")::bigint AS unidades_estoque_baixo FROM "Produtos" WHERE quantidade < ${LOW_STOCK_THRESHOLD};`,
  "produtos_top_por_valor": `SELECT id, nome, SUM(("preco")::numeric * "quantidade")::numeric AS valor_total FROM "Produtos" GROUP BY id, nome ORDER BY valor_total DESC LIMIT 100;`
};

async function run() {
  try {
    await db.sequelize.authenticate();
    const outDir = path.join(__dirname, '..', 'exports');
    ensureDir(outDir);

    for (const [name, sql] of Object.entries(queries)) {
      console.log('Executando', name);
      const [results] = await db.sequelize.query(sql);
      const outJson = path.join(outDir, `${name}.json`);
      fs.writeFileSync(outJson, JSON.stringify(results, null, 2));
      console.log('Wrote', outJson);

      // also write CSV when results is array of objects
      if (Array.isArray(results)) {
        const csv = toCSV(results);
        if (csv) {
          const outCsv = path.join(outDir, `${name}.csv`);
          fs.writeFileSync(outCsv, csv);
          console.log('Wrote', outCsv);
        }
      }
    }

    console.log('All BI exports completed.');
    process.exit(0);
  } catch (err) {
    console.error('BI export error:', err);
    process.exit(1);
  }
}

run();
