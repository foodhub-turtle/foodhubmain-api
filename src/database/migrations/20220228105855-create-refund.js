module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('refunds', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      customer_id: {
        type: Sequelize.INTEGER
      },
      refund_type_id: {
        type: Sequelize.INTEGER
      },
      refund_issue_id: {
        type: Sequelize.INTEGER
      },
      refund_status: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('refunds');
  }
};