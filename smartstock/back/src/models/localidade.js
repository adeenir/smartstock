'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Localidade extends Model {
    static associate(models) {
      this.hasMany(models.Usuario, {
        foreignKey: 'localidadeId',
        as: 'usuarios'
      });
    }
  }

  Localidade.init(
    {
      nome: DataTypes.STRING,
      estado: DataTypes.STRING,
      regiao: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'Localidade',
      tableName: 'Localidades'
    }
  );

  return Localidade;
};
