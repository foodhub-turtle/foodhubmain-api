import { v4 as uuidv4 } from 'uuid';
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('addresses', {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
        defaultValue: Sequelize.INTEGER
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      map_longitude: {
        type: Sequelize.STRING,
        allowNull: false
      },
      map_latitude: {
        type: Sequelize.STRING,
        allowNull: false
      },
      appartment_no: {
        type: Sequelize.STRING,
        allowNull: true
      },
      note: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      address_type: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      address_type_note: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      customer_id: {
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
  down: queryInterface => queryInterface.dropTable('addresses')
};