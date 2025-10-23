'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ImagemProduto extends Model {
    static associate(models) {
      this.belongsTo(models.Produto, {
        foreignKey: 'produtoId',
        as: 'produto'
      });
    }
  }

  ImagemProduto.init(
    {
      caminho: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'ImagemProduto',
      tableName: 'ImagensProdutos'
    }
  );

  return ImagemProduto;
};
