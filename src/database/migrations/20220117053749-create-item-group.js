import { v4 as uuidv4 } from 'uuid';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('item_groups', {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
        defaultValue: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      ingredient_type: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      minimum_ingredients: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      maximum_ingredients: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: false
      },      
      sort_no: {
        type: Sequelize.INTEGER,
        allowNull: true
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
  down: queryInterface => queryInterface.dropTable('item_groups')
};