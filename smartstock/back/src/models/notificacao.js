'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Notificacao extends Model {
    static associate(models) {
      this.belongsTo(models.Produto, { foreignKey: 'produtoId', as: 'produto' });
    }
  }

  Notificacao.init(
    {
      titulo: DataTypes.STRING,
      mensagem: DataTypes.TEXT,
      produtoId: DataTypes.INTEGER,
      lida: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      modelName: 'Notificacao',
      tableName: 'Notificacoes',
    }
  );

  return Notificacao;
};
