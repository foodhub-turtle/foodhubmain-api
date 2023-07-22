module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('cms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      page: {
        type: Sequelize.STRING
      },
      section: {
        type: Sequelize.STRING
      },
      sub_section: {
        type: Sequelize.STRING
      },
      data_value: {
        type: Sequelize.JSON
      },
      user_id: {
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
    await queryInterface.dropTable('cms');
  }
};