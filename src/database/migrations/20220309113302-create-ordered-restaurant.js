module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ordered_restaurants', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      customer_id: {
        type: Sequelize.BIGINT
      },
      restaurant_id: {
        type: Sequelize.BIGINT,
        allowNull: true
      },
      branch_id: {
        type: Sequelize.BIGINT
      },
      order_count: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ordered_restaurants');
  }
};