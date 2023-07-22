module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('orders', {

      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
        defaultValue: Sequelize.INTEGER
      },
      order_number: {
        type: Sequelize.STRING,
        allowNull: false
      },
      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      admin_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      note: {
        type: Sequelize.STRING,
        allowNull: true
      },
      item_count: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      grand_total: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      restaurent_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      branch_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      is_paid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      order_status: {
        type: Sequelize.ENUM('draft', 'pending', 'preparing', 'checking', 'prepared', 'delivering', 'delivered', 'cancelled'),
        allowNull: false
      },
      payment_status: {
        type: Sequelize.ENUM('pending', 'success', 'failed'),
        allowNull: false
      },
      order_datetime: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: new Date()
      },
      order_receivedtime: {
        type: Sequelize.STRING,
        allowNull: true
      },
      order_acceptedtime: {
        type: Sequelize.STRING,
        allowNull: true
      },
      order_indeliverytime: {
        type: Sequelize.STRING,
        allowNull: true
      },
      order_deliveredtime: {
        type: Sequelize.STRING,
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
  down: queryInterface => queryInterface.dropTable('orders')
};