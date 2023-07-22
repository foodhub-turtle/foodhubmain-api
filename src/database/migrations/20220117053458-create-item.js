import { v4 as uuidv4 } from 'uuid';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('items', {
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
      image: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true
      },
      calories: {
        type: Sequelize.STRING,
        allowNull: true
      },
      allergic_ingredients: {
        type: Sequelize.STRING,
        allowNull: true
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      cuisine_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      item_type_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      price: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      package: {
        type: Sequelize.DOUBLE,
        allowNull: true
      },
      restaurant_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      branch_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      is_popular: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      approve_status: {
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
  down: queryInterface => queryInterface.dropTable('items')
};