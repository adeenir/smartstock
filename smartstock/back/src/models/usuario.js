'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      this.belongsTo(models.Localidade, {
        foreignKey: 'localidadeId',
        as: 'localidade'
      });
    }
  }
  Usuario.init({
    nome: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    senha: { type: DataTypes.STRING, allowNull: false },
    resetToken: { type: DataTypes.STRING, allowNull: true },
    resetTokenExpiration: { type: DataTypes.DATE, allowNull: true },
    localidadeId: { type: DataTypes.INTEGER, allowNull: true }
  }, {
    sequelize,
    modelName: 'Usuario',
  });
  return Usuario;
};