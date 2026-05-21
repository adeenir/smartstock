'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Usuarios', 'localidadeId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Localidades',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Usuarios', 'localidadeId');
  }
};
