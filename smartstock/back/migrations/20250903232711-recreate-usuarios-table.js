'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove tabela antiga se existir
    await queryInterface.dropTable('Usuarios');

    // Cria nova tabela
    await queryInterface.createTable('Usuarios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false, // obrigatório
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false, // obrigatório
        unique: true,
      },
      senha: {
        type: Sequelize.STRING,
        allowNull: false, // obrigatório
      },
      resetToken: {
        type: Sequelize.STRING,
        allowNull: true, // opcional
      },
      resetTokenExpiration: {
        type: Sequelize.DATE,
        allowNull: true, // opcional
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove tabela caso precise reverter
    await queryInterface.dropTable('Usuarios');
  },
};
