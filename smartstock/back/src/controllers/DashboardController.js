'use strict';

const { sequelize, Sequelize } = require('../models');
const { QueryTypes } = Sequelize;

const dashboards = [
  {
    slug: 'notificacoes-pendentes-por-regiao',
    titulo: 'Fila de notificacoes pendentes por regiao',
    descricao: 'Quantidade total de notificacoes e percentual nao lido por regiao.',
    sql: `
      SELECT
        COALESCE(l.regiao, 'Sem Regiao') AS regiao,
        COUNT(n.id) AS total_notificacoes,
        SUM(CASE WHEN n.lida = false THEN 1 ELSE 0 END) AS notificacoes_nao_lidas,
        ROUND(100.0 * SUM(CASE WHEN n.lida = false THEN 1 ELSE 0 END) / NULLIF(COUNT(n.id),0), 2) AS pct_nao_lidas
      FROM "Notificacoes" n
      JOIN "Produtos" p ON p.id = n."produtoId"
      JOIN "Usuarios" u ON u.id = p."usuarioId"
      LEFT JOIN "Localidades" l ON l.id = u."localidadeId"
      GROUP BY COALESCE(l.regiao, 'Sem Regiao')
      ORDER BY notificacoes_nao_lidas ASC, pct_nao_lidas ASC;
    `,
  },
  {
    slug: 'localidades-mais-alimentos',
    titulo: 'Localidades que mais compraram alimentos',
    descricao: 'Localidades com maior volume de produtos de categorias alimentares.',
    sql: `
      SELECT
        l.nome AS localidade,
        l.regiao,
        COUNT(DISTINCT p.id) AS total_produtos_alimentos,
        COUNT(DISTINCT u.id) AS total_usuarios
      FROM "Localidades" l
      JOIN "Usuarios" u ON u."localidadeId" = l.id
      JOIN "Produtos" p ON p."usuarioId" = u.id
      WHERE p.categoria IN ('Alimentos', 'Bebidas', 'Frios', 'Congelados', 'Hortifruti')
      GROUP BY l.id, l.nome, l.regiao
      ORDER BY total_produtos_alimentos DESC, localidade;
    `,
  },
  {
    slug: 'localidades-produtos-vencendo',
    titulo: 'Localidades com mais produtos vencendo',
    descricao: 'Itens com vencimento nos proximos 30 dias e valor em risco por localidade.',
    sql: `
      SELECT
        l.nome AS localidade,
        l.regiao,
        p.nome AS produto,
        SUM(p.quantidade) AS quantidade_em_estoque,
        ROUND(AVG(p.preco::numeric), 2) AS preco_unitario_medio,
        ROUND(SUM(p.preco::numeric * p.quantidade), 2) AS valor_em_risco,
        MIN(p."dataValidade") AS primeira_validade,
        COUNT(*) AS qtd_registros
      FROM "Localidades" l
      JOIN "Usuarios" u ON u."localidadeId" = l.id
      JOIN "Produtos" p ON p."usuarioId" = u.id
      WHERE p."dataValidade" IS NOT NULL
        AND p."dataValidade" BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '30 days')
        AND p.quantidade > 0
      GROUP BY l.nome, l.regiao, p.nome
      ORDER BY valor_em_risco DESC, quantidade_em_estoque DESC, localidade, produto;
    `,
  },
  {
    slug: 'percentual-codigo-barras-por-localidade',
    titulo: 'Percentual de cadastro via codigo de barras por localidade',
    descricao: 'Efetividade de cadastro com codigo de barras por localidade.',
    sql: `
      SELECT
        l.nome AS localidade,
        l.regiao,
        COUNT(*) AS total_produtos,
        SUM(CASE WHEN p."codigoBarras" IS NOT NULL AND p."codigoBarras" <> '' THEN 1 ELSE 0 END) AS produtos_com_codigo,
        ROUND(
          100.0 * SUM(CASE WHEN p."codigoBarras" IS NOT NULL AND p."codigoBarras" <> '' THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0),
          2
        ) AS pct_codigo_barras
      FROM "Localidades" l
      JOIN "Usuarios" u ON u."localidadeId" = l.id
      JOIN "Produtos" p ON p."usuarioId" = u.id
      GROUP BY l.id, l.nome, l.regiao
      ORDER BY pct_codigo_barras DESC, localidade;
    `,
  },
  {
    slug: 'valor-total-estoque-por-localidade',
    titulo: 'Valor total do estoque por localidade',
    descricao: 'Capital imobilizado em estoque por cidade e estado.',
    sql: `
      SELECT
        l.nome AS localidade,
        l.estado,
        l.regiao,
        SUM(COALESCE(p.preco::numeric, 0) * COALESCE(p.quantidade, 0)) AS valor_total_estoque,
        COUNT(DISTINCT u.id) AS total_usuarios,
        COUNT(p.id) AS total_produtos
      FROM "Localidades" l
      JOIN "Usuarios" u ON u."localidadeId" = l.id
      JOIN "Produtos" p ON p."usuarioId" = u.id
      GROUP BY l.id, l.nome, l.estado, l.regiao
      ORDER BY valor_total_estoque DESC, localidade;
    `,
  },
  {
    slug: 'categorias-por-localidade',
    titulo: 'Categorias mais cadastradas por localidade',
    descricao: 'Participacao percentual de categorias no cadastro de produtos por localidade.',
    sql: `
      SELECT
        l.nome AS localidade,
        p.categoria,
        COUNT(p.id) AS total_produtos,
        ROUND(100.0 * COUNT(p.id) / SUM(COUNT(p.id)) OVER (PARTITION BY l.id), 2) AS pct_categoria
      FROM "Localidades" l
      JOIN "Usuarios" u ON u."localidadeId" = l.id
      JOIN "Produtos" p ON p."usuarioId" = u.id
      GROUP BY l.id, l.nome, p.categoria
      ORDER BY l.nome, COUNT(p.id) DESC;
    `,
  },
  {
    slug: 'mapa-localidades-mais-itens',
    titulo: 'Mapa de localidades com mais itens em estoque',
    descricao: 'Ranking por cidade com total de itens, produtos e valor de estoque.',
    sql: `
      SELECT
        l.nome AS localidade,
        l.estado,
        l.regiao,
        SUM(COALESCE(p.quantidade, 0)) AS total_itens,
        COUNT(DISTINCT p.id) AS total_produtos,
        ROUND(SUM(COALESCE(p.preco::numeric, 0) * COALESCE(p.quantidade, 0)), 2) AS valor_total_estoque
      FROM "Localidades" l
      JOIN "Usuarios" u ON u."localidadeId" = l.id
      JOIN "Produtos" p ON p."usuarioId" = u.id
      GROUP BY l.id, l.nome, l.estado, l.regiao
      HAVING SUM(COALESCE(p.quantidade, 0)) > 0
      ORDER BY total_itens DESC, valor_total_estoque DESC, localidade;
    `,
  },
];

