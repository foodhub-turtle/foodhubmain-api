import { v4 as uuidv4 } from 'uuid';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('restaurants', {
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
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false
      },
      average_cost: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      business_category_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      category_id: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: true
      },
      cuisine_id: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: true
      },
      outlet_type: {
        type: Sequelize.ENUM('restaurant', 'shop'),
        allowNull: true 
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
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
  down: queryInterface => queryInterface.dropTable('restaurants')
};