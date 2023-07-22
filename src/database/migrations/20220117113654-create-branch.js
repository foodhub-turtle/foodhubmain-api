import { v4 as uuidv4 } from 'uuid';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('branches', {

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
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      image: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      parent_id: {
        type: Sequelize.INTEGER,
        allowNull: false
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
      city_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      country_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      area_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      category_id: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: false
      },
      cuisine_id: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: false
      },
      is_free_delivery: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      is_offer_available: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      is_online_payment: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      is_donation: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      is_hasDiscount: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      average_cost: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      pickup_time: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      preparation_time: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      delivery_time: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      branch_type: {
        type: Sequelize.ENUM('restaurant', 'store'),
        allowNull: true 
      },
      availibility_status: {
        type: Sequelize.ENUM('open', 'close', 'busy'),
        allowNull: false
      },
      order_type: {
        type: Sequelize.ENUM('delivery', 'pickup', 'both'),
        allowNull: true
      },
      approve_status: {
        type: Sequelize.ENUM('pending', 'approve', 'rejected'),
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
  down: queryInterface => queryInterface.dropTable('branches')
};