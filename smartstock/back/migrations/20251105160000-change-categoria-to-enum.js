"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const enumValues = ['Alimentos','Bebidas','Higiene','Limpeza','Frios','Congelados','Hortifruti','Outros'];

    // Normalize existing values: map any unknown or null categories to 'Outros'
    await queryInterface.sequelize.query(
      `UPDATE "Produtos" SET "categoria" = 'Outros' WHERE "categoria" IS NULL OR "categoria" NOT IN (${enumValues.map(v => `'${v}'`).join(',')});`
    );

    // Create enum type if it does not exist
    await queryInterface.sequelize.query(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_produtos_categoria') THEN CREATE TYPE enum_produtos_categoria AS ENUM (${enumValues.map(v => `'${v}'`).join(',')}); END IF; END$$;`
    );

    // Alter the column type to the new enum
    await queryInterface.sequelize.query(
      `ALTER TABLE "Produtos" ALTER COLUMN "categoria" TYPE enum_produtos_categoria USING ("categoria")::enum_produtos_categoria;`
    );
  },

  async down(queryInterface, Sequelize) {
    // Revert column back to VARCHAR
    await queryInterface.sequelize.query(
      `ALTER TABLE "Produtos" ALTER COLUMN "categoria" TYPE VARCHAR USING "categoria"::text;`
    );

    // Drop enum type if exists
    await queryInterface.sequelize.query(
      `DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_produtos_categoria') THEN DROP TYPE enum_produtos_categoria; END IF; END$$;`
    );
  }
};
