"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Settings extends Model {
    static associate(models) {
      Settings.belongsTo(models.Usuario, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
    }
  }
  Settings.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      notificacoes: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      vencimentos: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      prazo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      sugestoes: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      camera: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Settings",
    }
  );
  return Settings;
};
