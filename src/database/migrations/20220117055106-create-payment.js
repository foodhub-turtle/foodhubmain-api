module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('payments', {

      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
        defaultValue: Sequelize.INTEGER
      },
      transaction_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      amount: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      payment_method: {
        type: Sequelize.STRING,
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
  down: queryInterface => queryInterface.dropTable('payments')
};