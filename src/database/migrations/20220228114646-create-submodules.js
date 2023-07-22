module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('submodules', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sub_module_id: {
        type: Sequelize.INTEGER
      },
      module_id: {
        type: Sequelize.INTEGER
      },
      sub_module_name: {
        type: Sequelize.STRING
      },
      areaname: {
        type: Sequelize.STRING
      },
      nextscreencode: {
        type: Sequelize.INTEGER
      },
      setdate: {
        type: Sequelize.DATE
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      iconname: {
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
    await queryInterface.dropTable('submodules');
  }
};