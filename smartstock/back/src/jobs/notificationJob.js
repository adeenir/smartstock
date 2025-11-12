'use strict';

const path = require('path');

// This job will create notifications for products nearing expiration.
// Default window: next 7 days (including already expired)
const DEFAULT_DAYS = 7;

async function runJob(models, options = {}) {
  const { Produto, Notificacao, sequelize } = models;
  const days = options.days ?? DEFAULT_DAYS;
  try {
    const now = new Date();
    const target = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    // Find products with dataValidade not null and <= target
    const produtos = await Produto.findAll({
      where: sequelize.where(
        sequelize.col('dataValidade'),
        '<=',
        target
      ),
    });

    let created = 0;
    for (const p of produtos) {
      if (!p.dataValidade) continue;
      const dataVal = new Date(p.dataValidade);
      const diffMs = dataVal.getTime() - now.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      let titulo;
      if (diffDays < 0) {
        titulo = `Produto ${p.nome} expirou em ${dataVal.toISOString().slice(0,10)}`;
      } else if (diffDays === 0) {
        titulo = `Produto ${p.nome} vence hoje`;
      } else {
        titulo = `Produto ${p.nome} vence em ${diffDays} dia(s)`;
      }

      const mensagem = `O produto ${p.nome} (id=${p.id}) tem validade ${dataVal.toISOString().slice(0,10)}.`;

      // Avoid duplicate notifications with same title for same product
      const exists = await Notificacao.findOne({ where: { produtoId: p.id, titulo } });
      if (!exists) {
        await Notificacao.create({ titulo, mensagem, produtoId: p.id, lida: false });
        created++;
      }
    }

    console.log(`Notification job: processed ${produtos.length} products, created ${created} notifications.`);
  } catch (err) {
    console.error('Error running notification job:', err);
  }
}

function init(models, opts = {}) {
  // Try to schedule using node-cron if available, otherwise fallback to setInterval
  let scheduled = false;
  try {
    const cron = require('node-cron');
    // Run every day at 08:00 server time
    cron.schedule('0 8 * * *', () => {
      runJob(models, opts);
    });
    scheduled = true;
    console.log('Notification job scheduled (node-cron) to run daily at 08:00.');
  } catch (err) {
    console.warn('node-cron not available, falling back to setInterval (runs every 24h). Install node-cron for cron syntax.');
    // Fallback: run once on startup, then every 24h
    runJob(models, opts);
    setInterval(() => runJob(models, opts), 24 * 60 * 60 * 1000);
  }
}

module.exports = { init, runJob };
