import { v4 as uuidv4 } from 'uuid';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('ingredient_mappings', {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
        defaultValue: Sequelize.INTEGER
      },
      item_group_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      ingredient_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      ingredient_price: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      ingredient_price_before_discount: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      is_available: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      }
  }),
  down: queryInterface => queryInterface.dropTable('ingredient_mappings')
};