// models/produto.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Produto extends Model {
    static associate(models) {
      this.belongsTo(models.Usuario, {
        foreignKey: 'usuarioId',
        as: 'usuario'
      });
      this.hasMany(models.ImagemProduto, {
        foreignKey: 'produtoId',
        as: 'imagens'
      });
    }
  }

  Produto.init(
    {
      nome: DataTypes.STRING,
      descricao: DataTypes.STRING,
      preco: DataTypes.DECIMAL(10, 2),
      quantidade: DataTypes.INTEGER,
      dataValidade: DataTypes.DATEONLY,
      categoria: DataTypes.ENUM(
        'Alimentos',
        'Bebidas',
        'Higiene',
        'Limpeza',
        'Frios',
        'Congelados',
        'Hortifruti',
        'Outros'
      ),
      marca: DataTypes.STRING,
      codigoBarras: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'Produto',
      tableName: 'Produtos'
    }
  );

  return Produto;
};
