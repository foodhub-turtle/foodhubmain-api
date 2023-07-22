module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('vouchers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      voucher_type_id: {
        type: Sequelize.INTEGER
      },
      voucher_set_type: {
        type: Sequelize.INTEGER
      },
      restaurant_id: {
        type: Sequelize.INTEGER
      },
      branch_id: {
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
    await queryInterface.dropTable('vouchers');
  }
};