module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('userlogs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      company_id: {
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      login_id: {
        type: Sequelize.INTEGER
      },
      screencode: {
        type: Sequelize.INTEGER
      },
      visiteddate: {
        type: Sequelize.DATE
      },
      operation: {
        type: Sequelize.STRING
      },
      method: {
        type: Sequelize.STRING
      },
      remarks: {
        type: Sequelize.STRING
      },
      ipaddress: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('userlogs');
  }
};