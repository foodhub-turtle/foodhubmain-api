module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('submodulesections', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      module_id: {
        type: Sequelize.INTEGER
      },
      sub_module_id: {
        type: Sequelize.INTEGER
      },
      section_id: {
        type: Sequelize.INTEGER
      },
      section_name: {
        type: Sequelize.STRING
      },
      icon_name: {
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
    await queryInterface.dropTable('submodulesections');
  }
};