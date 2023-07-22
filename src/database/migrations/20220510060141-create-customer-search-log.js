'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('CustomerSearchLogs', {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.BIGINT
      },
      search_content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      customer_id: {
        type: Sequelize.BIGINT,
        allowNull: true
      },
      search_datetime: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: new Date()
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
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('CustomerSearchLogs');
  }
};