const mapToMeta = ({ slug, titulo, descricao }) => ({ slug, titulo, descricao });

async function runDashboardQuery(slug) {
  const dashboard = dashboards.find((item) => item.slug === slug);
  if (!dashboard) return null;

  const data = await sequelize.query(dashboard.sql, { type: QueryTypes.SELECT });
  return {
    slug: dashboard.slug,
    titulo: dashboard.titulo,
    descricao: dashboard.descricao,
    data,
  };
}

module.exports = {
  async listar(req, res) {
    return res.json({ dashboards: dashboards.map(mapToMeta) });
  },

  async buscarPorSlug(req, res) {
    try {
      const { slug } = req.params;
      const result = await runDashboardQuery(slug);

      if (!result) {
        return res.status(404).json({
          erro: 'Dashboard nao encontrado',
          slug,
        });
      }

      return res.json(result);
    } catch (erro) {
      console.error('Erro ao executar dashboard:', erro);
      return res.status(500).json({ erro: 'Erro ao carregar dashboard', detalhe: erro.message });
    }
  },

  async buscarTodos(req, res) {
    try {
      const resultados = await Promise.all(dashboards.map((item) => runDashboardQuery(item.slug)));
      const dashboardsPorSlug = resultados.reduce((acc, item) => {
        acc[item.slug] = {
          titulo: item.titulo,
          descricao: item.descricao,
          data: item.data,
        };
        return acc;
      }, {});

      return res.json({
        atualizadoEm: new Date().toISOString(),
        dashboards: dashboardsPorSlug,
      });
    } catch (erro) {
      console.error('Erro ao executar todos dashboards:', erro);
      return res.status(500).json({ erro: 'Erro ao carregar dashboards', detalhe: erro.message });
    }
  },
};
