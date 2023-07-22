import { v4 as uuidv4 } from 'uuid';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('item_mappings', {

      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
        defaultValue: Sequelize.INTEGER
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: false
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
  down: queryInterface => queryInterface.dropTable('item_mappings')
};