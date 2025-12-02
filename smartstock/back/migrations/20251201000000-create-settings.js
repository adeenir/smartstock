"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Settings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Usuarios",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      notificacoes: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      vencimentos: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      prazo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      sugestoes: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      camera: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Settings");
  },
};