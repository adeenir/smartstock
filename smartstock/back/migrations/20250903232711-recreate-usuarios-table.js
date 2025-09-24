'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Adiciona colunas novas se não existirem
    await queryInterface.addColumn('Usuarios', 'resetToken', {
      type: Sequelize.STRING,
      allowNull: true, // opcional
    });
    await queryInterface.addColumn('Usuarios', 'resetTokenExpiration', {
      type: Sequelize.DATE,
      allowNull: true, // opcional
    });
    // Garante que createdAt e updatedAt tenham defaultValue, se necessário
    // (Opcional: use changeColumn se quiser garantir defaultValue)
    // await queryInterface.changeColumn('Usuarios', 'createdAt', {
    //   allowNull: false,
    //   type: Sequelize.DATE,
    //   defaultValue: Sequelize.fn('NOW'),
    // });
    // await queryInterface.changeColumn('Usuarios', 'updatedAt', {
    //   allowNull: false,
    //   type: Sequelize.DATE,
    //   defaultValue: Sequelize.fn('NOW'),
    // });
  },

  async down(queryInterface, Sequelize) {
    // Remove as colunas adicionadas no up
    await queryInterface.removeColumn('Usuarios', 'resetToken');
    await queryInterface.removeColumn('Usuarios', 'resetTokenExpiration');
  },
};
