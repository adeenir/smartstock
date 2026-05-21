require('dotenv').config();
// Compatibilidade com diferentes versões do @faker-js/faker
let faker;
try {
  const fakerPkg = require('@faker-js/faker');
  if (fakerPkg.Faker) {
    // nova API: criar instância com locale pt_BR
    const { Faker } = fakerPkg;
    const pt = require('@faker-js/faker/locale/pt_BR');
    faker = new Faker({ locale: pt });
  } else {
    // versão mais antiga expõe `faker`
    faker = fakerPkg.faker || fakerPkg;
    if (faker.setLocale) faker.setLocale('pt_BR');
  }
} catch (e) {
  // fallback simples
  const { faker: fallback } = require('@faker-js/faker');
  faker = fallback || require('@faker-js/faker');
}
const db = require('../../models');

const DEFAULTS = {
  USERS: parseInt(process.env.SEED_USERS, 10) || 100,
  PRODUCTS: parseInt(process.env.SEED_PRODUCTS, 10) || 2000,
  NOTIFICATIONS: parseInt(process.env.SEED_NOTIFICATIONS, 10) || 500
};

// Localidades brasileiras (cidades)
const localidades = [
  { nome: 'São Paulo', estado: 'SP', regiao: 'Sudeste' },
  { nome: 'Rio de Janeiro', estado: 'RJ', regiao: 'Sudeste' },
  { nome: 'Belo Horizonte', estado: 'MG', regiao: 'Sudeste' },
  { nome: 'Brasília', estado: 'DF', regiao: 'Centro-Oeste' },
  { nome: 'Salvador', estado: 'BA', regiao: 'Nordeste' },
  { nome: 'Recife', estado: 'PE', regiao: 'Nordeste' },
  { nome: 'Fortaleza', estado: 'CE', regiao: 'Nordeste' },
  { nome: 'Manaus', estado: 'AM', regiao: 'Norte' },
  { nome: 'Curitiba', estado: 'PR', regiao: 'Sul' },
  { nome: 'Porto Alegre', estado: 'RS', regiao: 'Sul' }
];

const categorias = [
  'Alimentos',
  'Bebidas',
  'Higiene',
  'Limpeza',
  'Frios',
  'Congelados',
  'Hortifruti',
  'Outros'
];

// geradores simples em pt-BR para contornar locais ausentes no faker
const primeiros = ['João','Maria','Carlos','Ana','Marcos','Mariana','Paulo','Lucas','Fernanda','Bruno','Juliana','Rafael','Patrícia','Ricardo','Aline'];
const sobrenomes = ['Silva','Santos','Souza','Oliveira','Pereira','Lima','Gomes','Ribeiro','Albuquerque','Costa','Alves','Rocha'];
const adj = ['Fresco','Natural','Premium','Integral','Orgânico','Delicioso','Tradicional','Crocante','Suave','Doce','Ácido'];
const nouns = ['Arroz','Feijão','Suco','Sabonete','Detergente','Queijo','Pão','Biscoito','Leite','Iogurte','Manteiga','Carne','Frango','Peixe'];
const marcas = ['BomSabor','CasaVerde','Alvo','NovoDia','SaborMais','HortiBem','Frescor'];

function rnd(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function nomeCompleto() { return `${rnd(primeiros)} ${rnd(sobrenomes)}`; }
function nomeProduto() { return `${rnd(adj)} ${rnd(nouns)}`; }
function nomeMarca() { return rnd(marcas); }

async function seed() {
  try {
    await db.sequelize.authenticate();

    if (process.env.CLEAR_DB === 'true') {
      console.log('Clearing existing data (truncate tables)...');
      // truncate in dependency order
      await db.Notificacao.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
      await db.ImagemProduto.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
      await db.Produto.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
      await db.Settings.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
      await db.Usuario.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
      await db.Localidade.destroy({ where: {}, truncate: true, cascade: true, restartIdentity: true });
    }

    console.log('Seeding localidades...');
    const localizadasData = localidades.map(l => ({
      nome: l.nome,
      estado: l.estado,
      regiao: l.regiao,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    const locais = await db.Localidade.bulkCreate(localizadasData, { returning: true });

    console.log('Seeding users...');
    const usersData = [];
    for (let i = 0; i < DEFAULTS.USERS; i++) {
      const localidade = locais[Math.floor(Math.random() * locais.length)];
      usersData.push({
        nome: nomeCompleto(),
        email: `user${i}@exemplo.com`,
        senha: Math.random().toString(36).slice(-8),
        localidadeId: localidade.id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    const users = await db.Usuario.bulkCreate(usersData, { returning: true });

    console.log('Seeding products...');
    const productsData = [];
    for (let i = 0; i < DEFAULTS.PRODUCTS; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const validade = faker.date.soon(365);
      productsData.push({
        nome: nomeProduto(),
        descricao: `Descrição: ${nomeProduto()} - produto gerado para testes.`,
        preco: faker.number.float ? faker.number.float({ min: 0.5, max: 500, precision: 0.01 }).toFixed(2) : (Math.random() * 500 + 0.5).toFixed(2),
        quantidade: faker.number && faker.number.int ? faker.number.int({ min: 0, max: 500 }) : Math.floor(Math.random() * 501),
        dataValidade: validade,
        categoria: categorias[Math.floor(Math.random() * categorias.length)],
        marca: nomeMarca(),
        codigoBarras: (Math.floor(1000000000000 + Math.random() * 8999999999999)).toString(),
        usuarioId: user.id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    const products = await db.Produto.bulkCreate(productsData, { returning: true });

    console.log('Seeding imagens...');
    const imagensData = [];
    for (const p of products) {
      if (Math.random() < 0.7) {
        imagensData.push({
          caminho: faker.image.urlLoremFlickr({ category: 'food' }),
          produtoId: p.id,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }
    await db.ImagemProduto.bulkCreate(imagensData);

    console.log('Seeding notificacoes...');
    const nots = [];
    for (let i = 0; i < DEFAULTS.NOTIFICATIONS; i++) {
      const produto = products[Math.floor(Math.random() * products.length)];
      nots.push({
        titulo: `Alerta: estoque de ${produto.nome}`,
        mensagem: `O produto ${produto.nome} está com estoque baixo ou próximo do vencimento. Verifique o lote.`,
        produtoId: produto.id,
        lida: Math.random() < 0.3,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    await db.Notificacao.bulkCreate(nots);

    console.log('Seeding settings...');
    const settingsData = users.map(u => ({
      userId: u.id,
      notificacoes: Math.random() < 0.9,
      vencimentos: Math.random() < 0.9,
      prazo: Math.random() < 0.9,
      sugestoes: Math.random() < 0.9,
      camera: Math.random() < 0.9,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    await db.Settings.bulkCreate(settingsData);

    console.log('Seeding finished.');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
