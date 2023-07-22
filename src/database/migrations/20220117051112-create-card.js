import { v4 as uuidv4 } from 'uuid';
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('cards', {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
        defaultValue: Sequelize.INTEGER
      },
      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      card_number: {
        type: Sequelize.STRING,
        allowNull: false
      },
      card_cvc: {
        type: Sequelize.STRING,
        allowNull: false
      },
      card_expiry_month: {
        type: Sequelize.STRING,
        allowNull: false
      },
      card_expiry_year: {
        type: Sequelize.STRING,
        allowNull: false
      },
      active_status: {
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
  down: queryInterface => queryInterface.dropTable('cards')
};